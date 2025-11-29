// assets/js/perfil.js
const API_URL = "https://ecosdacamaweb.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

function getUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();

  // Se não estiver logado, volta pra tela de login
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const user = getUserFromStorage();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");

  if (user && user.nome) nomeInput.value = user.nome;
  if (user && user.email) emailInput.value = user.email;

  const form = document.getElementById("perfilForm");
  form.addEventListener("submit", salvarPerfil);
});

async function salvarPerfil(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senhaAtual = document.getElementById("senhaAtual").value.trim();
  const novaSenha = document.getElementById("novaSenha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (!nome || !email) {
    alert("Nome e email são obrigatórios.");
    return;
  }

  // Se preencheu parte da troca de senha, valida tudo
  const querMudarSenha = senhaAtual || novaSenha || confirmarSenha;

  if (querMudarSenha) {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert("Para alterar a senha, preencha senha atual, nova senha e confirmação.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }
  }

  const body = {
    nome,
    email,
  };

  if (querMudarSenha) {
    body.senhaAtual = senhaAtual;
    body.novaSenha = novaSenha;
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao atualizar perfil");
      return;
    }

    // Atualiza o usuário no localStorage para refletir os novos dados
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // Limpa campos de senha
    document.getElementById("senhaAtual").value = "";
    document.getElementById("novaSenha").value = "";
    document.getElementById("confirmarSenha").value = "";

    alert("Dados atualizados com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    alert("Erro ao conectar com o servidor");
  }
}
