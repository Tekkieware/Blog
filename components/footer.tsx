export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-center text-sm text-muted-foreground">
          &quot;Build systems. Grow people. Leave logs.&quot;
        </p>
        <div className="flex items-center gap-4 font-mono text-sm">
          <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open github://senior.dev
          </a>
          <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open x://senior.dev
          </a>
          <a href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open linkedin://senior.dev
          </a>
        </div>
      </div>
    </footer>
  )
}
