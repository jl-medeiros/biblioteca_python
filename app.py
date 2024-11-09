from datetime import datetime, date, timedelta
import re
from flask import Flask, render_template, url_for, jsonify, request, redirect
from sqlalchemy import text, exists
from werkzeug.security import generate_password_hash, check_password_hash

from biblioteca import Biblioteca, Usuario, Credentials, Livros, Emprestimo

biblioteca = Biblioteca(user="lucas", password="123456", host="localhost", port="3307", database="biblioteca")

app = Flask(__name__)
app.secret_key = 'super_secret_key'

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/relatorios')
def relatorios():
    return render_template("relatorios.html")

@app.route('/register_page', methods=['POST', 'GET'])
def register_page():
    if request.method == 'POST':
        user = request.form.get('user')
        password = request.form.get('password')
        email = request.form.get('email')
        name = request.form.get('name')
        endereco = request.form.get('endereco')

        conditions = [
            user and len(user) > 3, 
            password and len(password) >= 8 and re.search(r'[A-Za-z]', password) and re.search(r'[0-9]', password),
            email and re.match(r"[^@]+@[^@]+\.[^@]+", email),
            endereco and len(endereco) > 5, 
            name and len(name) > 5
        ]

        if all(conditions):
            cursor = biblioteca.Session()

            emailAlreadyExists = cursor.query(exists().where(Usuario.email == email)).scalar()
            userAlreadyExists = cursor.query(exists().where(Credentials.login == user)).scalar()

            if emailAlreadyExists or userAlreadyExists:
                return jsonify({"message": "Erro no cadastro, o email ou usuario informado já existe.", "status": "error"})

            user_data = Usuario(nome=name, email=email, endereco=endereco)
            cursor.add(user_data)
            cursor.commit() 

            credentials = Credentials(id = user_data.id, login = user, senha = generate_password_hash(password, method='pbkdf2'))
            cursor.add(credentials)
            cursor.commit() 

            return jsonify({"message": "Cadastro realizado com sucesso!", "status": "success"})
        else:
            return jsonify({"message": "Erro no cadastro, verifique os dados.", "status": "error"})
        
    return render_template("register_page.html")


@app.route('/insert_book', methods=['POST', 'GET'])
def InsertABook():
    if request.method == 'POST':
        isbn = request.form.get('isbn')
        titulo = request.form.get('titulo')
        autor = request.form.get('autor')
        ano_publicacao = request.form.get('ano_pub')
        copias_disponiveis = request.form.get('copias_disp')
        cursor = biblioteca.Session()

        books_data = Livros(ISBN=int(isbn), titulo=titulo, autor=autor, ano_publicacao = int(ano_publicacao), copias_disponiveis = int(copias_disponiveis))
        cursor.add(books_data)
        cursor.commit() 


        return jsonify({"message": "Cadastro realizado com sucesso!", "status": "success"})

    return render_template("insert_book.html")


@app.route('/loan', methods = ['POST', 'GET'])
def bookLoan():
    if request.method == 'POST':
        user = request.form.get('users')
        book = request.form.get('books')

        result = biblioteca.realizarEmprestimo(id_livro=book, id_usuario=user)
        
        if result == 'Sucess':
            return jsonify({"message": "Emprestimo realizado com sucesso!", "status": "success"})
        else:
            return jsonify({"message": "Erro ao realizar o emprestimo!", "status": "fail"})
    return render_template('loan.html')

@app.route('/return_book', methods = ['POST', 'GET'])
def bookReturn():
    if request.method == 'POST':
        id = request.form.get('id_emprestimo')
        result = biblioteca.devolverLivro(id_emprestimo = id)
        
        if result == 'Sucess':
            return jsonify({"message": "Devolução realizada com sucesso!", "status": "success"})
        else:
            return jsonify({"message": "Erro ao realizar a devolução!", "status": "fail"})
    return render_template('book_return.html')


#APIS
@app.route('/api/livros', methods=['GET'])
def exibir_titulos():
    try:
        livros = biblioteca.buscar_livros()
        return jsonify(livros)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/api/users', methods=['GET'])
def exibir_usuarios():
    try:
        usuarios = biblioteca.buscar_usuarios()
        return jsonify(usuarios)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/api/loans', methods=['GET'])
def exibir_emprestimos():
    try:
        loans = biblioteca.buscar_emprestimos()
        return jsonify(loans)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


#TABELAS
@app.route('/visao_livros')
def renderBooks():
    return render_template("books_table.html")

@app.route('/visao_emprestimos')
def renderLoans():
    return render_template("loans_table.html")

@app.route('/visao_usuarios')
def renderUsers():
    return render_template("users_table.html")




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')