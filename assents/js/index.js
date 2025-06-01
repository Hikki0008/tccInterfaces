// Alternar tema 
function toggleTheme() {
  const body = document.body;
  const button = document.getElementById("themeToggle");
  body.classList.toggle("light");
  button.textContent = body.classList.contains("light") ? "🌙" : "☀️";
}

// Atualiza ícone do botão
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("themeToggle");
  button.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
});

// Cadastro
document.getElementById("btnCadastrar").addEventListener("click", function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!nome || !email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  document.getElementById("confirmation").textContent = "Cadastro realizado com sucesso!";

});


    