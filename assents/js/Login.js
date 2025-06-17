 class LoginForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.emailInput = document.querySelector("#email");
        this.passwordInput = document.querySelector("#sen");
        this.submitButton = document.querySelector("#cad");

        if (this.form) {
            this.attachEventListeners();
        } else {
            console.error("Formulário não encontrado.");
        }
    }

    attachEventListeners() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault(); // Previne envio padrão
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        if (this.validateEmail(email) && this.validatePassword(password)) {
            console.log("Email:", email);
            console.log("Senha:", password);

            // Aqui você pode substituir por uma chamada de API, redirecionamento, etc.
            alert("Cadastro realizado com sucesso!");
        } else {
            alert("Por favor, preencha os campos corretamente.");
        }
    }

    validateEmail(email) {
        // Regex simples para validar email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePassword(password) {
        // Pode adicionar regras mais complexas se necessário
        return password.length >= 6;
    }
}

// Inicializa a classe quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    new LoginForm("form");
});
