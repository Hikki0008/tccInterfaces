function cadastrar(event) {
    event.preventDefault();

    const nome = document.getElementById('idnome').value.trim();
    const email = document.getElementById('idemail').value.trim();
    const cpf = document.getElementById('idcpf').value.trim();
    const especialidade = document.getElementById('idespecialidade').value.trim();
    const certificado = document.getElementById('idcertificado').value.trim();
    const senha = document.getElementById('idsenha').value.trim();

    if (!nome || !email || !cpf || !especialidade || !senha) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (cpf.length < 11) {
        alert("CPF deve ter pelo menos 11 dígitos.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Cadastrando...";

    fetch('http://localhost:8080/auth/register/profissional', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nome": nome,
            "email": email,
            "cpf": cpf,
            "especialidade": especialidade,
            "certificado": certificado,
            "password": senha
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta da API:", data);
            alert("Profissional cadastrado com sucesso! Você será redirecionado.");
            window.location.href = '../index.html';
        })
        .catch(error => {
            console.error("Erro ao enviar dados:", error);
            alert("Erro ao cadastrar profissional. Verifique os dados e tente novamente.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Cadastrar";
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("formcadastro");
    if (form) {
        form.addEventListener("submit", cadastrar);
    } else {
        console.error("Formulário com ID 'formcadastro' não encontrado!");
    }
});