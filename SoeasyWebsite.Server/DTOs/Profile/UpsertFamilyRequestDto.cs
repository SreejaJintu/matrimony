namespace SoeasyWebsite.Server.DTOs.Profile;

public class UpsertFamilyRequestDto
{
    public int UserId { get; set; }

    public string? FatherName { get; set; }

    public short? FatherOccupationId { get; set; }

    public string? MotherName { get; set; }

    public short? MotherOccupationId { get; set; }

    public byte? FamilyTypeId { get; set; }

    public byte? FamilyStatusId { get; set; }

    public byte? FamilyValueId { get; set; }

    public string? NativePlace { get; set; }

    public byte Brothers { get; set; }

    public byte MarriedBrothers { get; set; }

    public byte Sisters { get; set; }

    public byte MarriedSisters { get; set; }

    public string? AboutFamily { get; set; }
}
