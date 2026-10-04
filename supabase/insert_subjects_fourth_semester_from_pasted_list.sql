-- Imports the supplied fourth-semester subject list and links each row to
-- existing departments, programmes, academic years, and semesters. Shared
-- subjects expand once per programme listed in the mapping table.
-- Political Science / General maps to Political Science; Commerce / Skill
-- Development maps to Commerce, as confirmed. No academic structure rows are
-- created or modified by this script.
-- Existing subjects with the same code, name, and semester are left unchanged.

BEGIN;

CREATE TEMP TABLE subject_import_mapping (
  mapping_key TEXT PRIMARY KEY,
  department_label TEXT NOT NULL,
  semester_label TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO subject_import_mapping (mapping_key, department_label, semester_label)
VALUES
  ('MAP_01', 'Political Science / General', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Fourth Semester'),
  ('MAP_02', 'Commerce / Skill Development', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Fourth Semester'),
  ('MAP_03', 'Physics', 'B.Sc. Fourth Semester'),
  ('MAP_04', 'Botany', 'B.Sc. Fourth Semester'),
  ('MAP_05', 'Microbiology', 'B.Sc. Fourth Semester'),
  ('MAP_06', 'Mathematics', 'B.Sc. Fourth Semester'),
  ('MAP_07', 'Statistics', 'B.Sc. Fourth Semester'),
  ('MAP_08', 'Chemistry', 'B.Sc. Fourth Semester'),
  ('MAP_09', 'Computer Science', 'B.Sc. Fourth Semester'),
  ('MAP_10', 'Zoology', 'B.Sc. Fourth Semester'),
  ('MAP_11', 'Nutrition and Health Education', 'B.Sc. Fourth Semester'),
  ('MAP_12', 'Commerce', 'B.Com. Fourth Semester'),
  ('MAP_13', 'Commerce / Business Administration', 'B.Com. / B.B.A. Fourth Semester'),
  ('MAP_14', 'Computer Applications', 'B.C.A. Fourth Semester'),
  ('MAP_15', 'Business Administration', 'B.B.A. Fourth Semester'),
  ('MAP_16', 'History', 'B.A. Fourth Semester'),
  ('MAP_17', 'Economics', 'B.A. / B.Sc. Fourth Semester'),
  ('MAP_18', 'Political Science', 'B.A. Fourth Semester'),
  ('MAP_19', 'Psychology', 'B.Sc. / B.A. Fourth Semester'),
  ('MAP_20', 'Computer Animation', 'B.A. / B.Sc. Fourth Semester'),
  ('MAP_21', 'Journalism and Mass Communication', 'B.A. Fourth Semester'),
  ('MAP_22', 'Secretarial Practice', 'B.A. Fourth Semester'),
  ('MAP_23', 'French', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Fourth Semester'),
  ('MAP_24', 'Malayalam', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Fourth Semester'),
  ('MAP_25', 'Kannada', 'B.A. Fourth Semester'),
  ('MAP_26', 'Kannada', 'B.Sc. Fourth Semester'),
  ('MAP_27', 'Kannada', 'B.Com. Fourth Semester'),
  ('MAP_28', 'Kannada', 'B.B.A. / B.C.A. Fourth Semester'),
  ('MAP_29', 'Hindi', 'B.A. Fourth Semester'),
  ('MAP_30', 'Hindi', 'B.Sc. Fourth Semester'),
  ('MAP_31', 'Hindi', 'B.Com. Fourth Semester'),
  ('MAP_32', 'Hindi', 'B.B.A. Fourth Semester'),
  ('MAP_33', 'Hindi', 'B.C.A. Fourth Semester'),
  ('MAP_34', 'English', 'B.A. Fourth Semester'),
  ('MAP_35', 'English', 'B.Sc. Fourth Semester'),
  ('MAP_36', 'English', 'B.Com. Fourth Semester'),
  ('MAP_37', 'English', 'B.B.A. Fourth Semester'),
  ('MAP_38', 'English', 'B.C.A. Fourth Semester');

CREATE TEMP TABLE subject_import_source (
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mapping_key TEXT NOT NULL REFERENCES subject_import_mapping (mapping_key)
) ON COMMIT DROP;

INSERT INTO subject_import_source (subject_code, subject_name, mapping_key)
VALUES
  ('22ABE401', 'Constitution of India', 'MAP_01'),
  ('22SKL401', 'Financial Education and Investment Awareness', 'MAP_02'),
  ('21ABE401', 'Constitutional Values', 'MAP_01'),
  ('24PHYC401', 'Electromagnetism & Current Electricity', 'MAP_03'),
  ('24BOTC401', 'Cell biology, Anatomy and Embryology', 'MAP_04'),
  ('24MICC401', 'Microbial Physiology and Metabolism', 'MAP_05'),
  ('21MATC401', 'Mathematics Theory - IV: Partial Differential Equations and Integral Transforms', 'MAP_06'),
  ('19MAT401', 'Mathematics Theory IV', 'MAP_06'),
  ('24MATC401', 'Algebra and Complex Analysis', 'MAP_06'),
  ('21STAC401', 'Statistics Theory - IV: Statistical Inference - I', 'MAP_07'),
  ('24STAC401', 'Sampling Theory', 'MAP_07'),
  ('24CHEC401', 'General Chemistry-IV', 'MAP_08'),
  ('21CHEC401', 'Chemistry Theory IV: Inorganic and Physical Chemistry - II', 'MAP_08'),
  ('21CSCC401', 'Computer Science Theory - IV: Database Management Systems', 'MAP_09'),
  ('24CSCC401', 'Database Management Systems', 'MAP_09'),
  ('19ZOO401', 'Zoology Theory IV', 'MAP_10'),
  ('21ZOOC401', 'Gene Technology, Immunology and Computational Biology', 'MAP_10'),
  ('24ZOOC401', 'Endocrinology, Histology, Animal Behavior and Applied Zoology', 'MAP_10'),
  ('24NHEC401', 'Public Health Nutrition', 'MAP_11'),
  ('24COMC401', 'Advanced Corporate Accounting', 'MAP_12'),
  ('19COM401', 'Financial Accounting IV', 'MAP_12'),
  ('21COMC401 (R)', 'Advanced Corporate Accounting', 'MAP_12'),
  ('24COMC402', 'Costing Methods and Techniques', 'MAP_12'),
  ('21COMC402 (R)', 'Costing Methods and Techniques', 'MAP_12'),
  ('21COMC403 (R)', 'Business Regulatory Framework', 'MAP_12'),
  ('24COMC403', 'Human Resource Management', 'MAP_12'),
  ('24COMC411', 'Strategic Business Leader', 'MAP_12'),
  ('24COMC412', 'Strategic Business Reporting II', 'MAP_12'),
  ('24COMC413', 'Investment Management', 'MAP_12'),
  ('24COMC433 / BBAC413', 'Strategic Investment and Risk Management', 'MAP_13'),
  ('24COMC421', 'Professional Accounting IV', 'MAP_12'),
  ('24COMC422', 'Income Tax - II', 'MAP_12'),
  ('24COMC423', 'Goods and Service Tax - II', 'MAP_12'),
  ('24COMC463 / 24BBAC423', 'Production and Operations Management', 'MAP_13'),
  ('23COMC423', 'Goods and Service tax II', 'MAP_12'),
  ('21COMC443 (R)', 'Strategic Investment and Risk Management', 'MAP_12'),
  ('21COAC401', 'Python Programming', 'MAP_14'),
  ('24COAC401', 'PHP & MYSQL', 'MAP_14'),
  ('21COAC402', 'Computer Multimedia and Animation', 'MAP_14'),
  ('24COAC402', 'Advanced Java', 'MAP_14'),
  ('21COAC403', 'Operating System Concepts', 'MAP_14'),
  ('24COAC403', 'Operating System', 'MAP_14'),
  ('21BBAC401', 'Management Accounting', 'MAP_15'),
  ('24BBAC401', 'Statistics for Business Decisions', 'MAP_15'),
  ('24BBAC402', 'Organisational Behaviour', 'MAP_15'),
  ('21BBAC403', 'Financial Management', 'MAP_15'),
  ('21BBAC412', 'Financial Markets & Services', 'MAP_15'),
  ('24HISC401', 'Medieval India from A.D.1526 to A.D. 1707', 'MAP_16'),
  ('24ECOC401', 'International Trade & Finance', 'MAP_17'),
  ('21ECOC402', 'Statistics for Economics', 'MAP_17'),
  ('24PSCC401', 'Politics, Society and Economy', 'MAP_18'),
  ('24PSYC401', 'Life Span Development', 'MAP_19'),
  ('24ANMC401', '3D Modelling & Texturing', 'MAP_20'),
  ('24JMCC401', 'Feature and Freelance Journalism', 'MAP_21'),
  ('24SEPC401', 'Business Communication and Correspondence', 'MAP_22'),
  ('21FRE401', 'General French IV', 'MAP_23'),
  ('24FRE401', 'General French - IV', 'MAP_23'),
  ('25MAL401', 'General Malayalam IV', 'MAP_24'),
  ('24KAN401', 'General Kannada IV', 'MAP_25'),
  ('24KAN402', 'General Kannada IV', 'MAP_26'),
  ('24KAN403', 'Kannada Language IV', 'MAP_27'),
  ('24KAN404', 'General Kannada IV', 'MAP_28'),
  ('21HIN401', 'General Hindi IV', 'MAP_29'),
  ('24HIN401', 'General Hindi - IV', 'MAP_29'),
  ('24HIN402', 'General Hindi - IV', 'MAP_30'),
  ('24HIN403', 'General Hindi - IV', 'MAP_31'),
  ('21HIN403', 'General Hindi IV', 'MAP_31'),
  ('24HIN404', 'General Hindi - IV', 'MAP_32'),
  ('21HIN404', 'General Hindi IV', 'MAP_32'),
  ('24HIN405', 'General Hindi - IV', 'MAP_33'),
  ('24ENG401', 'English Language', 'MAP_34'),
  ('24ENMC401', 'Indian Literature in Translation', 'MAP_34'),
  ('24ENG402', 'English Language', 'MAP_35'),
  ('24ENG403', 'English Language', 'MAP_36'),
  ('21ENG403', 'Generic English IV', 'MAP_36'),
  ('24ENG404', 'English Language', 'MAP_37'),
  ('21ENG404', 'Generic English - IV', 'MAP_37'),
  ('24ENG405', 'English Language', 'MAP_38'),
  ('21ENG405', 'Generic English - IV', 'MAP_38');

CREATE TEMP TABLE subject_import_resolved ON COMMIT DROP AS
WITH programme_targets AS (
  SELECT source.*, mapping.department_label, mapping.semester_label, target.programme_name
  FROM subject_import_source AS source
  JOIN subject_import_mapping AS mapping ON mapping.mapping_key = source.mapping_key
  CROSS JOIN LATERAL (VALUES
    ('Bachelor of Arts', mapping.semester_label ~* '(^|[[:space:]/&])B[.]A[.]'),
    ('Bachelor of Science', mapping.semester_label ~* '(^|[[:space:]/&])B[.]Sc[.]'),
    ('Bachelor of Commerce', mapping.semester_label ~* '(^|[[:space:]/&])B[.]Com[.]'),
    ('Bachelor of Business Administration', mapping.semester_label ~* '(^|[[:space:]/&])B[.]B[.]A[.]'),
    ('Bachelor of Computer Applications', mapping.semester_label ~* '(^|[[:space:]/&])B[.]C[.]A[.]')
  ) AS target(programme_name, is_target)
  WHERE target.is_target
), normalized AS (
  SELECT
    CASE
      WHEN target.subject_code LIKE '%/%'
        AND target.programme_name = 'Bachelor of Commerce'
        THEN regexp_replace(btrim(split_part(target.subject_code, '/', 1)), '\s+', '', 'g')
      WHEN target.subject_code LIKE '%/%'
        AND target.programme_name = 'Bachelor of Business Administration'
        THEN regexp_replace(btrim(split_part(target.subject_code, '/', 2)), '\s+', '', 'g')
      ELSE regexp_replace(target.subject_code, '\s+', '', 'g')
    END AS subject_code,
    target.subject_name,
    target.programme_name,
    CASE
      WHEN target.department_label = 'Commerce / Business Administration'
        AND target.programme_name = 'Bachelor of Business Administration'
        THEN 'Business Administration'
      WHEN target.department_label = 'Commerce / Business Administration' THEN 'Commerce'
      WHEN target.department_label IN ('Political Science / General', 'Political Science')
        THEN 'Political Science'
      WHEN target.department_label IN ('Commerce / Skill Development', 'Commerce')
        THEN 'Commerce'
      WHEN target.department_label = 'Journalism and Mass Communication'
        THEN 'Journalism & Mass Communication'
      WHEN target.department_label = 'Nutrition and Health Education'
        THEN 'Nutrition & Health Education'
      ELSE regexp_replace(target.department_label, '^Departments? of\s+', '', 'i')
    END AS department_name,
    CASE
      WHEN target.semester_label ILIKE '%First Semester%' THEN 1
      WHEN target.semester_label ILIKE '%Second Semester%' THEN 2
      WHEN target.semester_label ILIKE '%Third Semester%' THEN 3
      WHEN target.semester_label ILIKE '%Fourth Semester%' THEN 4
      WHEN target.semester_label ILIKE '%Fifth Semester%' THEN 5
      WHEN target.semester_label ILIKE '%Sixth Semester%' THEN 6
      ELSE NULL
    END AS semester_number
  FROM programme_targets AS target
)
SELECT
  normalized.subject_code,
  normalized.subject_name,
  normalized.programme_name,
  normalized.semester_number,
  departments.id AS department_id,
  semesters.id AS semester_id
FROM normalized
LEFT JOIN public.programmes AS programmes
  ON regexp_replace(lower(programmes.name), '[^a-z0-9]+', '', 'g') =
     regexp_replace(lower(normalized.programme_name), '[^a-z0-9]+', '', 'g')
LEFT JOIN public.semesters AS semesters
  ON semesters.programme_id = programmes.id
  AND semesters.name = 'Semester ' || normalized.semester_number::TEXT
LEFT JOIN public.departments AS departments
  ON regexp_replace(
       lower(regexp_replace(departments.name, '^Departments? of\s+', '', 'i')),
       '[^a-z0-9]+', '', 'g'
     ) =
     regexp_replace(lower(normalized.department_name), '[^a-z0-9]+', '', 'g');

DO $validate$
DECLARE
  unresolved TEXT;
BEGIN
  SELECT string_agg(
    format('%s / %s / %s (department=%s, semester=%s)',
      subject_code, programme_name, COALESCE('Semester ' || semester_number::TEXT, 'unknown semester'),
      CASE WHEN department_id IS NULL THEN 'not found' ELSE 'ok' END,
      CASE WHEN semester_id IS NULL THEN 'not found' ELSE 'ok' END),
    E'\n'
  )
  INTO unresolved
  FROM subject_import_resolved
  WHERE department_id IS NULL OR semester_id IS NULL;

  IF unresolved IS NOT NULL THEN
    RAISE EXCEPTION 'Subject import cancelled; academic references did not resolve:%', E'\n' || unresolved;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM subject_import_resolved) THEN
    RAISE EXCEPTION 'Subject import cancelled; no source rows matched a programme.';
  END IF;
END
$validate$;

DO $insert$
DECLARE
  inserted_count INTEGER;
BEGIN
  INSERT INTO public.subjects (
    semester_id, name, code, department_id, is_active, status
  )
  SELECT
    resolved.semester_id,
    resolved.subject_name,
    resolved.subject_code,
    resolved.department_id,
    true,
    'active'
  FROM subject_import_resolved AS resolved
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.subjects AS existing
    WHERE existing.semester_id = resolved.semester_id
      AND lower(btrim(existing.code)) = lower(btrim(resolved.subject_code))
      AND lower(btrim(existing.name)) = lower(btrim(resolved.subject_name))
  );

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Inserted % subject rows; existing code/name/semester pairs were left unchanged.', inserted_count;
END
$insert$;

COMMIT;
