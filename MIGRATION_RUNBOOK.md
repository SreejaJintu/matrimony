# Database Migration Runbook

## WARNING: LOCAL TEST ONLY
Do NOT run this runbook against production under any circumstances. Production migration must only be scheduled after business owners review and sign-off on the local tests.

## Setup Requirements (LOCAL DBs ONLY)
1. Backup local target DB `kaliweb1_soesy2026`.
2. Verify connections in `appsettings.json`.
3. Verify target schemas to drop UNIQUE index constraints properly.
   ```sql
   ALTER TABLE UserAccount DROP CONSTRAINT UQ__UserAcco__A9D10534C41AE2D7;
   CREATE UNIQUE NONCLUSTERED INDEX UQ_UserAccount_Email ON UserAccount(Email) WHERE Email IS NOT NULL;
   
   ALTER TABLE UserAccount DROP CONSTRAINT UQ__UserAcco__250375B146AC73B1;
   CREATE UNIQUE NONCLUSTERED INDEX UQ_UserAccount_Mobile ON UserAccount(MobileNumber) WHERE MobileNumber IS NOT NULL;
   ```

## Validation Path
1. Run pre-check (analyze nulls/emails layout)
2. 10-record run: `dotnet run 10`
3. Retry tested on FAILED records automatically (Idempotency checked using `Status IN ('SUCCESS', 'SKIPPED')`).
4. Execute `dotnet run 220` (first 120 cached, 100 net-new) for business pilot.
5. SQL Count Reconciliation:
   ```sql
   SELECT Status, COUNT(*) FROM MigrationSourceRecord GROUP BY Status;
   ```
6. Business review checkpoint: Review `MIGRATION_TEST_RESULTS.md` and `MIGRATION_CONFLICT_REPORT.md`.

## Post-Migration Verification
1. Compare `COUNT(*)` of `oldSoesyDB.tbl_registration` against `MigrationSourceRecord`.
2. Inspect `ErrorMessage` column for records that failed constraint validation. 
3. Address any errors or missed mapping enums directly in DB or via the Migration Tool (`TargetUserId` mapped).
