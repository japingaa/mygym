const db = require('./db');

function presisteAgendamento(id_usuario, especialidade, dataConsulta, horarioConsulta, observacoes, medicoTexto) {

    const sql = `
        INSERT INTO agendamentos (
            id_usuario,
            especialidade_valor,
            nome_medico,
            data_consulta,
            horario_consulta,
            observacoes
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
        id_usuario,
        especialidade,
        medicoTexto,
        dataConsulta,
        horarioConsulta,
        observacoes || null
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Erro ao salvar agendamento no banco de dados:", err.message);
        }
        console.log(`Novo agendamento inserido com ID: ${this.lastID}`);
    });
}

function pegaAgendamentos(id_usuario, callback) {
    const sql = `
        SELECT 
            id_agendamento,
            especialidade_valor AS especialidade, 
            nome_medico AS medico,
            data_consulta AS data,
            horario_consulta AS horario
        FROM agendamentos 
        WHERE id_usuario = ?
        ORDER BY data_consulta, horario_consulta
    `;

    db.all(sql, [id_usuario], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar agendamentos do usuário:", err.message);
            return callback(err, null);
        }
        callback(null, rows || []);
    });
}

function deletaAgendamentoPorId(id_agendamento, callback) {
    const sql = `DELETE FROM agendamentos WHERE id_agendamento = ?`;

    db.run(sql, [id_agendamento], function(err) { 
        if (err) {
            console.error("Erro ao deletar agendamento:", err.message);
            return callback(err, null);
        }
        
        callback(null, this.changes);
    });
}

module.exports = { presisteAgendamento, pegaAgendamentos, deletaAgendamentoPorId};
