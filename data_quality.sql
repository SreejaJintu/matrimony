SET NOCOUNT ON;

PRINT '### OVERALL COUNTS'
SELECT 
    (SELECT COUNT(*) FROM tbl_registration) AS Total_tbl_registration,
    (SELECT COUNT(*) FROM tbl_registration WHERE servicetype_id = 1) AS Matrimonial_tbl_registration,
    (SELECT COUNT(*) FROM tbl_tempreg) AS Total_tbl_tempreg,
    (SELECT COUNT(*) FROM tbl_tempreg WHERE servicetype_id = 1) AS Matrimonial_tbl_tempreg;

PRINT '### DUPLICATES'
SELECT 'Duplicate Emails' as Metric, COUNT(*) as Groups, SUM(Cnt) as TotalRows 
FROM (
    SELECT LOWER(LTRIM(RTRIM(m22))) AS email, COUNT(*) AS Cnt 
    FROM tbl_registration 
    WHERE servicetype_id=1 AND m22 IS NOT NULL AND LTRIM(RTRIM(m22)) <> '' 
    GROUP BY LOWER(LTRIM(RTRIM(m22))) HAVING COUNT(*) > 1
) a;

SELECT 'Duplicate Mobiles' as Metric, COUNT(*) as Groups, SUM(Cnt) as TotalRows 
FROM (
    SELECT REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(m6,' ',''),'-',''),'+',''),'.',''),'O','0') AS mobile, COUNT(*) AS Cnt 
    FROM tbl_registration 
    WHERE servicetype_id=1 AND m6 IS NOT NULL AND LTRIM(RTRIM(m6)) <> '' 
    GROUP BY REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(m6,' ',''),'-',''),'+',''),'.',''),'O','0') HAVING COUNT(*) > 1
) b;

PRINT '### NULL OR MISSING FIELDS'
SELECT 
    SUM(CASE WHEN m5 IS NULL OR LTRIM(RTRIM(m5)) = '' THEN 1 ELSE 0 END) AS MissingName_m5,
    SUM(CASE WHEN m6 IS NULL OR LTRIM(RTRIM(m6)) = '' THEN 1 ELSE 0 END) AS MissingMobile_m6,
    SUM(CASE WHEN m22 IS NULL OR LTRIM(RTRIM(m22)) = '' THEN 1 ELSE 0 END) AS MissingEmail_m22,
    SUM(CASE WHEN ddl_2_id = 0 OR ddl_2_id IS NULL THEN 1 ELSE 0 END) AS InvalidGender_ddl2,
    SUM(CASE WHEN ddl_1_id = 0 OR ddl_1_id IS NULL THEN 1 ELSE 0 END) AS InvalidMarital_ddl1
FROM tbl_registration WHERE servicetype_id=1;

PRINT '### DOB CLASSIFICATION'
SELECT 
    SUM(CASE WHEN m15 IS NULL OR LTRIM(RTRIM(m15)) = '' THEN 1 ELSE 0 END) AS Missing,
    SUM(CASE WHEN m15 IS NOT NULL AND TRY_CONVERT(DATE, m15, 103) IS NULL AND TRY_CONVERT(DATE, m15, 101) IS NULL THEN 1 ELSE 0 END) AS Unparseable,
    SUM(CASE WHEN TRY_CONVERT(DATE, m15, 103) IS NOT NULL AND TRY_CONVERT(DATE, m15, 101) IS NULL THEN 1 ELSE 0 END) AS DDMMYYYY_Only,
    SUM(CASE WHEN TRY_CONVERT(DATE, m15, 101) IS NOT NULL AND TRY_CONVERT(DATE, m15, 103) IS NULL THEN 1 ELSE 0 END) AS MMDDYYYY_Only,
    SUM(CASE WHEN TRY_CONVERT(DATE, m15, 103) IS NOT NULL AND TRY_CONVERT(DATE, m15, 101) IS NOT NULL 
               AND TRY_CONVERT(DATE, m15, 103) = TRY_CONVERT(DATE, m15, 101) THEN 1 ELSE 0 END) AS Unambiguous_BothParseToSame,
    SUM(CASE WHEN TRY_CONVERT(DATE, m15, 103) IS NOT NULL AND TRY_CONVERT(DATE, m15, 101) IS NOT NULL 
               AND TRY_CONVERT(DATE, m15, 103) <> TRY_CONVERT(DATE, m15, 101) THEN 1 ELSE 0 END) AS Ambiguous_BothParseToDifferent
