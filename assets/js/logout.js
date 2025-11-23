function logout() {
    if (confirm("Deseja realmente sair?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html"; // 🏡 volta para tela de login
    }
}
