


const sqlite3 = require('sqlite3').verbose();



const DBSOURCE = "mygym.db"; 



const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        
        console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
        
        
        throw err;
    } else {
        console.log(`Conectado ao banco de dados SQLite '${DBSOURCE}' com sucesso.`);

        
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT UNIQUE,
            nome TEXT NOT NULL,
            data_nascimento DATE,
            endereco TEXT,
            telefone TEXT,
            genero TEXT,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            token TEXT
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar/verificar tabela 'usuarios':", err.message);
            } else {
                console.log("Tabela 'usuarios' verificada/criada com sucesso.");
            }
        });
    }
});


module.exports = db;
