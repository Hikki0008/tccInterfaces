/**
 * Script para gerenciar a PÁGINA DE EDIÇÃO do perfil do profissional.
 * - Carrega os dados atuais do profissional no formulário.
 * - Envia as atualizações para a API via método PUT.
 */

// --- URL Base da API ---
const API_BASE_URL = 'http://localhost:8080/api';

// Variável global para armazenar o ID, facilitando o acesso em outras funções.
let profissionalId = null;

/**
 * Função principal que é executada quando o conteúdo da página de edição é carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    profissionalId = params.get('id');

    if (!profissionalId) {
        alert("ID do profissional não encontrado na URL. Impossível editar.");
        // Desabilita o formulário para evitar envios incorretos
        document.getElementById('form-editar-perfil').style.display = 'none';
        return;
    }

    // 1. Carrega os dados do profissional e preenche o formulário.
    carregarDadosParaEdicao(profissionalId);

    // 2. Configura o listener para o envio do formulário.
    const form = document.getElementById('form-editar-perfil');
    form.addEventListener('submit', handleFormSubmit);
});

/**
 * Busca os dados atuais do profissional na API e os insere nos campos do formulário.
 * @param {string} id - O ID do profissional.
 */
async function carregarDadosParaEdicao(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/profissional/${id}`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do profissional para edição.');
        }
        const profissional = await response.json();
        preencherFormulario(profissional);
    } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
        alert(`Erro: ${error.message}`);
    }
}

/**
 * Preenche os campos do formulário com os dados vindos da API.
 * @param {object} profissional - O objeto profissional.
 */
function preencherFormulario(profissional) {
    document.getElementById('prof-nome-edit').value = profissional.nome || '';
    document.getElementById('prof-email-edit').value = profissional.email || '';
    document.getElementById('prof-telefone-edit').value = profissional.telefone || '';
    document.getElementById('prof-especialidade-edit').value = profissional.especialidade || '';
    // Preencha outros campos do formulário aqui, se houver.
}

/**
 * Lida com o evento de submissão do formulário de edição.
 * @param {Event} event - O objeto do evento de submissão.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Impede o recarregamento padrão da página.

    // Coleta os dados atualizados do formulário.
    const dadosAtualizados = {
        id: profissionalId, // O ID deve ser enviado para o backend saber quem atualizar.
        nome: document.getElementById('prof-nome-edit').value,
        email: document.getElementById('prof-email-edit').value,
        telefone: document.getElementById('prof-telefone-edit').value,
        especialidade: document.getElementById('prof-especialidade-edit').value
        // Adicione outros campos conforme necessário.
    };

    // Desabilita o botão para evitar cliques duplos durante o envio.
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';

    try {
        // IMPORTANTE: Assumindo que seu backend aceita uma requisição PUT em /api/profissional/{id}
        // para atualizar um profissional existente.
        const response = await fetch(`${API_BASE_URL}/profissional/${profissionalId}`, {
            method: 'PUT', // Método HTTP para atualização completa de um recurso.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (!response.ok) {
            // Tenta ler uma mensagem de erro do backend.
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Falha ao atualizar o perfil.');
        }

        alert('Perfil atualizado com sucesso!');
        // Redireciona o usuário de volta para a página de visualização.
        window.location.href = `perfil_visualizacao.html?id=${profissionalId}`;

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert(`Erro: ${error.message}`);
        // Reabilita o botão em caso de erro.
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar Alterações';
    }
}