document.addEventListener('DOMContentLoaded', () => {
    // Endereço da API para buscar todos os agendamentos.
    const API_URL = 'http://localhost:8080/api/agendamento';
    const toastContainer = document.getElementById('toast-notifications-container');

    // Array para armazenar os IDs dos agendamentos já notificados
    let notifiedAppointments = [];

    // Função para exibir um pop-up de notificação
    const showToastNotification = (appointment) => {
        // Cria um elemento div para o card
        const toastCard = document.createElement('div');
        toastCard.className = 'toast-notification-card';

        // Define o conteúdo do card com base nos dados do agendamento
        toastCard.innerHTML = `
            <i class="fas fa-calendar-check notification-icon"></i>
            <div class="notification-content">
                <h4 class="notification-title">Novo Agendamento!</h4>
                <p class="notification-message">
                    Um serviço para <strong>${appointment.paciente.nome}</strong> foi confirmado.
                </p>
            </div>
        `;

        // Adiciona o card ao container
        toastContainer.appendChild(toastCard);

        // Remove o card automaticamente após 5 segundos
        setTimeout(() => {
            toastCard.remove();
        }, 5000);
    };

    // Função para buscar novos agendamentos
    const fetchNewAppointments = async () => {
        try {
            const response = await fetch(API_URL);
            const appointments = await response.json();

            // Filtra agendamentos que ainda não foram notificados
            const newAppointments = appointments.filter(app => !notifiedAppointments.includes(app.id));

            if (newAppointments.length > 0) {
                newAppointments.forEach(app => {
                    showToastNotification(app);
                    // Adiciona o ID do novo agendamento à lista de notificados
                    notifiedAppointments.push(app.id);
                });
            }

        } catch (error) {
            console.error('Erro ao buscar novos agendamentos:', error);
        }
    };

    // Chama a função de busca a cada 10 segundos
    setInterval(fetchNewAppointments, 10000); // 10000 ms = 10 segundos
});