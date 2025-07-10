function cadastrar(event) {
    event.preventDefault();

    const nome = document.getElementById('idnome').value.trim();
    const email = document.getElementById('idemail').value.trim();
    const cpf = document.getElementById('idcpf').value.trim();
    const especialidade = document.getElementById('idespecialidade').value.trim();
    const certificado = document.getElementById('idcertificado').value.trim();
    const senha = document.getElementById('idsenha').value.trim();


    if (!nome || !email || !cpf || !especialidade || !certificado|| !senha) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }


    if (cpf.length < 11) {
        alert("CPF deve ter pelo menos 11 dígitos.");
        return;
    }

    if (senha.length < 6) {
        alert("Senha deve ter pelo menos 6 caracteres.");
        return;
    }


    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Cadastrando...";


    fetch('http://localhost:8080/api/Profissional', {
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
            "senha": senha
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta da API:", data);
            alert("Usuario cadastrado com sucesso!");

            document.getElementById('idnome').value = "";
            document.getElementById('idemail').value = "";
            document.getElementById('idcpf').value = "";
            document.getElementById('idespecialidade').value = "";
            document.getElementById('idcertificado').value = "";
            document.getElementById('idsenha').value = "";
        })
        .catch(error => {
            console.error("Erro ao enviar dados:", error);
            alert("Erro ao cadastrar usuário. Verifique sua conexão e tente novamente.");
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