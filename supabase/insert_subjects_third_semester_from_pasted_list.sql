-- Imports the supplied third-semester subject list and links each row to
-- existing departments, programmes, academic years, and semesters. Shared
-- subjects expand once per programme listed in the mapping table. The source's
-- First Semester heading for 24COMC323 was a printing mistake; it is mapped to
-- the B.Com. third semester as confirmed.
-- The three B.B.A. elective/NPTEL options sharing code 24BBAE31 are kept as
-- separate subjects, as listed in the supplied data.
-- Existing subjects with the same code and semester are left unchanged.

BEGIN;

CREATE TEMP TABLE subject_import_mapping (
  mapping_key TEXT PRIMARY KEY,
  department_label TEXT NOT NULL,
  semester_label TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO subject_import_mapping (mapping_key, department_label, semester_label)
VALUES
  ('MAP_01', 'Malayalam', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Third Semester'),
  ('MAP_02', 'French', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Third Semester'),
  ('MAP_03', 'English', 'B.A. Third Semester'),
  ('MAP_04', 'English', 'B.Sc. Third Semester'),
  ('MAP_05', 'English', 'B.Com. Third Semester'),
  ('MAP_06', 'English', 'B.B.A. Third Semester'),
  ('MAP_07', 'English', 'B.C.A. Third Semester'),
  ('MAP_08', 'Kannada', 'B.A. Third Semester'),
  ('MAP_09', 'Kannada', 'B.Sc. Third Semester'),
  ('MAP_10', 'Kannada', 'B.Com. Third Semester'),
  ('MAP_11', 'Kannada', 'B.B.A. / B.C.A. Third Semester'),
  ('MAP_12', 'Hindi', 'B.A. Third Semester'),
  ('MAP_13', 'Hindi', 'B.Sc. Third Semester'),
  ('MAP_14', 'Hindi', 'B.Com. Third Semester'),
  ('MAP_15', 'Hindi', 'B.B.A. Third Semester'),
  ('MAP_16', 'Hindi', 'B.C.A. Third Semester'),
  ('MAP_17', 'Chemistry', 'B.Sc. Third Semester'),
  ('MAP_18', 'Zoology', 'B.A. / B.Sc. / B.B.A. / B.Com. / B.C.A. Third Semester'),
  ('MAP_19', 'Economics', 'B.Sc. / B.Com. / B.B.A. / B.C.A. Third Semester'),
  ('MAP_20', 'Journalism', 'B.Sc. / B.Com. / B.B.A. / B.C.A. Third Semester'),
  ('MAP_21', 'Mathematics', 'B.A. / B.B.A. / B.Com. Third Semester'),
  ('MAP_22', 'Commerce', 'B.Com. Third Semester'),
  ('MAP_23', 'Computer Animation', 'B.Sc. / B.A. / B.B.A. / B.Com. / B.C.A. Third Semester'),
  ('MAP_24', 'Business Administration', 'B.B.A. Third Semester'),
  ('MAP_25', 'Computer Applications', 'B.C.A. Third Semester'),
  ('MAP_26', 'Secretarial Practice', 'B.A. Third Semester'),
  ('MAP_27', 'History', 'B.A. Third Semester'),
  ('MAP_28', 'Economics', 'B.A. Third Semester'),
  ('MAP_29', 'Economics', 'B.A. / B.Sc. Third Semester'),
  ('MAP_30', 'Political Science', 'B.A. Third Semester'),
  ('MAP_31', 'Psychology', 'B.A. / B.Sc. Third Semester'),
  ('MAP_32', 'Psychology', 'B.Sc. / B.A. Third Semester'),
  ('MAP_33', 'Journalism', 'B.A. Third Semester'),
  ('MAP_34', 'Computer Science', 'B.Sc. Third Semester'),
  ('MAP_35', 'Zoology', 'B.Sc. Third Semester'),
  ('MAP_36', 'Statistics', 'B.Sc. Third Semester'),
  ('MAP_37', 'Nutrition and Health Education', 'B.A. & B.Sc. Third Semester'),
  ('MAP_38', 'Botany', 'B.Sc. Third Semester'),
  ('MAP_39', 'Mathematics', 'B.Sc. Third Semester'),
  ('MAP_40', 'Microbiology', 'B.Sc. Third Semester'),
  ('MAP_41', 'Nutrition and Health Education', 'B.A. / B.Sc. Third Semester'),
  ('MAP_42', 'Physics', 'B.Sc. Third Semester'),
  ('MAP_43', 'Computer Animation', 'B.Sc. and B.A. Third Semester'),
  ('MAP_44', 'Commerce / Business Administration', 'B.Com. / B.B.A. Third Semester');

CREATE TEMP TABLE subject_import_source (
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mapping_key TEXT NOT NULL REFERENCES subject_import_mapping (mapping_key)
) ON COMMIT DROP;

INSERT INTO subject_import_source (subject_code, subject_name, mapping_key)
VALUES
  ('25MAL301', 'General Malayalam III', 'MAP_01'),
  ('21MAL301', 'General Malayalam - III', 'MAP_01'),
  ('21FRE301', 'General French - III', 'MAP_02'),
  ('24FRE301', 'General French - III', 'MAP_02'),
  ('21ENG301', 'Generic English - III', 'MAP_03'),
  ('24ENG301', 'English Language', 'MAP_03'),
  ('21ENG302', 'Generic English III', 'MAP_04'),
  ('24ENG302', 'English Language', 'MAP_04'),
  ('21ENG303', 'Generic English III', 'MAP_05'),
  ('24ENG303', 'English Language', 'MAP_05'),
  ('21ENG304', 'Generic English III', 'MAP_06'),
  ('24ENG304', 'English Language', 'MAP_06'),
  ('21ENG305', 'Generic English III', 'MAP_07'),
  ('24ENG305', 'English Language', 'MAP_07'),
  ('21KAN301', 'General Kannada - III', 'MAP_08'),
  ('24KAN301', 'General Kannada III', 'MAP_08'),
  ('24KAN302', 'General Kannada III', 'MAP_09'),
  ('24KAN303', 'General Kannada III', 'MAP_10'),
  ('24KAN304', 'General Kannada III', 'MAP_11'),
  ('19KAN321', 'General Kannada III', 'MAP_09'),
  ('21HIN301', 'General Hindi - III', 'MAP_12'),
  ('24HIN301', 'General Hindi - III', 'MAP_12'),
  ('24HIN302', 'General Hindi - III', 'MAP_13'),
  ('24HIN303', 'General Hindi - III', 'MAP_14'),
  ('21HIN304', 'General Hindi - III', 'MAP_15'),
  ('24HIN304', 'General Hindi - III', 'MAP_15'),
  ('21HIN305', 'General Hindi - III', 'MAP_16'),
  ('24HIN305', 'General Hindi - III', 'MAP_16'),
  ('21CHEE31', 'Environmental Chemistry', 'MAP_17'),
  ('21ZOOE31', 'Endocrinology', 'MAP_18'),
  ('21ECOE31', 'Economics of Insurance', 'MAP_19'),
  ('21JMCE31', 'Feature Writing and Freelancing', 'MAP_20'),
  ('21MATE32', 'Quantitative Mathematics', 'MAP_21'),
  ('21COME32', 'Entrepreneurial Skills', 'MAP_22'),
  ('21COME35', 'International Financial Reporting', 'MAP_22'),
  ('23ANME31', 'Photography', 'MAP_23'),
  ('23COME34', 'Corporate Law', 'MAP_22'),
  ('24BBAE31', 'Consumer Psychology', 'MAP_24'),
  ('24BBAE31', 'Brand Management', 'MAP_24'),
  ('24BBAE31', 'Soft Skill Development', 'MAP_24'),
  ('21COAC301', 'Database Management Systems', 'MAP_25'),
  ('21COAC302', 'C# and .Net Framework', 'MAP_25'),
  ('21COAC303', 'Computers Communication and Networks', 'MAP_25'),
  ('24COAC301', 'Object Oriented Programming with Java', 'MAP_25'),
  ('24COAC302', 'C# and DOT NET Framework', 'MAP_25'),
  ('24COAC303', 'Computer Communication and Networks', 'MAP_25'),
  ('21BBAC301', 'Cost Accounting', 'MAP_24'),
  ('21BBAC302', 'Organisational Behaviour', 'MAP_24'),
  ('21BBAC303', 'Statistics for Business Decisions', 'MAP_24'),
  ('24BBAC301', 'Cost Accounting', 'MAP_24'),
  ('24BBAC302', 'Banking Law & Practice', 'MAP_24'),
  ('24BBAC303', 'Financial Management', 'MAP_24'),
  ('24SEPC301', 'Human Resource Management', 'MAP_26'),
  ('24HISC301', 'Medieval India from A.D.1206 to A.D. 1526', 'MAP_27'),
  ('21HISC302', 'History of Coastal Karnataka and Kodagu', 'MAP_27'),
  ('21ECOC301', 'Micro Economics', 'MAP_28'),
  ('24ECOC301', 'Banking and Insurance', 'MAP_29'),
  ('21ECOC302', 'Economics - IV: Mathematical Economics', 'MAP_28'),
  ('21PSCC301', 'Political Science - III: Indian Government and Politics', 'MAP_30'),
  ('21PSCC302', 'Political Science - IV: Parliamentary Procedures in India', 'MAP_30'),
  ('24PSCC301', 'Indian Political Thought', 'MAP_30'),
  ('21PSYC301', 'Child Development', 'MAP_31'),
  ('24PSYC301', 'Child Development', 'MAP_32'),
  ('24JMCC301', 'Editing', 'MAP_33'),
  ('21ENMC302', 'Indian Writing in Translation', 'MAP_03'),
  ('24ENMC301', 'British Literature: 1800 Onwards', 'MAP_03'),
  ('21CSCC301', 'Computer Science Theory - III: Object Oriented Programming Concepts & Java', 'MAP_34'),
  ('21CHEC301', 'Analytical and Organic Chemistry - II', 'MAP_17'),
  ('21ZOOC301', 'Molecular Biology, Bio instrumentation and Techniques in Biology', 'MAP_35'),
  ('21STAC301', 'Calculus and Probability', 'MAP_36'),
  ('22NHEC301', 'Introduction to Food Safety', 'MAP_37'),
  ('24BOTC301', 'Phanerogams and Plant systematics', 'MAP_38'),
  ('24CHEC301', 'General Chemistry-III', 'MAP_17'),
  ('24CSCC301', 'Object Oriented Programming Concepts and Programming in Java', 'MAP_34'),
  ('24MATC301', 'Sequences, Series and Differential Equations', 'MAP_39'),
  ('24MICC301', 'Microbial Growth and Biochemistry', 'MAP_40'),
  ('24NHEC301', 'Introduction to Food Safety', 'MAP_41'),
  ('24PHYC301', 'Acoustics & Optics', 'MAP_42'),
  ('24ANMC301', '2D Animation', 'MAP_43'),
  ('24STAC301', 'Estimation Theory & Time series Analysis', 'MAP_36'),
  ('24ZOOC301', 'Physiology, Biochemistry and Immunology', 'MAP_35'),
  ('21COMC301', 'Corporate Accounting', 'MAP_22'),
  ('21COMC302', 'Business Statistics', 'MAP_22'),
  ('21COMC303', 'Cost Accounting', 'MAP_22'),
  ('21COMC311', 'Financial Reporting II', 'MAP_22'),
  ('21COMC312', 'International Financial Management II', 'MAP_22'),
  ('21COMC313', 'Strategic Business Leader I', 'MAP_22'),
  ('21COMC342', 'Strategic Corporate Finance', 'MAP_22'),
  ('23COMC321', 'Professional Accounting - III', 'MAP_22'),
  ('23COMC323', 'Goods & Service Tax I', 'MAP_22'),
  ('24COMC301', 'Corporate Accounting', 'MAP_22'),
  ('24COMC302', 'Cost Accounting', 'MAP_22'),
  ('24COMC311', 'Audit and Assurance', 'MAP_22'),
  ('24COMC312', 'Strategic Business Reporting -1', 'MAP_22'),
  ('24COMC321', 'Professional Accounting III', 'MAP_22'),
  ('24COMC333 / 24BBAC313', 'Strategic Corporate Finance', 'MAP_44'),
  ('24COMC322', 'Income Tax I', 'MAP_22'),
  ('24COMC363 / 24BBAC323', 'Procurement, Warehouse and Distribution Management', 'MAP_44'),
  ('24COMC323', 'Goods and Services Tax', 'MAP_22');

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
      WHEN target.department_label = 'Animation' THEN 'Computer Animation'
      WHEN target.department_label = 'Journalism' THEN 'Journalism & Mass Communication'
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
  );

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Inserted % subject rows; existing code/semester pairs were left unchanged.', inserted_count;
END
$insert$;

COMMIT;
