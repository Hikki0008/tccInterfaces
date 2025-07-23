document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO DAS URLs DA API ---
    const API_BASE_URL = 'http://localhost:8080/api';
    const AGENDAMENTO_API_URL = `${API_BASE_URL}/agendamento`;
    const SERVICOS_API_URL = `${API_BASE_URL}/servico`;

    // --- MOCK DE DADOS DO PROFISSIONAL (SIMULAÇÃO) ---
    const mockProfissionais = {
        '1': { id: 1, nome: 'Ana Costa', especialidade: 'Cuidadora de Idosos', localizacao: 'Belo Horizonte, MG', registro: 'Certificado Profissional', avaliacao: '4.9 (87 Avaliações)', imagemUrl: 'https://images.pexels.com/photos/4270088/pexels-photo-4270088.jpeg?auto=compress&cs=tinysrgb&w=600' },
        '2': { id: 2, nome: 'Carlos Andrade', especialidade: 'Enfermeiro Domiciliar', localizacao: 'Contagem, MG', registro: 'COREN-MG 123.456', avaliacao: '5.0 (112 Avaliações)', imagemUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600' }
    };
    async function getProfessionalById(id) {
        return new Promise(resolve => setTimeout(() => resolve(mockProfissionais[id]), 200));
    }

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const agendamentoForm = document.getElementById('agendamento-form');
    const dateContainer = document.getElementById('date-items-container');
    const timeContainer = document.getElementById('time-items-container');
    const serviceCardsContainer = document.getElementById('service-cards-container');
    const subtotalValueElement = document.getElementById('subtotal-value');
    const agendamentosMarcadosContainer = document.getElementById('agendamentos-marcados-container'); // NOVO

    // Elementos do card do profissional
    const professionalImage = document.getElementById('professional-image');
    const professionalName = document.getElementById('professional-name');
    const professionalSpecialty = document.getElementById('professional-specialty');
    const professionalLocation = document.getElementById('professional-location');
    const professionalRegistry = document.getElementById('professional-registry');
    const professionalRating = document.getElementById('professional-rating');

    // --- ESTADO DO AGENDAMENTO ---
    let agendamentoState = { data: null, horario: null, servicoSelecionado: null, idProfissional: null };

    // --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA ---

    function populateProfessionalCard(professional) {
        professionalImage.src = professional.imagemUrl;
        professionalName.textContent = professional.nome;
        professionalSpecialty.innerHTML = `<i class="fas fa-user-md"></i> ${professional.especialidade}`;
        professionalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${professional.localizacao}`;
        professionalRegistry.innerHTML = `<i class="fas fa-id-card"></i> ${professional.registro}`;
        professionalRating.innerHTML = `<i class="fas fa-star"></i> ${professional.avaliacao}`;
    }

    /**
     * ATUALIZADO: Aceita uma lista de agendamentos para desabilitar horários.
     * @param {Array} agendamentos - Lista de agendamentos existentes.
     */
    function populateTimes(agendamentos = []) {
        timeContainer.innerHTML = '';
        const horarios = ['09:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30', '17:30'];

        horarios.forEach(horario => {
            const timeItem = document.createElement('div');
            timeItem.classList.add('time-item');
            timeItem.innerHTML = `<span class="time">${horario}</span>`;

            // Verifica se o horário já está agendado na data selecionada
            const isBooked = agendamentos.some(ag => ag.dataAgendamento === agendamentoState.data && ag.horarioAgendamento === horario);

            if (isBooked) {
                timeItem.classList.add('booked');
                timeItem.title = 'Horário indisponível';
            }

            timeContainer.appendChild(timeItem);
        });
    }

    // ATENÇÃO: a função populateDates permanece a mesma, pois a lógica de bloqueio está em populateTimes, que é chamado sempre que uma data é selecionada.
    function populateDates() {
        dateContainer.innerHTML = '';
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            if (date.getDay() === 0) continue;
            const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3);
            const dayOfMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            const dateValue = date.toISOString().split('T')[0];
            const dateItem = document.createElement('div');
            dateItem.classList.add('date-item');
            dateItem.setAttribute('data-date', dateValue);
            dateItem.innerHTML = `<span class="day-of-week">${dayOfWeek}</span><span class="day-of-month">${dayOfMonth.replace('.', '')}</span>`;
            dateContainer.appendChild(dateItem);
        }
    }


    /**
     * NOVO: Preenche a tabela de agendamentos marcados.
     * @param {Array} agendamentos - A lista de agendamentos do profissional.
     */
    function populateAgendamentosMarcados(agendamentos) {
        agendamentosMarcadosContainer.innerHTML = ''; // Limpa a tabela

        if (agendamentos.length === 0) {
            agendamentosMarcadosContainer.innerHTML = '<tr><td colspan="4">Nenhum horário agendado para este profissional.</td></tr>';
            return;
        }

        agendamentos.forEach(ag => {
            const dataFormatada = new Date(ag.dataAgendamento + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${ag.horarioAgendamento}</td>
                <td><span class="status">${ag.status || 'PENDENTE'}</span></td>
                <td>
                    <button class="btn-cancelar" data-agendamento-id="${ag.id}">Cancelar</button>
                </td>
            `;
            agendamentosMarcadosContainer.appendChild(row);
        });
    }

    async function carregarServicos() {
        try {
            const response = await fetch(SERVICOS_API_URL);
            if (!response.ok) throw new Error('Falha ao buscar serviços.');
            const servicos = await response.json();
            serviceCardsContainer.innerHTML = '';
            servicos.forEach(servico => {
                const card = document.createElement('div');
                card.className = 'service-type-card';
                card.dataset.serviceId = servico.id;
                card.dataset.serviceNome = servico.nome;
                card.dataset.servicePreco = servico.preco;
                card.innerHTML = `
                    <h4>${servico.nome.toUpperCase()}</h4>
                    <p class="price">A partir de ${Number(servico.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <div class="details"><p>${servico.descricao}</p></div>
                    <button type="button" class="add-to-cart">Adicionar</button>`;
                serviceCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            serviceCardsContainer.innerHTML = `<p style="color: red;">Não foi possível carregar os serviços.</p>`;
        }
    }

    function updateSubtotal() {
        const valor = agendamentoState.servicoSelecionado ? agendamentoState.servicoSelecionado.preco : 0;
        subtotalValueElement.textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- EVENT LISTENERS ---

    // Atualizado: Passa a lista de agendamentos ao selecionar uma data.
    dateContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.date-item');
        if (!target) return;
        dateContainer.querySelector('.selected')?.classList.remove('selected');
        target.classList.add('selected');
        agendamentoState.data = target.getAttribute('data-date');

        // Recarrega os horários, passando os agendamentos para a lógica de bloqueio.
        const professionalId = agendamentoState.idProfissional;
        initializePage(professionalId); // Recarrega os dados para atualizar os horários
    });

    timeContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.time-item');
        // Não permite selecionar se estiver agendado
        if (!target || target.classList.contains('booked')) return;

        timeContainer.querySelector('.selected')?.classList.remove('selected');
        target.classList.add('selected');
        agendamentoState.horario = target.querySelector('.time').textContent;
    });

    serviceCardsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const card = event.target.closest('.service-type-card');
            if (!card) return;
            serviceCardsContainer.querySelector('.selected')?.classList.remove('selected');
            card.classList.add('selected');
            agendamentoState.servicoSelecionado = {
                id: card.dataset.serviceId,
                nome: card.dataset.serviceNome,
                preco: parseFloat(card.dataset.servicePreco)
            };
            updateSubtotal();
        }
    });

    /**
     * NOVO: Listener para o botão de cancelar agendamento.
     */
    agendamentosMarcadosContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-cancelar')) {
            const agendamentoId = event.target.dataset.agendamentoId;
            if (confirm(`Tem certeza que deseja cancelar o agendamento #${agendamentoId}?`)) {
                try {
                    const response = await fetch(`${AGENDAMENTO_API_URL}/${agendamentoId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        // Se o status for 204 (No Content), a exclusão foi bem-sucedida.
                        if (response.status !== 204) {
                            throw new Error('Falha ao cancelar o agendamento.');
                        }
                    }

                    alert('Agendamento cancelado com sucesso!');
                    location.reload(); // Recarrega a página para atualizar a lista

                } catch (error) {
                    console.error('Erro ao cancelar agendamento:', error);
                    alert(error.message);
                }
            }
        }
    });

    agendamentoForm.addEventListener('submit', async (event) => { /* ...lógica de submissão do formulário permanece a mesma... */ });

    // --- INICIALIZAÇÃO DA PÁGINA ---
    async function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const professionalId = urlParams.get('id');

        if (!professionalId) {
            document.querySelector('.main-content').innerHTML = '<h1>Erro: Nenhum profissional selecionado.</h1><p>Por favor, volte à página anterior e escolha um profissional.</p>';
            return;
        }

        agendamentoState.idProfissional = professionalId; // Salva o ID no estado global

        try {
            // Busca dados do profissional e todos os agendamentos em paralelo
            const [professionalData, todosAgendamentosResponse] = await Promise.all([
                getProfessionalById(professionalId),
                fetch(AGENDAMENTO_API_URL)
            ]);

            if (!todosAgendamentosResponse.ok) throw new Error('Falha ao buscar agendamentos.');
            const todosAgendamentos = await todosAgendamentosResponse.json();

            // Filtra agendamentos apenas para o profissional atual
            const agendamentosDoProfissional = todosAgendamentos.filter(ag => ag.idProfissional == professionalId);

            // Popula todas as seções da página com os dados
            populateProfessionalCard(professionalData);
            populateAgendamentosMarcados(agendamentosDoProfissional); // NOVO
            await carregarServicos();
            populateDates();
            populateTimes(agendamentosDoProfissional); // Passa os agendamentos para bloquear horários

        } catch (error) {
            console.error("Erro ao inicializar a página:", error);
            document.querySelector('.main-content').innerHTML = `<h1>Erro ao carregar a página.</h1><p>${error.message}</p>`;
        }
    }

    initializePage();
});