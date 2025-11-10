const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const root = document.documentElement;
              const body = document.body;
              
              // Force dark theme only
              root.classList.add('dark');
              body.style.backgroundColor = '#111827';
              body.style.color = '#f3f4f6';
              
              // Remove any stored theme preference
              localStorage.removeItem('dashboard-theme');
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};

export default ThemeScript;
