document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DE DADOS (SIMULAÇÃO DO BACKEND) ---
    // Em uma aplicação real, estes dados viriam do seu backend ao fazer fetch('/api/profissionais/1')
    const mockProfissionais = {
        '1': {
            id: 1,
            nome: 'Ana Costa',
            especialidade: 'Cuidadora de Idosos',
            localizacao: 'Belo Horizonte, MG',
            registro: 'Certificado de Cuidadora Profissional',
            avaliacao: '4.9 (87 Avaliações)',
            imagemUrl: 'https://images.pexels.com/photos/4270088/pexels-photo-4270088.jpeg?auto=compress&cs=tinysrgb&w=600' // Substitua por uma imagem real
        },
        '2': {
            id: 2,
            nome: 'Carlos Andrade',
            especialidade: 'Enfermeiro Domiciliar',
            localizacao: 'Contagem, MG',
            registro: 'COREN-MG 123.456',
            avaliacao: '5.0 (112 Avaliações)',
            imagemUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600' // Substitua por uma imagem real
        }
    };
    
    // Função que simula a busca no banco de dados
    async function getProfessionalById(id) {
        // Em um projeto real:
        // const response = await fetch(`/api/profissionais/${id}`);
        // return await response.json();
        
        // Simulação para este exemplo:
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simula a demora da rede
                if (mockProfissionais[id]) {
                    resolve(mockProfissionais[id]);
                } else {
                    reject('Profissional não encontrado');
                }
            }, 500);
        });
    }

    // --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
    const agendamentoForm = document.getElementById('agendamento-form');
    const dateContainer = document.getElementById('date-items-container');
    const timeContainer = document.getElementById('time-items-container');
    const serviceCards = document.querySelectorAll('.service-type-card');
    const subtotalValueElement = document.getElementById('subtotal-value');
    
    // Seletores para o novo card do profissional
    const professionalCard = document.getElementById('professional-card');
    const professionalImage = document.getElementById('professional-image');
    const professionalName = document.getElementById('professional-name');
    const professionalSpecialty = document.getElementById('professional-specialty');
    const professionalLocation = document.getElementById('professional-location');
    const professionalRegistry = document.getElementById('professional-registry');
    const professionalRating = document.getElementById('professional-rating');
    

    // --- 2. ESTADO DO AGENDAMENTO ---
    let agendamentoState = {
        data: null,
        horario: null,
        tipoServico: null,
        valor: 0.0,
        idProfissional: null // Campo importante para guardar o ID do profissional
    };

    // --- 3. FUNÇÕES DINÂMICAS E DE LÓGICA ---

    // --- NOVO: Função para preencher o card do profissional ---
    function populateProfessionalCard(professional) {
        professionalImage.src = professional.imagemUrl;
        professionalName.textContent = professional.nome;
        professionalSpecialty.innerHTML = `<i class="fas fa-user-md"></i> ${professional.especialidade}`;
        professionalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${professional.localizacao}`;
        professionalRegistry.innerHTML = `<i class="fas fa-id-card"></i> ${professional.registro}`;
        professionalRating.innerHTML = `<i class="fas fa-star"></i> ${professional.avaliacao}`;
    }

    // Função para popular as datas (continua a mesma)
    function populateDates() {
        // ...código da função populateDates() da resposta anterior...
    }

    // Função para popular os horários (continua a mesma)
    function populateTimes() {
        // ...código da função populateTimes() da resposta anterior...
    }
    
    // Função para atualizar o subtotal (continua a mesma)
    function updateSubtotal() {
        // ...código da função updateSubtotal() da resposta anterior...
    }


    // --- 4. EVENT LISTENERS ---
    // (Todos os event listeners da resposta anterior continuam aqui)
    dateContainer.addEventListener('click', (event) => { /* ... */ });
    timeContainer.addEventListener('click', (event) => { /* ... */ });
    serviceCards.forEach(card => { /* ... */ });


    // --- ATUALIZAÇÃO: Evento de submissão do formulário ---
    agendamentoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!agendamentoState.data || !agendamentoState.horario || !agendamentoState.tipoServico) {
            alert('Por favor, selecione data, horário e um tipo de serviço.');
            return;
        }

        // Garante que o ID do profissional está no estado
        if (!agendamentoState.idProfissional) {
            alert('Erro: ID do profissional não encontrado. Volte e selecione um profissional novamente.');
            return;
        }

        const agendamentoParaSalvar = {
            dataAgendamento: agendamentoState.data,
            horarioAgendamento: agendamentoState.horario,
            tipoServico: agendamentoState.tipoServico,
            valor: agendamentoState.valor,
            status: 'PENDENTE',
            // --- ATUALIZAÇÃO: Incluindo o ID do profissional ---
            idProfissional: agendamentoState.idProfissional,
            // idCliente: 1, // Obter o ID do cliente logado
        };
        
        console.log('Enviando para o backend:', JSON.stringify(agendamentoParaSalvar));

        try {
            const response = await fetch('/api/agendamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamentoParaSalvar),
            });

            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            const data = await response.json();
            console.log('Sucesso:', data);
            alert(`Agendamento #${data.id} realizado com sucesso para ${professionalName.textContent}!`);
            agendamentoForm.reset();
            location.reload();
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            alert('Não foi possível realizar o agendamento. Tente novamente mais tarde.');
        }
    });


    // --- 5. INICIALIZAÇÃO DA PÁGINA ---
    async function initializePage() {
        // Pega os parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const professionalId = urlParams.get('id');

        if (!professionalId) {
            // Se não houver ID, esconde o formulário e mostra um erro
            document.querySelector('.main-content').innerHTML = '<h1>Erro: Nenhum profissional selecionado.</h1><p>Por favor, volte à página anterior e escolha um profissional para agendar.</p>';
            return;
        }

        try {
            // Busca os dados do profissional (usando a simulação)
            const professionalData = await getProfessionalById(professionalId);
            
            // Preenche o card do profissional
            populateProfessionalCard(professionalData);
            
            // Salva o ID no estado do agendamento
            agendamentoState.idProfissional = professionalData.id;

            // Popula datas e horários
            populateDates();
            populateTimes();
        } catch (error) {
            document.querySelector('.main-content').innerHTML = `<h1>Erro: Profissional não encontrado.</h1><p>${error}</p>`;
        }
    }

    initializePage();
    
    // (Cole aqui as funções e event listeners que omiti com "..." para manter o código limpo)
    // Ex: populateDates, populateTimes, updateSubtotal, e os listeners de data, hora e serviço.
});