FROM tbl_registration WHERE servicetype_id=1;

PRINT '### INVALID EMAILS FORMAT'
SELECT COUNT(*) AS InvalidEmailFormat
FROM tbl_registration
WHERE servicetype_id = 1 
  AND m22 IS NOT NULL AND LTRIM(RTRIM(m22)) <> ''
  AND (m22 NOT LIKE '%_@__%.__%' OR m22 LIKE '% %');

PRINT '### MASTERS COUNT'
SELECT 'Education_m12' as Field, COUNT(DISTINCT m12) as DistinctValues FROM tbl_registration WHERE servicetype_id=1 AND m12 IS NOT NULL AND m12 <> ''
UNION ALL
SELECT 'Occupation_m13', COUNT(DISTINCT m13) FROM tbl_registration WHERE servicetype_id=1 AND m13 IS NOT NULL AND m13 <> ''
UNION ALL
SELECT 'ReligionCommunity_m9', COUNT(DISTINCT m9) FROM tbl_registration WHERE servicetype_id=1 AND m9 IS NOT NULL AND m9 <> ''
UNION ALL
SELECT 'Income_m20', COUNT(DISTINCT m20) FROM tbl_registration WHERE servicetype_id=1 AND m20 IS NOT NULL AND m20 <> ''
UNION ALL
SELECT 'Height_m11', COUNT(DISTINCT m11) FROM tbl_registration WHERE servicetype_id=1 AND m11 IS NOT NULL AND m11 <> ''
UNION ALL
SELECT 'District_m19', COUNT(DISTINCT m19) FROM tbl_registration WHERE servicetype_id=1 AND m19 IS NOT NULL AND m19 <> '';

PRINT '### STATUS'
SELECT 
    SUM(CASE WHEN admin_status = 0 OR admin_status IS NULL THEN 1 ELSE 0 END) AS InactiveAdminStatus,
    SUM(CASE WHEN profilestatus = 0 OR profilestatus IS NULL THEN 1 ELSE 0 END) AS InactiveProfileStatus
FROM tbl_registration WHERE servicetype_id=1;

PRINT '### PAYMENTS'
SELECT 
    SUM(CASE WHEN paystatus = 1 THEN 1 ELSE 0 END) AS PayStatusOne,
    SUM(CASE WHEN paystatus = 1 AND TRY_CAST(payamount AS DECIMAL(18,2)) IS NULL THEN 1 ELSE 0 END) AS NonDecimalAmount,
    SUM(CASE WHEN paystatus = 1 AND TRY_CAST(payamount AS DECIMAL(18,2)) = 0 THEN 1 ELSE 0 END) AS ZeroAmount,
    COUNT(DISTINCT transactionid) AS DistinctTransactionRefs
FROM tbl_registration WHERE servicetype_id=1;

SELECT 'Duplicate Transactions' as Metric, COUNT(*) as DupeGroups, SUM(Cnt) as TotalRows
FROM (
    SELECT transactionid, COUNT(*) as Cnt FROM tbl_registration 
    WHERE servicetype_id=1 AND transactionid IS NOT NULL AND transactionid <> ''
    GROUP BY transactionid HAVING COUNT(*) > 1
) t;

PRINT '### PHOTOS'
SELECT 
    SUM(CASE WHEN img1 IS NOT NULL AND img1 <> '' THEN 1 ELSE 0 END) AS img1_count,
    SUM(CASE WHEN img2 IS NOT NULL AND img2 <> '' THEN 1 ELSE 0 END) AS img2_count,
    SUM(CASE WHEN img3 IS NOT NULL AND img3 <> '' THEN 1 ELSE 0 END) AS img3_count,
    SUM(CASE WHEN img4 IS NOT NULL AND img4 <> '' THEN 1 ELSE 0 END) AS img4_count,
    SUM(CASE WHEN (img1 IS NULL OR img1 = '') AND (img2 IS NULL OR img2 = '') AND (img3 IS NULL OR img3 = '') AND (img4 IS NULL OR img4 = '') THEN 1 ELSE 0 END) AS NoPhotosAtAll
FROM tbl_registration WHERE servicetype_id=1;
