const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const colaboradoresRoutes = require('./routes/colaboradores');
const pontosRoutes = require('./routes/pontos');
// const configJornadaRoutes = require('./routes/configJornada');
// const solicitacoesRoutes = require('./routes/solicitacoes');
// const historicoEdicoesRoutes = require('./routes/historicoEdicoes');

app.use('/colaboradores', colaboradoresRoutes);
app.use('/pontos', pontosRoutes);
// app.use('/configJornada', configJornadaRoutes);
// app.use('/solicitacoes', solicitacoesRoutes);
// app.use('/historicoEdicoes', historicoEdicoesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}, para finalizar pressione 'CTRL + C'`);
});

const db = require('./database/database');

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Conexão com o banco de dados fechada');
        process.exit(0);
    });
});