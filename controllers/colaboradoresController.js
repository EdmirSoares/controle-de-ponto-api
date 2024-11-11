const db = require('../database/database');

exports.getAll = (req, res) => {
    db.all('SELECT * FROM colaboradores', [], (err, rows) => {
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
    const { nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin } = req.body;
    const query = `INSERT INTO colaboradores (nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [nmFuncionario, dsEmail, dsFuncao, flAtivo, isAdmin], function (err) {
        if (err) {
            res.status(400).json({ error: 'Colaborador já cadastrado ou informações repetidas!' });
            return;
        }
        res.json({ message: "Colaborador criado com sucesso" });
    });
};

exports.update = (req, res) => {
    const { idFuncionario, nmFuncionario, dsEmail, dsFuncao } = req.body;
    const query = `UPDATE colaboradores SET nmFuncionario = ?, dsEmail = ?, dsFuncao = ? WHERE idFuncionario = ?`;

    db.run(query, [nmFuncionario, dsEmail, dsFuncao, idFuncionario], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        this.changes ? res.json({ message: 'Colaborador atualizado com sucesso' }) : res.status(404).json({ message: 'Colaborador não encontrado' });
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