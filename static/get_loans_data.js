document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/loans')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const panel = document.querySelector("#loans_panel");
            panel.innerHTML = ""; // Limpa o painel antes de renderizar os empréstimos

            data.forEach(loan => {
                // Cria um contêiner para cada empréstimo
                const loanContainer = document.createElement("div");
                loanContainer.classList.add("loan-item");

                // Adiciona o nome do livro e do usuário
                loanContainer.innerHTML = `
                    <p><strong>Livro:</strong> ${loan.nome_livro}</p>
                    <p><strong>Usuário:</strong> ${loan.nome_usuario}</p>
                    <p><strong>Data do Empréstimo:</strong> ${loan.data_emprestimo}</p>
                    <label>
                        <input type="radio" name="id_emprestimo" value="${loan.id}">
                        Selecionar para devolução
                    </label>
                `;

                panel.appendChild(loanContainer);
            });

            // Botão para confirmar a devolução
            const returnButton = document.createElement("button");
            returnButton.textContent = "Confirmar Devolução";
            returnButton.addEventListener("click", function() {
                const selectedLoan = document.querySelector('input[name="return_radio"]:checked');
                
                if (selectedLoan) {
                    const loanId = selectedLoan.value;
                    fetch(`/api/loans/${loanId}/return`, {
                        method: 'POST',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao devolver o livro');
                        }
                        alert("Livro devolvido com sucesso!");
                        window.location.href('/return_book');
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        window.location.href('/return_book');
                    });
                }
            });

            panel.appendChild(returnButton);
        })
        .catch(error => {
            console.error('Erro:', error);
            window.location.reload();
        });
});
