# Data Quality Report — oldSoesyDB Matrimonial Records

> **Status:** DRAFT  
> **Date:** 2026-09-04  
> **Source:** `tbl_registration WHERE servicetype_id = 1`  
> **Database:** `oldSoesyDB` (read-only analysis)

---

## 1. Population Summary

| Metric | Count |
|---|---|
| Total registrations in `tbl_registration` | 8,485 |
| Matrimonial registrations (`servicetype_id = 1`) | **8,465** |
| `tbl_tempreg` matrimonial rows | 125 (excluded from scope) |
| Non-matrimonial registrations | 20 |

---

## 2. Contact Data Quality

### 2.1 Email

| Metric | Count | % of 8,465 |
|---|---|---|
| Total with non-empty email (`m22`) | ~8,200+ | ~97% |
| Emails failing basic format validation | **250** | 3.0% |
| Duplicate email groups (after normalization) | TBD | — |
| Emails conflicting with existing `UserAccount` | **1** | <0.1% |

**Validation rule:** `m22` must match `^[^@\s]+@[^@\s]+\.[^@\s]+$` after `LOWER(TRIM())`.

### 2.2 Mobile

| Metric | Count | % of 8,465 |
|---|---|---|
| Total with non-empty mobile (`m6`) | ~8,400+ | ~99% |
| Mobiles failing normalized 10-digit check | **22** | 0.3% |
| Duplicate mobile groups (after normalization) | TBD | — |
| Mobiles conflicting with existing `UserAccount` | **1** | <0.1% |

**Normalization:** Strip `+91`, spaces, dashes, dots. Result must be exactly 10 digits.

---

## 3. Date of Birth Quality

**Source:** `tbl_registration.m15`

| Category | Count | % of 8,465 | Disposition |
|---|---|---|---|
| Missing / NULL | **27** | 0.3% | `NULL` in target |
| Unparseable (neither `dd/MM/yyyy` nor `MM/dd/yyyy`) | **39** | 0.5% | `REQUIRES REVIEW` |
| Unambiguous — one format parses, the other doesn't | ~3,252 | ~38.4% | Use the format that parses |
| Ambiguous — both formats parse to **same** date | ~55 | ~0.6% | Where day = month; safe to use |
| Ambiguous — both formats parse to **different** dates | **5,092** | **60.2%** | `REQUIRES REVIEW` |
| Apparent future / under-18 after provisional parse | **55** | 0.6% | `REQUIRES REVIEW` |
| Apparent over-100 years old after provisional parse | **32** | 0.4% | `REQUIRES REVIEW` |

> [!CAUTION]
> **5,092 records** (60%!) have DOBs where both `dd/MM/yyyy` and `MM/dd/yyyy` produce valid but different dates. These **must not be guessed** — they require explicit review or a secondary data source.

---

## 4. Mandatory Fields — Missing Data

| Field | Old Column | Missing/Empty Count | % of 8,465 |
|---|---|---|---|
| Name | `m5` | TBD (expected ~0) | — |
| Mobile | `m6` | ~65 | ~0.8% |
| Gender | `ddl_2_id = 0` | **72** | 0.9% |
| Marital status | `ddl_1_id = 0` | **86** | 1.0% |
| DOB | `m15` | **27** | 0.3% |
| Religion/Community | `m9` | TBD | — |

---

## 5. Dimension Fields — Value Quality

### 5.1 Height (`m11`)

| Issue | Count | % |
|---|---|---|
| Missing / NULL | **26** | 0.3% |
| Non-numeric (text, dates, phones) | **18** | 0.2% |
| Outside 120–220 cm range | **137** | 1.6% |
| Valid numeric in range | ~8,284 | ~97.9% |
| Mixed units (cm vs feet-like decimals) | Included in range | — |

### 5.2 Weight (`m10`)

| Issue | Count | % |
|---|---|---|
| Missing / NULL / non-numeric | TBD | — |
| Likely valid (30–200 kg) | Majority | — |

### 5.3 Education (`m12`)

| Metric | Value |
|---|---|
| Total normalized distinct values | **1,063** |
| Automatable (exact + alias) | ~15–20 patterns |
| Requires manual classification | **Majority** |

### 5.4 Occupation (`m13`)

| Metric | Value |
|---|---|
| Total normalized distinct values | **3,213** |
| Automatable (exact + alias) | ~15–20 patterns |
| Requires manual classification | **Majority** |

### 5.5 Income (`m20`)

| Category | Description |
|---|---|
| `nil`/`nill`/`NA`/empty | Majority of values |
| Mix of annual/monthly/lakhs/free text | Cannot be safely bucketed |
| Parseable to valid annual range | Very few |

### 5.6 Religion/Community (`m9`)

| Issue | Examples |
|---|---|
| Misspellings | `HINDHU`, `Cristan`, `Scheduledcastee` |
| Combined religion + community | `Hindu-Nair`, `Christian/Catholic` |
| Invalid data (phone numbers) | Phone number stored in religion field |
| Missing | TBD |

---

## 6. Master Table Coverage

