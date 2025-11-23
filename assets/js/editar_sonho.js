const API_URL = "https://ecosdacamaweb.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

function getDreamIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarSonho() {
  const token = getToken();
  const id = getDreamIdFromUrl();

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  if (!id) {
    alert("ID do sonho não informado.");
    window.location.href = "dashboard.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dreams/${id}`, {
      headers: {
        "Authorization": "Bearer " + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao carregar sonho para edição");
      window.location.href = "dashboard.html";
      return;
    }

    // Preenche os campos
    document.getElementById("titulo").value = data.titulo || "";
    document.getElementById("descricao").value = data.descricao || "";
    const select = document.getElementById("sentimento");
    if (data.humor) {
      select.value = data.humor;
    } else {
      select.value = "";
    }

  } catch (err) {
    console.error("Erro ao carregar sonho:", err);
    alert("Erro de conexão ao carregar sonho");
    window.location.href = "dashboard.html";
  }
}

async function atualizarSonho() {
  const token = getToken();
  const id = getDreamIdFromUrl();

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const sentimento = document.getElementById("sentimento").value;

  if (!titulo || !descricao) {
    alert("Preencha título e descrição.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dreams/${id}`, {
      method: "PUT",
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
      alert(data.error || "Erro ao atualizar sonho");
      return;
    }

    // Feedback visual
    const box = document.getElementById("successMsg");
    box.style.display = "block";

    setTimeout(() => {
      box.style.display = "none";
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (err) {
    console.error("Erro ao atualizar sonho:", err);
    alert("Erro de conexão ao atualizar sonho");
  }
}

document.addEventListener("DOMContentLoaded", carregarSonho);
