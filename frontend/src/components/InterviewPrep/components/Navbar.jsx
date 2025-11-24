import { Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

export function Navbar({ onLanguageChange, onDifficultyChange, onSearchChange }) {
    const { theme, setTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background z-20 px-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">T</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                    TC<span className="text-primary">CLUB</span>
                </span>
            </div>

            {/* <div className="flex items-center gap-3 ml-auto">
                <Select onValueChange={onLanguageChange} defaultValue="javascript">
                    <SelectTrigger className="w-40 bg-card border-border">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onDifficultyChange} defaultValue="all">
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

                <Select defaultValue="default">
                    <SelectTrigger className="w-32 bg-card border-border">
                        <SelectValue placeholder="Tags" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="default">All Tags</SelectItem>
                        <SelectItem value="arrays">Arrays</SelectItem>
                        <SelectItem value="strings">Strings</SelectItem>
                        <SelectItem value="loops">Loops</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search problems..."
                        className="pl-10 bg-card border-border"
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
            </div> */}

            <div className="flex ml-auto items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="text-foreground"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-foreground">
                    Interview Practice
                    <Badge className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                        New
                    </Badge>
                </Button>
                <Button variant="ghost" size="sm" className="text-foreground">
                    Courses
                </Button>
                <Button variant="default" size="sm">
                    Sign In
                </Button>
            </div>
        </header>
    );
}
