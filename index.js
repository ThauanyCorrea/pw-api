const express = require('express')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const getCursos = (request, response) => {
    pool.query('SELECT * FROM cursos', (error, results) => {
        if (error) {
            return response.status(401).json({
                status: 'error',
                message: 'Erro ao recuperar os cursos: ' + error
            });
        }
        response.status(200).json(results.rows)
    })
}

const getAlunos = (request, response) => {
    pool.query('SELECT * FROM alunos', (error, results) => {
        if (error) {
            return response.status(401).json({
                status: 'error',
                message: 'Erro ao recuperar os alunos: ' + error
            });
        }
        response.status(200).json(results.rows)
    })
}

const addCurso = (request, response) => {
    const { nome } = request.body

    pool.query(
        'INSERT INTO cursos (nome) VALUES ($1)',
        [nome],
        (error) => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro ao inserir o curso: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'curso criado.' })
        },
    )
}

const addAluno = (request, response) => {
    const { nome, curso } = request.body

    pool.query(
        'INSERT INTO alunos (nome, curso) VALUES ($1, $2)',
        [nome, curso],
        (error) => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro ao inserir o aluno: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'aluno criado.' })
        },
    )
}

const updateCurso = (request, response) => {
    const { codigo, nome } = request.body
    pool.query('UPDATE cursos set nome=$1 where codigo=$2',
        [nome, codigo], error => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro ao atualizar o curso: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'curso atualizado.' })
        })
}

const updateAluno = (request, response) => {
    const { codigo, nome, curso } = request.body
    pool.query('UPDATE alunos set nome=$1, curso=$2 where codigo=$3',
        [nome, curso, codigo], error => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro ao atualizar o aluno: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'aluno atualizado.' })
        })
}

const deleteCurso = (request, response, next) => {
    const codigo = parseInt(request.params.id)
    pool.query(
        'DELETE from cursos where codigo=$1',
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Não foi possivel remover o curso'
                });
            }
            response.status(201).json({
                status: 'success',
                message: 'curso removido com sucesso'
            })
        },
    )
}

const deleteAluno = (request, response, next) => {
    const codigo = parseInt(request.params.id)
    pool.query(
        'DELETE from alunos where codigo=$1',
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Não foi possivel remover o aluno'
                });
            }
            response.status(201).json({
                status: 'success',
                message: 'aluno removido com sucesso'
            })
        },
    )
}

const getCursoPorID = (request, response) => {
    const codigo = parseInt(request.params.id)
    pool.query('SELECT * FROM cursos where codigo = $1',
        [codigo], (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Não foi possivel recuperar o curso'
                });
            }
            response.status(200).json(results.rows)
        })
}

const getAlunoPorID = (request, response) => {
    const codigo = parseInt(request.params.id)
    pool.query('SELECT cursos.*, cursos.nome as curso_nome, alunos.* FROM alunos, cursos where alunos.codigo = $1 and alunos.curso = cursos.codigo',
        [codigo], (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Não foi possivel recuperar o aluno'
                });
            }
            response.status(200).json(results.rows)
        })
}

app
    .route('/cursos')
    .get(getCursos)
    .post(addCurso)
    .put(updateCurso)

app
    .route('/alunos')
    .get(getAlunos)
    .post(addAluno)
    .put(updateAluno)

app.route('/cursos/:id')
    .delete(deleteCurso)
    .get(getCursoPorID)

app.route('/alunos/:id')
    .delete(deleteAluno)
    .get(getAlunoPorID)

app.listen(process.env.PORT || 3002, () => {
    console.log(`Servidor rodando`)
})