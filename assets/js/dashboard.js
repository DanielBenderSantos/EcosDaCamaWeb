const API_URL = "https://ecosdacamaweb.onrender.com";

const dreamsContainer = document.getElementById("dreamsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let allDreams = [];
let currentPage = 1;
const pageSize = 5;

function formatarDataDream(dream) {
  // Usa sempre o created_at vindo do backend
  if (!dream.created_at) return "";

  // created_at normalmente vem como string ISO: "2025-11-23T19:24:39.496Z"
  const iso = String(dream.created_at).replace(" ", "T"); // caso venha "2025-11-23 19:24:39"
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
  `;

  dreamsContainer.appendChild(card);
});

  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

async function carregarSonhos() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dreams`, {
      headers: {
        "Authorization": "Bearer " + token,
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

prevBtn.addEventListener("click", () => {
  renderPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  renderPage(currentPage + 1);
});

document.addEventListener("DOMContentLoaded", carregarSonhos);
