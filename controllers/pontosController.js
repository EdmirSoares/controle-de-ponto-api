const db = require('../database/database');

exports.getAll = (req, res) => {
    db.all('SELECT * FROM pontos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

exports.create = (req, res) => {
    const { tipo, dataHora, idFuncionario } = req.body;
    const query = `INSERT INTO pontos (tipo, dataHora, idFuncionario) VALUES (?, ?, ?)`;

    db.run(query, [tipo, dataHora, idFuncionario], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao registrar ponto' });
            return;
        }
        res.json({ message: "Ponto registrado com sucesso" });
    });
};