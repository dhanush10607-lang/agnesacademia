-- Inserts the supplied 2026-2027 curricula under existing programmes.
-- Re-running this script skips curricula that already exist for the same programme and code.
BEGIN;

CREATE TEMP TABLE curriculum_import_2026_2027 (
  programme_name TEXT NOT NULL,
  curriculum_name TEXT NOT NULL,
  code TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  description TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO curriculum_import_2026_2027 (programme_name, curriculum_name, code, academic_year, description)
VALUES
  ('Bachelor of Arts', 'History / Economics / Political Science', 'BA-HEP', '2026-2027', 'Covers historical developments, economic models, and political governance, ideal for civil services and public administration.'),
  ('Bachelor of Arts', 'History / Economics / Psychology', 'BA-HEPs', '2026-2027', 'Bridges socio-economic analysis, historical contexts, and human behavioral dynamics.'),
  ('Bachelor of Arts', 'History / Economics / Secretarial Practice', 'BA-HES', '2026-2027', 'Combines historical perspectives and economic theory with executive office and administrative management.'),
  ('Bachelor of Arts', 'History / Psychology / English Major', 'BA-HPE', '2026-2027', 'Merges human behavior and literary critical analysis with global and national histories.'),
  ('Bachelor of Arts', 'History / Psychology / Secretarial Practice', 'BA-HPS', '2026-2027', 'Integrates behavioral studies and executive office operations within historical contexts.'),
  ('Bachelor of Arts', 'History / Political Science / Secretarial Practice', 'BA-HPSS', '2026-2027', 'Focuses on administrative systems, political theory, and professional office governance.'),
  ('Bachelor of Arts', 'Journalism and Mass Communication / Economics / Political Science', 'BA-JEP', '2026-2027', 'Prepares students for political journalism, economic reporting, and public affairs analysis.'),
  ('Bachelor of Arts', 'Journalism and Mass Communication / Economics / Computer Animation', 'BA-JEC', '2026-2027', 'Integrates digital media, visual storytelling, and animation with economic fundamentals.'),
  ('Bachelor of Arts', 'Journalism and Mass Communication / Psychology / English Major', 'BA-JPE', '2026-2027', 'Focuses on media communication, advanced writing, and behavioral insights for editorial and PR careers.'),
  ('Bachelor of Arts', 'Journalism and Mass Communication / Political Science / English Major', 'BA-JPIE', '2026-2027', 'Emphasizes political reporting, media ethics, and advanced English rhetoric.'),
  ('Bachelor of Arts', 'Journalism and Mass Communication / English Major / Computer Animation', 'BA-JECA', '2026-2027', 'Combines creative writing, visual animation, and multimedia broadcast storytelling.'),
  ('Bachelor of Arts', 'Public Policy / Economics / Political Science', 'BA-PPE', '2026-2027', 'Focuses on policy analysis, economic evaluation, governance, and legislative systems.'),
  ('Bachelor of Arts', 'Public Policy / English Major / Political Science', 'BA-PPIE', '2026-2027', 'Blends public policy formulation, political theory, and professional communication.'),
  ('Bachelor of Arts', 'Public Policy / English Major / Psychology', 'BA-PPyE', '2026-2027', 'Explores public policy design through the lens of human behavior and critical discourse.'),
  ('Bachelor of Science', 'Physics / Chemistry / Mathematics', 'BSC-PCM', '2026-2027', 'Classical foundational science combination preparing students for research, physical sciences, and analytics.'),
  ('Bachelor of Science', 'Physics / Mathematics / Computer Science', 'BSC-PMC', '2026-2027', 'Focuses on computing architecture, computational physics, and applied mathematical logic.'),
  ('Bachelor of Science', 'Mathematics / Statistics / Computer Science', 'BSC-MSC', '2026-2027', 'Emphasizes statistical computing, algorithmic logic, and software development for tech and analytics.'),
  ('Bachelor of Science', 'Mathematics / Statistics / Economics', 'BSC-MSE', '2026-2027', 'Quantitative focus combining econometrics, actuarial principles, and financial data modeling.'),
  ('Bachelor of Science', 'Statistics / Computer Animation / Computer Science', 'BSC-SCA', '2026-2027', 'Merges statistical computing, software tools, and digital 2D/3D graphics programming.'),
  ('Bachelor of Science', 'Botany / Zoology / Chemistry', 'BSC-BZC', '2026-2027', 'Core life sciences track covering plant biology, animal physiology, and bio-organic chemistry.'),
  ('Bachelor of Science', 'Botany / Zoology / Psychology', 'BSC-BZP', '2026-2027', 'Integrates biological sciences and ecological dynamics with behavioral and cognitive study.'),
  ('Bachelor of Science', 'Microbiology / Zoology / Chemistry', 'BSC-MZC', '2026-2027', 'Covers microbial pathology, animal physiology, and chemical assays for healthcare and diagnostic labs.'),
  ('Bachelor of Science', 'Microbiology / Zoology / Psychology', 'BSC-MZP', '2026-2027', 'Explores disease mechanics, physiological systems, and neuro-behavioral interactions.'),
  ('Bachelor of Science', 'Microbiology / Chemistry / Nutrition and Health Education', 'BSC-MCN', '2026-2027', 'Focuses on food biochemistry, clinical dietetics, and microbiological safety standards.'),
  ('Bachelor of Science', 'Microbiology / Psychology / Nutrition and Health Education', 'BSC-MPN', '2026-2027', 'Combines community wellness, nutritional physiology, mental health, and pathology.'),
  ('Bachelor of Science', 'Climate Science / Biostatistics / Chemistry', 'BSC-CSBC', '2026-2027', 'Addresses environmental dynamics, climate modeling, bio-chemical testing, and data analysis.'),
  ('Bachelor of Science', 'Climate Science / Zoology / Chemistry', 'BSC-CSZC', '2026-2027', 'Studies climate impacts on biodiversity, ecological systems, and environmental chemistry.'),
  ('Bachelor of Science', 'Bioinformatics / Biostatistics / Botany', 'BSC-BIBB', '2026-2027', 'Emphasizes computational biology, genetic sequence analysis, and botanical biometrics.'),
  ('Bachelor of Science', 'Bioinformatics / Biostatistics / Psychology', 'BSC-BIBP', '2026-2027', 'Applies computational data science and statistical biometrics to cognitive and behavioral research.'),
  ('Bachelor of Science (Data Science)', 'B.Sc. - Data Science', 'BSC-DS', '2026-2027', 'Dedicated program combining computational statistics, predictive modeling, machine learning, and data analytics.'),
  ('Bachelor of Commerce', 'B.Com. General', 'BCOM-GEN', '2026-2027', 'Comprehensive grounding in financial accounting, auditing, corporate taxation, and banking practices.'),
  ('Bachelor of Commerce', 'B.Com. with Business Process Services (BPS)', 'BCOM-BPS', '2026-2027', 'Industry-integrated corporate operations and process management curriculum in collaboration with TCS.'),
  ('Bachelor of Commerce', 'B.Com. with ACCA (UK)', 'BCOM-ACCA', '2026-2027', 'Integrated global chartered accountancy curriculum with exemptions for ACCA papers.'),
  ('Bachelor of Commerce', 'B.Com. Professional (CA)', 'BCOM-PRO', '2026-2027', 'Designed for students preparing concurrently for Chartered Accountancy (ICAI) foundations.'),
  ('Bachelor of Commerce', 'B.Com. with CMA (USA)', 'BCOM-CMA', '2026-2027', 'Focuses on international management accounting, cost management, and corporate financial strategy.'),
  ('Bachelor of Commerce', 'B.Com. with Business Analytics', 'BCOM-BA', '2026-2027', 'Blends financial accounting with corporate data analytics, reporting tools, and business intelligence.'),
  ('Bachelor of Commerce', 'B.Com. with Financial Technology (FINTECH)', 'BCOM-FIN', '2026-2027', 'Covers digital banking, blockchain, financial software, and tech-driven financial services.'),
  ('Bachelor of Commerce', 'B.Com. with Logistics & Supply Chain Management (LSCM)', 'BCOM-LSCM', '2026-2027', 'Focuses on global trade operations, procurement, freight logistics, and inventory systems.'),
  ('Bachelor of Commerce', 'B.Com. with Enterprise Resource Planning (ERP)', 'BCOM-ERP', '2026-2027', 'Focuses on integrated enterprise management software, operations workflows, and corporate systems.'),
  ('Bachelor of Commerce', 'B.Com. with Artificial Intelligence (AI)', 'BCOM-AI', '2026-2027', 'Equips commerce graduates with automated accounting, AI-driven financial modeling, and predictive tools.'),
  ('Bachelor of Business Administration', 'B.B.A. General', 'BBA-GEN', '2026-2027', 'Delivers fundamental executive training across marketing, finance, human resources, and operations.'),
  ('Bachelor of Business Administration', 'B.B.A. with Aviation', 'BBA-AVN', '2026-2027', 'Prepares students for airport administration, airline logistics, passenger handling, and hospitality management.'),
  ('Bachelor of Business Administration', 'B.B.A. with CMA (USA)', 'BBA-CMA', '2026-2027', 'Combines managerial leadership training with US-aligned strategic cost and management accounting.'),
  ('Bachelor of Business Administration', 'B.B.A. with Business Analytics', 'BBA-BA', '2026-2027', 'Trains future managers in data-backed decision-making, predictive dashboards, and market analytics.'),
  ('Bachelor of Business Administration', 'B.B.A. with Logistics & Supply Chain Management (LSCM)', 'BBA-LSCM', '2026-2027', 'Covers strategic freight distribution, supply network management, and global trade workflows.'),
  ('Bachelor of Business Administration', 'B.B.A. with Artificial Intelligence (AI)', 'BBA-AI', '2026-2027', 'Focuses on executive management, AI-driven automation, and technology strategy in corporate enterprises.'),
  ('Bachelor of Computer Applications', 'B.C.A General', 'BCA-GEN', '2026-2027', 'Comprehensive curriculum covering core programming (C++, Java, Python), database architectures, web engineering, and software development.'),
  ('Bachelor of Computer Applications', 'B.C.A - Artificial Intelligence and Machine Learning', 'BCA-AIML', '2026-2027', 'Advanced computing track focusing on neural networks, predictive algorithms, NLP, computer vision, and machine learning pipelines.');

DO $$
DECLARE
  unresolved_programmes TEXT;
BEGIN
  SELECT string_agg(programme_name, ', ' ORDER BY programme_name)
  INTO unresolved_programmes
  FROM (
    SELECT DISTINCT source.programme_name
    FROM curriculum_import_2026_2027 AS source
    WHERE (
      SELECT count(*)
      FROM public.programmes AS programme
      WHERE programme.name = source.programme_name
    ) <> 1
  ) AS unresolved;

  IF unresolved_programmes IS NOT NULL THEN
    RAISE EXCEPTION 'Expected exactly one matching programme for each curriculum. Missing or ambiguous programme names: %', unresolved_programmes;
  END IF;
END $$;

INSERT INTO public.curricula (programme_id, name, code, academic_year, description, is_active)
SELECT programme.id, source.curriculum_name, source.code, source.academic_year, source.description, TRUE
FROM curriculum_import_2026_2027 AS source
JOIN public.programmes AS programme ON programme.name = source.programme_name
WHERE NOT EXISTS (
  SELECT 1
  FROM public.curricula AS existing
  WHERE existing.programme_id = programme.id
    AND existing.code = source.code
);

COMMIT;
