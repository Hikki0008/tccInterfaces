document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const icon = button.querySelector('i');

            // Alterna a classe 'active' no item do FAQ para controlar o estado
            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                // Abre a resposta, ajustando a altura para o seu conteúdo
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                // Gira o ícone para cima
                icon.style.transform = 'rotate(180deg)';
            } else {
                // Fecha a resposta
                faqAnswer.style.maxHeight = '0';
                // Retorna o ícone para a posição inicial
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
});