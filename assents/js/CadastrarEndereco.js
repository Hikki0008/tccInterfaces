// --- URL Base da API do seu Backend ---
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const erroCep = document.getElementById("erro-cep");
    const form = document.getElementById("form-cadastro-endereco");

    // Lógica para buscar e preencher o endereço a partir do CEP (fornecida por você)
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) {
            erroCep.textContent = "CEP inválido. Deve conter 8 dígitos.";
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                erroCep.textContent = "CEP não encontrado.";
                limparFormularioEndereco();
                return;
            }

            erroCep.textContent = "";
            document.getElementById("endereco").value = dados.logradouro || "";
            document.getElementById("bairro").value = dados.bairro || "";
            document.getElementById("cidade").value = dados.localidade || "";
            document.getElementById("estado").value = dados.uf || "";

        } catch (e) {
            erroCep.textContent = "Erro ao buscar o CEP. Verifique sua conexão.";
        }
    });

    // Lógica para enviar o formulário para o seu Controller
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const enderecoData = {
            cep: document.getElementById('cep').value.replace(/\D/g, ""),
            logradouro: document.getElementById('endereco').value, // Adaptação para o nome do seu modelo
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            localidade: document.getElementById('cidade').value, // Adaptação
            uf: document.getElementById('estado').value // Adaptação
        };

        try {
            const response = await fetch(`${API_BASE_URL}/enderecos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enderecoData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Falha ao salvar o endereço. Status: ${response.status}. Mensagem: ${errorText}`);
            }

            alert('Endereço cadastrado com sucesso!');
            form.reset(); // Limpa o formulário após o sucesso
        } catch (error) {
            console.error('Erro ao salvar endereço:', error);
            alert(`Erro: ${error.message}`);
        }
    });
});

/**
 * Limpa os campos de endereço do formulário.
 */
function limparFormularioEndereco() {
    document.getElementById("endereco").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";
}