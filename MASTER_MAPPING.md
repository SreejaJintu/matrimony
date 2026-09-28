# Master Data Mapping — oldSoesyDB → kaliweb1_soesy2026

> **Status:** DRAFT — requires business approval  
> **Date:** 2026-09-04  
> **Rule:** No fuzzy match becomes an accepted mapping automatically. All `REQUIRES REVIEW` items need explicit business confirmation.

---

## 1. Gender / Looking-For

**Old source:** `tbl_registration.ddl_2_id` (labeled "Looking for" — `Bride`/`Groom`)  
**Target:** `UserAccount.GenderId`

**Logic:** "Looking for Bride" implies the registrant is Male; "Looking for Groom" implies Female.

| Old `ddl_2_id` | Old Label | Target `GenderId` | Target Label | Disposition | Count |
|---|---|---|---|---|---|
| 1 | Bride (looking for) | `1` | Male | `TRANSFORM` | ~4,200 |
| 2 | Groom (looking for) | `2` | Female | `TRANSFORM` | ~4,193 |
| 0 | Unmapped / Missing | — | — | `REQUIRES REVIEW` | 72 |
| Other | Unknown values | — | — | `REQUIRES REVIEW` | TBD |

> [!IMPORTANT]
> The 72 rows with `ddl_2_id = 0` cannot be automatically assigned a gender. Business must decide: exclude, or manually classify.

---

## 2. Marital Status

**Old source:** `tbl_registration.ddl_1_id`  
**Target:** `UserProfile.MaritalStatusId` → `MaritalStatusMaster`

| Old `ddl_1_id` | Old Label | Target ID | Target `MaritalStatusName` | Disposition | Notes |
|---|---|---|---|---|---|
| 1 | Unmarried | Match by name | `Unmarried` / `Never Married` | `MASTER LOOKUP` | Exact or alias match |
| 2 | Widow | Match by name | `Widowed` | `TRANSFORM` | Merge `Widow` + `Widower` → `Widowed` |
| 3 | Widower | Match by name | `Widowed` | `TRANSFORM` | Merge `Widow` + `Widower` → `Widowed` |
| 4 | Divorced | Match by name | `Divorced` | `MASTER LOOKUP` | Exact match |
| 5 | Separated | Match by name | `Separated` | `MASTER LOOKUP` | If exists in target; else `REQUIRES REVIEW` |
| 0 | Unmapped / Missing | — | — | `REQUIRES REVIEW` | 86 rows |

---

## 3. Religion

**Old source:** `tbl_registration.m9` (combined Religion/Community string)  
**Target:** `UserProfile.ReligionId` → `ReligionMaster`

### Approved Exact Matches

| Old Value (normalized) | Target `ReligionName` | Disposition |
|---|---|---|
| `Hindu` | `Hindu` | `MASTER LOOKUP` |
| `Muslim` | `Muslim` | `MASTER LOOKUP` |
| `Christian` | `Christian` | `MASTER LOOKUP` |
| `Sikh` | `Sikh` | `MASTER LOOKUP` |
| `Buddhist` | `Buddhist` | `MASTER LOOKUP` |
| `Jain` | `Jain` | `MASTER LOOKUP` |
| `Parsi` | `Parsi` | `MASTER LOOKUP` |

### Approved Aliases

| Old Value (case-insensitive) | Maps To | Disposition |
|---|---|---|
| `HINDHU`, `Hindoo`, `Hinhu` | `Hindu` | `TRANSFORM` |
| `Cristan`, `Cristian`, `Christan`, `Christain` | `Christian` | `TRANSFORM` |
| `Muslm`, `Mulsim` | `Muslim` | `TRANSFORM` |
| `Budhist`, `Buddist` | `Buddhist` | `TRANSFORM` |

### Requires Review

| Old Value Sample | Count | Issue |
|---|---|---|
| Phone numbers in religion field | TBD | Data entry error |
| Empty / NULL | TBD | Missing data |
| Combined values (e.g. `Hindu-Nair`) | TBD | Need to split religion from community |
| Unrecognized strings | TBD | Cannot map without business input |

---

## 4. Community (Caste)

**Old source:** `tbl_registration.m9` (community portion after split)  
**Target:** `UserProfile.CommunityId` → `CommunityMaster` (parent: `ReligionId`)

### Approach

1. Split `m9` on common delimiters (`-`, `/`, `,`, space after religion word).
2. Match community portion against `CommunityMaster.CommunityName` **within the resolved `ReligionId`**.
3. Only exact matches and explicitly approved aliases are automated.

### Known Aliases

