import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-a:text-primary prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}