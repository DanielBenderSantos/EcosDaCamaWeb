// assets/js/dashboard.js

const API_URL = "https://ecosdacamaweb.onrender.com";

const dreamsContainer = document.getElementById("dreamsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let allDreams = [];
let currentPage = 1;
const pageSize = 5; // quantos sonhos por página

function getToken() {
  return localStorage.getItem("token");
}

function formatarDataDream(dream) {
  if (!dream.created_at) return "";

  // cuidado com formato "2025-11-23 19:24:39"
  const iso = String(dream.created_at).replace(" ", "T");
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

  if (allDreams.length === 0) {
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

  dreamsToShow.forEach((dream) => {
    const card = document.createElement("div");
    card.classList.add("dream-card");

    const dataFormatada = formatarDataDream(dream);

    card.innerHTML = `
      <h3>${dream.titulo}</h3>
      ${dataFormatada ? `<p class="dream-date">${dataFormatada}</p>` : ""}
      <p class="dream-description">${dream.descricao}</p>
      ${
        dream.humor
          ? `<span class="dream-mood mood-${dream.humor}">
              Humor: ${dream.humor}
             </span>`
          : ""
      }
      <div class="dream-actions">
        <button class="edit-btn" data-id="${dream.id}">Editar</button>
        <button class="delete-btn" data-id="${dream.id}">Excluir</button>
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

async function carregarSonhos() {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dreams`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ao carregar sonhos:", data);
      dreamsContainer.innerHTML =
        `<p style="text-align:center;">Erro ao carregar seus sonhos.</p>`;
      return;
    }

    allDreams = Array.isArray(data) ? data : [];
    renderPage(1);
  } catch (err) {
    console.error("Erro de rede ao carregar sonhos:", err);
    dreamsContainer.innerHTML =
      `<p style="text-align:center;">Erro de conexão ao carregar seus sonhos.</p>`;
  }
}

function editarSonho(id) {
  // redireciona para a tela de edição com o id na URL
  window.location.href = `editar_sonho.html?id=${id}`;
}

async function excluirSonho(id) {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const confirmar = confirm("Tem certeza que deseja excluir este sonho?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_URL}/dreams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao excluir sonho");
      return;
    }

    // remove do array e re-renderiza
    allDreams = allDreams.filter((d) => String(d.id) !== String(id));

    // caso a página fique vazia, volta uma página
    const maxPage = Math.max(1, Math.ceil(allDreams.length / pageSize));
    if (currentPage > maxPage) currentPage = maxPage;

    renderPage(currentPage);
  } catch (err) {
    console.error("Erro ao excluir sonho:", err);
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