| Old Value (case-insensitive) | Maps To | Parent Religion |
|---|---|---|
| `Scheduledcastee`, `SC`, `Scheduled Caste` | `Scheduled Caste` (if in master) | Various |
| `Scheduledtribe`, `ST`, `Scheduled Tribe` | `Scheduled Tribe` (if in master) | Various |
| `OBC`, `Other Backward` | `OBC` (if in master) | Various |
| `Nair`, `Nayar` | `Nair` | Hindu |
| `Ezhava`, `Ezhava/Thiyya`, `Thiyya` | `Ezhava` | Hindu |

> [!WARNING]
> The old field has extreme variability. Most community values will fall into `REQUIRES REVIEW` until the community master table is populated and aliases are confirmed.

---

## 5. Education

**Old source:** `tbl_registration.m12`  
**Target:** `UserProfile.EducationId` → `EducationMaster`

**Statistics:** 1,063 normalized distinct values in old data.

### Approved Mappings (exact + alias)

| Old Value Pattern | Maps To (Target `EducationName`) | Disposition |
|---|---|---|
| `SSLC`, `10th`, `10th pass`, `10th Std` | `SSLC / 10th` | `TRANSFORM` |
| `Plus Two`, `+2`, `12th`, `HSC`, `Pre-Degree` | `Plus Two / 12th` | `TRANSFORM` |
| `Degree`, `BA`, `BSc`, `BCom`, `BBA`, `BCA` | `Degree` or specific degree if in master | `MASTER LOOKUP` |
| `PG`, `MA`, `MSc`, `MCom`, `MBA`, `MCA` | `Post Graduate` or specific if in master | `MASTER LOOKUP` |
| `PhD`, `Doctorate` | `Doctorate / PhD` | `MASTER LOOKUP` |
| `ITI`, `Diploma` | `Diploma / ITI` | `MASTER LOOKUP` |
| `MBBS`, `MD`, `MS` | `Medical` or specific if in master | `MASTER LOOKUP` |
| `BE`, `BTech`, `ME`, `MTech` | `Engineering` or specific if in master | `MASTER LOOKUP` |
| `LLB`, `LLM` | `Law` | `MASTER LOOKUP` |

### Unmapped

All values not matching the above patterns → `REQUIRES REVIEW` with old value preserved in dry-run manifest for manual classification.

---

## 6. Occupation

**Old source:** `tbl_registration.m13`  
**Target:** `UserProfile.OccupationId` → `OccupationMaster`

**Statistics:** 3,213 normalized distinct values in old data.

### Approved Mappings (exact + alias)

| Old Value Pattern | Maps To (Target `OccupationName`) | Disposition |
|---|---|---|
| `Doctor`, `MBBS Doctor` | `Doctor` | `MASTER LOOKUP` |
| `Engineer`, `Software Engineer`, `IT Engineer` | `Engineer` / `Software Professional` | `MASTER LOOKUP` |
| `Teacher`, `Lecturer`, `Professor` | `Teacher` / `Educator` | `MASTER LOOKUP` |
| `Govt`, `Government`, `Govt Employee`, `Govt Job` | `Government Employee` | `MASTER LOOKUP` |
| `Private`, `Private Employee`, `Pvt Job` | `Private Employee` | `MASTER LOOKUP` |
| `Business`, `Businessman`, `Self Employed` | `Business` / `Self Employed` | `MASTER LOOKUP` |
| `Lawyer`, `Advocate` | `Lawyer` | `MASTER LOOKUP` |
| `Not Working`, `Unemployed`, `NA`, `nil` | `Not Working` | `MASTER LOOKUP` |
| `NRI` | `NRI` (if in master) | `MASTER LOOKUP` |
| `Army`, `Navy`, `Airforce`, `Defence` | `Defence` | `MASTER LOOKUP` |
| `Nurse`, `Nursing` | `Nurse` | `MASTER LOOKUP` |
| `Police`, `SI`, `Inspector` | `Police` | `MASTER LOOKUP` |

### Unmapped

All other values → `REQUIRES REVIEW`.

---

## 7. Height

**Old source:** `tbl_registration.m11`  
**Target:** `UserProfile.HeightId` → `HeightMaster`

### Approach

1. Parse numeric value from `m11`.
2. If value is in the range 120–220 → treat as cm.
3. If value is in the range 4.0–7.5 → treat as feet, convert to cm: `round(value * 30.48)`.
4. Find closest `HeightMaster` entry.

### Problem Cases

