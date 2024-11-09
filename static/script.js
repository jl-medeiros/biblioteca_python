async function updateBookRecommendation() {
    let isbn;
    
    try {
        const response = await fetch('/api/livros');
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        
        if (data.length === 0) {
            console.log("Nenhum livro encontrado na resposta da API.");
            return;
        }

        let bookFound = false;
        let attemptCount = 0;
        while (!bookFound && attemptCount < 5) {
            const randomIndex = Math.floor(Math.random() * data.length);
            isbn = data[randomIndex].ISBN;
            isbn = isbn.toString();
            console.log("Tentando ISBN:", isbn);

            const bookResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
            const bookData = await bookResponse.json();
            const bookKey = `ISBN:${isbn}`;
            const book = bookData[bookKey];

            if (book) {
                const title = book.title;
                const author = book.authors.map(author => author.name).join(", ");
                const imageUrl = book.cover ? book.cover.medium : 'static/images/img_recommendation.jpg';

                const synopsis = book.description ? 
                    (typeof book.description === 'string' ? book.description : (book.description.value || "Sinopse não disponível")) 
                    : "Sinopse não disponível";

                document.getElementById('recommendation_title').innerText = `${title} - ${author}`;
                document.getElementById('recommendation_image').src = imageUrl;
                document.getElementById('recommendation_description').innerText = synopsis;
                
                bookFound = true; 
            } else {
                attemptCount++;
                console.log(`Livro não encontrado para o ISBN: ${isbn}. Tentativa ${attemptCount} de 5.`);
            }
        }

        if (!bookFound) {
            console.log("Não foi possível encontrar um livro válido após 5 tentativas.");
        }

    } catch (error) {
        console.error("Erro:", error);
    }
}




async function register(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/register_page', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        alert(result.message);

    } catch (error) {
        alert("Ocorreu um erro inesperado.");
        console.error("Erro:", error);
    }
}

async function login(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/login_page', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        alert(result.message);

    } catch (error) {
        alert("Ocorreu um erro inesperado.");
        console.error("Erro:", error);
    }
}

async function book(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/insert_book', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        alert(result.message);

    } catch (error) {
        alert("Ocorreu um erro inesperado.");
        console.error("Erro:", error);
    }
}

async function loan(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/loan', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        alert(result.message);

    } catch (error) {
        alert("Ocorreu um erro inesperado.");
        console.error("Erro:", error);
    }
}

async function return_book(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/return_book', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        alert(result.message);

    } catch (error) {
        alert("Ocorreu um erro inesperado.");
        console.error("Erro:", error);
    }
}

updateBookRecommendation();