| Master Domain | Old Distinct Values | Master Table Entries | Gap |
|---|---|---|---|
| Gender | 3+ (IDs: 0, 1, 2) | 2 (Male, Female) | ID 0 unmapped |
| Marital Status | 6+ | TBD | ID 0 + Widow/Widower merge |
| Religion | Many (with misspellings) | TBD | Many unmatched |
| Community | Many (highly variable) | TBD | Majority unmatched |
| Education | 1,063 distinct | TBD | Majority unmatched |
| Occupation | 3,213 distinct | TBD | Majority unmatched |
| Height | Numeric values | TBD entries in `HeightMaster` | ~181 problematic values |
| Income | Mostly nil/text | TBD entries in `IncomeMaster` | Nearly all unmatched |
| District | Variable text | `DistrictMaster` entries | Duplicates in master + missing |

---

## 7. Photo Availability

| Metric | Count |
|---|---|
| Rows with **at least one** photo path (`img1`–`img4`) | **8,423** |
| Rows with **no** photo paths | **42** |
| `img3` potentially Jathakam (not profile photo) | `REQUIRES REVIEW` |
| File existence at source URLs | **Not yet validated** |

> [!WARNING]
> Photo file existence and URL accessibility **must be validated** before migration. Migrating broken URLs would create a poor user experience.

---

## 8. Payment / Subscription Data

| Metric | Count | Notes |
|---|---|---|
| Rows with `paystatus = 1` | **8,464** | Nearly all rows — suspicious |
| Amounts that are not valid decimals | **1,601** | Cannot be used as `AmountPaid` |
| Amounts that are zero | **597** | Not meaningful payments |
| Transaction reference duplicate groups | **1,003** | — |
| Rows in duplicate transaction groups | **6,456** | 76% of all rows share a txn ref |
| Unique, valid payment candidates | ~410 | Extremely conservative estimate |

> [!CAUTION]
> Payment data reliability is **very low**. Only ~5% of rows may have trustworthy payment information.

---

## 9. Target Database Conflicts

| Conflict Type | Count | Impact |
|---|---|---|
| Email exists in both old and new `UserAccount` | **1** | Cannot auto-create; collision record |
| Mobile exists in both old and new `UserAccount` | **1** | Cannot auto-create; collision record |
| `DistrictMaster` duplicate names across states | Multiple | Ambiguous district matching |

---

## 10. Eligibility Summary

| Category | Count | % of 8,465 |
|---|---|---|
| Likely eligible (core data present) | ~8,300 | ~98% |
| Core exclusions (gender/name/conflict) | ~75 | ~0.9% |
| Usable BUT with child-entity gaps | ~8,200 | ~97% |
| All entities fully populated | Very few | <5% |

> **Key insight:** Nearly all records can have a `UserAccount` + partial `UserProfile` created, but very few will have fully populated profiles due to master mapping gaps (education, occupation, community, income).

---

## Appendix — Proposed Validation SQL

### Total Counts
```sql
-- Total matrimonial
SELECT COUNT(*) FROM tbl_registration WHERE servicetype_id = 1;

-- With photos
SELECT COUNT(*) FROM tbl_registration
WHERE servicetype_id = 1
  AND (img1 IS NOT NULL AND img1 <> ''
    OR img2 IS NOT NULL AND img2 <> ''
    OR img3 IS NOT NULL AND img3 <> ''
    OR img4 IS NOT NULL AND img4 <> '');
```

### Invalid DOBs
```sql
SELECT m15, COUNT(*) AS Cnt
FROM tbl_registration
WHERE servicetype_id = 1
  AND (m15 IS NULL OR LTRIM(RTRIM(m15)) = ''
    OR TRY_CONVERT(DATE, m15, 103) IS NULL AND TRY_CONVERT(DATE, m15, 101) IS NULL)
GROUP BY m15
ORDER BY Cnt DESC;
```

### Missing Mandatory Fields
```sql
SELECT
    SUM(CASE WHEN m5 IS NULL OR LTRIM(RTRIM(m5)) = '' THEN 1 ELSE 0 END) AS MissingName,
    SUM(CASE WHEN m6 IS NULL OR LTRIM(RTRIM(m6)) = '' THEN 1 ELSE 0 END) AS MissingMobile,
    SUM(CASE WHEN ddl_2_id = 0 THEN 1 ELSE 0 END) AS MissingGender,
    SUM(CASE WHEN ddl_1_id = 0 THEN 1 ELSE 0 END) AS MissingMarital,
    SUM(CASE WHEN m15 IS NULL OR LTRIM(RTRIM(m15)) = '' THEN 1 ELSE 0 END) AS MissingDOB
FROM tbl_registration
WHERE servicetype_id = 1;
```

### Unmapped Master Values — Religion Sample
```sql
SELECT LTRIM(RTRIM(m9)) AS RawReligion, COUNT(*) AS Cnt
FROM tbl_registration
WHERE servicetype_id = 1
  AND m9 IS NOT NULL AND LTRIM(RTRIM(m9)) <> ''
GROUP BY LTRIM(RTRIM(m9))
ORDER BY Cnt DESC;
```

### Payment Reliability
```sql
SELECT
    SUM(CASE WHEN TRY_CAST(payamount AS DECIMAL(18,2)) IS NULL THEN 1 ELSE 0 END) AS NonDecimalAmounts,
    SUM(CASE WHEN TRY_CAST(payamount AS DECIMAL(18,2)) = 0 THEN 1 ELSE 0 END) AS ZeroAmounts,
    COUNT(*) AS Total
FROM tbl_registration
WHERE servicetype_id = 1 AND paystatus = 1;
```
