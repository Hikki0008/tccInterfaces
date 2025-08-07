document.addEventListener('DOMContentLoaded', () => {
    // URL do seu endpoint de agendamento.
    // É importante que o Spring Boot esteja rodando para que a requisição funcione.
    const API_URL = 'http://localhost:8080/api/agendamento';
    const notificationsContainer = document.getElementById('notifications-container');

    // Função para buscar os agendamentos na API
    const fetchAppointments = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erro ao buscar as notificações.');
            }
            const appointments = await response.json();

            if (appointments.length === 0) {
                // Exibe uma mensagem se não houver notificações
                notificationsContainer.innerHTML = '<p>Você não tem novas notificações.</p>';
                return;
            }

            // Para cada agendamento, cria um cartão de notificação
            appointments.forEach(appointment => {
                createNotificationCard(appointment);
            });

        } catch (error) {
            console.error('Falha ao carregar as notificações:', error);
            notificationsContainer.innerHTML = '<p>Não foi possível carregar as notificações. Tente novamente mais tarde.</p>';
        }
    };

    // Função para criar um elemento de notificação a partir dos dados do agendamento
    const createNotificationCard = (appointment) => {
        // Converte a data do agendamento para um formato legível
        const appointmentDate = new Date(appointment.dataInicio).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Cria o elemento HTML completo para o cartão
        const cardHtml = `
            <div class="notification-card">
                <i class="fas fa-calendar-check notification-icon"></i>
                <div class="notification-content">
                    <h4 class="notification-title">Novo Agendamento Confirmado</h4>
                    <p class="notification-message">
                        O serviço de <strong>${appointment.servico.nome}</strong> com o profissional <strong>${appointment.profissional.nome}</strong> para o paciente <strong>${appointment.paciente.nome}</strong> foi confirmado.
                    </p>
                </div>
                <span class="notification-date">${appointmentDate}</span>
            </div>
        `;

        // Insere o HTML do novo cartão no contêiner
        notificationsContainer.insertAdjacentHTML('beforeend', cardHtml);
    };

    // Chama a função para buscar e exibir as notificações ao carregar a página
    fetchAppointments();
});