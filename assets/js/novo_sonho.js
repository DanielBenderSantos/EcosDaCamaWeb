const API_URL = "https://ecosdacamaweb.onrender.com";

async function salvarSonho() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const sentimento = document.getElementById("sentimento").value;

  if (!titulo || !descricao) {
    alert("Por favor, preencha título e descrição.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dreams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        titulo,
        descricao,
        sentimento
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao salvar sonho");
      return;
    }

    // Mensagem de sucesso
    const box = document.getElementById("successMsg");
    box.style.display = "block";

    // Limpa o formulário
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("sentimento").value = "";

    // Some depois de 3s
    setTimeout(() => {
      box.style.display = "none";
    }, 3000);

  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao conectar com o servidor");
  }
}
