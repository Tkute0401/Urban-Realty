// Hide splash screen after loading
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 800); // Match CSS transition
  }, 2500); // Adjust timing (2.5s total)
});