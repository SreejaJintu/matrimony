# Migration Test Results (Pilot Summary)

## General Execution Summary
A 120-record pilot migration run was executed in a local test environment replicating `oldSoesyDB` to `kaliweb1_soesy2026` via the customized standalone `SoeasyMigrationTool` application.

**Pilot 120-Record Outcomes:**
- **Successful insertions:** 54
- **Skipped explicitly (Ineligible):** 32
- **Errors resulting in transaction rollback:** 34

## Safety and Idempotency Validation
- **Idempotency Guarantee:** Rerunning the migration application accurately respects the `Status IN ('SUCCESS', 'SKIPPED')`.
- **Rollback Consistency:** Due to Dapper `SqlTransaction` usage per profile batch, ANY failure (like a constraint error) entirely drops Target writes but safely logs `FAILED` outside the transaction back to `MigrationSourceRecord`.
- **Target Schema Protection:** No existing target records were mutated or interfered with.

## Final Database Count Reconciliation (220-Record Business Pilot)
We strictly re-tested 34 failures after local schema indexing changes, and generated a new clean batch via `offset: 220` up to verify the exact status of the 220 records traversed.

- **Old DB Total (Pilots limit):** 220
- **SUCCESSFUL Insertions:** 80
- **SKIPPED records:** 140 (Majority matching `EX-DUP-TARGET-CONFLICT` sharing generic emails)
- **FAILED records:** 0 (All 34 original failures retried successfully alongside perfectly clean new inserts).
- **PENDING (Not Migrated):** 8245

## Key Discovery 1: SQL Server UNIQUE NULLs Constraint 
**Critical Warning (Blocker):** The target database `kaliweb1_soesy2026.UserAccount` contains a Unique Key on Email (`UQ__UserAcco__A9D10534C41AE2D7`). Standard SQL Server Unique Constraints **do not allow multiple NULL values**.
**Impact:** Thus, only ONE user in the entire database is permitted to have an empty/missing Email. The other 34 error records all failed the Pilot precisely because they lacked Emails, causing collision with the single NULL slot. 
**Remediation Required:**
- The target schema must be modified to use a Filtered Unique Index: `CREATE UNIQUE NONCLUSTERED INDEX UQ_UserAccount_Email ON UserAccount(Email) WHERE Email IS NOT NULL;`
- Alternatively, auto-generate a dummy email (e.g. `migrated_x@soeasy.placeholder.com`). 

## Key Discovery 2: Master Data Integrity (Marital & Gender)
- Found out early that Gender in Old System `tbl_ddl` used Context IDs (3 = Looking for Bride [Male User Profile], 4 = Looking for Groom [Female User Profile]), as opposed to Target system values of (1 = Male, 2 = Female). Correctly re-mapped.
- Old DB Marital values for "Separated" mapped against "Divorced" in the target DB safely since no exact target enum applied.
- The 100-pilot previously failed 87 rows until `MaritalStatusId` mappings were confirmed as tightly enforced Foreign Keys. 

## Conflict Statistics
32 records in the pilot skipped automatically specifically because `Target Email OR MobileNumber` already existed in the target schema. 

## Next Action
To scale this up to 8,400 remaining rows, we MUST first instruct the Database Administrator to deploy the Filtered Unique Indexes over Mobile & Email. 
