import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function TestResultsPanel({ output, testResults }) {
    if (!testResults) {
        return (
            <div className="p-4">
                {output ? (
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {output}
                    </pre>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Click "Run" to execute your code and see the output here.
                    </p>
                )}
            </div>
        );
    }

    const activeCaseIndex = 0;
    const activeCase = testResults.cases[activeCaseIndex];

    return (
        <Tabs defaultValue="result" className="h-full flex flex-col">
            <TabsList className="bg-secondary mx-4 mt-4">
                <TabsTrigger value="testcase" className="text-xs">
                    Testcase
                </TabsTrigger>
                <TabsTrigger value="result" className="text-xs">
                    Test Result
                </TabsTrigger>
            </TabsList>

            <TabsContent value="testcase" className="flex-1 m-0">
                <ScrollArea className="h-full">
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground">
                            Write your custom test cases here.
                        </p>
                    </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="result" className="flex-1 m-0">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <h3
                                className={`text-lg font-semibold ${testResults.status === "accepted"
                                    ? "text-success"
                                    : "text-destructive"
                                    }`}
                            >
                                {testResults.status === "accepted" ? "Accepted" : "Failed"}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                Runtime: {testResults.runtime}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {testResults.cases.map((testCase) => (
                                <Badge
                                    key={testCase.id}
                                    variant={testCase.passed ? "default" : "destructive"}
                                    className={
                                        testCase.passed
                                            ? "bg-success/10 text-success border-success/20"
                                            : ""
                                    }
                                >
                                    {testCase.passed ? (
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                    ) : (
                                        <XCircle className="w-3 h-3 mr-1" />
                                    )}
                                    Case {testCase.id}
                                </Badge>
                            ))}
                        </div>

                        {activeCase && (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Input</p>
                                    <div className="bg-secondary/50 p-3 rounded-lg">
                                        <pre className="text-sm font-mono text-foreground">
                                            {activeCase.input}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Output</p>
                                    <div className="bg-secondary/50 p-3 rounded-lg">
                                        <pre className="text-sm font-mono text-foreground">
                                            {activeCase.output}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Expected</p>
                                    <div className="bg-secondary/50 p-3 rounded-lg">
                                        <pre className="text-sm font-mono text-foreground">
                                            {activeCase.expected}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}
