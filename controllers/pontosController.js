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

exports.getByIdUser = (req, res) => {
    const id = req.params.idFuncionario;
    db.all('SELECT * FROM pontos WHERE idFuncionario = ?', [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
}

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

exports.requestEdit = (req, res) => {
    const { idPonto, dsJustificativa } = req.body;
    const query = `UPDATE pontos SET dsJustificativa = ?, status = 'solicitado' WHERE idPonto = ?`;

    db.run(query, [dsJustificativa, idPonto], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao solicitar edição do ponto' });
            return;
        }
        res.json({ message: "Edição solicitada com sucesso" });
    });
}

exports.updateStatus = (req, res) => {
    const { dsMotivo, idPonto } = req.body;
    const query = `UPDATE pontos SET status = 'pendente' WHERE idPonto = ?`;

    db.run(query, [dsMotivo, idPonto], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao atualizar status do ponto' });
            return;
        }
        res.json({ message: "Status do ponto atualizado com sucesso" });
    });
}

exports.update = (req, res) => {
    const { tipo, status, dataHora, idFuncionario, idPonto } = req.body;
    const query = `UPDATE pontos SET tipo = ?, status= ?, dataHora = ?, idFuncionario = ? WHERE idPonto = ?`;

    if (status === 'pendente') {
        status = 'editado';
    }

    db.run(query, [tipo, status, dataHora, idFuncionario, idPonto], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao atualizar ponto' });
            return;
        }
        res.json({ message: "Ponto atualizado com sucesso" });
    });
}