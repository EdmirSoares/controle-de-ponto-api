const db = require('../database/database');

exports.getAll = (req, res) => {
    db.all('SELECT * FROM config_jornada', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
}

exports.create = (req, res) => {
    const { horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario } = req.body;
    const query = `
    INSERT INTO config_jornada (horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario)
    VALUES (?, ?, ?, ?)
  `;
    db.run(query, [horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Ponto criado com sucesso' });
    });
}

/* 
idConfig INTEGER PRIMARY KEY AUTOINCREMENT,
idFuncionario INTEGER,
horaEntrada TIME,
horaSaida TIME,
maxAtrasoMinutos INTEGER, 
FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario) */