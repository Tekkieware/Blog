interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function generateToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];

  lines.forEach(line => {
    const match = line.match(/^(#+)\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      toc.push({ id, title, level });
    }
  });

  return toc;
}
