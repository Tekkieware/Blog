// This component must be rendered in the document head to prevent FOIT
export function ThemeScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            var storageKey = 'stacked-theme';
            var defaultTheme = 'dark';
            
            try {
              var theme = localStorage.getItem(storageKey) || defaultTheme;
              document.documentElement.classList.toggle('dark', theme === 'dark');
            } catch (e) {
              document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
            }
          })()
        `,
            }}
        />
    )
}