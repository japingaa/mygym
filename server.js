
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const { presisteAgendamento, pegaAgendamentos, deletaAgendamentoPorId } = require('./dominios/agendamento');
const { persisteCliente, buscaClientePorCpfOuEmail, buscaCliente, setToken, validaToken, buscaDadosCliente } = require('./dominios/usuario');

let id;


const app = express();

const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('/home');
});



app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'login.html'));
});



app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'cadastro.html'));
});



app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'home.html'));
});



app.post('/cadastra-usuario', (req, res) => {
    
    console.log("Requisição POST recebida em /cadastra-usuario");

    try {
        const {
            nomeCompleto,
            dataNascimento,
            telefone,
            email,
            senha
        } = req.body;
        const dados = req.body;
        console.log("Dados recebidos no backend:", dados);

        persisteCliente(nomeCompleto, dataNascimento, telefone, email, senha);

        res.status(200).json({ message: "Usuário cadastrado com sucesso!", dataRecebida: dados });


    } catch (err) {
        res.status(500).json({ error: "Falha ao receber o cadastro." });
    }
});

app.get('/get-cookie', (req, res) => {
    try {
        const tokenDoCliente = req.cookies.token;

        if (tokenDoCliente) {
            validaToken(tokenDoCliente, (err, cliente) => {
                console.log('teste', cliente)
                if (cliente) {
                    id = cliente;
                    console.log("Token encontrado:", tokenDoCliente);
                    res.status(200).json({
                        message: "Token encontrado com sucesso!",
                        token: tokenDoCliente
                    });
                } else {
                    res.status(403).send("token inexistente");
                }
            });
        } else {
            console.log("Cookie 'token' não encontrado.");
            res.status(403).json({ error: "Cookie 'token' não encontrado." });
        }
    } catch (err) {
        console.error("Erro ao processar /get-cookie:", err.message);
        res.status(500).send("Falha ao buscar token");
    }
});

app.get('/logout', (req, res) => {
    try {
        res.cookie('token', ' ', {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).send("Logout feito com sucesso!")
    } catch (err) {
        console.error("Erro ao processar /logoff:", err.message);
        res.status(500).send("Falha ao remover token");
    }
});

app.get('/agendamentos', (req, res) => {
    try {
        pegaAgendamentos(id, (err, dados) => {
            if (dados) {
                res.status(200).json(dados);
            } else {
                res.status(400).send("Nenhum agendamento encontrado");
            }
        });
    } catch (err) {
        console.error("Erro ao processar /agendamentos:", err.message);
        res.status(500).send("Falha ao remover token");
    }
});

app.get('/perfil', (req, res) => {
    try {
        buscaDadosCliente(id, (err, dados) => {
            if (dados) {
                console.log(dados);
                res.status(200).json(dados);
            }else {
                res.status(400).send("Dados nao encontrados")
            }
        });
    } catch (error) {
        res.status(500).send("Falha ao enviar dados do perfil");
    }
});

app.post("/deleta-agendamento", (req, res) => {
    console.log("teste")
    try {
        console.log(req.body);
        const {id_agendamento} = req.body;
        deletaAgendamentoPorId(id_agendamento, (err, sucesso) => {
            if (sucesso) {
                res.status(200).send("Agendamento deletado com sucesso!");
            }else {
                res.status(400).send("Agendamento nao existe");
            }
        })     
    } catch (error) {
        res.status(500).send("Falha ao deletar agendamento");    
    }
});

app.post('/login-usuario', (req, res) => {

    console.log("Requisição POST recebida em /login-usuario");

    try {
        const { emailCpf, senha } = req.body;
        const dados = req.body;
        buscaCliente(emailCpf, senha, (err, cliente) => {
            if (cliente) {
                id = cliente;
                const token = gerarTokenSimples();
                setToken(id, token);
                console.log("Dados recebidos no backend:", dados);
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ message: "Usuário cadastrado com sucesso!", dataRecebida: dados });
            } else {
                res.status(400).send("Usuario nao cadastrado");
            }
        });


    } catch (err) {
        res.status(500).json({ error: "Falha ao receber o cadastro." });
    }
});

app.post('/novo-agendamento', (req, res) => {
    console.log("Requisição POST recebida em /novo-agendamento"); 
    try {
        const {
            especialidade,
            medico,
            dataConsulta,
            horarioConsulta,
            observacoes,
            especialidadeTexto,
            medicoTexto
        } = req.body;

        presisteAgendamento(id, especialidade, dataConsulta, horarioConsulta, observacoes, medicoTexto);

        res.status(201).json({
            message: "Agendamento recebido com sucesso!",
            agendamentoRecebido: req.body 
        });

    } catch (err) {
        console.error("Erro interno ao processar /novo-agendamento:", err.message);
        res.status(500).json({ error: "Falha interna ao processar o agendamento." });
    }
});


app.use((req, res) => {
    console.log(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).send('<h1>Erro 404: Página não encontrada</h1><p><a href="/agendamento">Voltar para Agendamentos</a></p>');
});



app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


function gerarTokenSimples() {
    return crypto.randomBytes(16).toString('hex');
}