| Issue | Count | Disposition |
|---|---|---|
| Missing / NULL | 26 | `NULL` in target |
| Non-numeric (text, dates, phone numbers) | 18 | `REQUIRES REVIEW` |
| Outside 120–220 cm after conversion | 137 | `REQUIRES REVIEW` |
| Values that could be cm or feet ambiguously | TBD | If 5.0–7.0, assume feet (most common in India) |

---

## 8. Income

**Old source:** `tbl_registration.m20`  
**Target:** `UserProfile.IncomeId` → `IncomeMaster`

### Situation

Income data is **extremely unreliable**. Most values are `nil`, `nill`, `NA`, empty, or free-text descriptions like "middle class family" or "Rs 50000 per month".

### Conservative Rules

| Old Value Pattern | Target Mapping | Disposition |
|---|---|---|
| `nil`, `nill`, `NA`, empty, `0` | `NULL` (no income set) | `SKIP` |
| Parseable numeric ≤ 50,000 | Assume monthly, multiply × 12 → match `IncomeMaster` range | `REQUIRES REVIEW` (confirm assumption) |
| Parseable numeric > 50,000 and ≤ 50,00,000 | Assume annual → match `IncomeMaster` range | `REQUIRES REVIEW` (confirm assumption) |
| Contains "lakh" or "lac" | Parse multiplier × 100,000 → match `IncomeMaster` range | `REQUIRES REVIEW` |
| Free text descriptions | `NULL` | `SKIP` |

> [!CAUTION]
> No automated income mapping should be trusted without explicit business review of the assumptions above.

---

## 9. Geography (Country / State / District)

**Old source:** `tbl_registration.m19` (labeled "District")  
**Target:** `UserProfile.CountryId`, `StateId`, `DistrictId`

### Approach

1. **Country:** Default all old rows to India.
2. **District → State:** Look up `m19` in `DistrictMaster.DistrictName`. If exactly one match, derive `StateId` from `DistrictMaster.StateId`.
3. **Duplicate district names:** The target `DistrictMaster` has duplicate district names under different states. Ambiguous matches → `REQUIRES REVIEW`.

| Issue | Disposition |
|---|---|
| District name has exactly one match | `MASTER LOOKUP` → resolve both `DistrictId` and `StateId` |
| District name matches multiple states | `REQUIRES REVIEW` — need old address (`m18`) context |
| District name not found in master | `REQUIRES REVIEW` — may need new master entry |
| Empty / NULL | `NULL` in target |

---

## 10. Mother Tongue

**Old source:** Not present in old schema.  
**Target:** `UserProfile.MotherTongueId` → `MotherTongueMaster`

**Disposition:** `SKIP` — cannot be inferred. Remains `NULL`.

---

## 11. Family Masters

**Old source:** Not present in old schema.  
**Target:** `UserFamily.FamilyTypeId`, `FamilyStatusId`, `FamilyValueId`

| Master Table | Disposition |
|---|---|
| `FamilyTypeMaster` (Joint, Nuclear, etc.) | `SKIP` — not in old data |
| `FamilyStatusMaster` (Rich, Upper Middle, etc.) | `SKIP` — not in old data |
| `FamilyValueMaster` (Orthodox, Moderate, Liberal) | `SKIP` — not in old data |

---

## 12. Profile Status

**Old source:** `tbl_registration.userstatus`  
**Target:** `UserAccount.IsActive`, possible `UserProfile.ProfileStatusId`

| Old `userstatus` | Target Mapping | Disposition |
|---|---|---|
| Active / 1 | `IsActive = 1` | `DIRECT` |
| Inactive / 0 / blocked | `IsActive = 0` | `REQUIRES REVIEW` — should blocked users be migrated? |
| Other values | — | `REQUIRES REVIEW` |

---

## 13. Subscription Plans

**Old source:** No plan concept.  
**Target:** `UserSubscription.MembershipPlanId` → `MembershipPlan`

| Scenario | Target Plan | Disposition |
|---|---|---|
| Valid payment + unique transaction ref | `REQUIRES REVIEW` — business must map to a specific plan ID | — |
| No valid payment | Free plan (ID = 1) | `GENERATE` |

---

## Summary Statistics

| Category | Total Distinct Old Values | Auto-Mapped | Requires Review |
|---|---|---|---|
| Gender | 3+ | 2 | 1+ |
| Marital Status | 6+ | 4-5 | 1+ |
| Religion | Many | ~10 | Many |
| Community | Many | ~10 | Majority |
| Education | 1,063 | ~15-20 patterns | Majority |
| Occupation | 3,213 | ~15-20 patterns | Majority |
| Height | Numeric range | Most valid numeric | ~181 |
| Income | Mostly nil | ~0 | All non-nil |
| Geography | TBD | Unambiguous districts | Ambiguous + missing |
