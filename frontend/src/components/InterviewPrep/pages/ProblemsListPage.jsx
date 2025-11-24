import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ProblemCard } from "../components/ProblemCard";
import { problems } from "../data/problems";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const companies = [
    "Accenture",
    "Atlassian",
    "DP World",
    "Tekion",
    "Adobe",
    "Airbnb",
    "Amazon",
    "Apple",
    "Capgemini",
    "Cisco",
    "Dropbox",
    "Flipkart",
    "Google",
    "Infosys",
    "Intel",
    "LinkedIn",
    "Meesho",
    "Meta",
    "Microsoft",
    "Netflix",
];

export default function ProblemsListPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [companySearchQuery, setCompanySearchQuery] = useState("");
    const [languageFilter, setLanguageFilter] = useState("javascript");
    const [tagFilter, setTagFilter] = useState("default");

    const filteredProblems = problems
        .filter((problem) => {
            const matchesSearch =
                problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty =
                difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter;
            const matchesCompany =
                selectedCompanies.length === 0 ||
                problem.companies.some((c) => selectedCompanies.includes(c));
            const matchesTag =
                tagFilter === "default" || problem.tags.some((t) => t.toLowerCase() === tagFilter);
            return matchesSearch && matchesDifficulty && matchesCompany && matchesTag;
        })
        .sort((a, b) => {
            // Sort by difficulty
            const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
            const diffA = difficultyOrder[a.difficulty.toLowerCase()];
            const diffB = difficultyOrder[b.difficulty.toLowerCase()];
            if (diffA !== diffB) return diffA - diffB;

            // Then sort by title alphabetically
            return a.title.localeCompare(b.title);
        });

    const filteredCompanies = companies.filter((company) =>
        company.toLowerCase().includes(companySearchQuery.toLowerCase())
    );

    const toggleCompany = (company) => {
        setSelectedCompanies((prev) =>
            prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                onSearchChange={setSearchQuery}
                onDifficultyChange={setDifficultyFilter}
            />
            <Sidebar />

            <main className="ml-16 mt-16 p-6 flex gap-6">
                <div className="flex-1 max-w-4xl">
                    <div className="mb-6 flex gap-3 flex-wrap">
                        <Select value={languageFilter} onValueChange={setLanguageFilter}>
                            <SelectTrigger className="w-40 bg-card border-border">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger className="w-32 bg-card border-border">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={tagFilter} onValueChange={setTagFilter}>
                            <SelectTrigger className="w-32 bg-card border-border">
                                <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="default">All Tags</SelectItem>
                                <SelectItem value="arrays">Arrays</SelectItem>
                                <SelectItem value="strings">Strings</SelectItem>
                                <SelectItem value="loops">Loops</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="recursion">Recursion</SelectItem>
                                <SelectItem value="objects">Objects</SelectItem>
                                <SelectItem value="sorting">Sorting</SelectItem>
                                <SelectItem value="math">Math</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search problems..."
                                className="pl-10 bg-card border-border"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredProblems.map((problem) => (
                            <ProblemCard
                                key={problem.id}
                                problem={problem}
                                onClick={() => navigate(`/problem/${problem.id}`)}
                            />
                        ))}
                    </div>
                </div>

                <aside className="w-80 sticky top-20 h-fit">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Filter by Company</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>1/3</span>
                                <div className="flex gap-0.5">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <ChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search companies..."
                                className="pl-10 bg-secondary border-border h-9"
                                value={companySearchQuery}
                                onChange={(e) => setCompanySearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2.5 max-h-96 overflow-y-auto">
                            {filteredCompanies.map((company) => (
                                <label
                                    key={company}
                                    className="flex items-center gap-2.5 cursor-pointer hover:bg-secondary/50 p-2 rounded transition-colors"
                                >
                                    <Checkbox
                                        checked={selectedCompanies.includes(company)}
                                        onCheckedChange={() => toggleCompany(company)}
                                        className="border-border"
                                    />
                                    <span className="text-sm text-foreground">{company}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
