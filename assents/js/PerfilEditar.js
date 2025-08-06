// js/editar-profissional.js

import { makeAuthenticatedRequest } from './api.js';

const API_BASE_URL = 'http://localhost:8080/api';
let profissionalId = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    profissionalId = params.get('id');

    if (!profissionalId) {
        alert("ID do profissional não encontrado na URL. Impossível editar.");
        document.getElementById('form-editar-perfil').style.display = 'none';
        return;
    }
    carregarDadosParaEdicao(profissionalId);
    const form = document.getElementById('form-editar-perfil');
    form.addEventListener('submit', handleFormSubmit);
});

async function carregarDadosParaEdicao(id) {
    try {
        // --- Requisição Autenticada ---
        const profissional = await makeAuthenticatedRequest(`${API_BASE_URL}/profissional/${id}`);
        preencherFormulario(profissional);
    } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
        alert(`Erro: ${error.message}`);
    }
}

function preencherFormulario(profissional) {
    document.getElementById('prof-nome-edit').value = profissional.nome || '';
    document.getElementById('prof-email-edit').value = profissional.email || '';
    document.getElementById('prof-telefone-edit').value = profissional.telefone || '';
    document.getElementById('prof-especialidade-edit').value = profissional.especialidade || '';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const dadosAtualizados = {
        id: profissionalId,
        nome: document.getElementById('prof-nome-edit').value,
        email: document.getElementById('prof-email-edit').value,
        telefone: document.getElementById('prof-telefone-edit').value,
        especialidade: document.getElementById('prof-especialidade-edit').value
    };

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';

    try {
        // --- Requisição Autenticada ---
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/profissional/${profissionalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        alert('Perfil atualizado com sucesso!');
        window.location.href = `perfil_visualizacao.html?id=${profissionalId}`;

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert(`Erro: ${error.message}`);
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar Alterações';
    }
}