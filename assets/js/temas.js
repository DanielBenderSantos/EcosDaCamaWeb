const themeSelector = document.getElementById('theme-selector');
const body = document.body;

// Carregar tema salvo
const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    body.classList.add(savedTheme);
}
