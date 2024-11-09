
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/livros')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const select_books = document.querySelector("#books_select");
            select_books.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "SELECIONE SEU LIVRO";
            defaultOption.value = "default";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            select_books.appendChild(defaultOption);

            data.forEach(livro => {
                const option = document.createElement("option");
                option.textContent = livro.titulo;
                option.value = livro.ISBN;

                if (livro.copias_disponiveis === 0) {
                    option.classList.add("not-avalible"); 
                    option.disabled = true;
                }

                select_books.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});

//Carregar usuarios no option
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const select_users = document.querySelector("#users_select");
            select_users.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "SELECIONE O USUARIO";
            defaultOption.value = "default";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            select_users.appendChild(defaultOption);

            data.forEach(user => {
                const option = document.createElement("option");
                option.textContent = user.nome;
                option.value = user.id; 
                
                select_users.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});

