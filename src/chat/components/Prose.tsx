"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";

interface ProseProps {
  content: string;
  streaming?: boolean;
}

export function Prose({ content, streaming }: ProseProps) {
  return (
    <div className="g-prose">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
            const isInline = !className && typeof children === "string" && !(children as string).includes("\n");
            if (isInline) {
              return <code className={className} {...props}>{children}</code>;
            }
            const match = /language-(\w+)/.exec(className || "");
            const lang = match?.[1] ?? "text";
            const raw = String(children).replace(/\n$/, "");
            return <CodeBlock code={raw} language={lang} />;
          },
          pre({ children }: React.ComponentPropsWithoutRef<"pre">) {
            // Let CodeBlock handle the wrapper
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {streaming && content.length > 0 && <span className="g-cursor" />}
    </div>
  );
}