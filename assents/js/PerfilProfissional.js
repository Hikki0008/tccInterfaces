document.addEventListener('DOMContentLoaded', function() {

    // --- Seletores de Elementos do DOM ---
    const modal = document.getElementById('modal-servico');
    const btnAbrirModal = document.getElementById('btn-adicionar-servico');
    const btnFecharModal = document.querySelector('.close-button');
    const form = document.getElementById('form-novo-servico');
    const servicesListContainer = document.getElementById('services-list-container');
    const modalTitle = modal.querySelector('h2');
    const formSubmitButton = form.querySelector('button[type="submit"]');

    // --- Configuração da API ---
    // A URL base do seu backend. Ajuste a porta se for diferente (ex: 8080).
    const API_BASE_URL = 'http://localhost:8080/api/servico';

    // --- Lógica de Controle do Modal ---

    // Abre o modal em modo "Criar"
    btnAbrirModal.onclick = function() {
        form.reset(); // Limpa o formulário
        modalTitle.textContent = 'Cadastrar Novo Serviço';
        formSubmitButton.textContent = 'Salvar Serviço';
        // Garante que não há ID de edição
        document.getElementById('servico-id')?.remove();
        modal.style.display = 'block';
    }

    // Fecha o modal
    btnFecharModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Fecha o modal se clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // --- Funções CRUD (Create, Read, Update, Delete) ---

    /**
     * READ: Busca todos os serviços no backend e os exibe na tela.
     * Corresponde ao endpoint: GET /api/servico
     */
    async function carregarServicos() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const servicos = await response.json();

            servicesListContainer.innerHTML = ''; // Limpa a lista atual

            if (servicos.length === 0) {
                servicesListContainer.innerHTML = '<p>Nenhum serviço cadastrado ainda.</p>';
                return;
            }

            servicos.forEach(servico => {
                const servicoItem = document.createElement('li');
                servicoItem.className = 'service-item';
                // Adiciona um data-id para facilitar a busca do elemento depois
                servicoItem.dataset.id = servico.id;

                servicoItem.innerHTML = `
                    <div class="service-header">
                        <h3>${servico.nome}</h3>
                        <span class="service-price">R$ ${Number(servico.preco).toFixed(2)} / hora</span>
                    </div>
                    <p class="service-description">${servico.descricao}</p>
                    <div class="service-actions">
                        <button class="action-button edit-btn">Editar</button>
                        <button class="action-button delete-btn">Deletar</button>
                    </div>
                `;
                servicesListContainer.appendChild(servicoItem);
            });

        } catch (error) {
            console.error('Falha ao carregar serviços:', error);
            servicesListContainer.innerHTML = '<p style="color: red;">Erro ao carregar os serviços. Verifique a conexão com o servidor.</p>';
        }
    }

    /**
     * Event Listener para o formulário (Criação e Atualização).
     * CREATE: POST /api/servico
     * UPDATE: PUT /api/servico/{id}
     */
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const idInput = document.getElementById('servico-id');
        const id = idInput ? idInput.value : null;

        const servicoData = {
            nome: document.getElementById('servico-nome').value,
            descricao: document.getElementById('servico-descricao').value,
            preco: parseFloat(document.getElementById('servico-preco').value)
        };

        const isUpdating = id !== null;
        const url = isUpdating ? `${API_BASE_URL}/${id}` : API_BASE_URL;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(servicoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao ${isUpdating ? 'atualizar' : 'salvar'} serviço.`);
            }

            alert(`Serviço ${isUpdating ? 'atualizado' : 'cadastrado'} com sucesso!`);
            form.reset();
            modal.style.display = 'none';
            carregarServicos(); // Atualiza a lista na tela

        } catch (error) {
            console.error('Falha na operação:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    /**
     * Listener para cliques na lista de serviços (Delegação de Eventos).
     * Identifica se o clique foi no botão de Editar ou Deletar.
     */
    servicesListContainer.addEventListener('click', function(event) {
        const target = event.target;
        const serviceItem = target.closest('.service-item');
        if (!serviceItem) return;

        const id = serviceItem.dataset.id;

        if (target.classList.contains('edit-btn')) {
            abrirModalParaEdicao(id);
        } else if (target.classList.contains('delete-btn')) {
            deletarServico(id);
        }
    });

    /**
     * UPDATE (Parte 1): Prepara o modal para edição.
     * Busca os dados do serviço e preenche o formulário.
     */
    async function abrirModalParaEdicao(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Serviço não encontrado.');
            }
            const servico = await response.json();

            // Preenche o formulário com os dados do serviço
            document.getElementById('servico-nome').value = servico.nome;
            document.getElementById('servico-descricao').value = servico.descricao;
            document.getElementById('servico-preco').value = servico.preco;

            // Adiciona um campo oculto com o ID para o submit saber que é uma edição
            // Remove o campo antigo se existir
            document.getElementById('servico-id')?.remove();
            const idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.id = 'servico-id';
            idInput.value = id;
            form.appendChild(idInput);

            // Ajusta o modal para o modo de edição
            modalTitle.textContent = 'Editar Serviço';
            formSubmitButton.textContent = 'Atualizar Serviço';
            modal.style.display = 'block';

        } catch (error) {
            console.error('Falha ao buscar serviço para edição:', error);
            alert(error.message);
        }
    }

    /**
     * DELETE: Deleta um serviço do backend.
     * Corresponde ao endpoint: DELETE /api/servico/{id}
     */
    async function deletarServico(id) {
        if (!confirm('Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });


            if (!response.ok) {
                throw new Error('Falha ao deletar o serviço.');
            }

            alert('Serviço deletado com sucesso!');
            carregarServicos(); // Atualiza a lista na tela

        } catch (error) {
            console.error('Falha ao deletar serviço:', error);
            alert(error.message);
        }
    }

    // --- Inicialização ---
    // Carrega os serviços existentes assim que a página é carregada.
    carregarServicos();

});