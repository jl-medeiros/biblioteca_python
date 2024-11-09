from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import date, timedelta

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String ,BigInteger, Date


class Biblioteca():

    def __init__(self, user, password, host, port, database):
        self.engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}")
        self.Session = sessionmaker(bind=self.engine)

    def verificarDispLivros(self, id_livro):
        session = self.Session()
        try:
            result = session.execute(text(f'SELECT copias_disponiveis FROM livros WHERE ISBN = {id_livro}'))
            disp = result.fetchall()
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return 0
        finally:
            session.close()

        print('Disponibilidade do livro:', disp)
        return disp[0][0]
    
    def verificarEmprestimos(self, id_usuario):
        session = self.Session()
        try:
            result = session.execute(text(f'SELECT * FROM emprestimos WHERE id_usuario = {id_usuario}'))
            emprestimos = result.fetchall()
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
        finally:
            session.close()
            return emprestimos
        
    def realizarEmprestimo(self, id_usuario, id_livro):
        session = self.Session()
        data_devolucao = date.today() + timedelta(days=10)
        try:
            if self.verificarDispLivros(id_livro) > 0:
                session.execute(
                    text('INSERT INTO emprestimos (id_usuario, id_livro, data_devolucao) VALUES (:id_usuario, :id_livro, :data_devolucao)'),
                    {'id_usuario': id_usuario, 'id_livro': id_livro, 'data_devolucao': data_devolucao}
                )
                session.execute(
                    text('UPDATE livros SET copias_disponiveis = copias_disponiveis - 1 WHERE ISBN = :id'),
                    {'id': id_livro}
                )

                session.commit()  
                return 'Sucess'
            else:
                print('O livro não está disponivel para emprestimo, por gentileza aguarde a proxima data de devolução.')
                return 'Fail'
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
        finally:
            session.close()  

    def devolverLivro(self, id_emprestimo):
        session = self.Session()
        
        try:
            tabela = session.execute(
                text('SELECT id_livro FROM emprestimos WHERE id = :id'),
                {'id': id_emprestimo}
            ).fetchone()

            id_livro = tabela[0]

            session.execute(
                    text('DELETE FROM emprestimos WHERE id = :id'),
                    {'id': id_emprestimo}
                )
            session.execute(
                text('UPDATE livros SET copias_disponiveis = copias_disponiveis + 1 WHERE ISBN = :id'),
                {'id': id_livro}
            )
            session.commit()  
            return 'Sucess'
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return 'Fail'
        finally:    
            session.close()  


    def buscar_livros(self):
        session = self.Session()
        try:
            result = session.execute(text('SELECT * FROM livros')).mappings()
            livros = [{"ISBN":row['ISBN'],"titulo": row["titulo"], "autor": row["autor"], "ano_publicacao": row["ano_publicacao"],
                        "copias_disponiveis": row["copias_disponiveis"]} for row in result]
            return livros
        except Exception as e:
            print(f"Ocorreu um erro ao buscar livros: {e}")
            return []
        finally:
            session.close()

    def buscar_usuarios(self):
        session = self.Session()
        try:
            result = session.execute(text('SELECT * FROM usuarios')).mappings()
            users = [{"id":row['id'],"nome": row["nome"], "email": row["email"], "endereco": row["endereco"]} for row in result]
            return users
        except Exception as e:
            print(f"Ocorreu um erro ao buscar usuarios: {e}")
            return []
        finally:
            session.close()

    def buscar_emprestimos(self):
        session = self.Session()
        try:
            result = session.execute(
                text('''
                    SELECT emprestimos.id, usuarios.nome AS nome_usuario, livros.titulo AS nome_livro, 
                        livros.autor as autor, emprestimos.data_emprestimo, emprestimos.data_devolucao
                    FROM emprestimos
                    JOIN usuarios ON emprestimos.id_usuario = usuarios.id
                    JOIN livros ON emprestimos.id_livro = livros.ISBN
                ''')
            ).mappings()
            
            loan = [
                {
                    "id": row['id'],
                    "nome_usuario": row["nome_usuario"],
                    "nome_livro": row["nome_livro"],
                    "data_emprestimo": row["data_emprestimo"],
                    "data_devolucao": row["data_devolucao"],
                    "autor": row["autor"]
                }
                for row in result
            ]
            return loan
        except Exception as e:
            print(f"Ocorreu um erro ao buscar empréstimos: {e}")
            return []
        finally:
            session.close()



Base = declarative_base()
class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    nome = Column(String)
    email = Column(String, unique=True) 
    endereco = Column(String)

class Credentials(Base):
    __tablename__ = 'credentials'
    id = Column(Integer, primary_key=True)
    login = Column(String, unique=True)
    senha = Column(String) 

class Livros(Base):
    __tablename__ = 'livros'
    ISBN = Column(BigInteger, primary_key=True)
    titulo = Column(String)
    autor = Column(String) 
    ano_publicacao = Column(String) 
    copias_disponiveis = Column(String) 

class Emprestimo(Base):
    __tablename__ = 'emprestimos'
    id = Column(Integer, primary_key=True)
    id_usuario = Column(String)
    id_livro = Column(String)
    data_devolucao = Column(Date) 
