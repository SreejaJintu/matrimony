# Migration Conflict Report

## Overview
During the 120-record test migration, multiple records were skipped due to `EX-DUP-TARGET-CONFLICT` (or other exclusion reasons). This report details the conflict patterns to facilitate manual resolution.

## Conflict Patterns
The VAST majority of conflicts share generic agency emails:
- `soeasyclassifieds@gmail.com` (Mapped to target UserId: 92 - Nayanthara)
- `soesyservices@gmail.com` (Mapped to target UserId: 119 - Gayathri)
- `soeasyclassifides@gmail.com` (Mapped to target UserId: 128 - Malavika)
- `soeasyclassifiedes@gmail.com` (Mapped to target UserId: 130 - Gopika)

Over 50 old registrants share these exact agency emails. Because the `UserAccount` target schema enforces `UNIQUE` on `Email`, subsequent entries sharing these emails are blocked from insertion.

## Conflict Details

| Old reg_id | Old Name | Old Email | Target UserId | Target Name | Conflict Type | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- |
| 1194 | Nimisha Joshy | soesyservices@gmail.com | 119 | Gayathri | EMAIL_CONFLICT | Strip email before migration |
| 1197 | Shyam K R | soesyservices@gmail.com | 119 | Gayathri | EMAIL_CONFLICT | Strip email before migration |
| 1243 | Gayathri | soeasyclassifieds@gmail.com | 92 | Nayanthara | EMAIL_CONFLICT | Strip email before migration |
| ... | ... | *over 45 others* | 92 | Nayanthara | EMAIL_CONFLICT | Strip email before migration |

## Other Skipped Reasons
A handful of records were skipped early in the pilot test run for `EX-GENDER-MISSING` due to old gender flags mappings (Resolved).
- **1183 (Hasna)**
- **1184 (Sivangi)**
- **1185 (Rohini)**
- **1186 (Dhanik)**

## Action Plan
Since **fake emails are forbidden** and **merging is forbidden**, the recommended action for shared agency emails is to **clear the OldEmail field (`m22`) or skip migration**. Stripping the email makes the email `NULL`, which is now perfectly supported by the newly implemented Filtered Unique Index on `UserAccount(Email)`.
