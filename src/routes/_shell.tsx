import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/footer";
import { FloatingAI } from "@/components/floating-ai";
import { CommandPalette } from "@/components/command-palette";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 backdrop-blur px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search or ask AI…</span>
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-mono">⌘K</kbd>
            </Button>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          <Footer />
        </div>
        <FloatingAI />
        <CommandPalette />
      </div>
    </SidebarProvider>
  );
}