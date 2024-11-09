//Table books
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/livros')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#all_books tbody");
            tbody.innerHTML = "";

            data.forEach(livro => {
                const row = document.createElement("tr");

                const isbnCell = document.createElement("td");
                isbnCell.textContent = livro.ISBN;
                row.appendChild(isbnCell);

                const tituloCell = document.createElement("td");
                tituloCell.textContent = livro.titulo;
                row.appendChild(tituloCell);

                const autorCell = document.createElement("td");
                autorCell.textContent = livro.autor;
                row.appendChild(autorCell);

                const anoPublicacaoCell = document.createElement("td");
                anoPublicacaoCell.textContent = livro.ano_publicacao || 'N/A'; 
                row.appendChild(anoPublicacaoCell);

                const copiasDisponiveisCell = document.createElement("td");
                copiasDisponiveisCell.textContent = livro.copias_disponiveis;
                if(livro.copias_disponiveis == 0){
                    row.classList.add("not-avalible"); 
                }
                row.appendChild(copiasDisponiveisCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});




