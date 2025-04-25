import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CodeIcon, BookOpen, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 py-3 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-primary-600">
          <CodeIcon className="h-6 w-6" />
        </div>
        <Link href="/">
          <h1 className="text-xl font-semibold text-slate-800 cursor-pointer">Algorithm Visualizer</h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-sm text-slate-600 hover:bg-slate-100 rounded-md flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </Button>
        <Button variant="default" size="sm" className="text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-md flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          <span>Documentation</span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
