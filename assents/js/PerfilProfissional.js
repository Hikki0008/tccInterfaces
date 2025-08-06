// js/PerfilProfissional.js

import { makeAuthenticatedRequest } from './api.js';

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const profissionalId = params.get('id');

    if (!profissionalId) {
        alert("ID do profissional não encontrado na URL. Certifique-se que o link seja como: 'PerfilProfissional.html?id=1'");
        document.querySelector('.main-content').innerHTML = '<h1>Erro: ID do profissional não fornecido.</h1>';
        return;
    }
    carregarDadosDoPerfil(profissionalId);
    configurarModalServico(profissionalId);
});

async function carregarDadosDoPerfil(id) {
    try {
        const [profissional, todosAgendamentos] = await Promise.all([
            // --- Requisições Autenticadas ---
            makeAuthenticatedRequest(`${API_BASE_URL}/profissional/${id}`),
            makeAuthenticatedRequest(`${API_BASE_URL}/agendamento`)
        ]);

        preencherDadosProfissional(profissional);

        const agendamentosDoProfissional = todosAgendamentos.filter(agendamento =>
            agendamento.profissional && agendamento.profissional.id == id
        );
        preencherAgendamentos(agendamentosDoProfissional);

    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        alert(`Erro: ${error.message}`);
    }
}

function preencherDadosProfissional(profissional) {
    document.getElementById('prof-nome').textContent = profissional.nome || 'Não informado';
    document.getElementById('prof-email').textContent = profissional.email || 'Não informado';
    document.getElementById('prof-telefone').textContent = profissional.telefone || 'Não informado';
    document.getElementById('prof-especialidade').textContent = profissional.especialidade || 'Não informada';
}

function preencherAgendamentos(agendamentos) {
    const container = document.getElementById('agendamentos-list-container');
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = '<tr><td colspan="4">Nenhum agendamento encontrado.</td></tr>';
        return;
    }

    agendamentos.forEach(agendamento => {
        const tr = document.createElement('tr');
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

function configurarModalServico(profissionalId) {
    const modal = document.getElementById('modal-servico');
    const btnAbrir = document.getElementById('btn-adicionar-servico');
    const btnFechar = modal.querySelector('.close-button');
    const form = document.getElementById('form-novo-servico');

    btnAbrir.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    };

    btnFechar.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const servicoData = {
            nome: document.getElementById('servico-nome').value,
            descricao: document.getElementById('servico-descricao').value,
            preco: parseFloat(document.getElementById('servico-preco').value),
            profissionalId: profissionalId
        };
        try {
            // --- Requisição Autenticada ---
            const novoServico = await makeAuthenticatedRequest(`${API_BASE_URL}/servicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoData)
            });
            alert(`Serviço "${novoServico.nome}" salvo com sucesso!`);
            form.reset();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            alert(`Erro: ${error.message}`);
        }
    });
}