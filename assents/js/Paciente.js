/**
 * Script para gerenciar a página de perfil do paciente.
 * - Carrega dados do paciente e seus registros associados.
 */

// --- URL Base da API do Backend ---
const API_BASE_URL = 'http://localhost:8080/api/pacientes';

/**
 * Função principal que é executada quando o conteúdo da página é carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o ID do paciente da URL
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('id');

    if (!pacienteId) {
        alert("ID do paciente não encontrado na URL.");
        document.querySelector('.main-content').innerHTML = '<h1>Erro: ID do paciente não fornecido.</h1>';
        return;
    }

    // 2. Chama a função principal para carregar todos os dados
    carregarDadosDoPaciente(pacienteId);

    // 3. Atualiza o link de "Voltar" para levar ao perfil do cliente
    // ATENÇÃO: É necessário ter o ID do cliente na URL, se a navegação vier da tela de perfil do cliente.
    // Ex: perfil_paciente.html?id=1&clienteId=1
    const clienteId = params.get('clienteId');
    if (clienteId) {
        document.getElementById('btn-voltar').href = `perfil_cliente.html?id=${clienteId}`;
    }
});

/**
 * Carrega e exibe os dados do paciente, seus medicamentos, relatórios e agendamentos.
 * @param {string} id - O ID do paciente.
 */
async function carregarDadosDoPaciente(id) {
    try {
        // Busca os dados do paciente
        const pacienteResponse = await fetch(`${API_BASE_URL}/pacientes/${id}`);
        if (!pacienteResponse.ok) {
            throw new Error('Falha ao buscar dados do paciente.');
        }
        const paciente = await pacienteResponse.json();
        preencherDadosPaciente(paciente);

        // ATENÇÃO: Os endpoints abaixo são presumidos e precisam ser criados no backend
        // Busca os medicamentos do paciente
        const medicamentosResponse = await fetch(`${API_BASE_URL}/pacientes/${id}/medicamentos`);
        if (medicamentosResponse.ok) {
            const medicamentos = await medicamentosResponse.json();
            preencherListaMedicamentos(medicamentos);
        } else {
            console.warn('Endpoint de medicamentos não encontrado ou falha na busca.');
            preencherListaMedicamentos([]);
        }

        // Busca os relatórios do paciente
        const relatoriosResponse = await fetch(`${API_BASE_URL}/pacientes/${id}/relatorios`);
        if (relatoriosResponse.ok) {
            const relatorios = await relatoriosResponse.json();
            preencherListaRelatorios(relatorios);
        } else {
            console.warn('Endpoint de relatórios não encontrado ou falha na busca.');
            preencherListaRelatorios([]);
        }
        
        // Busca os agendamentos do paciente (endpoint presumido)
        const agendamentosResponse = await fetch(`${API_BASE_URL}/agendamento/paciente/${id}`);
        if (agendamentosResponse.ok) {
            const agendamentos = await agendamentosResponse.json();
            preencherListaAgendamentos(agendamentos);
        } else {
            console.warn('Endpoint de agendamentos por paciente não encontrado ou falha na busca.');
            preencherListaAgendamentos([]);
        }

    } catch (error) {
        console.error('Erro ao carregar dados do perfil do paciente:', error);
        alert(`Erro: ${error.message}`);
    }
}

/**
 * Preenche a seção de informações do paciente.
 * @param {object} paciente - O objeto com os dados do paciente.
 */
function preencherDadosPaciente(paciente) {
    document.getElementById('paciente-foto').src = paciente.fotoUrl || 'https://i.ibb.co/3k5fTyt/patient1.jpg';
    document.getElementById('paciente-nome').textContent = paciente.nome || 'Não informado';
    document.getElementById('paciente-info-basica').textContent = `${paciente.idade || 'N/A'} anos, ${paciente.genero || 'N/A'}`;
    document.getElementById('paciente-condicao').textContent = paciente.condicaoPrincipal || 'Não informada';
    document.getElementById('paciente-alergias').textContent = paciente.alergias || 'Nenhuma alergia conhecida';
    document.getElementById('paciente-cpf').textContent = paciente.cpf || 'Não informado';
    document.getElementById('paciente-contato-emergencia').textContent = paciente.contatoEmergencia || 'Não informado';
}

/**
 * Preenche a lista de medicamentos.
 * @param {Array} medicamentos - A lista de medicamentos do paciente.
 */
function preencherListaMedicamentos(medicamentos) {
    const container = document.getElementById('medicamentos-list-container');
    container.innerHTML = '';
    
    if (medicamentos.length === 0) {
        container.innerHTML = '<p>Nenhum medicamento em uso cadastrado.</p>';
        return;
    }

    medicamentos.forEach(medicamento => {
        const li = document.createElement('li');
        li.className = 'service-item';
        li.innerHTML = `<strong>${medicamento.nome}:</strong> ${medicamento.dosagem}`;
        container.appendChild(li);
    });
}

/**
 * Preenche a lista de relatórios.
 * @param {Array} relatorios - A lista de relatórios do paciente.
 */
function preencherListaRelatorios(relatorios) {
    const container = document.getElementById('relatorios-list-container');
    container.innerHTML = '';

    if (relatorios.length === 0) {
        container.innerHTML = '<p>Nenhum relatório histórico encontrado.</p>';
        return;
    }

    relatorios.forEach(relatorio => {
        const div = document.createElement('div');
        div.className = 'report-item';
        div.innerHTML = `
            <p>${relatorio.conteudo}</p>
            <p class="report-meta"><strong>Relatado por:</strong> ${relatorio.profissionalNome || 'N/A'} - <strong>Data:</strong> ${new Date(relatorio.data).toLocaleDateString('pt-BR')}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * Preenche a lista de agendamentos.
 * @param {Array} agendamentos - A lista de agendamentos do paciente.
 */
function preencherListaAgendamentos(agendamentos) {
    const container = document.getElementById('agendamentos-list-container');
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = '<p>Nenhum agendamento futuro encontrado.</p>';
        return;
    }

    agendamentos.forEach(agendamento => {
        const div = document.createElement('div');
        div.className = 'appointment-item-patient';
        div.innerHTML = `
            <p><strong>Profissional:</strong> ${agendamento.profissional.nome} (${agendamento.profissional.especialidade || 'N/A'})</p>
            <p><strong>Data:</strong> ${new Date(agendamento.data).toLocaleDateString('pt-BR')} - ${agendamento.hora || 'N/A'}</p>
            <p><strong>Local:</strong> ${agendamento.local || 'N/A'}</p>
            <p class="appointment-meta">Status: <strong>${agendamento.status || 'N/A'}</strong></p>
        `;
        container.appendChild(div);
    });
}