import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: Props) {
  const all = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground py-2">
      {all.map((item, i) => {
        const isLast = i === all.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-medium truncate max-w-[140px] md:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[160px] md:max-w-none ${isLast ? "text-foreground font-semibold" : ""}`} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />}
          </span>
        );
      })}
    </nav>
  );
}
