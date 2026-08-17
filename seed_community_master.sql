-- =============================================
-- Seed Data: CommunityMaster
-- Religions: 1=Hindu, 2=Muslim, 3=Christian
-- =============================================

SET IDENTITY_INSERT [dbo].[CommunityMaster] OFF;

-- =============================================
-- HINDU Communities (ReligionId = 1)
-- =============================================
INSERT INTO [dbo].[CommunityMaster] (ReligionId, CommunityName, IsActive) VALUES
(1, 'Brahmin', 1),
(1, 'Kayastha', 1),
(1, 'Rajput', 1),
(1, 'Kshatriya', 1),
(1, 'Vaishya', 1),
(1, 'Bania', 1),
(1, 'Aggarwal', 1),
(1, 'Khatri', 1),
(1, 'Jat', 1),
(1, 'Maratha', 1),
(1, 'Lingayat', 1),
(1, 'Vokkaliga', 1),
(1, 'Nair', 1),
(1, 'Ezhava', 1),
(1, 'Nadar', 1),
(1, 'Mudaliar', 1),
(1, 'Pillai', 1),
(1, 'Chettiar', 1),
(1, 'Gounder', 1),
(1, 'Naidu', 1),
(1, 'Reddy', 1),
(1, 'Kamma', 1),
(1, 'Velama', 1),
(1, 'Kapu', 1),
(1, 'Yadav', 1),
(1, 'Kurmi', 1),
(1, 'Bhumihar', 1),
(1, 'Teli', 1),
(1, 'Patel', 1),
(1, 'Leva Patel', 1),
(1, 'Kadava Patel', 1),
(1, 'Desai', 1),
(1, 'Soni', 1),
(1, 'Kumhar', 1),
(1, 'Scheduled Caste', 1),
(1, 'Scheduled Tribe', 1),
(1, 'Other Hindu', 1);

-- =============================================
-- MUSLIM Communities (ReligionId = 2)
-- =============================================
INSERT INTO [dbo].[CommunityMaster] (ReligionId, CommunityName, IsActive) VALUES
(2, 'Sunni', 1),
(2, 'Shia', 1),
(2, 'Syed', 1),
(2, 'Sheikh', 1),
(2, 'Pathan / Pathan', 1),
(2, 'Mughal', 1),
(2, 'Ansari', 1),
(2, 'Qureshi', 1),
(2, 'Bohra', 1),
(2, 'Khoja', 1),
(2, 'Memon', 1),
(2, 'Mappila / Moplah', 1),
(2, 'Lebbai', 1),
(2, 'Rowther', 1),
(2, 'Maraikkayar', 1),
(2, 'Other Muslim', 1);

-- =============================================
-- CHRISTIAN Communities (ReligionId = 3)
-- =============================================
INSERT INTO [dbo].[CommunityMaster] (ReligionId, CommunityName, IsActive) VALUES
(3, 'Catholic', 1),
(3, 'Protestant', 1),
(3, 'CSI (Church of South India)', 1),
(3, 'CNI (Church of North India)', 1),
(3, 'Pentecostal', 1),
(3, 'Baptist', 1),
(3, 'Methodist', 1),
(3, 'Lutheran', 1),
(3, 'Anglican', 1),
(3, 'Syrian Christian', 1),
(3, 'Jacobite', 1),
(3, 'Marthoma', 1),
(3, 'Knanaya', 1),
(3, 'Latin Catholic', 1),
(3, 'Born Again', 1),
(3, 'Seventh Day Adventist', 1),
(3, 'Other Christian', 1);
