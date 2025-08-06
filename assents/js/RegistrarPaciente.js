// js/cadastro-paciente.js

import { makeAuthenticatedRequest } from './api.js';

async function cadastrarPaciente(event) {
    event.preventDefault();

    const API_URL = 'http://localhost:8080/api/pacientes';

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

    try {
        // --- Requisição Autenticada ---
        const novoPaciente = await makeAuthenticatedRequest(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        });

        alert(`Paciente "${novoPaciente.nome}" cadastrado com sucesso!`);
        document.getElementById('patientForm').reset();

    } catch (error) {
        console.error('Falha no cadastro do paciente:', error);
        alert(`Erro no cadastro: ${error.message}`);
    }
}
// --- Máscaras e Validações (Opcional, mas recomendado) ---
document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('idcpf');
    const telefoneInput = document.getElementById('idtelefone');

    cpfInput.addEventListener('input', () => {
        let value = cpfInput.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = value;
    });

    telefoneInput.addEventListener('input', () => {
        let value = telefoneInput.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        telefoneInput.value = value;
    });
});