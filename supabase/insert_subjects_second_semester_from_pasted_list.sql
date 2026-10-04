-- Imports the supplied second-semester subject list and links each row to
-- existing programmes, academic years, semesters, and departments. Shared
-- subjects expand once per programme listed in the mapping table. The missing
-- Environmental Studies department is added only if no equivalent row exists.
-- Existing subjects with the same code and semester are left unchanged.
-- Run after the academic-structure export and migrations, in one session.

BEGIN;

DO $ensure_environmental_studies$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.departments AS departments
    WHERE regexp_replace(
      lower(regexp_replace(departments.name, '^Departments? of\s+', '', 'i')),
      '[^a-z0-9]+', '', 'g'
    ) = 'environmentalstudies'
  ) THEN
    INSERT INTO public.departments (name, description, status)
    VALUES (
      'Department of Environmental Studies',
      'Covers environmental systems, sustainability, and human impacts on the natural world.',
      'active'
    );
  END IF;
END
$ensure_environmental_studies$;

CREATE TEMP TABLE subject_import_mapping (
  mapping_key TEXT PRIMARY KEY,
  department_label TEXT NOT NULL,
  semester_label TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO subject_import_mapping (mapping_key, department_label, semester_label)
VALUES
  ('MAP_01', 'Physics', 'B.Sc. Second Semester'),
  ('MAP_02', 'Botany', 'B.Sc. Second Semester'),
  ('MAP_03', 'Microbiology', 'B.Sc. Second Semester'),
  ('MAP_04', 'Mathematics', 'B.Sc. Second Semester'),
  ('MAP_05', 'Statistics', 'B.Sc. Second Semester'),
  ('MAP_06', 'Statistics / Data Science', 'B.Sc. (Data Science) Second Semester'),
  ('MAP_07', 'Chemistry', 'B.Sc. Second Semester'),
  ('MAP_08', 'Computer Science', 'B.Sc. Second Semester'),
  ('MAP_09', 'Data Science', 'B.Sc. (Data Science) Second Semester'),
  ('MAP_10', 'Nutrition and Health Education', 'B.Sc. Second Semester'),
  ('MAP_11', 'Zoology', 'B.Sc. Second Semester'),
  ('MAP_12', 'Commerce', 'B.Com. Second Semester'),
  ('MAP_13', 'Economics / Commerce', 'B.Com. Second Semester'),
  ('MAP_14', 'Commerce / Business Administration', 'B.Com. / B.B.A. Second Semester'),
  ('MAP_15', 'Animation', 'B.A. / B.Sc. Second Semester'),
  ('MAP_16', 'Business Administration', 'B.B.A. Second Semester'),
  ('MAP_17', 'Economics', 'B.Sc. / B.Com. / B.B.A. / B.C.A. Second Semester'),
  ('MAP_18', 'Environmental Studies', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Second Semester'),
  ('MAP_19', 'French', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Second Semester'),
  ('MAP_20', 'Malayalam', 'B.A. / B.Sc. / B.B.A. / B.Com. / B.C.A. Second Semester'),
  ('MAP_21', 'Malayalam', 'B.A. / B.Sc. / B.Com. / B.B.A. / B.C.A. Second Semester'),
  ('MAP_22', 'Kannada', 'B.A. Second Semester'),
  ('MAP_23', 'Kannada', 'B.Sc. Second Semester'),
  ('MAP_24', 'Kannada', 'B.Com. Second Semester'),
  ('MAP_25', 'Kannada', 'B.B.A. & B.C.A. Second Semester'),
  ('MAP_26', 'Hindi', 'B.A. Second Semester'),
  ('MAP_27', 'Hindi', 'B.Sc. Second Semester'),
  ('MAP_28', 'Hindi', 'B.Com. Second Semester'),
  ('MAP_29', 'Hindi', 'B.B.A. Second Semester'),
  ('MAP_30', 'Hindi', 'B.C.A. Second Semester'),
  ('MAP_31', 'English', 'B.A. Second Semester'),
  ('MAP_32', 'English', 'B.Sc. Second Semester'),
  ('MAP_33', 'English', 'B.Com. Second Semester'),
  ('MAP_34', 'English', 'B.B.A. Second Semester'),
  ('MAP_35', 'English', 'B.C.A. Second Semester'),
  ('MAP_36', 'Computer Applications', 'B.C.A. Second Semester'),
  ('MAP_37', 'Computer Applications (AI & ML)', 'B.C.A. Second Semester'),
  ('MAP_38', 'History', 'B.A. Second Semester'),
  ('MAP_39', 'Economics', 'B.A. / B.Sc. Second Semester'),
  ('MAP_40', 'Economics', 'B.A. & B.Sc. Second Semester'),
  ('MAP_41', 'Political Science', 'B.A. Second Semester'),
  ('MAP_42', 'Psychology', 'B.Sc. / B.A. Second Semester'),
  ('MAP_43', 'Psychology', 'B.A. / B.Sc. Second Semester'),
  ('MAP_44', 'Computer Animation', 'B.A. / B.Sc. Second Semester'),
  ('MAP_45', 'Journalism and Mass Communication', 'B.A. Second Semester'),
  ('MAP_46', 'Secretarial Practice', 'B.A. Second Semester');

CREATE TEMP TABLE subject_import_source (
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mapping_key TEXT NOT NULL REFERENCES subject_import_mapping (mapping_key)
) ON COMMIT DROP;

INSERT INTO subject_import_source (subject_code, subject_name, mapping_key)
VALUES
  ('24PHYC201', 'Mechanics and Thermal Physics', 'MAP_01'),
  ('24BOTC201', 'Fungi and Cryptogams', 'MAP_02'),
  ('24MICC201', 'Microbial Diversity', 'MAP_03'),
  ('21MATC201', 'Number Theory, Algebra, Calculus II', 'MAP_04'),
  ('24MATC201', 'Number Theory and Calculus', 'MAP_04'),
  ('24STAC201', 'Probability Distributions', 'MAP_05'),
  ('21STAC201', 'Probability and distributions - 1', 'MAP_05'),
  ('25DSCC202', 'Probability Distributions and Differential Calculus', 'MAP_06'),
  ('21CHEC201', 'Inorganic and Physical Chemistry - I', 'MAP_07'),
  ('24CHEC201', 'General Chemistry-II', 'MAP_07'),
  ('21CSCC201', 'Computer Science Theory II: Data Structures using C', 'MAP_08'),
  ('25DSCC201', 'Data Structures', 'MAP_09'),
  ('25DSCC203', 'Principles of Data Science', 'MAP_09'),
  ('24NHEC201', 'Health And Nutrition for the Family', 'MAP_10'),
  ('24CSCC201', 'Data Structures using C', 'MAP_08'),
  ('24ZOOC201', 'Zoomorphology II', 'MAP_11'),
  ('21ZOOC201', 'Biochemistry and Physiology', 'MAP_11'),
  ('21COMC201', 'Advanced Financial Accounting', 'MAP_12'),
  ('24COMC201', 'Advanced Financial Accounting', 'MAP_12'),
  ('24COMC202', 'Banking in the Digital Age', 'MAP_12'),
  ('24COMC203', 'Marketing Management', 'MAP_12'),
  ('21COMC203 (R)', 'Law and Practice of Banking', 'MAP_12'),
  ('22COMC201 (R)', 'Advanced Financial Accounting', 'MAP_12'),
  ('24COMC211', 'Financial Reporting', 'MAP_12'),
  ('24COMC212', 'Financial Management', 'MAP_12'),
  ('21COMC212', 'International Financial Management I', 'MAP_12'),
  ('24COMC213', 'Leadership and Management', 'MAP_12'),
  ('24COMC221', 'Professional Accounting II', 'MAP_12'),
  ('23COMC222', 'Quantitative Techniques II', 'MAP_12'),
  ('24COMC222', 'Quantitative Techniques - II', 'MAP_12'),
  ('24COMC223', 'Indian Economics', 'MAP_13'),
  ('24COMC263 / 24BBAC223', 'Materials Management', 'MAP_14'),
  ('24COMC233', 'Financial Analytics and Control', 'MAP_12'),
  ('23COMC2E1 (R)', 'Business Mathematics', 'MAP_12'),
  ('23ANME21', 'Advances in Graphic Design', 'MAP_15'),
  ('21MICE21', 'Environmental and Sanitary Microbiology', 'MAP_03'),
  ('24COME21', 'International Trade', 'MAP_12'),
  ('24BBAE22', 'Business Organisation', 'MAP_16'),
  ('24COME23', 'Business and Technology', 'MAP_12'),
  ('21ECOE23', 'Economics of Business Environment', 'MAP_17'),
  ('24COME24', 'Business Law', 'MAP_12'),
  ('24COME25', 'International Financial Reporting', 'MAP_12'),
  ('22ABE201', 'Environmental Studies', 'MAP_18'),
  ('24FRE201', 'General French - II', 'MAP_19'),
  ('21FRE201', 'General French II', 'MAP_19'),
  ('24MAL201', 'General Malayalam - II', 'MAP_20'),
  ('25MAL201', 'General Malayalam II', 'MAP_21'),
  ('24KAN201', 'General Kannada II', 'MAP_22'),
  ('24KAN202', 'General Kannada II', 'MAP_23'),
  ('24KAN203', 'General Kannada II', 'MAP_24'),
  ('24KAN204', 'General Kannada II', 'MAP_25'),
  ('24HIN201', 'General Hindi - II', 'MAP_26'),
  ('21HIN201', 'General Hindi II', 'MAP_26'),
  ('24HIN202', 'General Hindi - II', 'MAP_27'),
  ('24HIN203', 'General Hindi - II', 'MAP_28'),
  ('21HIN203', 'General Hindi II', 'MAP_28'),
  ('24HIN204', 'General Hindi - II', 'MAP_29'),
  ('24HIN205', 'General Hindi - II', 'MAP_30'),
  ('21ENG201', 'Generic English - II', 'MAP_31'),
  ('24ENG201', 'English Language', 'MAP_31'),
  ('24ENMC201', 'Indian Writing in English', 'MAP_31'),
  ('24ENG202', 'English Language', 'MAP_32'),
  ('24ENG203', 'English Language', 'MAP_33'),
  ('24ENG204', 'English Language', 'MAP_34'),
  ('21ENG204', 'Generic English - II', 'MAP_34'),
  ('24ENG205', 'English Language', 'MAP_35'),
  ('21COAC201', 'Data Structures using C', 'MAP_36'),
  ('25COAAC201', 'Data Structures', 'MAP_37'),
  ('24COAC201', 'Data Structures using C', 'MAP_36'),
  ('25COAAC202', 'Data Base Management Systems', 'MAP_37'),
  ('24COAC202', 'Data Base Management Systems', 'MAP_36'),
  ('21COAC202', 'Object Oriented Concepts using JAVA', 'MAP_36'),
  ('24COAC203', 'Discrete Mathematical Structures', 'MAP_36'),
  ('25COAAC203', 'Machine Learning Fundamentals', 'MAP_37'),
  ('21BBAC201', 'Corporate Accounting and Reporting', 'MAP_16'),
  ('24BBAC201', 'Corporate Accounting & Reporting', 'MAP_16'),
  ('24BBAC202', 'International Business', 'MAP_16'),
  ('21BBAC202', 'Human Resource Management', 'MAP_16'),
  ('24BBAC203', 'Human Resource Management', 'MAP_16'),
  ('21BBAC203', 'Business Environment', 'MAP_16'),
  ('24HISC201', 'Ancient India from A.D 400 to A.D 1206', 'MAP_38'),
  ('24ECOC201', 'Macro Economics', 'MAP_39'),
  ('21ECOC201', 'Basic Economics - II', 'MAP_40'),
  ('24PSCC201', 'Paper II: Political Thinkers', 'MAP_41'),
  ('21PSCC201', 'Western Political Thought', 'MAP_41'),
  ('21PSCC202', 'Indian National Movement and Constitutional Development', 'MAP_41'),
  ('24PSYC201', 'Foundations of Behaviour', 'MAP_42'),
  ('21PSYC201', 'Paper II: Foundations of Behaviour', 'MAP_43'),
  ('24ANMC201', 'Introduction to Graphic Design', 'MAP_44'),
  ('24JMCC201', 'Media Practice', 'MAP_45'),
  ('24SEPC201', 'Soft Skills and Personality Development', 'MAP_46');

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
    target.programme_name,
    CASE
      WHEN target.department_label = 'Commerce / Business Administration'
        AND target.programme_name = 'Bachelor of Business Administration'
        THEN 'Business Administration'
      WHEN target.department_label = 'Commerce / Business Administration' THEN 'Commerce'
      WHEN target.department_label = 'Economics / Commerce'
        AND target.programme_name = 'Bachelor of Commerce' THEN 'Commerce'
      WHEN target.department_label = 'Statistics / Data Science' THEN 'Data Science'
      WHEN target.department_label = 'Animation' THEN 'Computer Animation'
      WHEN target.department_label = 'Computer Applications (AI & ML)' THEN 'Computer Applications'
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
  );

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Inserted % subject rows; existing code/semester pairs were left unchanged.', inserted_count;
END
$insert$;

COMMIT;
