const themeSelector = document.getElementById('theme-selector');
const body = document.body;

// Carregar tema salvo
const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    themeSelector.value = savedTheme;
}

// Quando mudar o select
themeSelector.addEventListener('change', () => {
    const selected = themeSelector.value;

    // Remove todos os temas
    body.classList.remove(
        'theme-purple',
        'theme-gamer',
        'theme-sunset',
        'theme-ocean',
        'theme-future'
    );

    // Adiciona o escolhido
    if (selected !== "") {
        body.classList.add(selected);
    }

    // Salva
    localStorage.setItem('selected-theme', selected);
});
