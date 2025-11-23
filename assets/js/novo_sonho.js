function salvarSonho() {
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const sentimento = document.getElementById("sentimento").value;

    if (!titulo || !descricao || !sentimento) {
    alert("Preencha todos os campos!");
    return;
    }

    // Aqui depois você troca pela sua API:
    // fetch("https://sua-api/sonhos", { method: "POST", body: JSON.stringify({titulo, descricao, sentimento}) })

    console.log("Sonho salvo:", { titulo, descricao, sentimento });

    // Mensagem de sucesso
    const msg = document.getElementById("successMsg");
    msg.style.display = "block";

    // Limpar campos
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("sentimento").value = "";
}