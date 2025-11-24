import { Clock, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProblemCard({ problem, onClick }) {
    const difficultyColors = {
        Easy: "bg-success/10 text-success border-success/20",
        Medium: "bg-warning/10 text-warning border-warning/20",
        Hard: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
        <div
            onClick={onClick}
            className="group bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01]"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {problem.description}
                    </p>
                </div>
                <div className="flex gap-2 ml-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {problem.tags[0]}
                </Badge>
                <Badge
                    variant="outline"
                    className={cn("font-medium", difficultyColors[problem.difficulty])}
                >
                    {problem.difficulty}
                </Badge>
                {problem.companies.slice(0, 4).map((company) => (
                    <Badge
                        key={company}
                        variant="outline"
                        className="bg-secondary text-secondary-foreground border-border"
                    >
                        {company}
                    </Badge>
                ))}
                {problem.companies.length > 4 && (
                    <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
                        +{problem.companies.length - 4}
                    </Badge>
                )}
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {problem.timeEstimate}
            </div>
        </div>
    );
}
