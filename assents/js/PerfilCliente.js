// js/perfil_cliente.js

import { makeAuthenticatedRequest } from './api.js';

// --- URL Base da API do Backend ---
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
});

async function carregarDadosDoCliente(id) {
    try {
        // --- Requisições Autenticadas ---
        const [cliente, pacientes, enderecos] = await Promise.all([
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}`),
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}/pacientes`),
            makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}/enderecos`)
        ]);

        preencherDadosCliente(cliente);
        preencherListaPacientes(pacientes);
        preencherListaEnderecos(enderecos);

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
    const addCard = container.querySelector('.add-new').parentNode;
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