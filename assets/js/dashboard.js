// Lista de sonhos simulados. Depois você troca pela API real.
const sonhos = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    titulo: `Sonho ${i + 1}`,
    descricao: "Descrição breve do sonho. Depois isso será substituído pela descrição real salva no banco."
}));

const container = document.getElementById("dreamsContainer");
const pageInfo = document.getElementById("pageInfo");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let paginaAtual = 1;
const itensPorPagina = 10;

// Renderiza os cards
function renderizarPagina() {
    container.innerHTML = "";

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const sonhosPagina = sonhos.slice(inicio, fim);

    sonhosPagina.forEach(s => {
    const div = document.createElement("div");
    div.classList.add("dream-card");

    div.innerHTML = `
        <h3>${s.titulo}</h3>
        <p>${s.descricao}</p>
    `;

    container.appendChild(div);
    });

    atualizarPaginacao();
}

function atualizarPaginacao() {
    const totalPaginas = Math.ceil(sonhos.length / itensPorPagina);

    pageInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    prevBtn.disabled = paginaAtual === 1;
    nextBtn.disabled = paginaAtual === totalPaginas;
}

prevBtn.onclick = () => {
    paginaAtual--;
    renderizarPagina();
};

nextBtn.onclick = () => {
    paginaAtual++;
    renderizarPagina();
};

// Inicializa
renderizarPagina();