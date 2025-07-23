/**
 * Script para gerenciar a página de perfil do profissional.
 * - Carrega dados do profissional e seus agendamentos.
 * - Gerencia a exibição e cadastro de novos serviços.
 */

// --- URL Base da API ---
// Certifique-se de que a porta (ex: 8080) está correta.
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Função principal que é executada quando o conteúdo da página é carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o ID do profissional da URL
    const params = new URLSearchParams(window.location.search);
    const profissionalId = params.get('id');

    if (!profissionalId) {
        alert("ID do profissional não encontrado na URL. Certifique-se que o link seja como: 'PerfilProfissional.html?id=1'");
        document.querySelector('.main-content').innerHTML = '<h1>Erro: ID do profissional não fornecido.</h1>';
        return;
    }

    // 2. Carrega os dados do profissional e os agendamentos em paralelo
    carregarDadosDoPerfil(profissionalId);

    // 3. Configura a lógica do modal de serviços
    configurarModalServico(profissionalId);
});

/**
 * Carrega e exibe os dados do profissional e seus agendamentos.
 * @param {string} id - O ID do profissional.
 */
async function carregarDadosDoPerfil(id) {
    try {
        // Usa Promise.all para buscar dados do profissional e agendamentos simultaneamente
        const [profissionalResponse, agendamentosResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/profissional/${id}`),
            fetch(`${API_BASE_URL}/agendamento`) // Busca todos os agendamentos
        ]);

        // Trata a resposta dos dados do profissional
        if (!profissionalResponse.ok) {
            throw new Error('Falha ao buscar dados do profissional. Verifique o ID e a API.');
        }
        const profissional = await profissionalResponse.json();
        preencherDadosProfissional(profissional);

        // Trata a resposta dos agendamentos
        if (!agendamentosResponse.ok) {
            throw new Error('Falha ao buscar a lista de agendamentos.');
        }
        const todosAgendamentos = await agendamentosResponse.json();

        // Filtra os agendamentos para mostrar apenas os deste profissional
        // ATENÇÃO: Assumindo que o objeto de agendamento tem um campo `profissional` com um `id` dentro.
        // Ex: agendamento = { ..., profissional: { id: 1, nome: 'Dr. João' }, ... }
        const agendamentosDoProfissional = todosAgendamentos.filter(agendamento =>
            agendamento.profissional && agendamento.profissional.id == id
        );
        preencherAgendamentos(agendamentosDoProfissional);

    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        alert(`Erro: ${error.message}`);
    }
}

/**
 * Preenche a seção "Meus Dados" no HTML com as informações do profissional.
 * @param {object} profissional - O objeto com os dados do profissional vindo da API.
 */
function preencherDadosProfissional(profissional) {
    document.getElementById('prof-nome').textContent = profissional.nome || 'Não informado';
    document.getElementById('prof-email').textContent = profissional.email || 'Não informado';
    document.getElementById('prof-telefone').textContent = profissional.telefone || 'Não informado';
    document.getElementById('prof-especialidade').textContent = profissional.especialidade || 'Não informada';
    // Preencha outros campos aqui, se houver
}

/**
 * Preenche a tabela de agendamentos no HTML.
 * @param {Array} agendamentos - A lista de agendamentos do profissional.
 */
function preencherAgendamentos(agendamentos) {
    const container = document.getElementById('agendamentos-list-container');
    container.innerHTML = ''; // Limpa a tabela antes de preencher

    if (agendamentos.length === 0) {
        container.innerHTML = '<tr><td colspan="4">Nenhum agendamento encontrado.</td></tr>';
        return;
    }

    agendamentos.forEach(agendamento => {
        const tr = document.createElement('tr');

        // ATENÇÃO: Assumindo a estrutura do seu AgendamentoModel e PacienteModel
        const pacienteNome = agendamento.paciente ? agendamento.paciente.nome : 'Paciente não informado';

        tr.innerHTML = `
            <td>${new Date(agendamento.data).toLocaleDateString('pt-BR')}</td>
            <td>${agendamento.hora || 'N/A'}</td>
            <td>${pacienteNome}</td>
            <td>${agendamento.status || 'N/A'}</td>
        `;
        container.appendChild(tr);
    });
}


/**
 * Configura os eventos para abrir, fechar e submeter o modal de cadastro de serviço.
 * @param {string} profissionalId - O ID do profissional ao qual o serviço será associado.
 */
function configurarModalServico(profissionalId) {
    const modal = document.getElementById('modal-servico');
    const btnAbrir = document.getElementById('btn-adicionar-servico');
    const btnFechar = modal.querySelector('.close-button');
    const form = document.getElementById('form-novo-servico');

    // Abre o modal
    btnAbrir.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    };

    // Fecha o modal pelo botão 'X'
    btnFechar.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha o modal ao clicar fora dele
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Lida com o envio do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const servicoData = {
            nome: document.getElementById('servico-nome').value,
            descricao: document.getElementById('servico-descricao').value,
            preco: parseFloat(document.getElementById('servico-preco').value),
            profissionalId: profissionalId // Associando o serviço ao profissional
        };

        // **IMPORTANTE**: Você precisa ter um endpoint no backend para salvar serviços.
        // Exemplo: POST /api/servicos
        try {
            // Supondo um endpoint /api/servicos
            const response = await fetch(`${API_BASE_URL}/servicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar o serviço.');
            }

            const novoServico = await response.json();
            alert(`Serviço "${novoServico.nome}" salvo com sucesso!`);
            form.reset();
            modal.style.display = 'none';
            // Aqui você deveria recarregar a lista de serviços na tela
            // carregarServicos(profissionalId); // Exemplo de função a ser criada

        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            alert(`Erro: ${error.message}`);
        }
    });
}