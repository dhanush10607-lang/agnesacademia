DO $$
DECLARE
    -- Science
    dept_botany UUID;
    dept_chemistry UUID;
    dept_cs UUID;
    dept_math UUID;
    dept_micro UUID;
    dept_physics UUID;
    dept_stats UUID;
    dept_zoology UUID;
    
    -- Humanities & Languages
    dept_english UUID;
    dept_hindi UUID;
    dept_kannada UUID;
    dept_french UUID;
    dept_malayalam UUID;
    dept_economics UUID;
    dept_history UUID;
    dept_polisci UUID;
    dept_psychology UUID;
    
    -- Commerce
    dept_commerce UUID;
    dept_bba UUID;
    dept_sec_prac UUID;
    
    -- Other
    dept_phys_ed UUID;
BEGIN
    -- 1. INSERT DEPARTMENTS (Ignore if exact name already exists)
    
    -- Science
    INSERT INTO public.departments (name, description) SELECT 'Department of Botany', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Botany') RETURNING id INTO dept_botany;
    INSERT INTO public.departments (name, description) SELECT 'Department of Chemistry', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Chemistry') RETURNING id INTO dept_chemistry;
    INSERT INTO public.departments (name, description) SELECT 'Department of Computer Science & Applications', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Computer Science & Applications') RETURNING id INTO dept_cs;
    INSERT INTO public.departments (name, description) SELECT 'Department of Mathematics', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Mathematics') RETURNING id INTO dept_math;
    INSERT INTO public.departments (name, description) SELECT 'Department of Microbiology', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Microbiology') RETURNING id INTO dept_micro;
    INSERT INTO public.departments (name, description) SELECT 'Department of Physics', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Physics') RETURNING id INTO dept_physics;
    INSERT INTO public.departments (name, description) SELECT 'Department of Statistics', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Statistics') RETURNING id INTO dept_stats;
    INSERT INTO public.departments (name, description) SELECT 'Department of Zoology', 'Science & Technology' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Zoology') RETURNING id INTO dept_zoology;
    
    -- Humanities
    INSERT INTO public.departments (name, description) SELECT 'Department of English', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of English') RETURNING id INTO dept_english;
    INSERT INTO public.departments (name, description) SELECT 'Department of Hindi', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Hindi') RETURNING id INTO dept_hindi;
    INSERT INTO public.departments (name, description) SELECT 'Department of Kannada', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Kannada') RETURNING id INTO dept_kannada;
    INSERT INTO public.departments (name, description) SELECT 'Department of French', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of French') RETURNING id INTO dept_french;
    INSERT INTO public.departments (name, description) SELECT 'Department of Malayalam', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Malayalam') RETURNING id INTO dept_malayalam;
    INSERT INTO public.departments (name, description) SELECT 'Department of Economics', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Economics') RETURNING id INTO dept_economics;
    INSERT INTO public.departments (name, description) SELECT 'Department of History', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of History') RETURNING id INTO dept_history;
    INSERT INTO public.departments (name, description) SELECT 'Department of Political Science', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Political Science') RETURNING id INTO dept_polisci;
    INSERT INTO public.departments (name, description) SELECT 'Department of Psychology', 'Languages & Humanities' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Psychology') RETURNING id INTO dept_psychology;

    -- Commerce & Management
    INSERT INTO public.departments (name, description) SELECT 'Department of Commerce', 'Commerce & Management' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Commerce') RETURNING id INTO dept_commerce;
    INSERT INTO public.departments (name, description) SELECT 'Department of Business Administration', 'Commerce & Management' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Business Administration') RETURNING id INTO dept_bba;
    INSERT INTO public.departments (name, description) SELECT 'Department of Secretarial Practice', 'Commerce & Management' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Secretarial Practice') RETURNING id INTO dept_sec_prac;
    
    -- Other
    INSERT INTO public.departments (name, description) SELECT 'Department of Physical Education', 'Specialized' WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE name = 'Department of Physical Education') RETURNING id INTO dept_phys_ed;

    -- Fallback for fetching IDs if ON CONFLICT DO NOTHING suppressed the RETURNING clause
    IF dept_botany IS NULL THEN SELECT id INTO dept_botany FROM public.departments WHERE name = 'Department of Botany'; END IF;
    IF dept_chemistry IS NULL THEN SELECT id INTO dept_chemistry FROM public.departments WHERE name = 'Department of Chemistry'; END IF;
    IF dept_cs IS NULL THEN SELECT id INTO dept_cs FROM public.departments WHERE name = 'Department of Computer Science & Applications'; END IF;
    IF dept_math IS NULL THEN SELECT id INTO dept_math FROM public.departments WHERE name = 'Department of Mathematics'; END IF;
    IF dept_micro IS NULL THEN SELECT id INTO dept_micro FROM public.departments WHERE name = 'Department of Microbiology'; END IF;
    IF dept_physics IS NULL THEN SELECT id INTO dept_physics FROM public.departments WHERE name = 'Department of Physics'; END IF;
    IF dept_stats IS NULL THEN SELECT id INTO dept_stats FROM public.departments WHERE name = 'Department of Statistics'; END IF;
    IF dept_zoology IS NULL THEN SELECT id INTO dept_zoology FROM public.departments WHERE name = 'Department of Zoology'; END IF;
    
    IF dept_english IS NULL THEN SELECT id INTO dept_english FROM public.departments WHERE name = 'Department of English'; END IF;
    IF dept_hindi IS NULL THEN SELECT id INTO dept_hindi FROM public.departments WHERE name = 'Department of Hindi'; END IF;
    IF dept_kannada IS NULL THEN SELECT id INTO dept_kannada FROM public.departments WHERE name = 'Department of Kannada'; END IF;
    IF dept_french IS NULL THEN SELECT id INTO dept_french FROM public.departments WHERE name = 'Department of French'; END IF;
    IF dept_malayalam IS NULL THEN SELECT id INTO dept_malayalam FROM public.departments WHERE name = 'Department of Malayalam'; END IF;
    IF dept_economics IS NULL THEN SELECT id INTO dept_economics FROM public.departments WHERE name = 'Department of Economics'; END IF;
    IF dept_history IS NULL THEN SELECT id INTO dept_history FROM public.departments WHERE name = 'Department of History'; END IF;
    IF dept_polisci IS NULL THEN SELECT id INTO dept_polisci FROM public.departments WHERE name = 'Department of Political Science'; END IF;
    IF dept_psychology IS NULL THEN SELECT id INTO dept_psychology FROM public.departments WHERE name = 'Department of Psychology'; END IF;

    IF dept_commerce IS NULL THEN SELECT id INTO dept_commerce FROM public.departments WHERE name = 'Department of Commerce'; END IF;
    IF dept_bba IS NULL THEN SELECT id INTO dept_bba FROM public.departments WHERE name = 'Department of Business Administration'; END IF;
    IF dept_sec_prac IS NULL THEN SELECT id INTO dept_sec_prac FROM public.departments WHERE name = 'Department of Secretarial Practice'; END IF;

    -- 2. INSERT PROGRAMMES (Using the Fetched/Generated Dept IDs)
    
    -- UG Sciences
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_physics, 'B.Sc. Physics', 'Undergraduate Degree in Physics' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Physics');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_chemistry, 'B.Sc. Chemistry', 'Undergraduate Degree in Chemistry' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Chemistry');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_math, 'B.Sc. Mathematics', 'Undergraduate Degree in Mathematics' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Mathematics');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_botany, 'B.Sc. Botany', 'Undergraduate Degree in Botany' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Botany');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_zoology, 'B.Sc. Zoology', 'Undergraduate Degree in Zoology' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Zoology');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_micro, 'B.Sc. Microbiology', 'Undergraduate Degree in Microbiology' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Microbiology');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_stats, 'B.Sc. Statistics', 'Undergraduate Degree in Statistics' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Statistics');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_cs, 'B.Sc. Computer Science', 'Undergraduate Degree in Computer Science' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Computer Science');
    
    -- UG Arts & Humanities
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_economics, 'B.A. Economics', 'Undergraduate Degree in Economics' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. Economics');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_history, 'B.A. History', 'Undergraduate Degree in History' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. History');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_polisci, 'B.A. Political Science', 'Undergraduate Degree in Political Science' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. Political Science');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_psychology, 'B.A. Psychology', 'Undergraduate Degree in Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. Psychology');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_sec_prac, 'B.A. Secretarial Practice', 'Undergraduate Degree in Secretarial Practice' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. Secretarial Practice');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_english, 'B.A. English', 'Undergraduate Degree in English' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.A. English');

    -- UG Commerce & IT
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_commerce, 'B.Com.', 'Bachelor of Commerce' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Com.');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_bba, 'B.B.A.', 'Bachelor of Business Administration' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.B.A.');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_cs, 'B.C.A.', 'Bachelor of Computer Applications' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.C.A.');

    -- PG Programmes
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_english, 'M.A. English', 'Postgraduate Degree in English' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.A. English');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_commerce, 'M.Com.', 'Master of Commerce' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.Com.');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_chemistry, 'M.Sc. Chemistry', 'Postgraduate Degree in Chemistry' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.Sc. Chemistry');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_psychology, 'M.Sc. Psychology', 'Postgraduate Degree in Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.Sc. Psychology');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_psychology, 'M.Sc. Clinical Psychology', 'Postgraduate Degree in Clinical Psychology' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.Sc. Clinical Psychology');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_cs, 'M.Sc. Big Data Analytics', 'Postgraduate Degree in Big Data Analytics' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'M.Sc. Big Data Analytics');
    INSERT INTO public.programmes (department_id, name, description) SELECT dept_cs, 'B.Sc. Data Science', 'Undergraduate Degree in Data Science' WHERE NOT EXISTS (SELECT 1 FROM public.programmes WHERE name = 'B.Sc. Data Science');

    -- 3. INSERT ACADEMIC YEAR, SEMESTERS, AND SUBJECTS FOR B.Sc. DATA SCIENCE
    DECLARE
        prog_bsc_ds UUID;
        year1_ds UUID;
        year2_ds UUID;
        sem1_ds UUID;
        sem2_ds UUID;
        sem3_ds UUID;
        sem4_ds UUID;
    BEGIN
        -- Get the programme ID
        SELECT id INTO prog_bsc_ds FROM public.programmes WHERE name = 'B.Sc. Data Science' LIMIT 1;
        
        -- Insert Year I
        INSERT INTO public.academic_years (programme_id, name) 
        SELECT prog_bsc_ds, 'I Year' 
        WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_bsc_ds AND name = 'I Year')
        RETURNING id INTO year1_ds;

        IF year1_ds IS NULL THEN
            SELECT id INTO year1_ds FROM public.academic_years WHERE programme_id = prog_bsc_ds AND name = 'I Year' LIMIT 1;
        END IF;

        -- Insert Semester I
        INSERT INTO public.semesters (academic_year_id, name) 
        SELECT year1_ds, 'Semester I' 
        WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year1_ds AND name = 'Semester I')
        RETURNING id INTO sem1_ds;

        IF sem1_ds IS NULL THEN
            SELECT id INTO sem1_ds FROM public.semesters WHERE academic_year_id = year1_ds AND name = 'Semester I' LIMIT 1;
        END IF;

        -- Insert Subjects for Semester I
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '24ENG102', 'English Language' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '24ENG102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '24HIN102', 'General Hindi- I' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '24HIN102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC101', 'Programming in Python' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC101');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC102', 'Discrete Mathematics and Descriptive Statistics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC102');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC103', 'Computer Fundamentals and Programming in C' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC103');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC151', 'Python Programming Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC151');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC152', 'Descriptive Statistics Using Excel Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC152');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, '25DSCC153', 'C Programming Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = '25DSCC153');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, 'ECA 03(b)', 'Extra Curricular Activities (NCC - Air Wing)' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = 'ECA 03(b)');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem1_ds, 'I M09', 'Religion / Human Value Education & Ethics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem1_ds AND code = 'I M09');

        -- Insert Semester II
        INSERT INTO public.semesters (academic_year_id, name) 
        SELECT year1_ds, 'Semester II' 
        WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year1_ds AND name = 'Semester II')
        RETURNING id INTO sem2_ds;

        IF sem2_ds IS NULL THEN
            SELECT id INTO sem2_ds FROM public.semesters WHERE academic_year_id = year1_ds AND name = 'Semester II' LIMIT 1;
        END IF;

        -- Insert Subjects for Semester II
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '24CHV201', 'Gender and Environmental Studies' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '24CHV201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '24ENG202', 'English Language' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '24ENG202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '24HIN202', 'General Hindi- II' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '24HIN202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC201', 'Data Structures' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC201');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC202', 'Probability Distributions and Differential Calculus' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC202');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC203', 'Principles of Data Science' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC203');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC251', 'Data Structure Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC251');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC252', 'R Programming and Statistical Modelling' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC252');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, '25DSCC253', 'Exploratory Data analysis using R' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = '25DSCC253');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, 'ECA 03(b)', 'Extra Curricular Activities (NCC - Air Wing)' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = 'ECA 03(b)');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem2_ds, 'I M09', 'Religion / Human Value Education & Ethics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem2_ds AND code = 'I M09');

        -- Insert Year II
        INSERT INTO public.academic_years (programme_id, name) 
        SELECT prog_bsc_ds, 'II Year' 
        WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE programme_id = prog_bsc_ds AND name = 'II Year')
        RETURNING id INTO year2_ds;

        IF year2_ds IS NULL THEN
            SELECT id INTO year2_ds FROM public.academic_years WHERE programme_id = prog_bsc_ds AND name = 'II Year' LIMIT 1;
        END IF;

        -- Insert Semester III
        INSERT INTO public.semesters (academic_year_id, name) 
        SELECT year2_ds, 'Semester III' 
        WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year2_ds AND name = 'Semester III')
        RETURNING id INTO sem3_ds;

        IF sem3_ds IS NULL THEN
            SELECT id INTO sem3_ds FROM public.semesters WHERE academic_year_id = year2_ds AND name = 'Semester III' LIMIT 1;
        END IF;

        -- Insert Subjects for Semester III
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '24ENG302', 'English Language' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '24ENG302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '24HIN302', 'General Hindi - III' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '24HIN302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC301', 'Machine Learning' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC301');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC302', 'Statistical Inference' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC302');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC303', 'Linear Algebra' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC303');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCE31', 'Medical Image Processing' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCE31');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC351', 'Machine Learning Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC351');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC352', 'Statistical Inference Lab using R' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC352');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, '25DSCC353', 'Data Analysis using SPSS Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = '25DSCC353');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, 'ECA 03(b)', 'Extra Curricular Activities (NCC - Air Wing)' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = 'ECA 03(b)');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem3_ds, 'II M04', 'Religion / Human Value Education & Ethics' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem3_ds AND code = 'II M04');

        -- Insert Semester IV
        INSERT INTO public.semesters (academic_year_id, name) 
        SELECT year2_ds, 'Semester IV' 
        WHERE NOT EXISTS (SELECT 1 FROM public.semesters WHERE academic_year_id = year2_ds AND name = 'Semester IV')
        RETURNING id INTO sem4_ds;

        IF sem4_ds IS NULL THEN
            SELECT id INTO sem4_ds FROM public.semesters WHERE academic_year_id = year2_ds AND name = 'Semester IV' LIMIT 1;
        END IF;

        -- Insert Subjects for Semester IV
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem4_ds, '25DSCC401', 'Database Management System' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem4_ds AND code = '25DSCC401');
        INSERT INTO public.subjects (semester_id, code, name) SELECT sem4_ds, '25DSCC451', 'Database Management System Lab' WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE semester_id = sem4_ds AND code = '25DSCC451');

    END;

END $$;
