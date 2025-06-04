document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Paciente cadastrado com sucesso!');
    // Aqui você pode enviar os dados para sua API usando fetch/Axios
});
