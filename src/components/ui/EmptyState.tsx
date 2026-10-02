import Link from "next/link";
import { LucideIcon, Inbox } from "lucide-react";

interface Action {
  label: string;
  href: string;
  primary?: boolean;
}

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: Action[];
}

/**
 * Smart Empty State — always explains what's missing, why, and what to do next.
 * Usage:
 *   <EmptyState
 *     icon={FileText}
 *     title="No question papers yet"
 *     description="Question papers for this subject haven't been uploaded yet. You can explore the question bank instead."
 *     actions={[
 *       { label: "Explore Question Bank", href: "/question-banks", primary: true },
 *       { label: "Browse All Resources", href: "/resources" },
 *     ]}
 *   />
 */
export function EmptyState({ icon: Icon = Inbox, title, description, actions }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-muted-foreground/60" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                action.primary
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-background hover:bg-muted text-foreground"
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
