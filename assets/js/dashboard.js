const API_URL = "https://ecosdacamaweb.onrender.com";

const dreamsContainer = document.getElementById("dreamsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let allDreams = [];
let currentPage = 1;
const pageSize = 5; // quantos sonhos por página

function formatarData(dateStr, timeStr) {
  if (!dateStr && !timeStr) {
    return "";
  }

  try {
    // se tiver data/hora separados
    if (dateStr && timeStr) {
      return new Date(`${dateStr}T${timeStr}`).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    }

    // fallback: tenta usar só a data ou created_at
    return new Date(dateStr || timeStr).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function renderPage(page) {
  dreamsContainer.innerHTML = "";

  if (allDreams.length === 0) {
    dreamsContainer.innerHTML = `<p style="text-align:center;">Você ainda não registrou nenhum sonho.</p>`;
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

    const dataFormatada = formatarData(dream.data, dream.hora || dream.created_at);

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
      dreamsContainer.innerHTML = `<p style="text-align:center;">Erro ao carregar seus sonhos.</p>`;
      return;
    }

    allDreams = Array.isArray(data) ? data : [];
    renderPage(1);
  } catch (err) {
    console.error("Erro de rede ao carregar sonhos:", err);
    dreamsContainer.innerHTML = `<p style="text-align:center;">Erro de conexão ao carregar seus sonhos.</p>`;
  }
}

// eventos dos botões de página
prevBtn.addEventListener("click", () => {
  renderPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  renderPage(currentPage + 1);
});

// inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", carregarSonhos);
