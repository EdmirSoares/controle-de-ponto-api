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
    db.run(`
CREATE TABLE IF NOT EXISTS colaboradores (
  idFuncionario INTEGER PRIMARY KEY AUTOINCREMENT,
  nmFuncionario TEXT NOT NULL,
  dsEmail TEXT UNIQUE NOT NULL,
  dsFuncao TEXT NOT NULL,
  flAtivo BOOLEAN NOT NULL CHECK(flAtivo IN (0, 1)),
  isAdmin BOOLEAN NOT NULL CHECK(isAdmin IN (0, 1))
);

CREATE TABLE IF NOT EXISTS pontos (
  idPonto INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
  dataHora TIMESTAMP NOT NULL,
  idFuncionario INTEGER NOT NULL,
  FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario)
);

CREATE TABLE IF NOT EXISTS solicitacoes (
  idSolicitacao INTEGER PRIMARY KEY AUTOINCREMENT,
  tipoSolicitacao TEXT NOT NULL CHECK(tipoSolicitacao IN ('adição', 'correção', 'remoção')),
  motivo TEXT NOT NULL,
  dataHoraSolicitada TIMESTAMP,
  status TEXT NOT NULL CHECK(status IN ('pendente', 'aprovada', 'rejeitada')) DEFAULT 'pendente',
  idFuncionario INTEGER NOT NULL,
  idPonto INTEGER,
  FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario),
  FOREIGN KEY (idPonto) REFERENCES pontos(idPonto)
);

realizadas nos pontos
CREATE TABLE IF NOT EXISTS historico_edicoes (
  idEdicao INTEGER PRIMARY KEY AUTOINCREMENT,
  idPonto INTEGER NOT NULL,
  dataHoraOriginal TIMESTAMP,
  dataHoraEditada TIMESTAMP,
  motivoEdicao TEXT,
  idFuncionario INTEGER NOT NULL,
  dataEdicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPonto) REFERENCES pontos(idPonto),
  FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario)
);

CREATE TABLE IF NOT EXISTS config_jornada (
  idConfig INTEGER PRIMARY KEY AUTOINCREMENT,
  idFuncionario INTEGER,
  horaEntrada TIME,
  horaSaida TIME,
  maxAtrasoMinutos INTEGER, 
  FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario)
);
`);
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

app.post('/colaboradores/login', (req, res) => {
    const { nmFuncionario, dsEmail } = req.body;
    db.get('SELECT * FROM colaboradores WHERE nmFuncionario = ? AND dsEmail = ?', [nmFuncionario, dsEmail], (err, row) => {
        if (err) {
            res.status(500).json({ err: err.message });
            return;
        }
        row ? res.json(row) : res.status(404).json({ message: 'Colaborador não cadastrado ou inválido' });
    });
});


//create colaborador
app.post('/colaboradores', (req, res) => {
    const { nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin } = req.body;
    const query = `INSERT INTO colaboradores (nmFuncionario, dsEmail,dsFuncao,flAtivo,isAdmin) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin], function (err) {
        if (err) {
            res.status(400).json({ error: 'Colaborador já cadastrado ou informações repetidas!' });
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
        this.changes ? res.json({ message: 'Colaborador atualizado com sucesso' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
});

//update flAtivo colaborador status by idFuncionario
app.put('/colaboradores/ativo', (req, res) => {
    const { idFuncionario, flAtivo } = req.body;
    const query = `UPDATE colaboradores SET flAtivo = ? WHERE idFuncionario = ?`;

    db.run(query, [flAtivo, idFuncionario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Status do colaborador atualizado com sucesso' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
    })

})

//delete colaborador by idFuncionario
app.delete('/colaboradores', (req, res) => {
    const { idFuncionario } = req.body;
    const query = `DELETE FROM colaboradores WHERE idFuncionario = ?`;

    db.run(query, idFuncionario, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Colaborador deletado com sucesso' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Conexão com o banco de dados fechada');
        process.exit(0);
    });
});