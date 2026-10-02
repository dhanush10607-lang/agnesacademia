import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, File } from "lucide-react";

export function ExplorerPreview() {
  const path = [
    "Computer Science",
    "B.Sc Data Science",
    "II Year",
    "Semester III",
    "Database Management Systems"
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Academic Explorer</h2>
            <p className="text-muted-foreground mb-6">
              Navigate seamlessly through the entire college structure. From broad departments down to specific subject notes, everything is organized logically.
            </p>
          </div>
          <div className="lg:w-2/3 w-full">
            <Card className="border-muted shadow-sm overflow-hidden bg-card/50">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground flex-wrap">
                  {path.map((item, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <span className={index === path.length - 1 ? "text-foreground font-semibold" : "hover:text-primary cursor-pointer transition-colors"}>
                        {item}
                      </span>
                      {index < path.length - 1 && <ChevronRight className="h-4 w-4" />}
                    </span>
                  ))}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {["Unit 1: Intro to Databases.pdf", "Unit 2: ER Modeling.pdf", "SQL Practice Lab.docx"].map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 border-b last:border-0 hover:bg-muted/20 cursor-pointer transition-colors group">
                      <File className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground">{file}</span>
                      <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">View Resource</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
