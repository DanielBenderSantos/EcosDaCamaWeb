document.getElementById("loginForm").addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede o envio padrão do form

  // opcional: pegue os valores
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // aqui você pode fazer validação, consulta na API, etc.
  // exemplo simples:
  if (email === "teste@teste.com" && senha === "123") {

    // 🔥 redireciona
    window.location.href = "dashboard.html";

  } else {
    alert("Login inválido!");
  }
});
