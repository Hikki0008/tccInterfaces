// js/api.js

/**
 * Função para obter o token de autenticação (ex: JWT) do armazenamento local.
 * Adapte esta função para a sua lógica de como o token é armazenado.
 * @returns {string | null} O token ou null se não for encontrado.
 */
function getToken() {
    // Exemplo: buscando o token no localStorage
    return localStorage.getItem('authToken');
}

// =================================================================
// Adicione aqui suas outras funções que já existiam no arquivo
// =================================================================


/**
 * Faz uma requisição autenticada para a API.
 * Adiciona o token de autenticação no cabeçalho 'Authorization'.
 * @param {string} url O endpoint da API.
 * @param {object} [options={}] Opções de requisição, como 'method' e 'body'.
 * @returns {Promise<any>} A promessa com os dados da resposta em JSON.
 */
export async function makeAuthenticatedRequest(url, options = {}) {
    const token = getToken();

    if (!token) {
        console.error('Nenhum token de autenticação encontrado. Redirecionando para login.');
        // Opcional: redirecionar para a página de login
        // window.location.href = '/login.html';
        throw new Error('Não autenticado. Faça login para continuar.');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const finalOptions = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, finalOptions);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Erro na requisição: ${response.status} - ${errorData.message}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return {};

    } catch (error) {
        console.error('Erro na requisição autenticada:', error);
        throw error;
    }
}