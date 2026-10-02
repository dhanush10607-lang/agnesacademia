-- Massive Seed Script for All Extracted Subjects
DO $$
DECLARE
    -- Foundation Programme
    dept_eng UUID;
    prog_found UUID;
    
    -- Variables for looping
    prog_id UUID;
    year_id UUID;
    sem_id UUID;
BEGIN
    -- Ensure Foundation Programme exists
    SELECT id INTO dept_eng FROM public.departments WHERE name = 'Department of English' LIMIT 1;
    IF dept_eng IS NULL THEN
        INSERT INTO public.departments (name, description) VALUES ('Department of English', 'Languages') RETURNING id INTO dept_eng;
    END IF;
    
    INSERT INTO public.programmes (department_id, name, description) 
    SELECT dept_eng, 'Foundation Courses', 'Common language and ethics courses' 
    WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'Foundation Courses')
    RETURNING id INTO prog_found;
    
    IF prog_found IS NULL THEN
        SELECT id INTO prog_found FROM public.programmes WHERE name = 'Foundation Courses' LIMIT 1;
    END IF;

    -- ================= PROGRAMME: Foundation Courses =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'Foundation Courses' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC101', 'Reading Literature' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENG101', 'English Language' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENG101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24KAN101', 'General Kannada I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24KAN101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HIN102', 'General Hindi I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HIN102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24FRE101', 'General French I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24FRE101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25MAL101', 'General Malayalam I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25MAL101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHV101', 'Constitutional Human Values' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHV101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC201', 'Indian Writing in English' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENG201', 'English Language' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENG201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24KAN201', 'General Kannada II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24KAN201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HIN201', 'General Hindi II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HIN201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24FRE201', 'General French II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24FRE201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25MAL201', 'General Malayalam II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25MAL201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHV201', 'Gender and Environmental Studies' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHV201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC301', 'British Literature: 1800 Onwards' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENG301', 'Generic English III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENG301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24KAN301', 'General Kannada III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24KAN301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HIN301', 'General Hindi III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HIN301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24FRE301', 'General French III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24FRE301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25MAL301', 'General Malayalam III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25MAL301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC401', 'Indian Literature in Translation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENG401', 'Generic English IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENG401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24KAN401', 'General Kannada IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24KAN401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HIN401', 'General Hindi IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HIN401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24FRE401', 'General French IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24FRE401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25MAL401', 'General Malayalam IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25MAL401');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC501', 'Literary Theory and Criticism' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ENMC502', 'Literature of the Marginalised' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ENMC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ENMC601', 'Post Colonial Studies' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ENMC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ENMC602', 'World Literatures in Translation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ENMC602');

    END IF;

    -- ================= PROGRAMME: B.A. History =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.A. History' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC101', 'Ancient India from beginning to A.D 400' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC201', 'Ancient India from A.D 400 to A.D 1206' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC301', 'Medieval India from A.D.1206 to A.D. 1526' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC401', 'Medieval India from A.D.1526 to A.D. 1707' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISSKL1', 'Cultural Heritage and Tourism' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC501', 'Modern India from A.D 1707 to 1857' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24HISC502', 'History of Modern Karnataka from A.D 1750 to 1956' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24HISC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21HISC601', 'History of Freedom Movement and Unification of Karnataka' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21HISC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21HISC602', 'History of India (CE 1761- CE 1857)' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21HISC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21HISC603', 'Process of Urbanization in India' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21HISC603');

    END IF;

    -- ================= PROGRAMME: B.A. Economics =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.A. Economics' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC101', 'Micro Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC201', 'Macro Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC301', 'Banking and Insurance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC401', 'International Trade & Finance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOSKL1', 'Economics of Self Employment' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC502', 'Public Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ECOC501', 'Development Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ECOC501');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ECOC601', 'International Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ECOC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ECOC602', 'Indian Public Finance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ECOC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ECOC603', 'Environmental Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ECOC603');

    END IF;

    -- ================= PROGRAMME: B.A. Political Science =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.A. Political Science' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC101', 'Basic Concepts in Political Science' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC201', 'Political Thinkers' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC301', 'Indian Political Thought' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC401', 'Politics, Society and Economy' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC401');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC501', 'Public Administration' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSCC502', 'International Relations' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSCC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PSCC601', 'International Relations-Theoretical Aspects' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PSCC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PSCC602', 'Human Resource Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PSCC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PSCC603', 'Modern Indian Political Thinkers' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PSCC603');

    END IF;

    -- ================= PROGRAMME: B.A. English =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.A. English' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC101', 'Introduction to Mass Communication' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC201', 'Media Practice' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC301', 'Editing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC401', 'Feature and Freelance Journalism' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC401');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC501', 'Advertising' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCC502', 'Public Relation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24JMCSKL1', 'Multimedia Journalism' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24JMCSKL1');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21JMCC601', 'Introduction to Digital Media' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21JMCC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21JMCC602', 'Advertising and Corporate Communication' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21JMCC602');

    END IF;

    -- ================= PROGRAMME: B.A. Psychology =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.A. Psychology' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC101', 'Dynamics of Behaviour' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC201', 'Foundations of Behaviour' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC301', 'Child Development' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC401', 'Life Span Development' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYSKL1', 'Life Skills Education' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC501', 'Social Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PSYC502', 'Abnormal Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PSYC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PSYC601', 'Abnormal Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PSYC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PSYC602', 'Human Resource Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PSYC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Physics =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Physics' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC101', 'Mathematical Physics, Properties of Materials and Relativity' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC201', 'Mechanics and Thermal Physics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC301', 'Acoustics & Optics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC401', 'Electromagnetism & Current Electricity' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYSKL1', 'Electrical appliances' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC501', 'Spectroscopy & Quantum Physics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24PHYC502', 'Solid State Physics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24PHYC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PHYC602', 'Electronic Instrumentation & Sensors' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PHYC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21PHYC601', 'Elements of Condensed Matter & Nuclear Physics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21PHYC601');

    END IF;

    -- ================= PROGRAMME: B.Sc. Botany =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Botany' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC101', 'Microbes and Algae' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC201', 'Fungi and Cryptogams' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC301', 'Phanerogams and Plant systematics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC401', 'Cell biology, Anatomy and Embryology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTSKL1', 'Horticulture and floriculture' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC501', 'Plant Physiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BOTC502', 'Genetics and Molecular biology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BOTC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BOTC601', 'Plant Physiology and Biochemistry' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BOTC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BOTC602', 'Cell Biology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BOTC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Microbiology =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Microbiology' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC101', 'General Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC201', 'Microbial Diversity' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC301', 'Microbial Growth and Biochemistry' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC401', 'Microbial Physiology and Metabolism' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC401');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC501', 'Immunology & Medical Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MICC502', 'Environmental & Agricultural Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MICC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21MICC601', 'Immunology and Medical Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21MICC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21MICC602', 'Industrial Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21MICC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Statistics =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Statistics' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC101', 'Descriptive Statistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC201', 'Probability Distributions' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC301', 'Estimation Theory & Time series Analysis' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC401', 'Sampling Theory' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC401');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC501', 'Statistical Inference' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24STAC502', 'Design and Analysis Experiments' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24STAC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21STAC601', 'Statistical Inference -II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21STAC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21STAC602', 'Sampling Techniques and Statistics for National Development' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21STAC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Data Science =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Data Science' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC102', 'Discrete Mathematics and Descriptive Statistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC101', 'Programming in Python' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC103', 'Computer Fundamentals and Programming in C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC103');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC202', 'Probability Distributions and Differential Calculus' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC203', 'Principles of Data Science' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC203');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC201', 'Data Structures' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC301', 'Machine Learning' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC302', 'Statistical Inference' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCC303', 'Linear Algebra' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCC303');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25DSCE31', 'Medical Image Processing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25DSCE31');

    END IF;

    -- ================= PROGRAMME: B.Sc. Chemistry =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Chemistry' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC101', 'General Chemistry - I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC101', 'Fundamentals of Nutrition and Food Science' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC201', 'General Chemistry - II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC201', 'Health And Nutrition for the Family' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC301', 'General Chemistry - III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC301', 'Introduction to Food Safety' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC401', 'General Chemistry - IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC401', 'Public Health Nutrition' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHESKL1', 'Diet Counseling' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHESKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC501', 'General Chemistry - V' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHEC502', 'General Chemistry - VI' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHEC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC501', 'Therapeutic Nutrition' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24NHEC502', 'Entrepreneurship For Small Catering Units' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24NHEC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CHESKL1', 'Analytical Chemistry' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CHESKL1');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21CHEC601', 'Inorganic and Physical Chemistry-IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21CHEC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21CHEC602', 'Organic Chemistry and Spectroscopy-II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21CHEC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21NHEC601', 'Functional Foods and Nutraceuticals' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21NHEC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21NHEC602', 'Food Preservation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21NHEC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Mathematics =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Mathematics' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC101', 'Calculus and Analytical Geometry' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC201', 'Number Theory and Calculus' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC301', 'Sequences, Series and Differential Equations' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC401', 'Algebra and Complex Analysis' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATSKL1', 'Quantitative Mathematics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC501', 'Algebra and Laplace Transforms' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24MATC502', 'Graph Theory' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24MATC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21MATC601', 'Linear Algebra' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21MATC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21MATC602', 'Numerical Analysis' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21MATC602');

    END IF;

    -- ================= PROGRAMME: B.Sc. Zoology =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Zoology' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC101', 'Zoo Morphology I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC101');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC201', 'Zoomorphology II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC201');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC301', 'Physiology, Biochemistry and Immunology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC401', 'Endocrinology, Histology, Animal Behavior and Applied Zoology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOSKL1', 'Zoology and entrepreneurship' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC501', 'Cell Biology, Molecular Biology and Genetic Engineering' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ZOOC502', 'Reproductive Biology and Developmental Biology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ZOOC502');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ZOOC601', 'Evolutionary and Developmental Biology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ZOOC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21ZOOC602', 'Environmental Biology, Wildlife Management and Conservation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21ZOOC602');

    END IF;

    -- ================= PROGRAMME: B.Com. =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Com.' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC101', 'Financial Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC111', 'International Financial Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC111');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC121', 'Professional Accounting I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC121');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC102', 'Principles of Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC112', 'Management Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC112');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC122', 'Quantitative Techniques I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC122');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC132', 'Financial Planning and Performance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC132');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC162', 'Essentials of Logistics and Supply Chain Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC162');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC103', 'Corporate Etiquette and Soft Skills' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC103');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '26COMC113', 'Financial Management I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '26COMC113');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC123', 'Business Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC123');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPC101', 'Executive Secretarial System' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME11', 'Business Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME11');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '26COME13', 'Corporate Communication and Professional Skills' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '26COME13');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME14', 'Mercantile Law' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME14');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC201', 'Advanced Financial Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC211', 'Financial Reporting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC211');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC221', 'Professional Accounting II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC221');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC212', 'Financial Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC212');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC222', 'Quantitative Techniques II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC222');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC233', 'Financial Analytics and Control' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC233');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC263', 'Materials Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC263');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC203', 'Marketing Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC203');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC223', 'Indian Economics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC223');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC202', 'Banking in the Digital Age' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME21', 'International Trade' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME21');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC213', 'Leadership and Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC213');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME24', 'Business Law' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME24');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME25', 'International Financial Reporting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME25');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPC201', 'Soft Skills and Personality Development' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COME23', 'Business and Technology' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COME23');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC301', 'Corporate Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC311', 'Audit and Assurance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC311');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC321', 'Professional Accounting III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC321');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC302', 'Cost Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC312', 'Strategic Business Reporting I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC312');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC322', 'Income Tax I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC322');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC303', 'Business Statistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC303');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC323', 'Goods and Service Tax I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC323');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC333', 'Strategic Corporate Finance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC333');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMDSE31', 'Organizational Leadership' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMDSE31');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMDSE32', 'Personal Finance and Investment Planning' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMDSE32');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMDSE33', 'Corporate Law I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMDSE33');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC401', 'Advanced Corporate Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC411', 'Strategic Business Leader' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC411');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC421', 'Professional Accounting IV' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC421');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC402', 'Costing Methods and Techniques' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC402');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC412', 'Strategic Business Reporting II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC412');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC422', 'Income Tax II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC422');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC403', 'Human Resource Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC403');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC423', 'Goods and Service Tax II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC423');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC413', 'Investment Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC413');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC433', 'Strategic Investment and Risk Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC433');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC463', 'Production and Operations Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC463');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPC401', 'Business Communication and Correspondence' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMSKL1', 'Professional Ethics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC501', 'Financial Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC511', 'Advanced Financial Management I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC511');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC521', 'Cost and Management Accounting I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC521');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC502', 'Income Tax Law and Practice I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC522', 'Principles and Practice of Auditing I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC522');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC503', 'Audit and assurance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC503');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC523', 'Strategic Financial Management I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC523');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC524', 'Strategies for Business I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC524');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC513', 'Advanced Audit and Assurance I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC513');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC563', 'Maritime Logistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC563');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC504', 'Business Law' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC504');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMC514', 'Forensic Accounting and Auditing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMC514');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPC501', 'Company Secretary and Meetings' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPC502', 'Fundamentals of Accountancy' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMDSE51', 'GST-Law & Practice' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMDSE51');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMDSE52', 'Digital Marketing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMDSE52');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24SEPSKL1', 'Personal Income Tax Concepts & Computation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24SEPSKL1');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COMSKL51', 'Employability Skills' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COMSKL51');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC601', 'Management Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COMC611', 'Advanced Audit and Assurance II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COMC611');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '23COMC621', 'Cost and Management Accounting II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '23COMC621');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC602', 'Income Tax Law and Practice-II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC612', 'Advanced Financial Management II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC612');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '23COMC622', 'Principles and Practice of Auditing II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '23COMC622');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC603', 'Advanced Financial Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC603');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC613', 'Strategic Business Reporting II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC613');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '23COMC623', 'Strategies for Business' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '23COMC623');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMC633', 'Campus to Corporate' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMC633');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMDS602', 'Investment Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMDS602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMDS604', 'Customer Relationship Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMDS604');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMDS601', 'Cultural Diversity at Work Place' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMDS601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMVC61', 'Assessment of persons other than Individuals & Filing of ITRs' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMVC61');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COMVC62', 'E- Commerce' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COMVC62');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21SEPC601', 'Personal Investment and Tax Planning' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21SEPC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21SEPC602', 'Innovative Banking' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21SEPC602');

    END IF;

    -- ================= PROGRAMME: B.B.A. =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.B.A.' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC101', 'Fundamentals of Business Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC123', 'Essentials of Logistics and Supply Chain Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC123');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC103', 'Marketing Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC103');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '26BBAC133', 'Introduction to Aviation Industry and Organization' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '26BBAC133');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC102', 'Principles & Practices of Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAE11', 'Business Communication' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAE11');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '26BBAE13', 'Personality Enhancement' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '26BBAE13');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC201', 'Corporate Accounting & Reporting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC223', 'Materials Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC223');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC203', 'Human Resource Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC203');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC202', 'International Business' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAE21', 'Business Organization' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAE21');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC301', 'Cost Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC303', 'Financial Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC303');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC302', 'Banking Law and Practice' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAE31', 'Principles of Insurance' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAE31');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBADSE31', 'Social Media Marketing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBADSE31');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC401', 'Statistics for Business Decisions' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC403', 'Management Accounting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC403');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC402', 'Organizational Behavior' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC402');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC413', 'Strategic Investment And Risk Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC413');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC423', 'Production and Operations Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC423');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBASKL41', 'Financial Education and Investment Awareness' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBASKL41');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC501', 'Export Import Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC503', 'Entrepreneurship & Small Business Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC503');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC502', 'Income Tax' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC523', 'Maritime Logistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC523');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC514', 'Forensic Accounting and Auditing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC514');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBAC504', 'Freight & Transportation Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBAC504');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBADSE51', 'Advanced Financial Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBADSE51');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBADSE52', 'Consumer Behavior' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBADSE52');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24BBASKL51', 'Digital Marketing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24BBASKL51');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBAC601', 'Business Laws' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBAC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBAC602', 'Income Tax-II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBAC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBAC603', 'International Business' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBAC603');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBADS625', 'Logistics And Supply Chain Management - Sourcing for Logistics and SCM' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBADS625');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBADS604', 'Security Analysis and Portfolio Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBADS604');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBADS614', 'Marketing-Advertising & Media Management' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBADS614');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21BBAVC 61', 'Goods & Services Tax (GST)' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21BBAVC 61');

    END IF;

    -- ================= PROGRAMME: B.C.A. =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.C.A.' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- I Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'I Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'I Year' LIMIT 1; END IF;

        -- Semester 1
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 1' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 1' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC101', 'Fundamentals of Computers' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC101', 'Fundamentals of Computers and Programing in C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC102', 'Programming in C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC102', 'Introduction to Artificial Intelligence' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC103', 'Mathematical Foundation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC103');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC103', 'Mathematical Foundation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC103');

        -- Semester 2
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 2' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 2' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC201', 'Data Structures using C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC201', 'Data Structures using C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC202', 'Data Base Management Systems' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC202', 'Data Base Management Systems' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC203', 'Discrete Mathematical Structures' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC203');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC203', 'Machine Learning Fundamentals' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC203');

        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC301', 'Object Oriented Programming with Java' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC301', 'Python Programming' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC302', 'C# and DOT NET Framework' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC302', 'Deep Learning & Neural Networks' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC303', 'Computer Communication and Networks' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC303');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '25COAAC303', 'Statistical Methods and Data Analytics for AI' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '25COAAC303');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC401', 'PHP and MySQL' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC402', 'Advanced java' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC402');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC403', 'Operating Systems Concepts' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC403');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COASKL1', 'Advanced Excel' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COASKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC501', 'Internet Technologies' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC502', 'Python Programming' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC503', 'Statistical Computing and R Programming' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC503');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC504', 'Software Engineering' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC504');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC505', 'Cloud Computing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC505');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COAC506', 'Digital Marketing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COAC506');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24COASKL2', 'Data Visualization with Power BI and Tableau' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24COASKL2');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COAC603', 'Advanced JAVA and J2EE' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COAC603');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COAC601', 'PHP and MySQL' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COAC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COAVC61', 'Web Content Management System' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COAVC61');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COAC602', 'Artificial Intelligence and Applications' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COAC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21COADS 601', 'Fundamentals of Data Science' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21COADS 601');

    END IF;

    -- ================= PROGRAMME: B.Sc. Computer Science =================
    SELECT id INTO prog_id FROM public.programmes WHERE name = 'B.Sc. Computer Science' LIMIT 1;
    IF prog_id IS NOT NULL THEN
        -- II Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'II Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'II Year' LIMIT 1; END IF;

        -- Semester 3
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 3' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 3' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ANMC301', '2D Animation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ANMC301');

        -- Semester 4
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 4' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 4' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ANMC401', '3D Modelling & Texturing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ANMC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CSCC401', 'Database Management Systems' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CSCC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ANMSKL1', 'Film Production Process' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ANMSKL1');

        -- III Year
        INSERT INTO public.academic_years (programme_id, name) SELECT prog_id, 'III Year' WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year') RETURNING id INTO year_id;
        IF year_id IS NULL THEN SELECT id INTO year_id FROM public.academic_years WHERE programme_id = prog_id AND name = 'III Year' LIMIT 1; END IF;

        -- Semester 5
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 5' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 5' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ANMC501', '3D Animation & Dynamics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ANMC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24ANMC502', 'Video Compositing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24ANMC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CSCC501', 'Programming in Python' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CSCC501');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CSCC502', 'C# and .Net Framework' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CSCC502');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '24CSCSKL1', 'Web Designing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '24CSCSKL1');

        -- Semester 6
        INSERT INTO public.semesters (academic_year_id, name) SELECT year_id, 'Semester 6' WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6') RETURNING id INTO sem_id;
        IF sem_id IS NULL THEN SELECT id INTO sem_id FROM public.semesters WHERE academic_year_id = year_id AND name = 'Semester 6' LIMIT 1; END IF;

        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '22ANMC601', '3D Rigging & Animation' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '22ANMC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '22ANMC602', 'Surfacing & Lighting' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '22ANMC602');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21CSCC601', 'Web Technologies' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21CSCC601');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem_id, '21CSCC602', 'Statistical Computing & R Programming' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem_id AND code = '21CSCC602');

    END IF;

END $$;
