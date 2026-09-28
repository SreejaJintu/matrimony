using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SoeasyMigrationTool;

class Program
{
    static async Task Main(string[] args)
    {
        int limit = args.Length > 0 && int.TryParse(args[0], out var l) ? l : 10;
        Console.WriteLine($"Starting migration tool, limit {limit} records...");

        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        var agent = new SqlAgent(config);
        var transformer = new Transformer();

        await agent.MarkExcludedGendersAsync();
        
        var sourceRecords = await agent.GetOldRegistrations(limit);
        Console.WriteLine($"\nSelected {sourceRecords.Count} eligible female candidates for pipeline evaluation.");

        int runId = new Random().Next(1000, 9999);
        int success = 0, skipped = 0, err = 0;

        foreach (var sr in sourceRecords)
        {
            var ctx = transformer.Transform(sr);

            if (ctx.IsEligible)
            {
                var clash = await agent.CheckConflicts(ctx.Email, ctx.MobileNumber);
                if (clash == "EMAIL" || clash == "BOTH")
                {
                    // User directive: use nulls for conflicted email fields
                    ctx.Email = null;
                    if (clash == "BOTH")
                    {
                        ctx.IsEligible = false;
                        ctx.ExclusionReasons.Add("EX-DUP-TARGET-CONFLICT-MOBILE");
                    }
                }
                else if (clash == "MOBILE")
                {
                    ctx.IsEligible = false;
                    ctx.ExclusionReasons.Add("EX-DUP-TARGET-CONFLICT-MOBILE");
                }
            }

            var ok = await agent.ProcessMigrationTx(ctx, runId);
            if (!ctx.IsEligible)
            {
                skipped++;
                Console.WriteLine($"RegID {ctx.Source.reg_id} Skipped. Reasons: {string.Join(", ", ctx.ExclusionReasons)}");
            }
            else if (ok)
            {
                success++;
            }
            else
            {
                err++;
                Console.WriteLine($"RegID {ctx.Source.reg_id} Failed.");
            }
        }

        var sStats = await agent.GetSourceStatsAsync();
        var remains = await agent.GetRemainingFemalesAsync();

        Console.WriteLine("\n=== PILOT MIGRATION REPORT ===");
        Console.WriteLine($"Source records checked: {sStats.Total}");
        Console.WriteLine($"Female eligible: {sStats.Female}");
        Console.WriteLine($"Male excluded: {sStats.Male}");
        Console.WriteLine($"Other/missing gender: {sStats.Missing}");
        Console.WriteLine("------------------------------");
        Console.WriteLine($"Successfully migrated: {success}");
        Console.WriteLine($"Skipped (Conflict/Invalid): {skipped}");
        Console.WriteLine($"Failed (Application Error): {err}");
        Console.WriteLine("------------------------------");
        Console.WriteLine($"Remaining female candidates: {remains}");
    }
}
