class LoginForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.emailInput = document.querySelector("#email");
        this.passwordInput = document.querySelector("#sen");
        this.submitButton = document.querySelector("#cad");

        // URL do seu endpoint de login.
        // Substitua 'http://localhost:8080/api/login' pela URL correta da sua API,
        // se for diferente.
        this.loginUrl = 'http://localhost:8080/api/login'; 

        if (this.form) {
            this.attachEventListeners();
        } else {
            console.error("Formulário não encontrado.");
        }
    }

    attachEventListeners() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Limpa mensagens de erro e desabilita o botão para evitar múltiplos cliques
        this.disableForm();

        try {
            // Verifica se a validação básica do formulário foi bem-sucedida
            if (!this.validateInputs(email, password)) {
                return;
            }

            const response = await fetch(this.loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha: password }),
            });

            if (!response.ok) {
                // Tenta ler uma mensagem de erro do corpo da resposta, se disponível
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Credenciais inválidas.');
            }

            const data = await response.json();
            console.log("Login bem-sucedido:", data);
            
            // Aqui você pode salvar o token ou dados do usuário no localStorage
            // Exemplo: localStorage.setItem('token', data.token);

            // Redireciona o usuário após o login
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
        // Implementa a validação de email e senha
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
        // Exibe a mensagem de erro para o usuário
        alert(message);
    }

    clearError() {
        // Lógica para remover mensagens de erro anteriores
    }
}

// Inicializa a classe quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    new LoginForm("form");
});