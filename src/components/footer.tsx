import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <p className="min-w-0 text-sm text-muted-foreground truncate">OpsPilot AI © 2026</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 shrink-0">
            <span>Designed & Developed by</span>
            <a
              href="https://www.linkedin.com/in/tebello-chabeli-659b29206"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
            >
              Tebello Chabeli
              <Linkedin className="h-3.5 w-3.5 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
            </a>
          </p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground/80">
          OpsPilot AI is an AI-powered productivity assistant. AI-generated outputs should always be reviewed before use in business-critical decisions.
        </p>
      </div>
    </footer>
  );
}