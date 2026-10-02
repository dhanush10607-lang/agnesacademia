-- Seed Resource Categories
-- Run this script to restore resource categories if they are missing (e.g. after running empty.sql)

INSERT INTO public.resource_categories (name, description, icon) 
SELECT 'Notes', 'Lecture notes and study materials', 'BookOpen'
WHERE NOT EXISTS (SELECT 1 FROM public.resource_categories WHERE name = 'Notes');

INSERT INTO public.resource_categories (name, description, icon) 
SELECT 'Question Papers', 'Previous year exam papers', 'FileText'
WHERE NOT EXISTS (SELECT 1 FROM public.resource_categories WHERE name = 'Question Papers');

INSERT INTO public.resource_categories (name, description, icon) 
SELECT 'Question Bank', 'Collection of important questions', 'Database'
WHERE NOT EXISTS (SELECT 1 FROM public.resource_categories WHERE name = 'Question Bank');

INSERT INTO public.resource_categories (name, description, icon) 
SELECT 'Assignments', 'Course assignments and projects', 'ClipboardList'
WHERE NOT EXISTS (SELECT 1 FROM public.resource_categories WHERE name = 'Assignments');

INSERT INTO public.resource_categories (name, description, icon) 
SELECT 'Videos', 'Recorded lectures and tutorials', 'Video'
WHERE NOT EXISTS (SELECT 1 FROM public.resource_categories WHERE name = 'Videos');
