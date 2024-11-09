//Table books
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#all_users tbody");
            tbody.innerHTML = "";

            data.forEach(user => {
                const row = document.createElement("tr");

                const nomeCell = document.createElement("td");
                nomeCell.textContent = user.nome;
                row.appendChild(nomeCell);

                const emailCell = document.createElement("td");
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                const enderecoCell = document.createElement("td");
                enderecoCell.textContent = user.endereco;
                row.appendChild(enderecoCell);
        
        

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});




