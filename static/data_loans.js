//Table books
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/loans')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#all_loans tbody");
            tbody.innerHTML = "";

            data.forEach(loans => {

                const row = document.createElement("tr");

                console.log(loans)
                const nomeCell = document.createElement("td");
                nomeCell.textContent = loans.nome_usuario;
                row.appendChild(nomeCell);

                const livroCell = document.createElement("td");
                livroCell.textContent = loans.nome_livro;
                row.appendChild(livroCell);

                const autorCell = document.createElement("td");
                autorCell.textContent = loans.autor;
                row.appendChild(autorCell);

                const emprestimoCell = document.createElement("td");
                emprestimoCell.textContent = loans.data_emprestimo;
                row.appendChild(emprestimoCell);

                const devolucaoCell = document.createElement("td");
                devolucaoCell.textContent = loans.data_devolucao;
                row.appendChild(devolucaoCell);



                



                tbody.appendChild(row);
                
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});




