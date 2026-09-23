"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  AlertTriangle,
  AlertCircle,
  Code2,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-foreground/90">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`link-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80 font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function CodeSnippet({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 dark:bg-black text-zinc-100 shadow-md">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-3.5 py-1.5 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Code2 className="size-3.5 text-zinc-400" />
          <span>{language || "code"}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 gap-1 px-2 text-[10px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-200">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

type ParsedBlock =
  | { type: "paragraph"; text: string }
  | { type: "code"; code: string; language: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

type ReviewSection = {
  id: string;
  title: string;
  type: "summary" | "good" | "suggestions" | "issues" | "general";
  blocks: ParsedBlock[];
};

export function parseReviewMarkdown(markdown: string): ReviewSection[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const sections: ReviewSection[] = [];

  let currentSection: ReviewSection = {
    id: "summary",
    title: "Executive Summary",
    type: "summary",
    blocks: [],
  };

  let inCode = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      currentSection.blocks.push({
        type: "list",
        items: [...listBuffer],
      });
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check code blocks toggle
    if (trimmed.startsWith("```")) {
      flushList();
      if (!inCode) {
        inCode = true;
        codeLang = trimmed.replace(/^```/, "").trim();
        codeBuffer = [];
      } else {
        inCode = false;
        currentSection.blocks.push({
          type: "code",
          code: codeBuffer.join("\n"),
          language: codeLang,
        });
        codeBuffer = [];
        codeLang = "";
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Check header 2 or 3
    if (trimmed.startsWith("#")) {
      flushList();
      const rawTitle = trimmed.replace(/^#+\s*/, "");
      let type: ReviewSection["type"] = "general";

      const lower = rawTitle.toLowerCase();
      if (lower.includes("what looks good") || lower.includes("good") || rawTitle.includes("✅")) {
        type = "good";
      } else if (
        lower.includes("suggestion") ||
        lower.includes("improvement") ||
        rawTitle.includes("⚠️")
      ) {
        type = "suggestions";
      } else if (
        lower.includes("issue") ||
        lower.includes("bug") ||
        lower.includes("problem") ||
        lower.includes("security") ||
        rawTitle.includes("🚨") ||
        rawTitle.includes("❌")
      ) {
        type = "issues";
      }

      // If current section has blocks, save it
      if (currentSection.blocks.length > 0) {
        sections.push(currentSection);
      }

      currentSection = {
        id: `section-${sections.length}-${type}`,
        title: rawTitle,
        type,
        blocks: [],
      };
      continue;
    }

    // List item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      const itemContent = trimmed.replace(/^([-*]|\d+\.)\s+/, "");
      listBuffer.push(itemContent);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      currentSection.blocks.push({
        type: "quote",
        text: trimmed.replace(/^>\s*/, ""),
      });
      continue;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    currentSection.blocks.push({
      type: "paragraph",
      text: trimmed,
    });
  }

  flushList();
  if (inCode && codeBuffer.length > 0) {
    currentSection.blocks.push({
      type: "code",
      code: codeBuffer.join("\n"),
      language: codeLang,
    });
  }

  if (currentSection.blocks.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

export function MarkdownReviewRenderer({ markdown }: { markdown: string }) {
  const sections = parseReviewMarkdown(markdown);

  if (sections.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No review text available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        // Section color themes
        let badgeStyle = "bg-muted text-muted-foreground border-border";
        let cardStyle = "border-border/80 bg-card";
        let icon = <Info className="size-4 text-muted-foreground" />;

        if (section.type === "good") {
          badgeStyle = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
          cardStyle = "border-emerald-500/25 bg-emerald-500/[0.03]";
          icon = <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />;
        } else if (section.type === "suggestions") {
          badgeStyle = "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
          cardStyle = "border-amber-500/25 bg-amber-500/[0.03]";
          icon = <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />;
        } else if (section.type === "issues") {
          badgeStyle = "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
          cardStyle = "border-red-500/25 bg-red-500/[0.03]";
          icon = <AlertCircle className="size-4 text-red-600 dark:text-red-400" />;
        } else if (section.type === "summary") {
          badgeStyle = "bg-primary/10 text-primary border-primary/25";
          cardStyle = "border-primary/20 bg-primary/[0.02]";
          icon = <Sparkles className="size-4 text-primary" />;
        }

        return (
          <div
            key={section.id}
            className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-colors ${cardStyle}`}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background border border-border/80 shadow-2xs">
                {icon}
              </span>
              <h3 className="font-semibold text-sm text-foreground tracking-tight">
                {section.title}
              </h3>
            </div>

            {/* Content Blocks */}
            <div className="space-y-3">
              {section.blocks.map((block, idx) => {
                if (block.type === "paragraph") {
                  return (
                    <p
                      key={idx}
                      className="text-xs sm:text-[13px] leading-relaxed text-foreground/90 font-normal"
                    >
                      {renderInlineMarkdown(block.text)}
                    </p>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul key={idx} className="space-y-2 pl-1">
                      {block.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed text-foreground/90"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                          <div className="flex-1">{renderInlineMarkdown(item)}</div>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "code") {
                  return (
                    <CodeSnippet
                      key={idx}
                      code={block.code}
                      language={block.language}
                    />
                  );
                }

                if (block.type === "quote") {
                  return (
                    <div
                      key={idx}
                      className="border-l-2 border-primary/60 bg-muted/40 px-3.5 py-2 text-xs italic text-muted-foreground rounded-r-md"
                    >
                      {renderInlineMarkdown(block.text)}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
