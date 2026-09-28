using System;
using System.Text.RegularExpressions;
using SoeasyMigrationTool.Models;

namespace SoeasyMigrationTool;

public class Transformer
{
    public MigrationContext Transform(OldRegistration oldReg)
    {
        var ctx = new MigrationContext { Source = oldReg };
        
        ValidateGender(ctx);
        TransformContactData(ctx);
        TransformCoreProfile(ctx);
        TransformDOB(ctx);
        ProcessPhotos(ctx);
        CheckDuplicatesAndFlags(ctx);
        
        return ctx;
    }

    private void ValidateGender(MigrationContext ctx)
    {
        // 3=Bride (looking for) -> target gender Male (1)
        // 4=Groom (looking for) -> target gender Female (2)
        if (ctx.Source.ddl_2_id == 3) ctx.GenderId = 1;
        else if (ctx.Source.ddl_2_id == 4) ctx.GenderId = 2;
        else
        {
            ctx.IsEligible = false;
            ctx.ExclusionReasons.Add("EX-GENDER-MISSING");
        }
    }

    private void TransformContactData(MigrationContext ctx)
    {
        ctx.FullName = string.IsNullOrWhiteSpace(ctx.Source.m5) ? "Unknown" : ctx.Source.m5.Trim();
        if (ctx.FullName == "Unknown")
        {
            ctx.IsEligible = false;
            ctx.ExclusionReasons.Add("EX-NAME-MISSING");
        }

        // Email normalization
        if (!string.IsNullOrWhiteSpace(ctx.Source.m22))
        {
            var email = ctx.Source.m22.Trim().ToLower();
            if (Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                ctx.Email = email;
            else
                ctx.Warnings.Add($"Invalid email format: {ctx.Source.m22}");
        }
        else
        {
            ctx.IsEligible = false;
            ctx.ExclusionReasons.Add("EX-EMAIL-MISSING");
        }

        // Mobile normalization: strip characters and validate 10 digits
        if (!string.IsNullOrWhiteSpace(ctx.Source.m6))
        {
            var m = ctx.Source.m6;
            m = m.Replace(" ", "").Replace("-", "").Replace("+", "").Replace(".", "").Replace("O", "0");
            if (m.StartsWith("91") && m.Length == 12) m = m.Substring(2);
            if (m.Length == 10 && Regex.IsMatch(m, @"^\d{10}$"))
                ctx.MobileNumber = m;
            else
                ctx.Warnings.Add($"Invalid mobile format: {ctx.Source.m6}");
        }
    }
    
    private void TransformCoreProfile(MigrationContext ctx)
    {
        // Password Sentinel (Test@12345)
        ctx.PasswordHash = "$2a$11$W1e.FnRzqB8/JyKWQCWPXO9rFI4i8UhsJaLVqrYmZDZDH6C5a3T9O";
        
        // Active Status
        ctx.IsActive = ctx.Source.admin_status ?? true;
        
        // Marital Status Mapping (1=Unmarried, 2=Widow, 3=Widower, 4=Divorced, 5=Separated)
        if (ctx.Source.ddl_1_id == 1) ctx.MaritalStatusId = 1; // Never Married
        else if (ctx.Source.ddl_1_id == 2 || ctx.Source.ddl_1_id == 3) ctx.MaritalStatusId = 3; // Widowed
        else if (ctx.Source.ddl_1_id == 4 || ctx.Source.ddl_1_id == 5) ctx.MaritalStatusId = 2; // Divorced / Separated
        
        // Family
        ctx.FatherName = string.IsNullOrWhiteSpace(ctx.Source.m16) ? null : ctx.Source.m16.Trim();
        ctx.MotherName = string.IsNullOrWhiteSpace(ctx.Source.m17) ? null : ctx.Source.m17.Trim();
        
        ctx.Address = string.IsNullOrWhiteSpace(ctx.Source.m18) ? null : ctx.Source.m18.Trim();
        ctx.AboutMe = string.IsNullOrWhiteSpace(ctx.Source.m21) ? null : ctx.Source.m21.Trim();
    }

    private void TransformDOB(MigrationContext ctx)
    {
        if (string.IsNullOrWhiteSpace(ctx.Source.m15)) return;
        
        var m15 = ctx.Source.m15.Trim();
        var isUk = DateTime.TryParseExact(m15, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var dUk);
        var isUs = DateTime.TryParseExact(m15, "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out var dUs);

        if (isUk && isUs && dUk != dUs)
        {
            ctx.Warnings.Add($"DOB Ambiguous: {m15}");
            // Leave DateOfBirth null to force review
        }
        else if (isUk)
        {
            ctx.DateOfBirth = dUk;
        }
        else if (isUs)
        {
            ctx.DateOfBirth = dUs;
        }
        else
        {
            ctx.Warnings.Add($"DOB Unparseable: {m15}");
        }
    }
    
    private void ProcessPhotos(MigrationContext ctx)
    {
        var baseUrl = "https://assetsmatrimony.kaliweb.in/uploads/old/uploads/";

        static string NormalizePhotoPath(string path)
        {
            return path.Trim().TrimStart('/').Replace("uploads/", "", StringComparison.OrdinalIgnoreCase);
        }

        if (!string.IsNullOrWhiteSpace(ctx.Source.img1))
            ctx.Photos.Add(new PhotoInfo{ Url = baseUrl + NormalizePhotoPath(ctx.Source.img1), IsProfilePhoto = true, Order = 1 });
            
        if (!string.IsNullOrWhiteSpace(ctx.Source.img2))
            ctx.Photos.Add(new PhotoInfo{ Url = baseUrl + NormalizePhotoPath(ctx.Source.img2), IsProfilePhoto = false, Order = 2 });
            
        if (!string.IsNullOrWhiteSpace(ctx.Source.img3))
            ctx.Warnings.Add("img3 present: May be Jathakam. Skipping auto-migration.");
            
        if (!string.IsNullOrWhiteSpace(ctx.Source.img4))
            ctx.Photos.Add(new PhotoInfo{ Url = baseUrl + NormalizePhotoPath(ctx.Source.img4), IsProfilePhoto = false, Order = 4 });
    }
    
    private void CheckDuplicatesAndFlags(MigrationContext ctx)
    {
        // Handled at the pipeline orchestration layer (OldDbReader logic), but we set flags here if needed
    }
}
