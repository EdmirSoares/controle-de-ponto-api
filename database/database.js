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
    )
  `, (err) => {
        if (err) {
            console.error('Erro ao criar a table colaboradores:', err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS pontos (
      idPonto INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
      dataHora TIMESTAMP NOT NULL,
      status TEXT NOT NULL CHECK(status IN ( 'aprovado', 'solicitado', 'pendente', 'rejeitado', 'editado')) DEFAULT 'aprovado',
      dsMotivo TEXT,
      dsJustificativa TEXT,
      idFuncionario INTEGER NOT NULL,
      FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario)
    )
  `, (err) => {
        if (err) {
            console.error('Erro ao criar a table pontos:', err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS config_jornada (
      idConfig INTEGER PRIMARY KEY AUTOINCREMENT,
      idFuncionario INTEGER UNIQUE,
      horaEntrada TIME,
      horaSaida TIME,
      maxAtrasoMinutos INTEGER, 
      FOREIGN KEY (idFuncionario) REFERENCES colaboradores(idFuncionario)
    )
  `, (err) => {
        if (err) {
            console.error('Erro ao criar a table config_jornada:', err.message);
        }
    });

});

module.exports = db;
