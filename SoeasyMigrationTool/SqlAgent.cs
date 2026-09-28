using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SoeasyMigrationTool.Models;

namespace SoeasyMigrationTool;

public class SqlAgent
{
    private readonly string _oldDbStr;
    private readonly string _newDbStr;

    public SqlAgent(IConfiguration config)
    {
        _oldDbStr = config.GetConnectionString("OldConnection");
        _newDbStr = config.GetConnectionString("NewConnection");
    }

    public async Task<(int Total, int Female, int Male, int Missing)> GetSourceStatsAsync()
    {
        using var conn = new SqlConnection(_oldDbStr);
        var sql = @"
            SELECT 
                COUNT(*) as Total,
                SUM(CASE WHEN ddl_2_id = 4 THEN 1 ELSE 0 END) as Female,
                SUM(CASE WHEN ddl_2_id = 3 THEN 1 ELSE 0 END) as Male,
                SUM(CASE WHEN ddl_2_id NOT IN (3,4) OR ddl_2_id IS NULL THEN 1 ELSE 0 END) as Missing
            FROM tbl_registration;";
        return await conn.QuerySingleAsync<(int Total, int Female, int Male, int Missing)>(sql);
    }

    public async Task<int> GetRemainingFemalesAsync()
    {
        using var conn = new SqlConnection(_newDbStr);
        var sql = @"
            SELECT COUNT(*) 
            FROM oldSoesyDB.dbo.tbl_registration r
            WHERE r.ddl_2_id = 4
              AND NOT EXISTS (
                  SELECT 1 FROM kaliweb1_soesy2026.dbo.MigrationSourceRecord m 
                  WHERE m.SourceRegistrationId = r.reg_id AND m.SourceSystem = 'oldSoesyDB' 
                    AND m.Status IN ('SUCCESS', 'SKIPPED', 'EXCLUDED')
              );";
        return await conn.QuerySingleAsync<int>(sql);
    }

    public async Task<List<OldRegistration>> GetOldRegistrations(int limit = 10)
    {
        using var conn = new SqlConnection(_oldDbStr);
        // Exclude those already migrated
        var sql = $@"
            SELECT TOP {limit} r.*
            FROM tbl_registration r
            WHERE r.ddl_2_id = 4
              AND r.reg_id NOT IN (
                  SELECT SourceRegistrationId 
                  FROM kaliweb1_soesy2026.dbo.MigrationSourceRecord 
                  WHERE SourceSystem = 'oldSoesyDB' 
                    AND Status IN ('SUCCESS', 'SKIPPED', 'EXCLUDED')
              )
            ORDER BY r.reg_id ASC";
        var res = await conn.QueryAsync<OldRegistration>(sql);
        return res.AsList();
    }

    public async Task MarkExcludedGendersAsync()
    {
        using var conn = new SqlConnection(_newDbStr);
        var sql = @"
            INSERT INTO MigrationSourceRecord (SourceSystem, SourceRegistrationId, TargetUserId, MigrationRunId, ContentHash, Status, ErrorMessage, CreatedAt)
            SELECT 'oldSoesyDB', r.reg_id, NULL, 0, 'EXCLUDED_GENDER', 'EXCLUDED', 
                   CASE WHEN r.ddl_2_id = 3 THEN 'EX-GENDER-MALE' ELSE 'EX-GENDER-MISSING' END, GETDATE()
            FROM oldSoesyDB.dbo.tbl_registration r
            WHERE (r.ddl_2_id IS NULL OR r.ddl_2_id != 4)
              AND NOT EXISTS (
                  SELECT 1 FROM MigrationSourceRecord m 
                  WHERE m.SourceRegistrationId = r.reg_id AND m.SourceSystem = 'oldSoesyDB'
              );
        ";
        var count = await conn.ExecuteAsync(sql);
        Console.WriteLine($"Initialized EXCLUDED tracker: {count} unmigrated non-female records bypassed via idempotency schema.");
    }

    public async Task<string> CheckConflicts(string email, string mobile)
    {
        using var conn = new SqlConnection(_newDbStr);
        bool emailClash = !string.IsNullOrEmpty(email) && await conn.QueryFirstOrDefaultAsync<int>("SELECT 1 FROM UserAccount WHERE Email = @e", new { e = email }) == 1;
        bool mobileClash = !string.IsNullOrEmpty(mobile) && await conn.QueryFirstOrDefaultAsync<int>("SELECT 1 FROM UserAccount WHERE MobileNumber = @m", new { m = mobile }) == 1;

        if (emailClash && mobileClash) return "BOTH";
        if (emailClash) return "EMAIL";
        if (mobileClash) return "MOBILE";
        return "NONE";
    }

