const db = require('../database/database');

exports.getAll = (req, res) => {
    const query = `
    SELECT colaboradores.*, config_jornada.horaEntrada, config_jornada.horaSaida, config_jornada.maxAtrasoMinutos
    FROM colaboradores
    LEFT JOIN config_jornada ON colaboradores.idFuncionario = config_jornada.idFuncionario
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

exports.getById = (req, res) => {
    const { idFuncionario } = req.params;
    db.get('SELECT * FROM colaboradores WHERE idFuncionario = ?', [idFuncionario], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        row ? res.json(row) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
};

exports.create = (req, res) => {
    const { nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin, horaEntrada, horaSaida, maxAtrasoMinutos } = req.body;

    const createColaboradorQuery = `
    INSERT INTO colaboradores (nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.run(createColaboradorQuery, [nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao criar colaborador: ' + err.message });
            return;
        }

        const idFuncionario = this.lastID;

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

            const createJornadaQuery = `
            INSERT INTO config_jornada (horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario)
            VALUES (?, ?, ?, ?)
            `;
            db.run(createJornadaQuery, [horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Colaborador e jornada criados com sucesso' });
            });
        });
    });
};

exports.update = (req, res) => {
    const { idFuncionario, nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin, horaEntrada, horaSaida, maxAtrasoMinutos } = req.body;

    const updateColaboradorQuery = `
    UPDATE colaboradores SET nmFuncionario = ?, dsEmail = ?, dsFuncao = ?, flAtivo = ?, isAdmin = ? WHERE idFuncionario = ?
    `;

    const updateJornadaQuery = `
    UPDATE config_jornada SET horaEntrada = ?, horaSaida = ?, maxAtrasoMinutos = ? WHERE idFuncionario = ?
    `;

    const updateColaborador = new Promise((resolve, reject) => {
        db.run(updateColaboradorQuery, [nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin, idFuncionario], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });

    const updateJornada = new Promise((resolve, reject) => {
        db.run(updateJornadaQuery, [horaEntrada, horaSaida, maxAtrasoMinutos, idFuncionario], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });

    Promise.all([updateColaborador, updateJornada])
        .then(results => {
            const [colaboradorChanges, jornadaChanges] = results;
            if (colaboradorChanges || jornadaChanges) {
                res.json({ message: 'Colaborador e jornada atualizados com sucesso' });
            } else {
                res.status(404).json({ message: 'Colaborador ou jornada não encontrados' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateStatus = (req, res) => {
    const { idFuncionario, flAtivo } = req.body;
    const query = `UPDATE colaboradores SET flAtivo = ? WHERE idFuncionario = ?`;

    db.run(query, [flAtivo, idFuncionario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Status do colaborador atualizado com sucesso' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
};

exports.delete = (req, res) => {
    const { idFuncionario } = req.body;
    const query = `DELETE FROM colaboradores WHERE idFuncionario = ?`;

    db.run(query, idFuncionario, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Colaborador desligado efetivamente' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
    });
};

exports.login = (req, res) => {
    const { dsEmail, nmFuncionario } = req.body;
    db.get('SELECT * FROM colaboradores WHERE dsEmail = ? AND nmFuncionario = ?', [dsEmail, nmFuncionario], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            if (row.flAtivo === 0) {
                res.status(401).json({ message: 'Colaborador desligado' });
                return;
            }
        }
        row ? res.json(row) : res.status(404).json({ message: 'E-mail ou senha inválidos' });
    });
}