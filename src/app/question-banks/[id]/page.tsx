import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FolderOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackView } from "@/components/TrackView";
import { BookmarkButton } from "@/components/BookmarkButton";
import { checkIsBookmarked } from "@/app/actions/bookmarks";
import { ReportResourceDialog } from "@/components/ReportResourceDialog";

export default async function QuestionBankDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the bank with basic subject details
  const { data: bank, error } = await supabase
    .from("question_banks")
    .select(`
      *,
      subject:subjects(name)
    `)
    .eq("id", id)
    .single();

  if (error || !bank) notFound();

  if (bank.status !== 'published' && (!user || user.id !== bank.created_by)) {
    notFound();
  }

  const isBookmarked = await checkIsBookmarked('question_bank', bank.id);

  // Fetch all units and questions inside them
  const { data: units } = await supabase
    .from("question_units")
    .select(`
      id, unit_number, title, description,
      questions (id, question_text, marks, question_type, answer_text)
    `)
    .eq("question_bank_id", id)
    .order("unit_number", { ascending: true });

  // Helper to format the type enum
  const formatType = (type: string) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <TrackView 
        itemType="question_bank" 
        itemId={bank.id} 
        title={bank.title} 
        url={`/question-banks/${bank.id}`} 
        subjectId={bank.subject_id} 
      />
      <Link 
        href={`/subjects/${bank.subject_id}`} 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to {(bank.subject as any)?.name || 'Subject'}
      </Link>

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex gap-2 mb-3">
            <Badge variant="outline" className="bg-background">Question Bank</Badge>
            {bank.status !== 'published' && (
              <Badge variant="secondary">Status: {bank.status.replace('_', ' ')}</Badge>
            )}
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">{bank.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {bank.description || "Comprehensive collection of questions for exam preparation."}
          </p>
        </div>
        <div className="shrink-0 pt-2">
          <BookmarkButton 
            itemType="question_bank" 
            itemId={bank.id} 
            title={bank.title} 
            url={`/question-banks/${bank.id}`} 
            initialIsBookmarked={isBookmarked}
          />
        </div>
      </div>

      {units && units.length > 0 ? (
        <Tabs defaultValue={`unit-${units[0].id}`} className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto rounded-none border-b bg-transparent h-auto p-0 space-x-6 mb-8">
            {units.map(unit => (
              <TabsTrigger 
                key={unit.id} 
                value={`unit-${unit.id}`}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Unit {unit.unit_number}: {unit.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {units.map(unit => {
            // Group questions by marks inside the unit
            const questionsByMarks = (unit.questions || []).reduce((acc: any, q: any) => {
              if (!acc[q.marks]) acc[q.marks] = [];
              acc[q.marks].push(q);
              return acc;
            }, {});

            // Sort marks descending
            const sortedMarks = Object.keys(questionsByMarks).map(Number).sort((a, b) => a - b);

            return (
              <TabsContent key={unit.id} value={`unit-${unit.id}`} className="pt-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Unit {unit.unit_number}: {unit.title}</h2>
                  {unit.description && <p className="text-muted-foreground">{unit.description}</p>}
                </div>

                {sortedMarks.length > 0 ? (
                  <div className="space-y-12">
                    {sortedMarks.map(mark => (
                      <div key={mark}>
                        <h3 className="text-xl font-bold border-b pb-2 mb-6 text-primary">
                          {mark} MARK QUESTIONS
                        </h3>
                        <div className="space-y-6">
                          {questionsByMarks[mark].map((q: any, idx: number) => (
                            <div key={q.id} className="group">
                              <div className="flex gap-4">
                                <span className="font-semibold text-muted-foreground min-w-[2.5rem]">
                                  Q{idx + 1}.
                                </span>
                                <div className="flex-1">
                                  <p className="text-lg font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                                    {q.question_text}
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {formatType(q.question_type)}
                                    </Badge>
                                  </div>
                                  {q.answer_text && (
                                    <div className="mt-4 p-4 rounded-lg bg-muted/30 border text-sm text-muted-foreground whitespace-pre-wrap">
                                      <span className="font-semibold text-foreground mb-1 block">Answer / Hint:</span>
                                      {q.answer_text}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                      <h3 className="text-lg font-semibold mb-1">No questions found</h3>
                      <p className="text-muted-foreground">No questions have been added to this unit yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
            <h3 className="text-xl font-semibold mb-2">Question Bank is empty</h3>
            <p className="text-muted-foreground max-w-md">No units or questions have been created for this question bank yet.</p>
          </CardContent>
        </Card>
      )}
      <div className="mt-8 flex justify-center">
        <ReportResourceDialog itemType="question_bank" itemId={bank.id} />
      </div>
    </div>
  );
}
