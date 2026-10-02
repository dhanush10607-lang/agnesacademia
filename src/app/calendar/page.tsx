import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Target, CalendarDays, List } from "lucide-react";
import Link from "next/link";
import { format, isFuture, isToday, isThisWeek, isThisMonth } from "date-fns";

export default async function AcademicCalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user profile for targeting
  const { data: profile } = await supabase
    .from("profiles")
    .select("department_id, programme_id, semester_id")
    .eq("id", user.id)
    .single();

  // Fetch all published events
  const { data: events } = await supabase
    .from("calendar_events")
    .select(`
      *,
      department:departments(name),
      programme:programmes(name),
      semester:semesters(name)
    `)
    .in("status", ['published', 'cancelled'])
    .order("start_time", { ascending: true });

  // Filter for relevance, similar to notices
  const isRelevantEvent = (e: any) => {
    if (e.department_id && profile?.department_id !== e.department_id) return false;
    if (e.programme_id && profile?.programme_id !== e.programme_id) return false;
    if (e.semester_id && profile?.semester_id !== e.semester_id) return false;
    return true; // If no targets specified, it's a global event
  };

  const relevantEvents = events?.filter(isRelevantEvent) || [];
  
  // Categorize for easy viewing
  const now = new Date();
  const upcomingEvents = relevantEvents.filter(e => new Date(e.end_time) >= now);
  const pastEvents = relevantEvents.filter(e => new Date(e.end_time) < now).reverse().slice(0, 5); // Just show last 5

  const getEventColor = (category: string) => {
    switch(category) {
      case 'Examination': return 'border-l-red-500 bg-red-500/10 text-red-700 dark:text-red-400';
      case 'Internal Assessment': return 'border-l-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'Assignment Deadline': return 'border-l-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Holiday': return 'border-l-green-500 bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'border-l-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-5xl flex-grow">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="text-4xl font-heading font-extrabold flex items-center mb-2">
              <CalendarDays className="w-8 h-8 mr-3 text-primary" /> Academic Calendar
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personalized schedule of exams, deadlines, and college events.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List View */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold flex items-center mb-4">
                <Target className="w-5 h-5 mr-2 text-primary" /> Upcoming Events
              </h2>
              
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Card key={event.id} className={`border-border shadow-sm border-l-4 transition-all hover:shadow-md ${event.status === 'cancelled' ? 'border-l-muted opacity-60 grayscale' : getEventColor(event.category).split(' ')[0]}`}>
                      <CardContent className="p-0 flex flex-col sm:flex-row">
                        
                        {/* Date Block */}
                        <div className={`p-4 sm:p-6 sm:w-32 shrink-0 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r bg-muted/20 ${isToday(new Date(event.start_time)) ? 'bg-primary/10 text-primary' : ''}`}>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {format(new Date(event.start_time), "MMM")}
                          </span>
                          <span className="text-3xl font-black my-1">
                            {format(new Date(event.start_time), "dd")}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {format(new Date(event.start_time), "EEEE")}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 sm:p-6 flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className={`border-transparent ${getEventColor(event.category).split(' ').slice(1).join(' ')}`}>
                              {event.category}
                            </Badge>
                            {event.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
                          </div>
                          
                          <h3 className={`text-xl font-bold mb-2 ${event.status === 'cancelled' ? 'line-through' : ''}`}>
                            {event.title}
                          </h3>
                          
                          {event.description && (
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5" />
                              {format(new Date(event.start_time), "h:mm a")} 
                              {event.end_time && event.start_time !== event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 border border-dashed rounded-xl bg-muted/10">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">Your schedule is currently clear.</p>
                  </div>
                )}
              </div>
            </section>

            {pastEvents.length > 0 && (
              <section className="opacity-70">
                <h2 className="text-xl font-bold flex items-center mb-4 text-muted-foreground">
                  <Clock className="w-5 h-5 mr-2" /> Recent Past Events
                </h2>
                <div className="space-y-3">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="border-border shadow-sm border-l-2 bg-muted/20">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold mb-1">{event.title}</h4>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {format(new Date(event.start_time), "MMM d, yyyy")}
                          </div>
                        </div>
                        <Badge variant="outline">{event.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="border-border shadow-sm sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">This Week</span>
                    <Badge variant="secondary">{upcomingEvents.filter(e => isThisWeek(new Date(e.start_time))).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">This Month</span>
                    <Badge variant="secondary">{upcomingEvents.filter(e => isThisMonth(new Date(e.start_time))).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Exams / Assessments</span>
                    <Badge className="bg-red-500 hover:bg-red-600">
                      {upcomingEvents.filter(e => e.category === 'Examination' || e.category === 'Internal Assessment').length}
                    </Badge>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Color Legend</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Exams</li>
                    <li className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div> Internal Assessments</li>
                    <li className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div> Deadlines</li>
                    <li className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Holidays</li>
                    <li className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> Events & Others</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
