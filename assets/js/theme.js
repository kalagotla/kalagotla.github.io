(function(){
  function applyInitialTheme() {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var storedTheme = null;
    try { storedTheme = localStorage.getItem('theme'); } catch(e) {}
    var isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-theme', isDark);
  }

  function updateToggleButtonIcon(button) {
    if (!button) return;
    var icon = button.querySelector('i');
    var dark = document.body.classList.contains('dark-theme');
    button.setAttribute('aria-pressed', String(dark));
    if (icon) {
      icon.classList.toggle('fa-moon', !dark);
      icon.classList.toggle('fa-sun', dark);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    applyInitialTheme();
    var toggle = document.getElementById('theme-toggle');
    updateToggleButtonIcon(toggle);
    if (toggle) {
      toggle.addEventListener('click', function() {
        var nowDark = !document.body.classList.contains('dark-theme');
        document.documentElement.classList.toggle('dark-theme', nowDark);
        document.body.classList.toggle('dark-theme', nowDark);
        try { localStorage.setItem('theme', nowDark ? 'dark' : 'light'); } catch(e) {}
        updateToggleButtonIcon(toggle);
      });
    }
  });
})();


