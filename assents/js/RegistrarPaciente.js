/**
 * Script para lidar com o cadastro de um novo paciente.
 * Captura os dados do formulário e os envia para a API do backend.
 * Controller Spring Boot alvo: /api/pacientes
 */

// A função é chamada diretamente pelo 'onsubmit' do formulário no HTML.
async function cadastrarPaciente(event) {
    // Impede que o formulário recarregue a página, que é o comportamento padrão.
    event.preventDefault();

    // --- URL da API ---
    // Certifique-se de que a porta (ex: 8080) está correta.
    const API_URL = 'http://localhost:8080/api/pacientes';

    // --- Coleta de Dados do Formulário ---
    // Cria um objeto com os dados do paciente, pegando os valores de cada campo do formulário.
    // Os nomes das chaves (nome, dataNascimento, etc.) devem corresponder aos nomes dos atributos
    // na sua classe `PacienteModel` no backend.
    const pacienteData = {
        nome: document.getElementById('idnome').value,
        dataNascimento: document.getElementById('iddatanascimento').value,
        cpf: document.getElementById('idcpf').value,
        sexo: document.getElementById('idsexo').value,
        telefone: document.getElementById('idtelefone').value,
        email: document.getElementById('idemail').value,
        comorbidades: document.getElementById('idcomorbidades').value,
        observacoes: document.getElementById('idobservacoes').value
    };

    // --- Requisição para o Backend ---
    try {
        // Envia a requisição POST para a API com os dados do paciente.
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Informa ao backend que estamos enviando dados em formato JSON.
            },
            body: JSON.stringify(pacienteData) // Converte o objeto JavaScript para uma string JSON.
        });

        // Verifica se a requisição foi bem-sucedida (status 2xx).
        if (!response.ok) {
            // Se o backend retornar um erro, tenta ler a mensagem de erro do corpo da resposta.
            const errorData = await response.json();
            // Lança um erro para ser capturado pelo bloco catch.
            throw new Error(errorData.message || 'Ocorreu um erro ao cadastrar o paciente.');
        }

        // Se a requisição foi bem-sucedida:
        const novoPaciente = await response.json();
        alert(`Paciente "${novoPaciente.nome}" cadastrado com sucesso!`);

        // Limpa o formulário após o cadastro.
        document.getElementById('patientForm').reset();

        // Opcional: Redirecionar para outra página, como a lista de pacientes.
        // window.location.href = '/lista-de-pacientes.html';

    } catch (error) {
        // Se ocorrer qualquer erro (na requisição ou lançado manualmente), ele será capturado aqui.
        console.error('Falha no cadastro do paciente:', error);
        alert(`Erro no cadastro: ${error.message}`);
    }
}

// --- Máscaras e Validações (Opcional, mas recomendado) ---
document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('idcpf');
    const telefoneInput = document.getElementById('idtelefone');

    // Máscara para CPF
    cpfInput.addEventListener('input', () => {
        let value = cpfInput.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = value;
    });

    // Máscara para Telefone
    telefoneInput.addEventListener('input', () => {
        let value = telefoneInput.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        telefoneInput.value = value;
    });
});