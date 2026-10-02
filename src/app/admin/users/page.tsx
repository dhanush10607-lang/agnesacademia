import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users } from "lucide-react";
import { UserRoleSelect, UserStatusToggle, AcademicLockToggle } from "@/components/admin/UserControls";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const { q, role, page = "1" } = await searchParams;
  const supabase = await createClient();
  
  const pageNum = parseInt(page);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  let query = supabase
    .from("profiles")
    .select("*, department:departments(name), programme:programmes(code)", { count: "exact" });

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,registration_number.ilike.%${q}%`);
  }
  
  if (role) {
    query = query.eq("role", role);
  }

  const { data: users, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary" /> User Management
          </h1>
          <p className="text-muted-foreground">Manage students, faculty, and administrative staff accounts.</p>
        </div>
        
        <div className="flex shrink-0 gap-2">
          <Link href="/admin/academic-profile-settings" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Global Profile Lock
          </Link>
          <Link href="/admin/users/faculty-assignments" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Assign Faculty Subjects
          </Link>
        </div>
      </div>

      <Card className="mb-6 border-border shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <form className="flex-grow flex gap-2" action="/admin/users">
            {role && <input type="hidden" name="role" value={role} />}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="q" 
                defaultValue={q} 
                placeholder="Search by name or registration number..." 
                className="pl-9 bg-background"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <div className="flex gap-2 shrink-0">
            <form action="/admin/users">
              {q && <input type="hidden" name="q" value={q} />}
              <div className="flex gap-2">
                <select 
                  name="role" 
                  defaultValue={role || ""} 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="moderator">Moderators</option>
                  <option value="administrator">Administrators</option>
                </select>
                <Button type="submit" variant="secondary">Filter</Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Academic Dept</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{user.full_name || 'Unnamed User'}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{user.registration_number || user.id.split('-')[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{user.department?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground mt-1">{user.programme?.code || ''}</div>
                      {user.role === 'student' && (
                        <div className="mt-2">
                          <AcademicLockToggle userId={user.id} isLocked={user.is_academic_locked || false} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <UserStatusToggle userId={user.id} currentStatus={user.account_status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-muted/10">
            <span className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + limit, count || 0)} of {count}
            </span>
            <div className="flex gap-2">
              <a 
                href={`/admin/users?page=${Math.max(1, pageNum - 1)}${q ? `&q=${q}`:''}${role ? `&role=${role}`:''}`}
                className={`px-3 py-1 text-sm border rounded hover:bg-muted ${pageNum === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Prev
              </a>
              <a 
                href={`/admin/users?page=${Math.min(totalPages, pageNum + 1)}${q ? `&q=${q}`:''}${role ? `&role=${role}`:''}`}
                className={`px-3 py-1 text-sm border rounded hover:bg-muted ${pageNum === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
