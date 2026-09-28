# Migration Plan — oldSoesyDB → kaliweb1_soesy2026

> **Status:** DRAFT — requires business approval before any write operations  
> **Date:** 2026-09-04  
> **Author:** Migration Analysis Tool (read-only phase)

---

## 1. Scope

Migrate **matrimonial registrations** from the legacy `oldSoesyDB` database into the normalized `kaliweb1_soesy2026` schema.

### Source Selection

| Criterion | Value |
|---|---|
| Source table | `tbl_registration` |
| Filter | `servicetype_id = 1` (matrimonial) |
| Total eligible rows | **8,465** |
| `tbl_tempreg` rows | 125 — treated separately, **not** in scope for automated migration |
| Total registrations in table | 8,485 |

### Exclusion Policy

A source row is **excluded** from automated migration if any of the following apply:

| Code | Reason | Measured Count |
|---|---|---|
| `EX-GENDER` | `ddl_2_id` is `0` or unmapped | 72 |
| `EX-EMAIL-DUP` | Normalized email collides with an existing `UserAccount` | 1 |
| `EX-MOBILE-DUP` | Normalized mobile collides with an existing `UserAccount` | 1 |
| `EX-CRITICAL` | Missing both name (`m5`) and mobile (`m6`) | TBD at runtime |

Excluded rows are logged with reason codes; they require manual review.

---

## 2. Target Tables

Each migrated registration produces an **aggregate** of up to six rows across these tables:

| # | Target Table | Required | Key Fields |
|---|---|---|---|
| 1 | `UserAccount` | ✅ | FullName, MobileNumber, Email, GenderId, ProfileCode, PasswordHash, IsActive, IsPremium, MembershipPlanId |
| 2 | `UserProfile` | ✅ | DateOfBirth, HeightId, Weight, MaritalStatusId, ReligionId, CommunityId, EducationId, OccupationId, IncomeId, CountryId, StateId, DistrictId, Address, Pincode, AboutMe |
| 3 | `UserFamily` | Optional | FatherName, MotherName, FatherOccupationId, MotherOccupationId, FamilyTypeId, FamilyStatusId, FamilyValueId, NativePlace, siblings |
| 4 | `UserPreference` | Optional | Age range, Height range, master IDs, PreferredDescription |
| 5 | `UserPhoto` | Optional | PhotoUrl, IsProfilePhoto, DisplayOrder, IsApproved |
| 6 | `UserSubscription` | Optional | MembershipPlanId, PaymentReference, AmountPaid, StartDate, EndDate, IsActive, IsApproved |

---

## 3. Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  OLD DB      │────▶│  Typed Read      │────▶│  Normalize /  │
│  (read-only) │     │  Model           │     │  Transform    │
└──────────────┘     └──────────────────┘     └───────┬───────┘
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │  Mapping       │
                                              │  Registry      │
                                              │  (approved     │
                                              │   master maps) │
                                              └───────┬───────┘
                                                      │
                                                      ▼
                                              ┌───────────────┐     ┌──────────────┐
                                              │  Validate &   │────▶│  Staged      │
                                              │  Classify     │     │  Result      │
                                              └───────────────┘     │  (dry-run    │
                                                                    │   manifest)  │
                                                                    └──────┬───────┘
                                                                           │
                                                              ┌────────────┼────────────┐
                                                              ▼            ▼             ▼
                                                       [DRY-RUN]    [WRITE MODE]   [RECONCILE]
                                                       JSON/CSV     Target Txn      Hash compare
                                                       report       + audit log     + FK check
