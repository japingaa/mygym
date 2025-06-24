const db = require('./db');

function persisteCliente(
    nome,
    data_nascimento,
    telefone,
    email,
    senha) {

    const sql = `
        INSERT INTO usuarios (
            nome,
            data_nascimento,
            telefone,
            email,
            senha
        ) VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
        nome,
        data_nascimento,
        telefone,
        email,
        senha
    ];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Erro ao cadastrar usuario no banco de dados:", err.message);
        }
        console.log(`Novo usuario inserido com ID: ${this.lastID}`);
    });
}

function buscaClientePorCpfOuEmail(emailCpf, callback) {
    try {
        const sql = `SELECT id_usuario FROM usuarios WHERE cpf = ? OR email = ?`;


        db.get(sql, [emailCpf, emailCpf], (err, row) => {
            if (err) {
                console.error("Erro ao buscar usuário por CPF ou Email:", err.message);
                return callback(err, null);
            }
            if (row) {
                callback(null, row.id_usuario);
            } else {
                callback(null, null);
            }
        });
    }catch(err) {
        console.log("Erro ao buscar cliente");
    }
    
}

function buscaCliente(emailCpf, senha, callback) {
    try {
        const sql = `SELECT id_usuario FROM usuarios WHERE (cpf = ? OR email = ?) AND senha = ?`;


        db.get(sql, [emailCpf, emailCpf, senha], (err, row) => {
            if (err) {
                console.error("Erro ao buscar usuário por CPF ou Email:", err.message);
                return callback(err, null);
            }
            if (row) {
                callback(null, row.id_usuario);
            } else {
                callback(null, null);
            }
        });
    }catch(err) {
        console.log("Erro ao buscar cliente");
    }
    
}

function setToken(id, token) {
    try {
        const sql = `UPDATE usuarios SET token = ? WHERE id_usuario = ?`;


        db.get(sql, [token, id], (err, row) => {
            if (err) {
                console.error("Erro ao setar token do usuário", err.message);
            }
            console.log("token setado no id: " + id);
        });

        console.log("cookie setado: " + token);
    }catch(err) {
        console.log("Erro ao buscar cliente");
    }
    
}

function validaToken(token, callback) {
    try {
        const sql = `SELECT id_usuario FROM usuarios WHERE token = ?`;

        db.get(sql, [token], (err, row) => {
            if (err) {
                console.error("Erro ao buscar usuário pelo token:", err.message); 
                return callback(err, null);
            }
            console.log(row);
            if (row) {
                callback(null, row.id_usuario);
            } else {
                callback(null, null);
            }
        });

        console.log("cookie validado: " + token);
    } catch(err) {
        
        console.error("Erro síncrono na função validaToken:", err.message);
        callback(err, null);
    }
}

function buscaDadosCliente(id_usuario, callback) {
    const sql = `
        SELECT 
            cpf,
            nome, 
            data_nascimento,
            endereco,
            telefone,
            genero,
            email
        FROM usuarios 
        WHERE id_usuario = ?
    `;

    db.all(sql, [id_usuario], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar o usuário:", err.message);
            return callback(err, null);
        }
        callback(null, rows || []);
    });
}

module.exports = { persisteCliente, buscaClientePorCpfOuEmail, buscaCliente, setToken, validaToken, buscaDadosCliente };
