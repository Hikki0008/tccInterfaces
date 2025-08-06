// js/usuarios.js

import { makeAuthenticatedRequest } from './api.js';

// Função para listar todos os usuários
async function listarUsuarios() {
    try {
        // Use a nova função para fazer a requisição
        const usuarios = await makeAuthenticatedRequest('http://localhost:8080/api/usuarios');
        console.log("Usuários:", usuarios);
        // Lógica para renderizar os usuários na página
    } catch (error) {
        console.error("Falha ao listar usuários:", error);
    }
}

// Outras funções que fazem requisições autenticadas também usariam a função makeAuthenticatedRequest
async function deletarUsuario(id) {
    try {
        const options = { method: 'DELETE' };
        await makeAuthenticatedRequest(`http://localhost:8080/api/usuarios/${id}`, options);
        console.log(`Usuário com ID ${id} deletado com sucesso.`);
        // Lógica para remover o usuário da tela
    } catch (error) {
        console.error("Falha ao deletar usuário:", error);
    }
}

// Adicione aqui a lógica para executar essas funções
document.addEventListener('DOMContentLoaded', () => {
    listarUsuarios();
});