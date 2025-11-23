// Proteção global das páginas que usam o menu
if (!localStorage.getItem("token")) {
    window.location.href = "index.html"; // volta para o login
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    sidebar.classList.toggle("active");
    content.classList.toggle("shift");
}