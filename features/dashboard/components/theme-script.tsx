const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('dashboard-theme');
              const root = document.documentElement;
              const body = document.body;
              
              if (theme === 'dark') {
                root.classList.add('dark');
                body.style.backgroundColor = '#111827';
                body.style.color = '#f3f4f6';
              } else {
                root.classList.remove('dark');
                body.style.backgroundColor = 'white';
                body.style.color = '#374151';
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};

export default ThemeScript;