```

### Connections

| Connection | Database | Access |
|---|---|---|
| `OldDatabase` | `oldSoesyDB` | **Read-only** (Windows auth, read-only intent) |
| `NewDatabase` | `kaliweb1_soesy2026` | Read for masters/conflicts; **write only in approved write mode** |

### Module Isolation

- Dedicated migration console project or isolated module.
- **Never** route bulk migration through public registration/profile APIs.
- Use separate `OldDatabase` and `NewDatabase` connection factories.
- Least-privilege credentials for each connection.

---

## 4. Phases

### Phase 1 — Analysis & Dry Run (current)

1. Generate five documentation files (this phase).
2. Produce per-record dry-run manifest: normalized values, resolved master IDs, warnings, exclusion reasons, deterministic hash.
3. Reconciliation report: total eligible, total excluded (by reason), total ready, master coverage gaps.

### Phase 2 — Master Data Preparation

1. Populate missing master table entries (education, occupation, religion, community, income, height, location) based on approved `MASTER_MAPPING.md`.
2. Business review and confirmation of all `REQUIRES REVIEW` mappings.

### Phase 3 — Schema Extension

1. Create `MigrationSourceRecord` table:
   ```sql
   CREATE TABLE MigrationSourceRecord (
       MigrationSourceId   INT IDENTITY(1,1) PRIMARY KEY,
       SourceSystem        VARCHAR(50) NOT NULL,          -- 'oldSoesyDB'
       SourceRegistrationId INT NOT NULL,                 -- tbl_registration.reg_id
       TargetUserId        INT NULL,                      -- FK → UserAccount.UserId
       MigrationRunId      INT NOT NULL,
       ContentHash         VARCHAR(64) NOT NULL,          -- SHA-256 of normalized source
       Status              VARCHAR(20) NOT NULL,          -- 'Pending','Migrated','Error','Skipped'
       ErrorMessage        NVARCHAR(MAX) NULL,
       CreatedAt           DATETIME2 NOT NULL DEFAULT GETDATE(),
       UpdatedAt           DATETIME2 NULL,
       CONSTRAINT UQ_Source UNIQUE (SourceSystem, SourceRegistrationId)
   );
   ```
2. Create `MigrationRun` audit table for batch tracking.

### Phase 4 — Write Migration (separately approved)

1. For each eligible source row, within a single transaction:
   - INSERT `UserAccount` (with generated `ProfileCode`, placeholder `PasswordHash` = `'MIGRATION_REQUIRES_RESET'`).
   - INSERT `UserProfile` with resolved master IDs.
   - INSERT `UserFamily` if father/mother data exists.
   - SKIP `UserPreference` (old schema has no structured preference data).
   - INSERT `UserPhoto` for verified photo URLs.
   - INSERT `UserSubscription` only for rows passing conservative payment eligibility.
   - INSERT `MigrationSourceRecord` with content hash.
2. On failure: roll back entire aggregate, log error.

### Phase 5 — Reconciliation & Activation

1. Validate row counts per table.
2. Validate FK integrity across all migrated rows.
3. Generate user activation/password-reset tokens for migrated accounts.
4. Notify migrated users through established channels.

---

## 5. Idempotency

| Mechanism | Purpose |
|---|---|
| `MigrationSourceRecord.UQ_Source` | Prevents duplicate migration of same source row |
| `ContentHash` | Detects source-data changes between runs |
| Per-aggregate transaction | All-or-nothing per user |
| Rerun behavior | Match on `(SourceSystem, SourceRegistrationId)` → skip if hash unchanged, reconcile if changed, never create duplicate |
| Email/mobile collision | Flagged as conflict record, **never** implicit merge |

---

## 6. Dry-Run Manifest Format

Each source row produces a JSON record:

```json
{
  "sourceRegId": 12345,
  "eligible": true,
  "exclusionReasons": [],
  "account": {
    "fullName": "...",
    "mobileNumber": "...",
    "email": "...",
    "genderId": 2
  },
  "profile": {
    "dateOfBirth": "1990-05-15",
    "dobConfidence": "UNAMBIGUOUS",
    "heightId": null,
    "heightRaw": "165",
    "religionId": 3,
    "religionRaw": "Hindu",
    "communityId": null,
    "communityRaw": "Scheduledcastee",
    "communityStatus": "REQUIRES_REVIEW"
  },
  "warnings": [
    "DOB ambiguous: both dd/MM and MM/dd parse to different dates",
    "Community value not found in master: 'Scheduledcastee'"
  ],
  "contentHash": "sha256:abc123..."
}
```

---

## 7. Rollback Boundaries

| Scope | Rollback Method |
|---|---|
| Individual user aggregate | Transaction rollback on error |
| Batch of users | Delete `MigrationSourceRecord` rows for the batch; cascading cleanup via recorded `TargetUserId` |
| Entire migration | Truncate migration tables, delete all `UserAccount` rows where `UserId` has a `MigrationSourceRecord` |

---

## 8. Approval Gates

| Gate | Required Before |
|---|---|
| ✅ `FIELD_MAPPING.md` approved | Any write operation |
| ✅ `MASTER_MAPPING.md` approved | Master data population |
| ✅ `DATA_QUALITY_REPORT.md` reviewed | Migration eligibility rules finalized |
| ✅ `MIGRATION_WARNINGS.md` acknowledged | Phase 4 execution |
| ✅ Dry-run manifest reviewed | Phase 4 execution |
| ✅ `MigrationSourceRecord` schema approved | Phase 3 execution |

---

## 9. Safety Commitments

- **No database modifications** in analysis/dry-run phases.
- Write mode is a separate, explicitly opt-in configuration.
- Source reads use read-only intent where supported.
- Passwords are **never** synthesized or shared; migrated accounts require activation/reset.
- Photos are copied only **after** account commit and physical source-file verification.
- `tbl_tempreg` rows are **excluded** from automated migration.
- All operations are logged with timestamps, batch IDs, and operator identity.

---

## Appendix A — Proposed Analysis SQL

### Total Matrimonial Registrations
```sql
SELECT COUNT(*) AS TotalMatrimonial
FROM tbl_registration
WHERE servicetype_id = 1;
```

### Eligible vs Excluded (by reason)
```sql
SELECT
    CASE
        WHEN ddl_2_id = 0 OR ddl_2_id NOT IN (1,2,3,4) THEN 'EX-GENDER'
        WHEN LTRIM(RTRIM(m5)) = '' OR m5 IS NULL THEN 'EX-NAME-MISSING'
        ELSE 'ELIGIBLE'
    END AS Status,
    COUNT(*) AS Cnt
FROM tbl_registration
WHERE servicetype_id = 1
GROUP BY
    CASE
        WHEN ddl_2_id = 0 OR ddl_2_id NOT IN (1,2,3,4) THEN 'EX-GENDER'
        WHEN LTRIM(RTRIM(m5)) = '' OR m5 IS NULL THEN 'EX-NAME-MISSING'
        ELSE 'ELIGIBLE'
    END;
```

### Duplicate Emails
```sql
SELECT LOWER(LTRIM(RTRIM(m22))) AS NormEmail, COUNT(*) AS Cnt
FROM tbl_registration
WHERE servicetype_id = 1
  AND m22 IS NOT NULL AND LTRIM(RTRIM(m22)) <> ''
GROUP BY LOWER(LTRIM(RTRIM(m22)))
HAVING COUNT(*) > 1;
```

### Duplicate Mobiles
```sql
SELECT
    REPLACE(REPLACE(REPLACE(REPLACE(m6,' ',''),'-',''),'+',''),'.','') AS NormMobile,
    COUNT(*) AS Cnt
FROM tbl_registration
WHERE servicetype_id = 1
  AND m6 IS NOT NULL AND LTRIM(RTRIM(m6)) <> ''
GROUP BY REPLACE(REPLACE(REPLACE(REPLACE(m6,' ',''),'-',''),'+',''),'.','')
HAVING COUNT(*) > 1;
```
