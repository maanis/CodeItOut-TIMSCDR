import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CodeEditor } from "../components/CodeEditor";
import { Navbar } from "../components/Navbar";
// import { problems } from "./problems";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Share2,
    Bookmark,
    Eye,
    MessageSquare,
    Maximize2,
    Settings2,
    Play,
    Send,
    Loader2,
    Clock,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { TestResultsPanel } from "../components/TestResultsPanel";
import { problems } from "../data/problems";

export default function ProblemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const problem = problems.find((p) => p.id === id);

    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [wordWrap, setWordWrap] = useState(true);
    const [theme, setTheme] = useState("VS Dark");
    const [language, setLanguage] = useState("javascript");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [testResults, setTestResults] = useState(null);

    useEffect(() => {
        if (problem) {
            setCode(problem.starterCode);
        }
    }, [problem]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isFullscreen]);

    if (!problem) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Problem not found</h1>
                    <Button onClick={() => navigate("/")}>Go Back</Button>
                </div>
            </div>
        );
    }

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running...");
        setTestResults(null);

        // Simulate execution
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTestResults({
            status: "accepted",
            runtime: "0 ms",
            cases: [
                {
                    id: 1,
                    passed: true,
                    input: 'nums = \n[2,7,11,15]\n\ntarget = \n9',
                    output: '[0,1]',
                    expected: '[0,1]',
                },
                {
                    id: 2,
                    passed: true,
                    input: 'nums = \n[3,2,4]\n\ntarget = \n6',
                    output: '[1,2]',
                    expected: '[1,2]',
                },
                {
                    id: 3,
                    passed: true,
                    input: 'nums = \n[3,3]\n\ntarget = \n6',
                    output: '[0,1]',
                    expected: '[0,1]',
                },
            ],
        });
        setOutput("");
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setOutput("Submitting...");
        setTestResults(null);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setTestResults({
            status: "accepted",
            runtime: "2 ms",
            cases: [
                {
                    id: 1,
                    passed: true,
                    input: 'nums = \n[2,7,11,15]\n\ntarget = \n9',
                    output: '[0,1]',
                    expected: '[0,1]',
                },
                {
                    id: 2,
                    passed: true,
                    input: 'nums = \n[3,2,4]\n\ntarget = \n6',
                    output: '[1,2]',
                    expected: '[1,2]',
                },
                {
                    id: 3,
                    passed: true,
                    input: 'nums = \n[3,3]\n\ntarget = \n6',
                    output: '[0,1]',
                    expected: '[0,1]',
                },
            ],
        });
        setOutput("");
        setIsRunning(false);
    };

    const difficultyColors = {
        Easy: "bg-success/10 text-success border-success/20",
        Medium: "bg-warning/10 text-warning border-warning/20",
        Hard: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
        <div className="h-screen bg-background flex flex-col">
            <Navbar />

            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-background flex flex-col">
                    <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">index.js</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setIsFullscreen(false)}
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Settings2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
                        <div className="flex items-center gap-3">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-32 h-8 bg-secondary border-border text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-32 h-8 bg-secondary border-border text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="VS Dark">VS Dark</SelectItem>
                                    <SelectItem value="Light">Light</SelectItem>
                                    <SelectItem value="High Contrast">High Contrast</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Word Wrap</span>
                                <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <CodeEditor
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            language={language}
                            theme={theme}
                        />
                    </div>

                    <div className="h-14 border-t border-border flex items-center justify-between px-4 bg-card">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-2"
                                onClick={handleRun}
                                disabled={isRunning}
                            >
                                {isRunning ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                Run
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                                <Clock className="w-4 h-4 mr-2" />
                                Start Timer
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Attempts: 0</span>
                            <Button
                                size="sm"
                                className="h-8 bg-primary hover:bg-primary/90"
                                onClick={handleSubmit}
                                disabled={isRunning}
                            >
                                {isRunning ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 mt-16">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel - Problem Description */}
                    <ResizablePanel defaultSize={30} minSize={20}>
                        <div className="h-full border-r border-border flex flex-col bg-background">
                            <Tabs defaultValue="problem" className="flex-1 flex flex-col">
                                <div className="border-b border-border px-4 py-2">
                                    <TabsList className="bg-secondary">
                                        <TabsTrigger value="problem" className="text-xs">
                                            Problem
                                        </TabsTrigger>
                                        <TabsTrigger value="solution" className="text-xs">
                                            Solution
                                        </TabsTrigger>
                                        <TabsTrigger value="submissions" className="text-xs">
                                            Submissions
                                        </TabsTrigger>
                                        <TabsTrigger value="notes" className="text-xs">
                                            Notes
                                        </TabsTrigger>
                                        <TabsTrigger value="discuss" className="text-xs">
                                            Discuss
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="problem" className="flex-1 m-0">
                                    <ScrollArea className="h-full">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h1 className="text-2xl font-bold text-foreground">{problem.title}</h1>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Share2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Bookmark className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6 flex-wrap">
                                                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                                    {problem.tags[0]}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={difficultyColors[problem.difficulty]}
                                                >
                                                    {problem.difficulty}
                                                </Badge>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground ml-2">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        1.7K
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" />
                                                        45
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="w-4 h-4" />
                                                        582
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {problem.timeEstimate}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="prose prose-invert max-w-none">
                                                <p className="text-success text-sm mb-4">{problem.statement}</p>

                                                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                                                    Examples
                                                </h3>
                                                {problem.examples.map((example, idx) => (
                                                    <div key={idx} className="bg-secondary/50 p-4 rounded-lg mb-4 font-mono text-sm">
                                                        <div className="text-muted-foreground mb-1">Input: {example.input}</div>
                                                        <div className="text-muted-foreground">
                                                            Output: {example.output}
                                                        </div>
                                                        {example.explanation && (
                                                            <div className="text-muted-foreground mt-2 text-xs">
                                                                {example.explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                                                    Constraints
                                                </h3>
                                                <ul className="space-y-2">
                                                    {problem.constraints.map((constraint, idx) => (
                                                        <li key={idx} className="text-muted-foreground text-sm">
                                                            {constraint}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                                                    Function Signature
                                                </h3>
                                                <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm text-accent">
                                                    {problem.starterCode.split("\n")[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Center Panel - Code Editor */}
                    <ResizablePanel defaultSize={45} minSize={30}>
                        <div className="h-full flex flex-col bg-[#1e1e1e]">
                            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">index.js</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => setIsFullscreen(true)}
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Settings2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
                                <div className="flex items-center gap-3">
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-32 h-8 bg-secondary border-border text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                            <SelectItem value="python">Python</SelectItem>
                                            <SelectItem value="java">Java</SelectItem>
                                            <SelectItem value="cpp">C++</SelectItem>
                                            <SelectItem value="typescript">TypeScript</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={theme} onValueChange={setTheme}>
                                        <SelectTrigger className="w-32 h-8 bg-secondary border-border text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="VS Dark">VS Dark</SelectItem>
                                            <SelectItem value="Light">Light</SelectItem>
                                            <SelectItem value="High Contrast">High Contrast</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Word Wrap</span>
                                        <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <CodeEditor
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                    language={language}
                                    theme={theme}
                                />
                            </div>

                            <div className="h-14 border-t border-border flex items-center justify-between px-4 bg-card">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-2"
                                        onClick={handleRun}
                                        disabled={isRunning}
                                    >
                                        {isRunning ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Play className="w-4 h-4" />
                                        )}
                                        Run
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Start Timer
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Attempts: 0</span>
                                    <Button
                                        size="sm"
                                        className="h-8 bg-primary hover:bg-primary/90"
                                        onClick={handleSubmit}
                                        disabled={isRunning}
                                    >
                                        {isRunning ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : (
                                            <Send className="w-4 h-4 mr-2" />
                                        )}
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Panel - Console */}
                    <ResizablePanel defaultSize={25} minSize={20}>
                        <div className="h-full border-l border-border flex flex-col bg-background">
                            <div className="h-12 border-b border-border flex items-center px-4 bg-card">
                                <span className="text-sm font-medium text-foreground">Console</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <TestResultsPanel output={output} testResults={testResults} />
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
