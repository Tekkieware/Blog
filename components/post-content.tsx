"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DebugNote } from '@/components/debug-note';
import { cn } from '@/lib/utils';

interface PostContentProps {
  content: string;
  children: (params: {
    toc: TocEntry[];
    debugNotes: ReactNode[];
    renderedContent: ReactNode;
  }) => ReactNode;
}

interface TocEntry {
  id: string;
  title: string;
  level: number;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className="relative rounded bg-code-background px-[0.3rem] py-[0.2rem] font-mono text-sm text-code-foreground border border-code-border"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between bg-code-background border border-code-border rounded-t-lg px-4 py-2">
        <span className="text-xs font-mono text-code-foreground/70 uppercase tracking-wide">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-code-foreground/10"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-code-foreground/70" />
          )}
        </Button>
      </div>
      <div className="rounded-b-lg overflow-hidden border-x border-b border-code-border">
        <SyntaxHighlighter
          style={theme === 'dark' ? vscDarkPlus : vs}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: 'hsl(var(--code-background))',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              color: 'hsl(var(--code-foreground))',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            },
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const PostContent = ({ content, children }: PostContentProps) => {
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [debugNotes, setDebugNotes] = useState<ReactNode[]>([]);

  const renderedContent = (
    <div className={cn("prose prose-gray dark:prose-invert max-w-none")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: CodeBlock,
          h1: ({ children, ...props }) => {
            const id = generateSlug(String(children));
            const title = String(children);
            useEffect(() => {
              setToc(prev => [...prev, { id, title, level: 1 }]);
            }, []);
            return (
              <h1 id={id} className="scroll-mt-20 text-prose-headings font-bold" {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const id = generateSlug(String(children));
            const title = String(children);
            useEffect(() => {
              setToc(prev => [...prev, { id, title, level: 2 }]);
            }, []);
            return (
              <h2 id={id} className="scroll-mt-20 text-prose-headings font-semibold" {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const id = generateSlug(String(children));
            const title = String(children);
            useEffect(() => {
              setToc(prev => [...prev, { id, title, level: 3 }]);
            }, []);
            return (
              <h3 id={id} className="scroll-mt-20 text-prose-headings font-semibold" {...props}>
                {children}
              </h3>
            );
          },
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-prose-links hover:text-prose-links/80 underline decoration-prose-links/30 hover:decoration-prose-links/60 transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }) => {
            const childArray = React.Children.toArray(children);
            if (
              childArray.length > 0 &&
              typeof childArray[0] === 'object' &&
              'props' in childArray[0] &&
              childArray[0].props.children &&
              typeof childArray[0].props.children[0] === 'string' &&
              childArray[0].props.children[0].startsWith('**Debug Note:**')
            ) {
              const content = childArray[0].props.children[0].replace('**Debug Note:**', '').trim();
              const note = <DebugNote>{content}</DebugNote>;
              useEffect(() => {
                setDebugNotes(prev => [...prev, note]);
              }, []);
              return null; // Don't render it in the main content
            }
            return (
              <blockquote
                className="border-l-4 border-primary/30 bg-gradient-subtle pl-6 py-2 my-6 italic text-prose-emphasis rounded-lg"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-soft my-8 max-w-full h-auto"
              {...props}
            />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-border rounded-lg" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border px-4 py-2 text-foreground" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  return <>{children({ toc, debugNotes, renderedContent })}</>;
};
