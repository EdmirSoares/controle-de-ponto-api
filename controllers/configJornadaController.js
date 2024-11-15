const db = require('../database/database');

exports.getAll = (req, res) => {
    const { idFuncionario } = req.params;
    const query = `SELECT * FROM config_jornada WHERE idFuncionario = ?`;

    db.all(query, [idFuncionario], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};