    public async Task<bool> ProcessMigrationTx(MigrationContext ctx, int runId)
    {
        using var conn = new SqlConnection(_newDbStr);
        await conn.OpenAsync();
        using var tx = await conn.BeginTransactionAsync();

        try
        {
            // 1. Check idempotency (Already migrated?)
            var existing = await conn.QueryFirstOrDefaultAsync<int?>(
                "SELECT MigrationSourceId FROM MigrationSourceRecord WHERE SourceSystem='oldSoesyDB' AND SourceRegistrationId=@reg AND Status IN ('SUCCESS', 'SKIPPED', 'EXCLUDED')",
                new { reg = ctx.Source.reg_id }, tx);

            if (existing.HasValue) 
            {
               // Exists, skip or update. We will skip for idempotency currently.
               return true;
            }

            if (!ctx.IsEligible)
            {
                // Write failure record
                await WriteMigrationSource(conn, (SqlTransaction)tx, ctx, null, runId, "SKIPPED", string.Join(";", ctx.ExclusionReasons));
                await tx.CommitAsync();
                return false;
            }

            // 2. Insert UserAccount
            var pCode = $"SE{ctx.Source.reg_id}";
            var acctSql = @"
                INSERT INTO UserAccount (ProfileCode, FullName, MobileNumber, Email, PasswordHash, GenderId, MembershipPlanId, ProfileStatusId, IsMobileVerified, IsEmailVerified, IsProfileCompleted, IsPremium, IsActive, CreatedAt, IsMarried)
                OUTPUT INSERTED.UserId
                VALUES (@pc, @fn, @m, @e, @pw, @g, 1, 1, 0, 0, 0, 0, @act, GETDATE(), 0)";
            var userId = await conn.QuerySingleAsync<int>(acctSql, new {
                pc = pCode, fn = ctx.FullName, m = ctx.MobileNumber, e = ctx.Email, pw = ctx.PasswordHash, g = ctx.GenderId, act = ctx.IsActive
            }, tx);

            // 3. Insert UserProfile
            var profSql = @"
                INSERT INTO UserProfile (UserId, DateOfBirth, MaritalStatusId, Address, AboutMe, CreatedAt, IsActive)
                VALUES (@uid, @dob, @ms, @addr, @abt, GETDATE(), 1)";
            await conn.ExecuteAsync(profSql, new {
                uid = userId, dob = ctx.DateOfBirth, ms = ctx.MaritalStatusId, addr = ctx.Address, abt = ctx.AboutMe
            }, tx);

            // 4. Insert UserFamily
            if (ctx.HasFamilyData)
            {
                var famSql = @"
                    INSERT INTO UserFamily (UserId, FatherName, MotherName, Brothers, MarriedBrothers, Sisters, MarriedSisters, CreatedAt, IsActive)
                    VALUES (@uid, @fa, @mo, 0, 0, 0, 0, GETDATE(), 1)";
                await conn.ExecuteAsync(famSql, new { uid = userId, fa = ctx.FatherName, mo = ctx.MotherName }, tx);
            }

            // 5. Insert Photos
            foreach(var p in ctx.Photos)
            {
                var pSql = @"
                    INSERT INTO UserPhoto (UserId, PhotoUrl, IsProfilePhoto, DisplayOrder, IsApproved, CreatedAt, IsActive)
                    VALUES (@uid, @url, @ip, @dspO, 1, GETDATE(), 1)";
                await conn.ExecuteAsync(pSql, new { uid = userId, url = p.Url, ip = p.IsProfilePhoto, dspO = p.Order }, tx);
            }

            // 6. Write success to MigrationSourceRecord
            var cHash = Hasher.ComputeContentHash(ctx);
            await WriteMigrationSource(conn, (SqlTransaction)tx, ctx, userId, runId, "SUCCESS", string.Join(";", ctx.Warnings));
            
            await tx.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            Console.WriteLine($"Error on RegID {ctx.Source.reg_id}: {ex.Message}");
            // Log external failure using the UPSERT
            await WriteMigrationSource(conn, null, ctx, null, runId, "FAILED", ex.Message);
            return false;
        }
    }

    private async Task WriteMigrationSource(SqlConnection conn, SqlTransaction tx, MigrationContext ctx, int? userId, int runId, string status, string msg)
    {
        var sql = @"
            IF EXISTS (SELECT 1 FROM MigrationSourceRecord WHERE SourceSystem='oldSoesyDB' AND SourceRegistrationId=@regId)
            BEGIN
                UPDATE MigrationSourceRecord 
                SET TargetUserId=@uid, MigrationRunId=@rId, ContentHash=@h, Status=@st, ErrorMessage=@msg, UpdatedAt=GETDATE()
                WHERE SourceSystem='oldSoesyDB' AND SourceRegistrationId=@regId
            END
            ELSE
            BEGIN
                INSERT INTO MigrationSourceRecord (SourceSystem, SourceRegistrationId, TargetUserId, MigrationRunId, ContentHash, Status, ErrorMessage, CreatedAt)
                VALUES ('oldSoesyDB', @regId, @uid, @rId, @h, @st, @msg, GETDATE())
            END";
        var cHash = Hasher.ComputeContentHash(ctx);
        if (tx != null)
        {
            await conn.ExecuteAsync(sql, new {
                regId = ctx.Source.reg_id, uid = userId, rId = runId, h = cHash, st = status, msg = msg
            }, tx);
        }
        else
        {
            await conn.ExecuteAsync(sql, new {
                regId = ctx.Source.reg_id, uid = userId, rId = runId, h = cHash, st = status, msg = msg
            });
        }
    }
}
