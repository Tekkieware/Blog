import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex gap-3 items-end">
          <Logo />
          <p className="font-mono text-center text-sm text-muted-foreground">
            &quot;Build solutions. Share thoughts.&quot;
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 font-mono text-sm">
          <a href="https://github.com/Tekkieware" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open github://io
          </a>
          <a href="https://isaiahozadhe.tech" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open portfolio://io
          </a>
          <a href="https://www.linkedin.com/in/isaiah-ozadhe/" className="text-muted-foreground hover:text-foreground transition-colors">
            &gt; open linkedin://io
          </a>
        </div>
      </div>
    </footer>
  )
}
