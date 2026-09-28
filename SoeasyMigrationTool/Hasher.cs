using System;
using System.Security.Cryptography;
using System.Text;

namespace SoeasyMigrationTool;

public static class Hasher
{
    public static string ComputeContentHash(Models.MigrationContext context)
    {
        var rawData = $"{context.Source.m15}|{context.Source.m5}|{context.Source.m6}|{context.Source.m22}|{context.Source.m16}|{context.Source.m17}|{context.Source.m9}|{context.Source.m11}";
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(rawData);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToHexString(hash);
    }
}
