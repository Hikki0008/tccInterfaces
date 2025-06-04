let selected = null;

function selectOption(optionId) {
    // Remover seleção anterior
    if (selected) {
        document.getElementById(selected).classList.remove('selected');
    }

    // Selecionar nova opção
    selected = optionId;
    document.getElementById(optionId).classList.add('selected');

    // Habilitar botão
    document.getElementById('continueBtn').disabled = false;
}

// Evento do botão continuar
document.getElementById('continueBtn').addEventListener('click', () => {
    if (selected) {
        alert(`Você selecionou: ${selected}`);
        // Redirecionar ou carregar o formulário específico
        // window.location.href = `/cadastro/${selected}.html`;
    }
});
