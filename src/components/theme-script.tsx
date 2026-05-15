export function ThemeScript() {
  const script = `
    (function () {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "dark") { document.documentElement.classList.add("dark"); return; }
        if (stored === "light") { document.documentElement.classList.remove("dark"); return; }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        }
      } catch {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}