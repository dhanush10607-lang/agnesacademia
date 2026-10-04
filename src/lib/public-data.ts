import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { PUBLIC_CACHE_TAGS } from "@/lib/public-cache-tags";

const cacheKeyParts = [
  "public-data-v1",
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
];

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createSupabaseClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

const getDepartmentIndex = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [
      { data: departments, error: departmentError },
      { data: unassignedProgrammes, error: programmeError },
    ] = await Promise.all([
      supabase
        .from("departments")
        .select("*")
        .eq("status", "active")
        .order("name"),
      supabase
        .from("programmes")
        .select("id, name, description")
        .is("department_id", null)
        .eq("status", "active")
        .order("name"),
    ]);

    if (departmentError) throw new Error(departmentError.message);
    if (programmeError) throw new Error(programmeError.message);

    return { departments, unassignedProgrammes };
  },
  [...cacheKeyParts, "department-index"],
  { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.departments, PUBLIC_CACHE_TAGS.programmes] },
);

const getDepartmentPageData = unstable_cache(
  async (departmentId: string) => {
    const supabase = createPublicClient();
    const [
      { data: department, error: departmentError },
      { data: programmes, error: programmeError },
    ] = await Promise.all([
      supabase
        .from("departments")
        .select("*")
        .eq("id", departmentId)
        .maybeSingle(),
      supabase
        .from("programmes")
        .select("*")
        .eq("department_id", departmentId)
        .order("name"),
    ]);

    return {
      department,
      departmentError: Boolean(departmentError),
      programmes,
      programmeError: Boolean(programmeError),
    };
  },
  [...cacheKeyParts, "department-page"],
  { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.departments, PUBLIC_CACHE_TAGS.programmes] },
);

const getProgrammePageData = unstable_cache(
  async (programmeId: string) => {
    const supabase = createPublicClient();
    const [
      { data: programme, error: programmeError },
      { data: curricula, error: curriculaError },
      { data: academicYears, error: academicYearsError },
    ] = await Promise.all([
      supabase
        .from("programmes")
        .select("*, department:departments(*)")
        .eq("id", programmeId)
        .maybeSingle(),
      supabase
        .from("curricula")
        .select("id, name, description, academic_year")
        .eq("programme_id", programmeId)
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("academic_years")
        .select("*, semesters(*)")
        .eq("programme_id", programmeId)
        .order("name"),
    ]);

    return {
      programme,
      programmeError: Boolean(programmeError),
      curricula,
      curriculaError: Boolean(curriculaError),
      academicYears,
      academicYearsError: Boolean(academicYearsError),
    };
  },
  [...cacheKeyParts, "programme-page"],
  { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.programmes] },
);

const getHomeStats = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [
      { count: departmentCount, error: departmentError },
      { count: programmeCount, error: programmeError },
      { count: subjectCount, error: subjectError },
      { count: resourceCount, error: resourceError },
    ] = await Promise.all([
      supabase.from("departments").select("*", { count: "exact", head: true }),
      supabase.from("programmes").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    const queryError = departmentError || programmeError || subjectError || resourceError;
    if (queryError) throw new Error(queryError.message);

    return {
      departmentCount: departmentCount ?? 0,
      programmeCount: programmeCount ?? 0,
      subjectCount: subjectCount ?? 0,
      resourceCount: resourceCount ?? 0,
    };
  },
  [...cacheKeyParts, "home-stats"],
  {
    revalidate: 300,
    tags: [
      PUBLIC_CACHE_TAGS.departments,
      PUBLIC_CACHE_TAGS.programmes,
      PUBLIC_CACHE_TAGS.subjects,
      PUBLIC_CACHE_TAGS.homeResources,
    ],
  },
);

const getRecentlyAddedResources = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("resources")
      .select(`
        id, title, created_at,
        subject:subjects(name),
        category:resource_categories(name)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw new Error(error.message);
    return data;
  },
  [...cacheKeyParts, "home-recent-resources"],
  { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.homeResources] },
);

const getResourceFilterData = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [
      { data: categories, error: categoriesError },
      { data: subjects, error: subjectsError },
      { data: curriculumSubjects, error: curriculumSubjectsError },
    ] = await Promise.all([
      supabase.from("resource_categories").select("id, name").order("name"),
      supabase.from("subjects").select("id, name").eq("is_active", true).order("name"),
      supabase.from("curriculum_subjects").select("subject_id, curriculum:curricula(code)"),
    ]);

    const queryError = categoriesError || subjectsError || curriculumSubjectsError;
    if (queryError) throw new Error(queryError.message);

    return { categories, subjects, curriculumSubjects };
  },
  [...cacheKeyParts, "resource-filter-data"],
  { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.resources, PUBLIC_CACHE_TAGS.subjects] },
);

const getPublishedResourcesPage = unstable_cache(
  async (page: number, limit: number) => {
    const supabase = createPublicClient();
    const { data, count, error } = await supabase
      .from("resources")
      .select("id, title, description, created_at, file_path, category:resource_categories(name), subject:subjects(name)", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);
    return { data, count };
  },
  [...cacheKeyParts, "published-resources-page"],
  { revalidate: 60, tags: [PUBLIC_CACHE_TAGS.resources] },
);

export function getPublicDepartmentIndex() {
  return getDepartmentIndex();
}

export function getPublicDepartmentPageData(departmentId: string) {
  return getDepartmentPageData(departmentId);
}

export function getPublicProgrammePageData(programmeId: string) {
  return getProgrammePageData(programmeId);
}

export function getPublicHomeStats() {
  return getHomeStats();
}

export function getPublicRecentlyAddedResources() {
  return getRecentlyAddedResources();
}

export function getPublicResourceFilterData() {
  return getResourceFilterData();
}

export function getPublicResourcesPage(page: number, limit: number) {
  return getPublishedResourcesPage(page, limit);
}
