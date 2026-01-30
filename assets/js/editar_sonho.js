// assets/js/editar_sonho.js

const LOCAL_DREAMS_KEY = "ecos_sonhos_v1";

let isSaving = false;

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

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

function normalizeDream(d) {
  return {
    id: d?.id ?? "",
    titulo: d?.titulo ?? "",
    descricao: d?.descricao ?? "",
    sentimento: d?.sentimento ?? d?.humor ?? "",
    significado: d?.significado ?? d?.interpretacao ?? "",
    createdAt: d?.createdAt ?? d?.created_at ?? "",
    updatedAt: d?.updatedAt ?? d?.updated_at ?? "",
  };
}

function carregarDreamNaTela(dream) {
  document.getElementById("titulo").value = dream.titulo || "";
  document.getElementById("descricao").value = dream.descricao || "";
  document.getElementById("sentimento").value = dream.sentimento || "";

  const interpretacaoEl = document.getElementById("interpretacao");
  if (interpretacaoEl) interpretacaoEl.value = dream.significado || "";
}

function carregarSonhoParaEdicao() {
  const id = getParam("id");
  if (!id) {
    alert("ID do sonho não informado.");
    window.location.href = "index.html";
    return;
  }

  const dreams = getLocalDreams();
  const found = dreams.find((d) => String(d?.id) === String(id));

  if (!found) {
    alert("Sonho não encontrado no armazenamento local.");
    window.location.href = "index.html";
    return;
  }

  const dream = normalizeDream(found);
  carregarDreamNaTela(dream);
}

function salvarEdicao() {
  if (isSaving) return;

  const id = getParam("id");
  if (!id) {
    alert("ID do sonho não informado.");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const sentimento = document.getElementById("sentimento").value;

  const interpretacaoEl = document.getElementById("interpretacao");
  const significado = interpretacaoEl ? interpretacaoEl.value.trim() : "";

  if (!titulo || !descricao) {
    alert("Por favor, preencha título e descrição.");
    return;
  }

  const btn = document.getElementById("salvarBtn");

  try {
    isSaving = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Salvando...";
    }

    const dreams = getLocalDreams();
    const idx = dreams.findIndex((d) => String(d?.id) === String(id));

    if (idx === -1) {
      alert("Sonho não encontrado para atualizar.");
      return;
    }

    const old = normalizeDream(dreams[idx]);

    const updated = {
      ...dreams[idx],
      id: old.id, // garante id
      titulo,
      descricao,
      sentimento,
      significado,
      createdAt: old.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "local",
    };

    dreams[idx] = updated;
    setLocalDreams(dreams);

    alert("Sonho atualizado com sucesso!");
    window.location.href = "index.html";
  } catch (e) {
    console.error(e);
    alert("Erro ao salvar edição.");
  } finally {
    isSaving = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Salvar Alterações";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarSonhoParaEdicao();

  const btn = document.getElementById("salvarBtn");
  if (btn) btn.addEventListener("click", salvarEdicao);
});
