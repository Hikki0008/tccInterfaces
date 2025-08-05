// --- URL Base da API do Backend ---
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o ID do cliente da URL
    const params = new URLSearchParams(window.location.search);
    // Exemplo: perfil_cliente.html?id=1
    const clienteId = params.get('id');

    if (!clienteId) {
        alert("ID do cliente não encontrado na URL. Verifique se o link está correto.");
        document.querySelector('.main-content').innerHTML = '<h1>Erro: ID do cliente não fornecido.</h1>';
        return;
    }

    // 2. Chama a função principal para carregar todos os dados
    carregarDadosDoCliente(clienteId);
});

/**
 * Carrega e exibe os dados do cliente, seus pacientes e endereços.
 * @param {string} id - O ID do cliente.
 */
async function carregarDadosDoCliente(id) {
    try {
        // Busca os dados do cliente
        const clienteResponse = await fetch(`${API_BASE_URL}/usuarios/${id}`);
        if (!clienteResponse.ok) {
            throw new Error('Falha ao buscar dados do cliente.');
        }
        const cliente = await clienteResponse.json();
        preencherDadosCliente(cliente);

        // Busca os pacientes (assumindo um endpoint)
        const pacientesResponse = await fetch(`${API_BASE_URL}/usuarios/${id}/pacientes`);
        if (pacientesResponse.ok) {
            const pacientes = await pacientesResponse.json();
            preencherListaPacientes(pacientes);
        } else {
            console.warn('Endpoint de pacientes não encontrado ou falha na busca.');
            preencherListaPacientes([]); // Exibe uma lista vazia
        }

        // Busca os endereços (assumindo um endpoint)
        const enderecosResponse = await fetch(`${API_BASE_URL}/usuarios/${id}/enderecos`);
        if (enderecosResponse.ok) {
            const enderecos = await enderecosResponse.json();
            preencherListaEnderecos(enderecos);
        } else {
            console.warn('Endpoint de endereços não encontrado ou falha na busca.');
            preencherListaEnderecos([]); // Exibe uma lista vazia
        }

    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        alert(`Erro: ${error.message}`);
    }
}

/**
 * Preenche a seção de informações do cliente.
 * @param {object} cliente - O objeto com os dados do cliente.
 */
function preencherDadosCliente(cliente) {
    document.getElementById('cliente-nome').textContent = cliente.nome || 'Não informado';
    document.getElementById('cliente-email').textContent = cliente.email || 'Não informado';
    document.getElementById('cliente-telefone').textContent = cliente.telefone || 'Não informado';
    // Se você tiver a URL da foto no modelo do cliente, pode preenchê-la aqui
    // document.querySelector('.profile-pic').src = cliente.fotoUrl;
}

/**
 * Preenche a grade de pacientes.
 * @param {Array} pacientes - A lista de pacientes do cliente.
 */
function preencherListaPacientes(pacientes) {
    const container = document.getElementById('patients-list-container');
    
    // Mantém o card de "Adicionar Novo"
    const addCard = container.querySelector('.add-new').parentNode;
    container.innerHTML = '';
    
    if (pacientes.length === 0) {
        // Se não houver pacientes, exibe uma mensagem
        const noData = document.createElement('p');
        noData.textContent = 'Nenhum paciente cadastrado.';
        container.appendChild(noData);
    } else {
        pacientes.forEach(paciente => {
            const link = document.createElement('a');
            link.href = `perfil_paciente.html?id=${paciente.id}`; // Link para o perfil do paciente
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

    // Adiciona o card de "Adicionar Novo" de volta ao final
    container.appendChild(addCard);
}

/**
 * Preenche a lista de endereços.
 * @param {Array} enderecos - A lista de endereços do cliente.
 */
function preencherListaEnderecos(enderecos) {
    const container = document.getElementById('address-list-container');
    container.innerHTML = ''; // Limpa o conteúdo

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