const db = require('../database/database');

exports.getAll = (req, res) => {
    const query = `
    SELECT pontos.*, colaboradores.nmFuncionario 
    FROM pontos 
    JOIN colaboradores ON pontos.idFuncionario = colaboradores.idFuncionario
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

exports.getByIdUser = (req, res) => {
    const id = req.params.idFuncionario;
    const query = `
    SELECT pontos.*, colaboradores.nmFuncionario
    FROM pontos
    JOIN colaboradores ON pontos.idFuncionario = colaboradores.idFuncionario
    WHERE pontos.idFuncionario = ?
    `;

    db.all(query, [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
}

exports.getAllByStatus = (req, res) => {
    const { status } = req.body;
    const query = `
    SELECT pontos.*, colaboradores.nmFuncionario
    FROM pontos
    JOIN colaboradores ON pontos.idFuncionario = colaboradores.idFuncionario
    WHERE pontos.status = ?
    `;

    db.all(query, [status], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
}

exports.create = (req, res) => {
    let { tipo, dataHora, idFuncionario, dsMotivo } = req.body;
    const query = `INSERT INTO pontos (tipo, dataHora, idFuncionario, dsMotivo) VALUES (?, ?, ?, ?)`;
    if (!dsMotivo) {
        dsMotivo = 'Registro dentro do horário';
    }

    db.run(query, [tipo, dataHora, idFuncionario, dsMotivo], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao registrar ponto' });
            return;
        }
        res.json({ message: "Ponto registrado com sucesso" });
    });
};

exports.requestEdit = (req, res) => {
    const { idPonto, dsMotivo } = req.body;
    const query = `UPDATE pontos SET dsMotivo = ?, status = 'solicitado' WHERE idPonto = ?`;

    db.run(query, [dsMotivo, idPonto], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao solicitar edição do ponto' });
            return;
        }
        res.json({ message: "Edição solicitada com sucesso" });
    });
}

exports.updateStatus = (req, res) => {
    const { dsJustificativa, idPonto, status } = req.body;
    const query = `UPDATE pontos SET status = ?, dsJustificativa = ? WHERE idPonto = ?`;

    db.run(query, [status, dsJustificativa, idPonto], function (err) {
        if (err) {
            res.status(400).json({ error: 'Erro ao atualizar status do ponto' });
            return;
        }
        res.json({ message: "Status do ponto atualizado com sucesso" });
    });
}

exports.update = (req, res) => {
    let { tipo, status, dataHora, idFuncionario, idPonto } = req.body;
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