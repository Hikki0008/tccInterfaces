document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const erroCep = document.getElementById("erro-cep");

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) {
            erroCep.textContent = "CEP inválido. Deve conter 8 dígitos.";
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                erroCep.textContent = "CEP não encontrado.";
                return;
            }

            erroCep.textContent = "";
            document.getElementById("endereco").value = dados.logradouro || "";
            document.getElementById("bairro").value = dados.bairro || "";
            document.getElementById("cidade").value = dados.localidade || "";
            document.getElementById("estado").value = dados.uf || "";

        } catch (e) {
            erroCep.textContent = "Erro ao buscar o CEP. Verifique sua conexão.";
        }
    });
}); 