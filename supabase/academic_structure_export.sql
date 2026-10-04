-- Academic structure data export generated from the configured Supabase project.
-- Restore after applying migrations that create these public tables.
-- Includes academic sessions and study years because profiles and semesters reference them.
-- Inserts are idempotent by primary key (id).

BEGIN;

-- departments: 25 rows
INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('07f13d7b-e4ce-425c-a578-94c40bd1904d', 'Department of Computer Science', 'Focuses on foundational computing theory, data structures, algorithms, and core programming languages as an elective and integrated subject for Bachelor of Science (B.Sc.) and Arts streams.', '2026-10-03T14:35:19.509186+00:00', '2026-10-03T14:35:19.509186+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('1a5d61e6-c6a4-4df1-b5d7-c8c4cc25d845', 'Department of Chemistry', 'Imparts foundational and applied knowledge in organic, inorganic, and analytical chemistry for industry and research.', '2026-10-03T14:30:31.86184+00:00', '2026-10-03T14:30:31.86184+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('24ee7db6-18e8-46a3-a59f-fea17a065a20', 'Department of Secretarial Practice', 'Develops administrative, executive communication, and office governance skills for corporate and managerial support roles.', '2026-10-03T14:30:02.460589+00:00', '2026-10-03T14:30:02.460589+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('273af06b-10ed-4fcb-b7fc-22a8d650f883', 'Department of Zoology', 'Studies animal physiology, genetics, and biodiversity with practical applications in healthcare and biosciences.', '2026-10-03T14:31:09.83914+00:00', '2026-10-03T14:31:09.83914+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('3dcb7169-2374-48e6-b443-9722138349ad', 'Department of Computer Applications', 'Delivers hands-on training in software engineering, full-stack programming, database architectures, and AI/ML, preparing graduates for IT industry roles and advanced postgraduate research.', '2026-10-03T14:34:48.782439+00:00', '2026-10-03T14:34:48.782439+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('3e7f314e-d7fd-4a74-b997-3e323b84eb6c', 'Departments of Malayalam', 'Cultivates linguistic proficiency, cultural appreciation, and translation competencies.', '2026-10-03T14:33:58.805698+00:00', '2026-10-03T14:33:58.805698+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('440166da-9758-414c-8f3b-bf54ce3b8c2d', 'Department of English', 'Enhances literary appreciation, critical analysis, creative writing, and advanced professional communication.', '2026-10-03T14:32:49.269488+00:00', '2026-10-03T14:32:49.269488+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('4a774be7-e5b5-4294-89ec-e97f1c767b15', 'Department of Physics', 'Blends theoretical mechanics, electromagnetism, and quantum concepts with experimental lab work.', '2026-10-03T14:30:17.942172+00:00', '2026-10-03T14:30:17.942172+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('593f196f-6bc3-44d4-ac5e-1df7dc0d1be3', 'Department of Journalism & Mass Communication', 'Teaches print, broadcast, and digital reporting alongside media ethics, public relations, and content production.', '2026-10-03T14:29:50.604173+00:00', '2026-10-03T14:29:50.604173+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('5d455c54-9b6d-41f7-be27-9d6a82d4c719', 'Departments of Hindi', 'Cultivates linguistic proficiency, cultural appreciation, and translation competencies.', '2026-10-03T14:33:12.928711+00:00', '2026-10-03T14:33:12.928711+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('62703d40-87e3-468b-aa0c-7106e0f7aaf8', 'Department of Business Administration', 'Builds managerial leadership, marketing, operational strategy, and entrepreneurial problem-solving skills.', '2026-10-03T14:32:16.791073+00:00', '2026-10-03T14:32:16.791073+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('6b815d3b-493e-4aff-9023-9f5d2564c857', 'Department of Nutrition & Health Education', 'Focuses on dietetics, nutritional biochemistry, food safety, and community health management.', '2026-10-03T14:31:47.139953+00:00', '2026-10-03T14:31:47.139953+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('6d5ef5ec-5bd2-4955-aa9b-82627caa0062', 'Department of Botany', 'Examines plant biology, ecological conservation, and plant biotechnology through laboratory and field studies.', '2026-10-03T14:30:56.099525+00:00', '2026-10-03T14:30:56.099525+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('8ae17313-ad62-4058-9856-b230ecfd9546', 'Department of Mathematics', 'Strengthens mathematical modeling, calculus, and abstract reasoning for computational and analytical domains.', '2026-10-03T14:30:43.92401+00:00', '2026-10-03T14:30:43.92401+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('994c047e-a187-44a3-84ce-6e245da9f1f7', 'Department of Psychology', 'Explores human behavior, cognitive processes, and counseling fundamentals with hands-on psychometric training.', '2026-10-03T14:29:36.577158+00:00', '2026-10-03T14:29:36.577158+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('a077591c-eb79-4072-aab2-1fe6846e3688', 'Department of Microbiology', 'Focuses on microbial genetics, pathology, and industrial biotechnology essential for clinical and diagnostic labs.', '2026-10-03T14:31:22.093688+00:00', '2026-10-03T14:31:22.093688+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('b714aed1-132f-4184-bbf2-f7e6cde4c0fe', 'Departments of Kannada', 'Cultivates linguistic proficiency, cultural appreciation, and translation competencies.', '2026-10-03T14:33:28.541985+00:00', '2026-10-03T14:33:28.541985+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('bd326536-5567-495b-bc6c-60afe3818bbc', 'Department of Statistics', 'Trains students in data collection, probability, statistical modeling, and modern analytical tools.', '2026-10-03T14:31:34.798255+00:00', '2026-10-03T14:31:34.798255+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('be9086e8-228f-4aaf-8453-888dd34d7f44', 'Department of Political Science', 'Focuses on political theory, Indian governance, public administration, and global affairs to cultivate civic and legal awareness.', '2026-10-03T14:29:21.368208+00:00', '2026-10-03T14:29:21.368208+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('d1c34872-b46b-4fde-8c2f-f8a9c21d6f07', 'Department of Commerce', 'Delivers comprehensive grounding in accounting, corporate finance, taxation, and business law, aligned with professional credentials.', '2026-10-03T14:32:04.857129+00:00', '2026-10-03T14:32:04.857129+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('d6fbf477-2123-4eca-bc95-0e2870dcfb16', 'Departments of French', 'Cultivates linguistic proficiency, cultural appreciation, and translation competencies.', '2026-10-03T14:33:45.518009+00:00', '2026-10-03T14:33:45.518009+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('d8e1f5f7-9d42-4641-916b-8b701443151b', 'Department of Economics', 'Covers micro and macroeconomic theories, market dynamics, and quantitative analysis for banking, policy, and research careers.', '2026-10-03T14:28:54.856063+00:00', '2026-10-03T14:28:54.856063+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('dbbf60cd-f3f1-4d05-9d5a-8c4d59664ba9', 'Department of History', 'Studies world, national, and regional histories to build critical research and analytical skills for public service and heritage sectors.', '2026-10-03T14:28:34.466106+00:00', '2026-10-03T14:28:34.466106+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('e657e6f5-d205-4675-9930-644e3383af15', 'Department of Computer Animation', 'Equips students with technical and creative competencies in 2D/3D modeling, visual effects (VFX), character design, motion graphics, and digital media production.', '2026-10-03T14:35:32.565371+00:00', '2026-10-03T14:35:32.565371+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";

INSERT INTO public."departments" ("id", "name", "description", "created_at", "updated_at", "status")
VALUES ('fa810b26-52d0-494d-bdb5-9f7321a1c494', 'Department of Data Science', 'Blends mathematical modeling, applied statistics, machine learning, and computational tools (Python/R) to train students in analyzing complex datasets and building data-driven solutions.', '2026-10-03T14:44:11.295455+00:00', '2026-10-03T14:44:11.295455+00:00', 'active')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status";


-- programmes: 6 rows
INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('4f49954f-affc-498d-8151-154174b399c5', NULL, 'Bachelor of Science', NULL, '2026-10-03T15:00:00.416378+00:00', '2026-10-03T15:00:00.416378+00:00', 'active', 'BSC')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";

INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', 'd1c34872-b46b-4fde-8c2f-f8a9c21d6f07', 'Bachelor of Commerce', NULL, '2026-10-03T14:47:48.49624+00:00', '2026-10-03T14:47:48.49624+00:00', 'active', 'BCOM')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";

INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('bc73d42d-0851-4186-8406-51ca42c2e661', NULL, 'Bachelor of Arts', NULL, '2026-10-03T14:59:34.916967+00:00', '2026-10-03T14:59:34.916967+00:00', 'active', 'BA')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";

INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('cbb6a183-cac5-433f-936e-b2c048ab335e', '62703d40-87e3-468b-aa0c-7106e0f7aaf8', 'Bachelor of Business Administration', NULL, '2026-10-03T14:48:13.967448+00:00', '2026-10-03T14:48:13.967448+00:00', 'active', 'BBA')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";

INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('d62094a0-d335-4c29-90ee-bc7549bcdd1b', 'fa810b26-52d0-494d-bdb5-9f7321a1c494', 'Bachelor of Science (Data Science)', NULL, '2026-10-03T15:00:29.669073+00:00', '2026-10-03T15:00:29.669073+00:00', 'active', 'BSCDS')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";

INSERT INTO public."programmes" ("id", "department_id", "name", "description", "created_at", "updated_at", "status", "code")
VALUES ('eee61b29-f819-48af-9e55-6c8d85cdee82', '3dcb7169-2374-48e6-b443-9722138349ad', 'Bachelor of Computer Applications', NULL, '2026-10-03T14:47:26.026901+00:00', '2026-10-03T14:47:26.026901+00:00', 'active', 'BCA')
ON CONFLICT ("id") DO UPDATE SET
  "department_id" = EXCLUDED."department_id",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "code" = EXCLUDED."code";


-- academic_sessions: 6 rows

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('05906af5-288b-46e7-a0df-aded9394a518', 'bc73d42d-0851-4186-8406-51ca42c2e661', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:13:49.194426+00:00', '2026-10-03T15:13:49.194426+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('34fa5a2a-701b-49ed-b56a-214a70070768', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:15:01.475748+00:00', '2026-10-03T15:15:01.475748+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('75ce62a7-2e71-4da6-9182-fa10af5832d6', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:14:32.10784+00:00', '2026-10-03T15:14:32.10784+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('940be794-a12f-4629-93f0-ca6ff52f62ae', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:15:40.819498+00:00', '2026-10-03T15:15:40.819498+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('c428b0fe-dec3-4aa8-825e-282e2f97a9db', 'cbb6a183-cac5-433f-936e-b2c048ab335e', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:14:13.487958+00:00', '2026-10-03T15:14:13.487958+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";

INSERT INTO public."academic_sessions" ("id", "programme_id", "name", "start_date", "end_date", "status", "created_at", "updated_at")
VALUES ('d626cbda-682a-43e8-aeec-94b70f6b9a10', '4f49954f-affc-498d-8151-154174b399c5', '2026-2027', '2026-06-15', '2027-04-30', 'active', '2026-10-03T15:15:22.487776+00:00', '2026-10-03T15:15:22.487776+00:00')
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "updated_at" = EXCLUDED."updated_at";


-- academic_years: 18 rows (three study years per programme)

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('d626cbda-682a-43e8-aeec-94b70f6b9a10', '4f49954f-affc-498d-8151-154174b399c5', 'I Year', '2026-10-03T15:15:22.487776+00:00', '2026-10-03T15:15:22.487776+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('234fdbea-fa00-36db-8cbe-be39e6c3051f', '4f49954f-affc-498d-8151-154174b399c5', 'II Year', '2026-10-03T15:15:22.487776+00:00', '2026-10-03T15:15:22.487776+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('3455edc3-4536-21f2-1e9f-a009bdcb4162', '4f49954f-affc-498d-8151-154174b399c5', 'III Year', '2026-10-03T15:15:22.487776+00:00', '2026-10-03T15:15:22.487776+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('75ce62a7-2e71-4da6-9182-fa10af5832d6', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', 'I Year', '2026-10-03T15:14:32.10784+00:00', '2026-10-03T15:14:32.10784+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('747a8a38-63aa-2767-ba8b-39e255327ed6', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', 'II Year', '2026-10-03T15:14:32.10784+00:00', '2026-10-03T15:14:32.10784+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('e9ae53c8-ffc4-185c-2023-3d35fb02bbe1', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', 'III Year', '2026-10-03T15:14:32.10784+00:00', '2026-10-03T15:14:32.10784+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('05906af5-288b-46e7-a0df-aded9394a518', 'bc73d42d-0851-4186-8406-51ca42c2e661', 'I Year', '2026-10-03T15:13:49.194426+00:00', '2026-10-03T15:13:49.194426+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('1a09de83-b34e-6ace-8ea4-1d6f4dd823f1', 'bc73d42d-0851-4186-8406-51ca42c2e661', 'II Year', '2026-10-03T15:13:49.194426+00:00', '2026-10-03T15:13:49.194426+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('e5e5208f-b72a-987c-9987-0c7af6b88c87', 'bc73d42d-0851-4186-8406-51ca42c2e661', 'III Year', '2026-10-03T15:13:49.194426+00:00', '2026-10-03T15:13:49.194426+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('c428b0fe-dec3-4aa8-825e-282e2f97a9db', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'I Year', '2026-10-03T15:14:13.487958+00:00', '2026-10-03T15:14:13.487958+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('d7891d1d-ada3-baa6-94d8-db1e70d4374b', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'II Year', '2026-10-03T15:14:13.487958+00:00', '2026-10-03T15:14:13.487958+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('f86874ed-b555-3ff3-3fe2-430f40b9ed05', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'III Year', '2026-10-03T15:14:13.487958+00:00', '2026-10-03T15:14:13.487958+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('940be794-a12f-4629-93f0-ca6ff52f62ae', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', 'I Year', '2026-10-03T15:15:40.819498+00:00', '2026-10-03T15:15:40.819498+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('b2316c1c-3449-a620-80f3-1e268e46f97d', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', 'II Year', '2026-10-03T15:15:40.819498+00:00', '2026-10-03T15:15:40.819498+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('6c68b117-abdf-b8d3-2f76-153cac492764', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', 'III Year', '2026-10-03T15:15:40.819498+00:00', '2026-10-03T15:15:40.819498+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('34fa5a2a-701b-49ed-b56a-214a70070768', 'eee61b29-f819-48af-9e55-6c8d85cdee82', 'I Year', '2026-10-03T15:15:01.475748+00:00', '2026-10-03T15:15:01.475748+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('54bf90c4-fa4d-b4b7-12cb-fe5b8dea7849', 'eee61b29-f819-48af-9e55-6c8d85cdee82', 'II Year', '2026-10-03T15:15:01.475748+00:00', '2026-10-03T15:15:01.475748+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

INSERT INTO public."academic_years" ("id", "programme_id", "name", "created_at", "updated_at", "status", "start_date", "end_date")
VALUES ('accb277d-7250-cb5d-9b1e-93a81d015036', 'eee61b29-f819-48af-9e55-6c8d85cdee82', 'III Year', '2026-10-03T15:15:01.475748+00:00', '2026-10-03T15:15:01.475748+00:00', 'active', NULL, NULL)
ON CONFLICT ("id") DO UPDATE SET
  "programme_id" = EXCLUDED."programme_id",
  "name" = EXCLUDED."name",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "start_date" = NULL,
  "end_date" = NULL;

-- semesters: 34 rows
INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('02a9cd46-5562-4593-af87-c499836a868a', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db', 'Semester 2', '2026-10-03T15:26:14.503491+00:00', '2026-10-03T15:26:14.503491+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('033e1dd1-6e8c-4d45-a6db-9e79df577bd0', 'd626cbda-682a-43e8-aeec-94b70f6b9a10', 'Semester 2', '2026-10-03T15:27:14.261992+00:00', '2026-10-03T15:27:14.261992+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('041079a7-2ccd-4a75-97c9-8ef6426f6f76', 'e5e5208f-b72a-987c-9987-0c7af6b88c87', 'Semester 5', '2026-10-03T15:26:57.939737+00:00', '2026-10-03T15:26:57.939737+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('05f2bef6-364f-44ee-928c-15dbce3152a5', '05906af5-288b-46e7-a0df-aded9394a518', 'Semester 1', '2026-10-03T15:26:41.260017+00:00', '2026-10-03T15:26:41.260017+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('09137e03-129d-4555-ba3b-6efa741af2ca', 'd7891d1d-ada3-baa6-94d8-db1e70d4374b', 'Semester 3', '2026-10-03T15:26:18.687696+00:00', '2026-10-03T15:26:18.687696+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('0d0e5179-e6fd-4ffb-b4c4-ad4852a9d20c', 'b2316c1c-3449-a620-80f3-1e268e46f97d', 'Semester 3', '2026-10-03T15:27:57.468144+00:00', '2026-10-03T15:27:57.468144+00:00', 'active', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', '940be794-a12f-4629-93f0-ca6ff52f62ae')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('18800482-fea7-49c3-a45a-7b822d7d375c', '940be794-a12f-4629-93f0-ca6ff52f62ae', 'Semester 2', '2026-10-03T15:27:53.634458+00:00', '2026-10-03T15:27:53.634458+00:00', 'active', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', '940be794-a12f-4629-93f0-ca6ff52f62ae')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('32bf6f2f-2107-40d6-a22e-a4800ec65c7a', 'f86874ed-b555-3ff3-3fe2-430f40b9ed05', 'Semester 5', '2026-10-03T15:26:27.35634+00:00', '2026-10-03T15:26:27.35634+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('331c8337-c406-4630-ba43-1195a4eb893f', '3455edc3-4536-21f2-1e9f-a009bdcb4162', 'Semester 6', '2026-10-03T15:27:32.755825+00:00', '2026-10-03T15:27:32.755825+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('39a976aa-7789-43d0-a305-d6b98c32c7cc', '34fa5a2a-701b-49ed-b56a-214a70070768', 'Semester 1', '2026-10-03T15:24:55.427152+00:00', '2026-10-03T15:24:55.427152+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('49121f09-6cca-40d0-a2c7-9f98f2d5f71f', 'e5e5208f-b72a-987c-9987-0c7af6b88c87', 'Semester 6', '2026-10-03T15:27:02.483883+00:00', '2026-10-03T15:27:02.483883+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('4aaff7d8-2956-4340-bd36-ac90c934cbe7', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db', 'Semester 1', '2026-10-03T15:26:11.102871+00:00', '2026-10-03T15:26:11.102871+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('5135cf37-5e6c-40d6-bcb5-b693907e5d30', '747a8a38-63aa-2767-ba8b-39e255327ed6', 'Semester 3', '2026-10-03T15:25:42.73471+00:00', '2026-10-03T15:25:42.73471+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('573433ac-0d7e-4111-b76c-b150e7844226', 'd626cbda-682a-43e8-aeec-94b70f6b9a10', 'Semester 1', '2026-10-03T15:27:09.699798+00:00', '2026-10-03T15:27:09.699798+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('66fe2522-c466-43d8-bd49-781e13e9175e', '234fdbea-fa00-36db-8cbe-be39e6c3051f', 'Semester 3', '2026-10-03T15:27:17.849072+00:00', '2026-10-03T15:27:17.849072+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('67c75b18-1cf5-43a6-bd4b-d2c9785bb9e4', '75ce62a7-2e71-4da6-9182-fa10af5832d6', 'Semester 2', '2026-10-03T15:25:37.760961+00:00', '2026-10-03T15:25:37.760961+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('81902e4a-327e-4d5d-a907-d80f5b0f6698', 'accb277d-7250-cb5d-9b1e-93a81d015036', 'Semester 6', '2026-10-03T15:25:20.378312+00:00', '2026-10-03T15:25:20.378312+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('884af3ab-e7da-4312-ae59-6876d7449952', '1a09de83-b34e-6ace-8ea4-1d6f4dd823f1', 'Semester 3', '2026-10-03T15:26:47.913863+00:00', '2026-10-03T15:26:47.913863+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('8bf43a7f-c98a-4838-bca8-7666e197f54c', '747a8a38-63aa-2767-ba8b-39e255327ed6', 'Semester 4', '2026-10-03T15:25:47.521571+00:00', '2026-10-03T15:25:47.521571+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('8cfd35b1-506e-4db8-8718-46687cf7a46b', '940be794-a12f-4629-93f0-ca6ff52f62ae', 'Semester 1', '2026-10-03T15:27:49.526779+00:00', '2026-10-03T15:27:49.526779+00:00', 'active', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', '940be794-a12f-4629-93f0-ca6ff52f62ae')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('9796a134-262a-4de6-aa82-89a7cc1f1e4e', '75ce62a7-2e71-4da6-9182-fa10af5832d6', 'Semester 1', '2026-10-03T15:25:34.114234+00:00', '2026-10-03T15:25:34.114234+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('993c16a3-e395-4018-9ccc-f3ad650358ba', '3455edc3-4536-21f2-1e9f-a009bdcb4162', 'Semester 5', '2026-10-03T15:27:28.844507+00:00', '2026-10-03T15:27:28.844507+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('a29082bf-13ef-4e81-abfd-fb6a80c1a04a', '1a09de83-b34e-6ace-8ea4-1d6f4dd823f1', 'Semester 4', '2026-10-03T15:26:53.498777+00:00', '2026-10-03T15:26:53.498777+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('a312ccfd-6bea-4668-955e-68c68c4f97ac', '05906af5-288b-46e7-a0df-aded9394a518', 'Semester 2', '2026-10-03T15:26:44.355952+00:00', '2026-10-03T15:26:44.355952+00:00', 'active', 'bc73d42d-0851-4186-8406-51ca42c2e661', '05906af5-288b-46e7-a0df-aded9394a518')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('a333dba6-747b-4986-be06-6d96637ba17e', '234fdbea-fa00-36db-8cbe-be39e6c3051f', 'Semester 4', '2026-10-03T15:27:24.436464+00:00', '2026-10-03T15:27:24.436464+00:00', 'active', '4f49954f-affc-498d-8151-154174b399c5', 'd626cbda-682a-43e8-aeec-94b70f6b9a10')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('a63b9808-5fda-48be-9d13-589e0511540b', 'f86874ed-b555-3ff3-3fe2-430f40b9ed05', 'Semester 6', '2026-10-03T15:26:33.252808+00:00', '2026-10-03T15:26:33.252808+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('b64adae9-f517-48c7-b2e4-1b312251722c', 'd7891d1d-ada3-baa6-94d8-db1e70d4374b', 'Semester 4', '2026-10-03T15:26:22.94881+00:00', '2026-10-03T15:26:22.94881+00:00', 'active', 'cbb6a183-cac5-433f-936e-b2c048ab335e', 'c428b0fe-dec3-4aa8-825e-282e2f97a9db')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('d484975a-72d2-4b35-920d-4ad2d6356c17', '34fa5a2a-701b-49ed-b56a-214a70070768', 'Semester 2', '2026-10-03T15:25:00.535497+00:00', '2026-10-03T15:25:00.535497+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('dc780d90-1a67-447b-b388-13da22508f5c', 'e9ae53c8-ffc4-185c-2023-3d35fb02bbe1', 'Semester 6', '2026-10-03T15:25:58.783458+00:00', '2026-10-03T15:25:58.783458+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('dd150a2a-7c05-4124-9270-0e7d57fdf356', '54bf90c4-fa4d-b4b7-12cb-fe5b8dea7849', 'Semester 3', '2026-10-03T15:25:05.562606+00:00', '2026-10-03T15:25:05.562606+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('eb259ca9-35fc-4a2c-a256-29e3cd903287', 'accb277d-7250-cb5d-9b1e-93a81d015036', 'Semester 5', '2026-10-03T15:25:16.198935+00:00', '2026-10-03T15:25:16.198935+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('f0135249-5b08-4cf1-b59b-6bcb4696d7fa', 'e9ae53c8-ffc4-185c-2023-3d35fb02bbe1', 'Semester 5', '2026-10-03T15:25:54.622417+00:00', '2026-10-03T15:25:54.622417+00:00', 'active', '79aa1d2e-28b4-4ce0-a5dd-2e167e7dbbba', '75ce62a7-2e71-4da6-9182-fa10af5832d6')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('f2ecdb45-d3bd-4875-899b-ee518363352b', '54bf90c4-fa4d-b4b7-12cb-fe5b8dea7849', 'Semester 4', '2026-10-03T15:25:11.406066+00:00', '2026-10-03T15:25:11.406066+00:00', 'active', 'eee61b29-f819-48af-9e55-6c8d85cdee82', '34fa5a2a-701b-49ed-b56a-214a70070768')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";

INSERT INTO public."semesters" ("id", "academic_year_id", "name", "created_at", "updated_at", "status", "programme_id", "academic_session_id")
VALUES ('f494e708-a5ab-4511-8fd5-4714aba828c7', 'b2316c1c-3449-a620-80f3-1e268e46f97d', 'Semester 4', '2026-10-03T15:28:10.703864+00:00', '2026-10-03T15:28:10.703864+00:00', 'active', 'd62094a0-d335-4c29-90ee-bc7549bcdd1b', '940be794-a12f-4629-93f0-ca6ff52f62ae')
ON CONFLICT ("id") DO UPDATE SET
  "academic_year_id" = EXCLUDED."academic_year_id",
  "name" = EXCLUDED."name",
  "created_at" = EXCLUDED."created_at",
  "updated_at" = EXCLUDED."updated_at",
  "status" = EXCLUDED."status",
  "programme_id" = EXCLUDED."programme_id",
  "academic_session_id" = EXCLUDED."academic_session_id";


COMMIT;
