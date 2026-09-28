namespace SoeasyMigrationTool.Models;

public class OldRegistration
{
    public int reg_id { get; set; }
    public int? ddl_1_id { get; set; } // Marital
    public int? ddl_2_id { get; set; } // Gender
    public string m5 { get; set; } // Name
    public string m6 { get; set; } // Mobile
    public string m7 { get; set; } // Whatsapp
    public string m8 { get; set; } // Star
    public string m9 { get; set; } // Religion & Community
    public string m10 { get; set; } // Weight
    public string m11 { get; set; } // Height
    public string m12 { get; set; } // Education
    public string m13 { get; set; } // Job
    public string m14 { get; set; } // Age
    public string m15 { get; set; } // DOB
    public string m16 { get; set; } // Father
    public string m17 { get; set; } // Mother
    public string m18 { get; set; } // Address
    public string m19 { get; set; } // District
    public string m20 { get; set; } // Income
    public string m21 { get; set; } // Description
    public string m22 { get; set; } // Email
    public string img1 { get; set; } // Photo 1
    public string img2 { get; set; } // Photo 2
    public string img3 { get; set; } // Jathakam / Photo 3
    public string img4 { get; set; } // Photo 4
    public string reg_date { get; set; }
    public bool? admin_status { get; set; }
    public string transactionid { get; set; }
    public string payamount { get; set; }
    public bool? paystatus { get; set; }
    public bool? profilestatus { get; set; }
}

public class MigrationContext // The Aggregate Model holding mapped target values
{
    public OldRegistration Source { get; set; } = new();
    
    // Core details
    public string ProfileCode { get; set; }
    public string FullName { get; set; }
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }
    public byte GenderId { get; set; }
    public bool IsActive { get; set; }
    public string PasswordHash { get; set; } // Sentinel value

    // Profile details
    public DateTime? DateOfBirth { get; set; }
    public short? HeightId { get; set; }
    public decimal? Weight { get; set; }
    public byte? MaritalStatusId { get; set; }
    public short? ReligionId { get; set; }
    public int? CommunityId { get; set; }
    public short? EducationId { get; set; }
    public short? OccupationId { get; set; }
    public short? IncomeId { get; set; }
    public short? DistrictId { get; set; }
    public short? StateId { get; set; }
    public short? CountryId { get; set; }
    public string? Address { get; set; }
    public string? AboutMe { get; set; }
    
    // Family (Only populated if parents present)
    public bool HasFamilyData => !string.IsNullOrWhiteSpace(FatherName) || !string.IsNullOrWhiteSpace(MotherName);
    public string? FatherName { get; set; }
    public string? MotherName { get; set; }
    
    // Migration status/validation
    public bool IsEligible { get; set; } = true;
    public List<string> ExclusionReasons { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
    
    // Photos
    public List<PhotoInfo> Photos { get; set; } = new();
}

public class PhotoInfo
{
    public string Url { get; set; }
    public bool IsProfilePhoto { get; set; }
    public byte Order { get; set; }
}
