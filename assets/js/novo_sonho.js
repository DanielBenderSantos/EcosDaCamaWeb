// assets/js/novo_sonho.js

const API_URL = "https://ecosdacamaweb.onrender.com";

let isSaving = false; // trava para evitar cliques múltiplos

async function salvarSonho() {
  if (isSaving) {
    // se já estiver salvando, ignora cliques extras
    return;
  }

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

  const btn = document.getElementById("salvarBtn");
  const successBox = document.getElementById("successMsg");

  try {
    isSaving = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Salvando...";
    }

    const response = await fetch(`${API_URL}/dreams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        titulo,
        descricao,
        sentimento,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao salvar sonho");
      return;
    }

    // Mostra mensagem de sucesso
    if (successBox) {
      successBox.style.display = "block";
    }

    // Limpa formulário
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("sentimento").value = "";

    // Some depois de 3s
    setTimeout(() => {
      if (successBox) {
        successBox.style.display = "none";
      }
    }, 3000);
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao conectar com o servidor");
  } finally {
    isSaving = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Salvar Sonho";
    }
  }
}

async function interpretarSonho() {
  const texto = document.getElementById("descricao").value.trim();
  const interpretacaoBox = document.getElementById("interpretacao");

  if (!texto) {
    interpretacaoBox.value = "⚠️ Escreva o sonho primeiro.";
    return;
  }

  interpretacaoBox.value = "Interpretando sonho... aguarde ⏳";

  try {
    const response = await fetch(`${API_URL}/api/interpretar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });

    const data = await response.json();
    interpretacaoBox.value =
      data?.interpretacao || "Não veio nenhuma interpretação na resposta.";
  } catch (error) {
    interpretacaoBox.value = "❌ Erro ao interpretar o sonho.";
    console.log(error);
  }
}
