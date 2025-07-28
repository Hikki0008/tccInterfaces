/**
 * Script para gerenciar a PÁGINA DE VISUALIZAÇÃO do perfil do profissional.
 * - Carrega e exibe dados do profissional e seus agendamentos.
 * - Gerencia a exibição e cadastro de novos serviços.
 */

// --- URL Base da API ---
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Função principal que é executada quando o conteúdo da página é carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const profissionalId = params.get('id');

    if (!profissionalId) {
        handleFatalError("ID do profissional não encontrado na URL.");
        return;
    }

    // Carrega todos os dados necessários para a tela de visualização.
    carregarDadosDeVisualizacao(profissionalId);

    // A lógica do modal de serviços continua aqui, pois o botão está na tela de visualização.
    configurarModalServico(profissionalId);
});

/**
 * Exibe uma mensagem de erro grave e impede a continuação do script.
 * @param {string} message - A mensagem de erro a ser exibida.
 */
function handleFatalError(message) {
    alert(message);
    document.querySelector('.main-content').innerHTML = `<h1>Erro: ${message}</h1>`;
}

/**
 * Carrega e exibe os dados do profissional e seus agendamentos.
 * @param {string} id - O ID do profissional.
 */
async function carregarDadosDeVisualizacao(id) {
    try {
        // Busca dados do profissional e agendamentos em paralelo para mais eficiência.
        const [profissionalResponse, agendamentosResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/profissional/${id}`),
            // RECOMENDAÇÃO: O ideal seria ter um endpoint que já retorna os agendamentos filtrados
            // por profissional, como: fetch(`${API_BASE_URL}/profissional/${id}/agendamentos`)
            // Isso evita trafegar dados desnecessários pela rede.
            fetch(`${API_BASE_URL}/agendamento`)
        ]);

        if (!profissionalResponse.ok) throw new Error('Falha ao buscar dados do profissional.');
        const profissional = await profissionalResponse.json();
        exibirDadosProfissional(profissional);

        if (!agendamentosResponse.ok) throw new Error('Falha ao buscar a lista de agendamentos.');
        const todosAgendamentos = await agendamentosResponse.json();

        // Filtra os agendamentos para mostrar apenas os deste profissional.
        const agendamentosDoProfissional = todosAgendamentos.filter(agendamento =>
            agendamento.profissional && agendamento.profissional.id == id
        );
        exibirAgendamentos(agendamentosDoProfissional);

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        handleFatalError(error.message);
    }
}

/**
 * Preenche a seção de perfil no HTML com as informações do profissional.
 * @param {object} profissional - O objeto com os dados do profissional.
 */
function exibirDadosProfissional(profissional) {
    // Usamos 'textContent' para segurança, evitando injeção de HTML.
    document.getElementById('prof-nome').textContent = profissional.nome || 'Nome não informado';
    document.getElementById('prof-email').textContent = profissional.email || 'E-mail não informado';
    document.getElementById('prof-telefone').textContent = profissional.telefone || 'Telefone não informado';
    document.getElementById('prof-especialidade').textContent = profissional.especialidade || 'Especialidade não informada';
}

/**
 * Preenche a tabela de agendamentos no HTML.
 * @param {Array} agendamentos - A lista de agendamentos do profissional.
 */
function exibirAgendamentos(agendamentos) {
    const container = document.getElementById('agendamentos-list-container');
    container.innerHTML = ''; // Limpa a tabela antes de preencher.

    if (!agendamentos || agendamentos.length === 0) {
        container.innerHTML = '<tr><td colspan="4">Nenhum agendamento encontrado para este profissional.</td></tr>';
        return;
    }

    agendamentos.forEach(agendamento => {
        const tr = document.createElement('tr');
        const pacienteNome = agendamento.paciente ? agendamento.paciente.nome : 'Paciente não associado';
        const dataFormatada = new Date(agendamento.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${agendamento.hora || 'N/A'}</td>
            <td>${pacienteNome}</td>
            <td><span class="status">${agendamento.status || 'N/A'}</span></td>
        `;
        container.appendChild(tr);
    });
}

/**
 * Configura os eventos para o modal de cadastro de serviço.
 * (Esta função é idêntica à sua original, pois sua lógica está correta).
 * @param {string} profissionalId
 */
function configurarModalServico(profissionalId) {
    // ... (seu código original para o modal vai aqui, sem alterações)
}