function cadastrarFuncionario(event){
    event.preventDefault();
    const nome = document.getElementById('idnome').value;
    const email = document.getElementById('idemail').value;
    const senha = document.getElementById('idsenha').value;
    const cep = document.getElementById('idcep').value;
    const endereco = document.getElementById('idendereco').value;
    const numero = document.getElementById('idnumero').value;
    const bairro = document.getElementById('idbairro').value;
    const cidade = document.getElementById('idcidade').value;
    const estado = document.getElementById('idestado').value;


if(nome&&email&&senha&&cep&&endereco&&numero&&bairro&&cidade&estado){


    document.getElementById('idnome').value ="";
    document.getElementById('idemail').value = "";
    document.getElementById('idsenha').value = "";
    document.getElementById('idcep').value = "";
    document.getElementById('idendereco').value = "";
    document.getElementById('idnumero').value = "";
    document.getElementById('idbairro').value = "";
    document.getElementById('idcidade').value = "";
    document.getElementById('idestado').value = "";

fetch('http://localhost:8080/ai/funcionarios', {
    method :'POST',
    Headers: {
        'content-type': 'application/json'
    },
    ReportBody: JSON.stringify({"nome":nome,"email":email,"senha": senha, "cep": cep,"endereco": endereco,
        "numero": numero, "bairro": bairro, "cidade": cidade, "estado": estado})
    })
.then(response=> response.json())
.then(data => {
    console.log("Resposta da API:", data);
})
.catch(error => {
    console.log("erro ao enviar dados:", error);
        });
    }
}
document.getElementById("formcadastro").addEventListener("submit",cadastrarFuncionario)