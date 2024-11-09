const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}, para finalizar pressione 'CTRL + C'`);
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS colaboradores (
      idFuncionario INTEGER PRIMARY KEY AUTOINCREMENT,
      nmFuncionario TEXT NOT NULL,
      dsEmail TEXT UNIQUE NOT NULL,
      dsFuncao TEXT NOT NULL,
      flAtivo BOOLEAN NOT NULL,
      isAdmin BOOLEAN NOT NULL
    )`);
});

//get all colaboradores
app.get('/colaboradores', (req, res) => {
    db.all('SELECT * FROM colaboradores', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

//get colaborador by idFuncionario
app.get('/colaboradores/:idFuncionario', (req, res) => {
    const { idFuncionario } = req.params;
    db.get('SELECT * FROM colaboradores WHERE idFuncionario = ?', [idFuncionario], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        row ? res.json(row) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
});

//create colaborador
app.post('/colaboradores', (req, res) => {
    const { nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin } = req.body;
    const query = `INSERT INTO colaboradores (nmFuncionario, dsEmail,dsFuncao,flAtivo,isAdmin) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin], function (err) {
        if (err) {
            res.status(400).json({ error: 'Usuário já cadastrado ou informações' });
            return;
        }
        res.json({ message: "Colaborador criado com sucesso" });
    });
});

//update colaborador by idFuncionario
app.put('/colaboradores', (req, res) => {
    const { idFuncionario, nmFuncionario, dsEmail, dsFuncao } = req.body;
    const query = `UPDATE colaboradores SET nmFuncionario = ?, dsEmail = ?, dsFuncao = ? WHERE idFuncionario = ?`;

    db.run(query, [nmFuncionario, dsEmail, dsFuncao, idFuncionario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Usuário atualizado com sucesso' }) : res.status(404).json({ message: 'Usuário não encontrado' });
    });
});

//delete colaborador by idFuncionario
app.delete('/colaboradores', (req, res) => {
    const { idFuncionario } = req.body;
    const query = `DELETE FROM colaboradores WHERE idFuncionario = ?`;

    db.run(query, idFuncionario, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Usuário deletado com sucesso' }) : res.status(404).json({ message: 'Usuário não encontrado' });
    });
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Conexão com o banco de dados fechada');
        process.exit(0);
    });
});