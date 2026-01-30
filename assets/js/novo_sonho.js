// assets/js/novo_sonho.js

const API_URL = "https://ecosdacamaweb.onrender.com";

// Chave onde os sonhos ficam salvos localmente
const LOCAL_DREAMS_KEY = "ecos_sonhos_v1";

let isSaving = false; // trava para evitar cliques múltiplos

function getLocalDreams() {
  try {
    const raw = localStorage.getItem(LOCAL_DREAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao ler sonhos do localStorage:", e);
    return [];
  }
}

function setLocalDreams(dreams) {
  localStorage.setItem(LOCAL_DREAMS_KEY, JSON.stringify(dreams));
}

function addLocalDream(dream) {
  const dreams = getLocalDreams();
  dreams.unshift(dream); // adiciona no topo (mais recente primeiro)
  setLocalDreams(dreams);
}

function createDreamObject({ titulo, descricao, sentimento, significado }) {
  // id simples e bom o suficiente pra uso local
  const id = (crypto?.randomUUID?.() || `d_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  return {
    id,
    titulo,
    descricao,
    sentimento,
    significado,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "local",
  };
}

async function salvarSonho() {
  if (isSaving) return;

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const sentimento = document.getElementById("sentimento").value;
  const significadoEl = document.getElementById("interpretacao");
  const significado = significadoEl ? significadoEl.value.trim() : "";

  if (!titulo || !descricao) {
    alert("Por favor, preencha título e descrição.");
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

    // ✅ SALVA LOCALMENTE
    const dream = createDreamObject({
      titulo,
      descricao,
      sentimento,
      significado,
    });

    addLocalDream(dream);

    // Mostra mensagem de sucesso
    if (successBox) {
      successBox.style.display = "block";
    }

    // Limpa formulário
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("sentimento").value = "";
    if (significadoEl) significadoEl.value = "";

    // Some depois de 3s
    setTimeout(() => {
      if (successBox) successBox.style.display = "none";
    }, 3000);

  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao salvar localmente");
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

    if (!response.ok) {
      interpretacaoBox.value = data?.error || "❌ Erro ao interpretar o sonho.";
      return;
    }

    interpretacaoBox.value =
      data?.interpretacao || "Não veio nenhuma interpretação na resposta.";
  } catch (error) {
    console.error(error);
    interpretacaoBox.value =
      "❌ Erro ao interpretar o sonho (falha na conexão).";
  }
}
