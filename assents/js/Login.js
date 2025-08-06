class LoginForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.emailInput = document.getElementById('idemail');
        this.passwordInput = document.getElementById('idsenha');
        this.submitButton = this.form.querySelector('button[type="submit"]');

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!this.validateInputs(email, password)) {
            return;
        }

        this.disableForm();

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro desconhecido no login.');
            }

            const data = await response.json();
            console.log("Login bem-sucedido. Token recebido:", data.token);

            // Armazene o token de autenticação para uso futuro
            localStorage.setItem('auth_token', data.token);

            alert("Login realizado com sucesso! Redirecionando...");
            window.location.href = '../index.html';

        } catch (error) {
            console.error("Erro no login:", error);
            this.showError(error.message);
        } finally {
            this.enableForm();
        }
    }

    validateInputs(email, password) {
        if (!this.validateEmail(email)) {
            this.showError("Por favor, insira um email válido.");
            return false;
        }
        if (!this.validatePassword(password)) {
            this.showError("A senha deve ter pelo menos 6 caracteres.");
            return false;
        }
        return true;
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    disableForm() {
        this.submitButton.disabled = true;
        this.submitButton.textContent = "Entrando...";
        this.emailInput.disabled = true;
        this.passwordInput.disabled = true;
        this.clearError();
    }

    enableForm() {
        this.submitButton.disabled = false;
        this.submitButton.textContent = "Entrar";
        this.emailInput.disabled = false;
        this.passwordInput.disabled = false;
    }

    showError(message) {
        alert(message);
    }

    clearError() {
        // Lógica para remover mensagens de erro anteriores
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new LoginForm("form");
});