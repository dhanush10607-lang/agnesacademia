import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date-time";
import { ExternalLink, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReportReviewActions } from "./ReportReviewActions";

type Report = {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  reporter?: { full_name: string | null } | null;
};

type ReportItem = {
  title: string;
  href: string | null;
};

export function ResourceReportsContent({
  reports,
  items,
  status,
}: {
  reports: Report[];
  items: Map<string, ReportItem>;
  status: string;
}) {
  const filters = [
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
    { value: "dismissed", label: "Dismissed" },
    { value: "all", label: "All reports" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 flex items-center text-3xl font-heading font-extrabold">
          <Flag className="mr-3 h-7 w-7 text-destructive" />
          Reported Content
        </h1>
        <p className="text-muted-foreground">
          Review reports submitted by users and record the outcome.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Report status filter">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={`?status=${filter.value}`}
            className={buttonVariants({
              variant: status === filter.value ? "default" : "outline",
              size: "sm",
            })}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No {status === "all" ? "" : `${status} `}reports found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const item = items.get(`${report.item_type}:${report.item_id}`);
            const pending = report.status === "pending";

            return (
              <Card key={report.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{report.item_type.replaceAll("_", " ")}</Badge>
                      <Badge variant={pending ? "destructive" : "secondary"}>
                        {report.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Reported {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-semibold">{item?.title || "Reported item is unavailable"}</h2>
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    {report.details && (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {report.details}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Submitted by {report.reporter?.full_name || `user ${report.user_id.slice(0, 8)}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    {item?.href ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open reported content
                      </Link>
                    ) : <span />}
                    {pending && <ReportReviewActions reportId={report.id} />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export async function loadResourceReports(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  status: string
) {
  const reportQuery = supabase
    .from("resource_reports")
    .select("id, user_id, item_type, item_id, reason, details, status, created_at, resolved_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: reportData, error } =
    status === "all"
      ? await reportQuery
      : await reportQuery.eq("status", status);

  if (error) {
    console.error("Could not load resource reports:", error);
    return { reports: null, items: new Map<string, ReportItem>(), error: true };
  }

  const reports = (reportData ?? []) as Report[];
  const idsByType = new Map<string, string[]>();
  for (const report of reports) {
    idsByType.set(report.item_type, [...(idsByType.get(report.item_type) ?? []), report.item_id]);
  }

  const items = new Map<string, ReportItem>();
  const lookups = [
    { type: "note", table: "resources", titleColumn: "title", path: "/resources/" },
    { type: "video", table: "resources", titleColumn: "title", path: "/resources/" },
    { type: "question_paper", table: "question_papers", titleColumn: "title", path: "/question-papers/" },
    { type: "question_bank", table: "question_banks", titleColumn: "title", path: "/question-banks/" },
    { type: "syllabus", table: "syllabi", titleColumn: "course_code", path: "/syllabi/" },
  ] as const;

  await Promise.all(lookups.map(async ({ type, table, titleColumn, path }) => {
    const ids = idsByType.get(type);
    if (!ids?.length) return;
    const { data, error: itemError } = await supabase
      .from(table)
      .select(`id, ${titleColumn}`)
      .in("id", ids);

    if (itemError) {
      console.error(`Could not load reported ${type} items:`, itemError);
      return;
    }

    for (const row of data ?? []) {
      const itemTitle = "title" in row ? row.title : row.course_code;
      const title = itemTitle || (type === "syllabus" ? "Syllabus" : `${type} item`);
      items.set(`${type}:${row.id}`, { title, href: `${path}${row.id}` });
    }
  }));

  const questionIds = idsByType.get("question");
  if (questionIds?.length) {
    const { data, error: questionError } = await supabase
      .from("questions")
      .select("id, question_text, unit:question_units(question_bank_id)")
      .in("id", questionIds);

    if (questionError) {
      console.error("Could not load reported questions:", questionError);
    } else {
      for (const question of data ?? []) {
        const questionUnit = Array.isArray(question.unit) ? question.unit[0] : question.unit;
        items.set(`question:${question.id}`, {
          title: question.question_text,
          href: questionUnit?.question_bank_id
            ? `/question-banks/${questionUnit.question_bank_id}`
            : null,
        });
      }
    }
  }

  const reporterIds = [...new Set(reports.map((report) => report.user_id))];
  if (reporterIds.length) {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", reporterIds);

    if (profileError) {
      console.error("Could not load report submitters:", profileError);
    } else {
      const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));
      for (const report of reports) {
        report.reporter = { full_name: names.get(report.user_id) ?? null };
      }
    }
  }

  return { reports, items, error: false };
}
