const API_URL = "https:localhost/api/cargos";


function carregarCargos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(cargos => {
            const tabela = document.getElementById("tabelaCorpo");
            tabela.innerHTML = "";

            cargos.forEach(cargo => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${cargo.nome}</td>
                    <td>${cargo.descricao}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" onclick="editarCargo(${cargo.id}, '${cargo.nome}', '${cargo.descricao}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarCargo(${cargo.id})">Excluir</button>
                    </td>
                `;

                tabela.appendChild(row);
            });
        })
        .catch(error => console.error("Erro ao carregar cargos:", error));
}


function cadastrarCargo(event) {
    event.preventDefault();

    const nome = document.getElementById("idcargo").value;
    const descricao = document.getElementById("idescricao").value;

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, descricao })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar cargo");
            return res.json();
        })
        .then(() => {
            document.querySelector("form").reset();
            carregarCargos();
        })
        .catch(error => console.error(error));
}

// Função para editar cargo (preencher os campos e mudar o botão)
function editarCargo(id, nome, descricao) {
    document.getElementById("idcargo").value = nome;
    document.getElementById("idescricao").value = descricao;

    const botao = document.querySelector("button[type='submit']");
    botao.textContent = "Atualizar";
    botao.classList.remove("btn-success");
    botao.classList.add("btn-primary");

    botao.onclick = function (event) {
        event.preventDefault();
        atualizarCargo(id);
    };
}

function filtrarCargosPorId() {
    const termo = document.getElementById("buscaInput").value;

    if (termo === "") {
        carregarCargos(); // Volta à lista completa
        return;
    }

    fetch(`${API_URL}/${termo}`)
        .then(res => {
            if (!res.ok) throw new Error("Cargo não encontrado");
            return res.json();
        })
        .then(cargo => {
            renderizarCargos([cargo]);
        })
        .catch(error => {
            console.error(error);
            renderizarCargos([]);
        });
}

function atualizarCargo(id) {
    const nome = document.getElementById("idcargo").value;
    const descricao = document.getElementById("idescricao").value;

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, descricao })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao atualizar cargo");
            return res.json();
        })
        .then(() => {
            document.querySelector("form").reset();
            const botao = document.querySelector("button[type='submit']");
            botao.textContent = "Cadastrar";
            botao.classList.remove("btn-primary");
            botao.classList.add("btn-success");
            botao.onclick = cadastrarCargo;
            carregarCargos();
        })
        .catch(error => console.error(error));
}

// Função para deletar cargo (DELETE)
function deletarCargo(id) {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao excluir cargo");
            carregarCargos();
        })
        .catch(error => console.error(error));
}

// Carregar cargos ao abrir a página
document.addEventListener("DOMContentLoaded", carregarCargos);
