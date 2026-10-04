-- Imports the supplied subject list and links each row to existing departments,
-- programmes, academic years, and semesters. Shared subjects are expanded once
-- per programme listed in the mapping table. Subject rows use mapping keys; those
-- mappings resolve to IDs from the academic structure tables. No academic structure
-- rows are created or modified by this script.
--
-- Run after academic_structure_export.sql and seed_curricula_2026_2027.sql,
-- with migrations already applied. Review the mapping and run the whole file.
-- Existing subjects with the same code and semester are left unchanged.

BEGIN;

CREATE TEMP TABLE subject_import_mapping (
  mapping_key TEXT PRIMARY KEY,
  department_label TEXT NOT NULL,
  semester_label TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO subject_import_mapping (mapping_key, department_label, semester_label)
VALUES
  ('MAP_01', 'Commerce', 'B.Com. First Semester'),
  ('MAP_02', 'Commerce / Business Administration', 'B.Com. / B.B.A. First Semester'),
  ('MAP_03', 'Computer Science', 'B.Sc. First Semester'),
  ('MAP_04', 'Botany', 'B.Sc. First Semester'),
  ('MAP_05', 'Nutrition and Health Education', 'B.A. and B.Sc. First Semester'),
  ('MAP_06', 'Physics', 'B.Sc. First Semester'),
  ('MAP_07', 'Nutrition and Health Education', 'B.A. / B.Sc. First Semester'),
  ('MAP_08', 'Computer Animation', 'B.Sc. and B.A. First Semester'),
  ('MAP_09', 'Chemistry', 'B.Sc. First Semester'),
  ('MAP_10', 'Microbiology', 'B.Sc. First Semester'),
  ('MAP_11', 'Mathematics', 'B.Sc. First Semester'),
  ('MAP_12', 'Statistics / Data Science', 'B.Sc. Data Science First Semester'),
  ('MAP_13', 'Data Science', 'B.Sc. First Semester'),
  ('MAP_14', 'Malayalam', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. First Semester'),
  ('MAP_15', 'Malayalam', 'B.A. / B.Sc. / B.B.A. / B.Com. / B.C.A. First Semester'),
  ('MAP_16', 'French', 'B.A. / B.Sc. / B.Com. / B.C.A. / B.B.A. First Semester'),
  ('MAP_17', 'French', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. First Semester'),
  ('MAP_18', 'English', 'B.A. First Semester'),
  ('MAP_19', 'English', 'B.Sc. First Semester'),
  ('MAP_20', 'English', 'B.Com. First Semester'),
  ('MAP_21', 'English', 'B.B.A. First Semester'),
  ('MAP_22', 'English', 'B.C.A. First Semester'),
  ('MAP_23', 'Kannada', 'B.A. First Semester'),
  ('MAP_24', 'Kannada', 'B.Sc. First Semester'),
  ('MAP_25', 'Kannada', 'B.Com. First Semester'),
  ('MAP_26', 'Hindi', 'B.A. First Semester'),
  ('MAP_27', 'Hindi', 'B.Sc. First Semester'),
  ('MAP_28', 'Hindi', 'B.Com. First Semester'),
  ('MAP_29', 'Hindi', 'B.B.A. First Semester'),
  ('MAP_30', 'Hindi', 'B.C.A. First Semester'),
  ('MAP_31', 'Zoology', 'B.A. / B.B.A. / B.Com. / B.C.A. First Semester'),
  ('MAP_32', 'Microbiology', 'B.A. / B.Com. / B.B.A. / B.C.A. First Semester'),
  ('MAP_33', 'Commerce / Management', 'B.A. First Semester'),
  ('MAP_34', 'Psychology', 'B.Sc. / B.Com. / B.B.A. / B.C.A. First Semester'),
  ('MAP_35', 'Business Administration', 'B.A. / B.C.A. / B.Sc. First Semester'),
  ('MAP_36', 'Economics', 'B.Com. First Semester'),
  ('MAP_37', 'Animation', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. First Semester'),
  ('MAP_38', 'Business Administration', 'B.B.A. First Semester'),
  ('MAP_39', 'Computer Applications', 'B.C.A. First Semester'),
  ('MAP_40', 'Computer Applications (AI & ML)', 'B.C.A. First Semester'),
  ('MAP_41', 'Secretarial Practice', 'B.A. First Semester'),
  ('MAP_42', 'History', 'B.A. First Semester'),
  ('MAP_43', 'Economics', 'B.A. / B.Sc. First Semester'),
  ('MAP_44', 'Political Science', 'B.A. First Semester'),
  ('MAP_45', 'Psychology', 'B.A. / B.Sc. First Semester'),
  ('MAP_46', 'Psychology', 'B.Sc. / B.A. First Semester'),
  ('MAP_47', 'Journalism', 'B.A. First Semester');

CREATE TEMP TABLE subject_import_source (
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mapping_key TEXT NOT NULL REFERENCES subject_import_mapping (mapping_key)
) ON COMMIT DROP;

INSERT INTO subject_import_source (subject_code, subject_name, mapping_key)
VALUES
  ('21COMC102', 'Management Principles and Applications', 'MAP_01'),
  ('21COMC143', 'Financial Planning and Performance', 'MAP_01'),
  ('22COMC101', 'Financial Accounting', 'MAP_01'),
  ('24COMC101', 'Financial Accounting', 'MAP_01'),
  ('24COMC102', 'Principles of Management', 'MAP_01'),
  ('24COMC103', 'Corporate Etiquette and Soft Skills', 'MAP_01'),
  ('24COMC111', 'International Financial Accounting', 'MAP_01'),
  ('24COMC112', 'Management Accounting', 'MAP_01'),
  ('24COMC113', 'Performance Management', 'MAP_01'),
  ('24COMC121', 'Professional Accounting I', 'MAP_01'),
  ('24COMC122', 'Quantitative Techniques I', 'MAP_01'),
  ('24COMC123', 'Business Economics', 'MAP_01'),
  ('24COMC132', 'Financial Planning and Performance', 'MAP_01'),
  ('24COMC162 / 24 BBAC123', 'Essentials of Logistics and Supply Chain Management', 'MAP_02'),
  ('21CSCC101', 'Computer Fundamentals and Programming in C', 'MAP_03'),
  ('21BOTC101', 'Botany Theory - I', 'MAP_04'),
  ('22NHEC101', 'Fundamentals of food and nutrition science', 'MAP_05'),
  ('24BOTC101', 'Microbes and Algae', 'MAP_04'),
  ('24PHYC101', 'Mathematical Physics, Properties of Materials and Relativity', 'MAP_06'),
  ('24NHEC101', 'Fundamentals of Nutrition and Food Science', 'MAP_07'),
  ('24ANMC101', 'Fundamentals of Art & Animation', 'MAP_08'),
  ('24CHEC101', 'General Chemistry-1', 'MAP_09'),
  ('24CSCC101', 'Computer Fundamentals and Programming in C', 'MAP_03'),
  ('24MICC101', 'General Microbiology', 'MAP_10'),
  ('24MATC101', 'Calculus and Analytical Geometry', 'MAP_11'),
  ('25DSCC101', 'Programming in Python', 'MAP_12'),
  ('25DSCC102', 'Discrete Mathematics and Descriptive Statistics', 'MAP_13'),
  ('25DSCC103', 'Computer Fundamentals and Programming in C', 'MAP_13'),
  ('25MAL101', 'General Malayalam I', 'MAP_14'),
  ('24MAL101', 'General Malayalam - I', 'MAP_15'),
  ('24FRE101', 'General French - 1', 'MAP_16'),
  ('21FRE101', 'General French - I', 'MAP_17'),
  ('21ENG101', 'Generic English - I', 'MAP_18'),
  ('24ENG101', 'English Language', 'MAP_18'),
  ('24ENG102', 'English Language', 'MAP_19'),
  ('24ENG103', 'English Language', 'MAP_20'),
  ('24ENG104', 'English Language', 'MAP_21'),
  ('24ENG105', 'English Language', 'MAP_22'),
  ('24KAN101', 'General Kannada I', 'MAP_23'),
  ('24KAN102', 'General Kannada I', 'MAP_24'),
  ('24KAN103', 'General Kannada I', 'MAP_25'),
  ('21HIN101', 'General Hindi - I', 'MAP_26'),
  ('24HIN101', 'General Hindi - I', 'MAP_26'),
  ('21HIN102', 'General Hindi - 1', 'MAP_27'),
  ('24HIN102', 'General Hindi - I', 'MAP_27'),
  ('21HIN103', 'General Hindi - I', 'MAP_28'),
  ('24HIN103', 'General Hindi - I', 'MAP_28'),
  ('21HIN104', 'General Hindi - I', 'MAP_29'),
  ('24HIN104', 'General Hindi - I', 'MAP_29'),
  ('24HIN105', 'General Hindi - I', 'MAP_30'),
  ('21ZOOE11', 'Economic zoology', 'MAP_31'),
  ('21MICE11', 'Microorganisms for Human Welfare', 'MAP_32'),
  ('21OPME11', 'Entrepreneurship Development Programme', 'MAP_33'),
  ('21PSYE11', 'Psychology of Health and Wellbeing', 'MAP_34'),
  ('21BBAE11', 'Business Organisation', 'MAP_35'),
  ('21COME14', 'Global Corporate and Business Law', 'MAP_01'),
  ('21ECOE14', 'Business Economics', 'MAP_36'),
  ('22NHEE11', 'Human Nutrition', 'MAP_07'),
  ('23ANME11', 'Basics of Graphic Design', 'MAP_37'),
  ('24BBAE11', 'Business Communication', 'MAP_38'),
  ('24COME11', 'Business Economics', 'MAP_01'),
  ('24COME13', 'Corporate and Business Law', 'MAP_01'),
  ('24COME14', 'Mercantile law', 'MAP_01'),
  ('21COAC101', 'Fundamentals of Computers', 'MAP_39'),
  ('21COAC102', 'Programming in C - Theory', 'MAP_39'),
  ('24COAC101', 'Fundamentals of Computers', 'MAP_39'),
  ('24COAC102', 'Programming in C', 'MAP_39'),
  ('21COAC103', 'Mathematical Foundation', 'MAP_39'),
  ('24COAC103', 'Mathematical Foundation', 'MAP_39'),
  ('25COAAC101', 'Fundamentals of Computers and Programming in C', 'MAP_40'),
  ('25COAAC102', 'Introduction to Artificial Intelligence', 'MAP_40'),
  ('25COAAC103', 'Mathematical Foundation', 'MAP_40'),
  ('21BBAC101', 'Management Principles & Practice', 'MAP_38'),
  ('21BBAC102', 'Fundamentals of Business Accounting', 'MAP_38'),
  ('21BBAC103', 'Marketing Management', 'MAP_38'),
  ('24BBAC101', 'Fundamentals of Business Accounting', 'MAP_38'),
  ('24BBAC102', 'Principles & Practices of Management', 'MAP_38'),
  ('24BBAC103', 'Marketing Management', 'MAP_38'),
  ('24SEPC101', 'Executive Secretarial System', 'MAP_41'),
  ('24HISC101', 'Ancient India from beginning to A.D 400', 'MAP_42'),
  ('24ECOC101', 'Micro Economics', 'MAP_43'),
  ('24PSCC101', 'Basic Concepts In Political Science', 'MAP_44'),
  ('21PSYC101', 'Foundations of Psychology', 'MAP_45'),
  ('24PSYC101', 'Dynamics of Behaviour', 'MAP_46'),
  ('24JMCC101', 'Introduction to Mass Communication', 'MAP_47'),
  ('24ENMC101', 'Reading Literature', 'MAP_18');

CREATE TEMP TABLE subject_import_resolved ON COMMIT DROP AS
WITH programme_targets AS (
  SELECT source.*, mapping.department_label, mapping.semester_label, target.programme_name
  FROM subject_import_source AS source
  JOIN subject_import_mapping AS mapping ON mapping.mapping_key = source.mapping_key
  CROSS JOIN LATERAL (VALUES
    ('Bachelor of Arts', mapping.semester_label ~* '(^|[^[:alnum:]])B[.]A[.]'),
    ('Bachelor of Science', mapping.semester_label ~* '(^|[^[:alnum:]])B[.]Sc[.]'
      AND mapping.semester_label NOT ILIKE '%Data Science%'
      AND source.subject_code NOT LIKE '25DS%'),
    ('Bachelor of Science (Data Science)', mapping.semester_label ILIKE '%Data Science%'
      OR source.subject_code LIKE '25DS%'),
    ('Bachelor of Commerce', mapping.semester_label ~* '(^|[^[:alnum:]])B[.]Com[.]'),
    ('Bachelor of Business Administration', mapping.semester_label ~* '(^|[^[:alnum:]])B[.]B[.]A[.]'),
    ('Bachelor of Computer Applications', mapping.semester_label ~* '(^|[^[:alnum:]])B[.]C[.]A[.]')
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
    target.semester_label,
    target.programme_name,
    CASE
      WHEN target.department_label = 'Commerce / Business Administration'
        AND target.programme_name = 'Bachelor of Business Administration'
        THEN 'Business Administration'
      WHEN target.department_label = 'Commerce / Business Administration' THEN 'Commerce'
      WHEN target.department_label = 'Commerce / Management' THEN 'Commerce'
      WHEN target.department_label = 'Statistics / Data Science' THEN 'Data Science'
      WHEN target.department_label = 'Animation' THEN 'Computer Animation'
      WHEN target.department_label = 'Journalism' THEN 'Journalism & Mass Communication'
      WHEN target.department_label = 'Computer Applications (AI & ML)' THEN 'Computer Applications'
      WHEN target.department_label = 'Nutrition and Health Education' THEN 'Nutrition & Health Education'
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
  );

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Inserted % subject rows; existing code/semester pairs were left unchanged.', inserted_count;
END
$insert$;

COMMIT;
