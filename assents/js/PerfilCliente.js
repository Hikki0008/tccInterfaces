// js/perfil_cliente.js

import { makeAuthenticatedRequest } from './api.js';

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id');

    if (!clienteId) {
        alert("ID do cliente não encontrado na URL. Verifique se o link está correto.");
        document.querySelector('.main-content').innerHTML = '<h1>Erro: ID do cliente não fornecido.</h1>';
        return;
    }
    carregarDadosDoCliente(clienteId);

    const pacienteModal = document.getElementById('paciente-modal');
    const abrirModalBtn = document.getElementById('abrir-modal-paciente');
    const fecharModalBtn = pacienteModal.querySelector('.close-button');
    const opcaoEuPacienteBtn = document.getElementById('opcao-eu-paciente');
    const opcaoNovoPacienteBtn = document.getElementById('opcao-novo-paciente');

    abrirModalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        pacienteModal.style.display = 'block';
    });

    fecharModalBtn.addEventListener('click', () => {
        pacienteModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === pacienteModal) {
            pacienteModal.style.display = 'none';
        }
    });

    opcaoNovoPacienteBtn.addEventListener('click', () => {
        window.location.href = `RegistrarPaciente.html?responsavelId=${clienteId}`;
    });

    opcaoEuPacienteBtn.addEventListener('click', () => {
        if (confirm("Você deseja realmente se registrar como paciente? Seus dados serão utilizados para o cadastro.")) {
            registrarProprioPaciente(clienteId);
        }
    });
});

async function carregarDadosDoCliente(id) {
    try {
        const [cliente, pacientes, enderecos, agendamentos] = await Promise.all([
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}`),
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}/pacientes`),
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}/enderecos`),
            // NOVA REQUISIÇÃO: busca agendamentos do usuário
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}/agendamentos`)
        ]);

        preencherDadosCliente(cliente);
        preencherListaPacientes(pacientes);
        preencherListaEnderecos(enderecos);
        // NOVA CHAMADA: para exibir a lista de agendamentos
        preencherListaAgendamentos(agendamentos);

    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        alert(`Erro: ${error.message}`);
    }
}

function preencherDadosCliente(cliente) {
    document.getElementById('cliente-nome').textContent = cliente.nome || 'Não informado';
    document.getElementById('cliente-email').textContent = cliente.email || 'Não informado';
    document.getElementById('cliente-telefone').textContent = cliente.telefone || 'Não informado';
}

function preencherListaPacientes(pacientes) {
    const container = document.getElementById('patients-list-container');
    // Encontra o card de adicionar novo paciente
    const addCard = document.getElementById('abrir-modal-paciente');
    container.innerHTML = '';

    if (pacientes.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'Nenhum paciente cadastrado.';
        container.appendChild(noData);
    } else {
        pacientes.forEach(paciente => {
            const link = document.createElement('a');
            link.href = `perfil_paciente.html?id=${paciente.id}`;
            link.className = 'patient-card-link';
            link.innerHTML = `
                <div class="patient-card">
                    <img src="${paciente.fotoUrl || 'https://i.ibb.co/3k5fTyt/patient1.jpg'}" alt="Foto do Paciente ${paciente.nome}">
                    <h3>${paciente.nome}</h3>
                    <p class="relationship">${paciente.relacionamento || 'Não informado'}</p>
                </div>
            `;
            container.appendChild(link);
        });
    }
    // Adiciona o card "Adicionar Novo" no final
    container.appendChild(addCard);
}

function preencherListaEnderecos(enderecos) {
    const container = document.getElementById('address-list-container');
    container.innerHTML = '';

    if (enderecos.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'Nenhum endereço de atendimento cadastrado.';
        container.appendChild(noData);
        return;
    }

    enderecos.forEach(endereco => {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.innerHTML = `
            <div class="address-details">
                <p class="address-nickname"><i class="fas fa-map-marker-alt"></i> ${endereco.apelido || 'Endereço sem nome'}</p>
                <p class="address-full">${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}</p>
            </div>
            <div class="address-actions">
                <a href="#" class="action-btn" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                <a href="#" class="action-btn" title="Excluir"><i class="fas fa-trash-alt"></i></a>
            </div>
        `;
        container.appendChild(card);
    });
}

// NOVA FUNÇÃO: para renderizar a lista de agendamentos
function preencherListaAgendamentos(agendamentos) {
    const container = document.getElementById('appointments-list-container');
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }

    agendamentos.forEach(agendamento => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="appointment-details">
                <h4 class="appointment-title">Agendamento para ${agendamento.paciente.nome}</h4>
                <p class="appointment-info"><i class="far fa-calendar-alt"></i> Data: ${agendamento.data}</p>
                <p class="appointment-info"><i class="far fa-clock"></i> Horário: ${agendamento.hora}</p>
                <p class="appointment-info"><i class="fas fa-notes-medical"></i> Serviço: ${agendamento.servico}</p>
                <p class="appointment-info"><i class="fas fa-user-md"></i> Profissional: ${agendamento.profissional.nome}</p>
            </div>
            <div class="appointment-actions">
                <span class="appointment-status status-${agendamento.status.toLowerCase()}">${agendamento.status}</span>
                </div>
        `;
        container.appendChild(card);
    });
}

async function registrarProprioPaciente(clienteId) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/pacientes/registrar-proprio-paciente`, {
            method: 'POST',
            body: JSON.stringify({ usuarioId: clienteId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response) {
            alert('Você foi registrado como paciente com sucesso!');
            document.getElementById('paciente-modal').style.display = 'none';
            carregarDadosDoCliente(clienteId);
        }

    } catch (error) {
        console.error('Erro ao registrar como paciente:', error);
        alert(`Erro: ${error.message}`);
    }
}