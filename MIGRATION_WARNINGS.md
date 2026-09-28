# Migration Warnings — Decisions Requiring Business Approval

> **Status:** DRAFT  
> **Date:** 2026-09-04  
> **Classification:** Items that **must** be resolved by business stakeholders before any write operation proceeds.

---

## ⚠️ W-01: Password Activation Requirement

**Severity:** 🔴 Critical

The old `oldSoesyDB` stores **no password** for matrimonial registrations. Migrated accounts will have the sentinel value `MIGRATION_REQUIRES_RESET` in the `PasswordHash` column.

**Impact:**
- Migrated users **cannot log in** until they complete a password reset/activation flow.
- The current `usp_User_Login` will reject these accounts since `PasswordHelper.Verify()` will fail against the sentinel.

**Required Decisions:**
1. Build a dedicated "Activate Your Account" flow (email/SMS with token)?
2. Or require users to use "Forgot Password" on first login?
3. How to communicate to ~8,400 migrated users that their account exists?

> [!CAUTION]
> **Never** synthesize, reuse, or share passwords. Each account must go through an individual activation/reset process.

---

## ⚠️ W-02: Source Identity Schema Gap

**Severity:** 🔴 Critical

The new `kaliweb1_soesy2026` schema has **no column** to track the old registration ID. Without this:
- Reruns may create duplicate users.
- Reconciliation between old and new is impossible.
- Rollback cannot identify which new users came from migration.

**Proposed Solution:**
Create a `MigrationSourceRecord` table (see `MIGRATION_PLAN.md` §3 Phase 3) with a unique constraint on `(SourceSystem, SourceRegistrationId)`.

**Required Decision:** Approve the `MigrationSourceRecord` schema before Phase 3.

---

## ⚠️ W-03: DOB Ambiguity — 5,092 Records (60%)

**Severity:** 🟠 High

5,092 out of 8,465 records have dates of birth where both `dd/MM/yyyy` and `MM/dd/yyyy` are valid date strings but produce **different dates**. Example: `05/06/1990` could be June 5 or May 6.

**Policy:** These are marked `REQUIRES REVIEW`, not guessed.

**Required Decisions:**
1. Accept that ~60% of migrated profiles will have **NULL** DOB until manually reviewed?
2. Or use a heuristic (e.g., assume `dd/MM/yyyy` since Indian format is standard)? If so, accept that some DOBs will be wrong.
3. Or contact users to confirm their DOB?

---

## ⚠️ W-04: Duplicate Handling Strategy

**Severity:** 🟠 High

The old data contains:
- Duplicate emails (same normalized email, multiple `reg_id` values)
- Duplicate mobiles (same normalized mobile, multiple `reg_id` values)
- 1 email and 1 mobile that already exist in the target `UserAccount`

**New schema enforces:**
- Unique email per `UserAccount`
- Unique mobile per `UserAccount`

**Required Decisions:**
1. For old-side duplicates: which `reg_id` is the "canonical" one? Newest? Highest `reg_id`? Most complete profile?
2. For target conflicts: skip the old registration? Merge data into existing account?
3. Email/mobile collisions are **never** implicit merges — explicit policy needed.

---

## ⚠️ W-05: Payment / Subscription Unreliability

**Severity:** 🟠 High

Payment data quality is extremely poor:
- 8,464 of 8,465 rows have `paystatus = 1` (meaningless as a filter).
- 1,601 payment amounts are not valid decimals.
- 597 amounts are zero.
- 6,456 rows share duplicate transaction references across 1,003 groups.
- Only ~410 rows (~5%) may have credible payment data.

**Required Decisions:**
1. Migrate all old users as **Free plan** and require re-subscription?
2. Or attempt to honor valid payments — if so, what plan do they map to? What subscription period?
3. Refund/credit policy for users who paid in the old system?

---

## ⚠️ W-06: Photo / Jathakam Concern

**Severity:** 🟡 Medium

Old field labeling suggests:
- `img1`, `img2` → Profile photos
- `img3` → Possibly **Jathakam** (horoscope chart), not a profile photo
- `img4` → Additional photo

**Impact:** If `img3` is migrated as a profile photo, users may see horoscope images in photo galleries.

**Required Decisions:**
1. Confirm the semantic meaning of `img3` — is it always Jathakam, sometimes a photo, or mixed?
2. Should Jathakam images be migrated at all? If yes, to a separate document store?
3. Photo file accessibility must be verified before migration.

---

## ⚠️ W-07: Absent Preference Data

**Severity:** 🟡 Medium

