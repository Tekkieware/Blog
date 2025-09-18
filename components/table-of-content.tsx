import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
    id: string;
    title: string;
    level: number;
}

interface TableOfContentsProps {
    items: TocItem[];
    className?: string;
}

export const TableOfContents = ({ items, className }: TableOfContentsProps) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80px 0px' }
        );

        // Observe all headings
        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={cn("space-y-4", className)}>
            <div className="bg-gradient-subtle border border-border rounded-lg p-4 shadow-soft">
                <h4 className="font-mono font-bold text-foreground mb-4">Table of Contents</h4>
                <ul className="space-y-2 text-sm">
                    {items.map((item) => (
                        <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                            <button
                                onClick={() => handleClick(item.id)}
                                className={cn(
                                    "text-left w-full flex items-center transition-colors hover:text-toc-active group",
                                    activeId === item.id
                                        ? "text-toc-active font-bold"
                                        : "text-toc-inactive"
                                )}
                            >
                                <span
                                    className={cn(
                                        "mr-2 text-xs opacity-50 group-hover:opacity-70",
                                        activeId === item.id && "text-primary"
                                    )}>
                                    {"#".repeat(item.level)}
                                </span>
                                <span className="truncate">{item.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};