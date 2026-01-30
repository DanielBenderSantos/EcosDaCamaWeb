// assets/js/index.js

const dreamsContainer = document.getElementById("dreamsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Mesma chave usada no novo_sonho.js
const LOCAL_DREAMS_KEY = "ecos_sonhos_v1";

let allDreams = [];
let currentPage = 1;
const pageSize = 5; // quantos sonhos por página

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

// Normaliza o formato para a UI, independente da origem
function normalizeDream(d) {
  return {
    id: d?.id ?? "",
    titulo: d?.titulo ?? "",
    descricao: d?.descricao ?? "",
    // local: sentimento | api antigo: humor
    sentimento: d?.sentimento ?? d?.humor ?? "",
    // local: createdAt | api: created_at
    createdAt: d?.createdAt ?? d?.created_at ?? "",
    significado: d?.significado ?? d?.interpretacao ?? "",
  };
}

function formatarDataDream(dream) {
  const raw = dream?.createdAt;
  if (!raw) return "";

  // aceita "2025-11-23 19:24:39" ou ISO
  const iso = String(raw).includes("T") ? String(raw) : String(raw).replace(" ", "T");
  const d = new Date(iso);

  if (isNaN(d.getTime())) return "";

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  const horas = String(d.getHours()).padStart(2, "0");
  const minutos = String(d.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} • ${horas}:${minutos}`;
}

function renderPage(page) {
  dreamsContainer.innerHTML = "";

  if (!allDreams || allDreams.length === 0) {
    dreamsContainer.innerHTML =
      `<p style="text-align:center;">Você ainda não registrou nenhum sonho.</p>`;
    pageInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const totalPages = Math.ceil(allDreams.length / pageSize);
  currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dreamsToShow = allDreams.slice(startIndex, endIndex);

  dreamsToShow.forEach((rawDream) => {
    const dream = normalizeDream(rawDream);

    const card = document.createElement("div");
    card.classList.add("dream-card");

    const dataFormatada = formatarDataDream(dream);

    card.innerHTML = `
      <h3>${escapeHtml(dream.titulo)}</h3>
      ${dataFormatada ? `<p class="dream-date">${escapeHtml(dataFormatada)}</p>` : ""}
      <p class="dream-description">${escapeHtml(dream.descricao)}</p>

      ${dream.sentimento
        ? `<span class="dream-mood mood-${escapeClass(dream.sentimento)}">
              Sentimento: ${escapeHtml(dream.sentimento)}
             </span>`
        : ""
      }

      ${dream.significado
        ? `<details class="dream-meaning">
              <summary>Ver interpretação</summary>
              <p>${escapeHtml(dream.significado)}</p>
            </details>`
        : ""
      }

      <div class="dream-actions">
        <button class="edit-btn" data-id="${escapeAttr(dream.id)}">Editar</button>
        <button class="delete-btn" data-id="${escapeAttr(dream.id)}">Excluir</button>
      </div>
    `;

    dreamsContainer.appendChild(card);
  });

  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // eventos dos botões de ação
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      editarSonho(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      excluirSonho(id);
    });
  });
}

function carregarSonhos() {
  try {
    allDreams = getLocalDreams();

    // garante ordem mais recente primeiro (se tiver createdAt)
    allDreams.sort((a, b) => {
      const da = new Date((a?.createdAt || a?.created_at || 0));
      const db = new Date((b?.createdAt || b?.created_at || 0));
      return db - da;
    });

    renderPage(1);
  } catch (err) {
    console.error("Erro ao carregar sonhos locais:", err);
    dreamsContainer.innerHTML =
      `<p style="text-align:center;">Erro ao carregar seus sonhos.</p>`;
  }
}

function editarSonho(id) {
  window.location.href = `editar_sonho.html?id=${encodeURIComponent(id)}`;
}

function excluirSonho(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este sonho?");
  if (!confirmar) return;

  try {
    const dreams = getLocalDreams();
    const filtered = dreams.filter((d) => String(d?.id) !== String(id));
    setLocalDreams(filtered);

    // atualiza tela
    allDreams = filtered;

    const maxPage = Math.max(1, Math.ceil(allDreams.length / pageSize));
    if (currentPage > maxPage) currentPage = maxPage;

    renderPage(currentPage);
  } catch (err) {
    console.error("Erro ao excluir sonho local:", err);
    alert("Erro ao excluir sonho");
  }
}

prevBtn.addEventListener("click", () => {
  renderPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  renderPage(currentPage + 1);
});

document.addEventListener("DOMContentLoaded", carregarSonhos);

/**
 * Helpers básicos para evitar injeção de HTML quando o usuário digitar coisas como "<script>"
 */
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// para usar em data-id / atributos
function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

// para usar em classe CSS (evitar espaços e caracteres estranhos)
function escapeClass(str) {
  return String(str ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
}
