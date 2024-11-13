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
    const checkQuery = `SELECT * FROM config_jornada WHERE idFuncionario = ?`;

    db.get(checkQuery, [idFuncionario], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: 'O funcionário já possui uma jornada cadastrada!' });
            return;
        }

        const query = `
        INSERT INTO config_jornada (horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario)
        VALUES (?, ?, ?, ?)
      `;
        db.run(query, [horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Jornada criada com sucesso' });
        });
    })
}

exports.update = (req, res) => {
    const { idConfig, horaEntrada, horaSaida, maxAtrasoMinutos } = req.body;
    const query = `UPDATE config_jornada SET horaEntrada = ?, horaSaida = ?, maxAtrasoMinutos = ? WHERE idConfig = ?`;

    db.run(query, [horaEntrada, horaSaida, maxAtrasoMinutos, idConfig], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Jornada atualizada com sucesso' }) : res.status(404).json({ message: 'Jornada não encontrada' });
    });
}

exports.delete = (req, res) => {
    const { idConfig } = req.body;
    const query = `DELETE FROM config_jornada WHERE idConfig = ?`;

    db.run(query, [idConfig], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Jornada deletada com sucesso' }) : res.status(404).json({ message: 'Jornada não encontrada' });
    });
}