The old schema has **no structured partner preference data** (age range, height range, preferred religion, education, etc.). The new `UserPreference` table will be **empty** for all migrated users.

**Impact:** Migrated users will appear in match searches but won't have preferences set, potentially affecting match quality algorithms.

**Required Decision:** Is this acceptable, or should a default preference profile be created based on the user's own attributes?

---

## ⚠️ W-08: Master Data Deficiencies

**Severity:** 🟡 Medium

### Education & Occupation
- Old data has 1,063 distinct education values and 3,213 distinct occupation values.
- New master tables may have far fewer entries.
- Most old values won't map automatically.

**Impact:** Majority of migrated profiles will have `NULL` education/occupation IDs.

### Community
- Old data stores religion and community combined in one field (`m9`).
- Splitting and matching is error-prone.
- Many community values are misspelled or don't exist in the target master.

### Location
- Target `DistrictMaster` contains duplicate district names under different states.
- District matching without full state context is ambiguous.
- Address data (`m18`) may help but is free text.

**Required Decision:** Should the master tables be pre-populated with old values before migration, or should unmatched values remain NULL?

---

## ⚠️ W-09: Privacy & Security Warnings

**Severity:** 🔴 Critical

| Concern | Mitigation |
|---|---|
| Old personal data (name, mobile, email, DOB) is being moved between systems | Ensure compliance with applicable data protection regulations |
| Connection strings with credentials exist in `appsettings.json` | Must not be committed to public repositories; use secrets management |
| FTP credentials for photo upload are in `appsettings.json` | Same as above |
| Migration logs may contain PII | Logs must be access-controlled and retention-limited |
| Migrated users haven't consented to the new platform's terms | Terms acceptance flow required on first activation |

**Required Decisions:**
1. Is there a consent/notification requirement for migrating user data to the new platform?
2. Should users be explicitly informed about the migration and asked to re-accept terms?
3. Photo migration involves copying personal images — does this require separate consent?

---

## ⚠️ W-10: `tbl_tempreg` Exclusion

**Severity:** 🟡 Medium

125 matrimonial rows exist in `tbl_tempreg` (temporary registrations). These are **excluded** from automated migration.

**Rationale:** Temporary registrations may be incomplete, unapproved, or duplicates of completed registrations.

**Required Decision:** Should any `tbl_tempreg` rows be migrated? If so, under what criteria?

---

## ⚠️ W-11: Inactive / Blocked User Migration

**Severity:** 🟡 Medium

Some old registrations may have `userstatus` values indicating inactive or blocked accounts.

**Required Decisions:**
1. Should inactive/blocked users be migrated at all?
2. If migrated, should they retain their inactive status (`IsActive = 0`)?
3. Should blocked users be excluded entirely from migration?

---

## ⚠️ W-12: Target `DistrictMaster` Data Quality

**Severity:** 🟡 Medium

The target database's `DistrictMaster` table itself contains data quality issues:
- Duplicate district names under different states
- Potentially mis-parented rows (districts assigned to wrong states)

**Impact:** Even correct old district values may resolve to the wrong district ID.

**Required Decision:** Should `DistrictMaster` be cleaned before migration begins?

---

## Decision Matrix

| # | Warning | Owner | Decision Needed | Blocking? |
|---|---|---|---|---|
| W-01 | Password activation | Business + Dev | Activation flow design | ✅ Yes |
| W-02 | Source identity table | Dev + DBA | Schema approval | ✅ Yes |
| W-03 | DOB ambiguity | Business | Format assumption or review policy | ✅ Yes |
| W-04 | Duplicate strategy | Business | Canonical record rules | ✅ Yes |
| W-05 | Payment unreliability | Business | Free plan default or honor policy | ✅ Yes |
| W-06 | Photo/Jathakam | Business | img3 semantics | ⚠️ Pre-photo |
| W-07 | No preferences | Business | Accept or generate defaults | ❌ No |
| W-08 | Master data gaps | Business + Dev | Pre-populate or accept NULL | ⚠️ Pre-write |
| W-09 | Privacy/security | Legal + Business | Consent/notification policy | ✅ Yes |
| W-10 | tempreg exclusion | Business | Include criteria or confirm exclude | ❌ No |
| W-11 | Inactive users | Business | Migration eligibility | ⚠️ Pre-write |
| W-12 | DistrictMaster quality | Dev + DBA | Clean before migration | ⚠️ Pre-write |

---

> [!IMPORTANT]
> **No write operations will proceed** until all blocking decisions (✅) are resolved and documented. This analysis phase is read-only and produces only documentation.
