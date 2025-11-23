const API_URL = "https://ecosdacamaweb.onrender.com";

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    if (senha !== confirmar) {
        alert("As senhas não são iguais!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Erro ao criar conta");
            return;
        }

        alert("Conta criada com sucesso!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao conectar com o servidor");
    }
});
