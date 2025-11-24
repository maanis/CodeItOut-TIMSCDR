import { Home, Code2, FileText, BookOpen, MessageSquare, BarChart } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, to: "/", label: "Home" },
    { icon: Code2, to: "/problems", label: "Problems" },
    { icon: FileText, to: "/submissions", label: "Submissions" },
    { icon: BookOpen, to: "/notes", label: "Notes" },
    { icon: MessageSquare, to: "/discuss", label: "Discuss" },
    { icon: BarChart, to: "/stats", label: "Stats" },
];

export function Sidebar() {
    return (
        <aside className="fixed left-0 h-[calc(100vh-4rem)] w-16 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-2 z-10">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200",
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    activeClassName="bg-sidebar-accent text-primary"
                >
                    <item.icon className="w-5 h-5" />
                </NavLink>
            ))}
        </aside>
    );
}
