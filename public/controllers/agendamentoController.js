


document.addEventListener('DOMContentLoaded', () => {
    const formAgendamento = document.getElementById('agendamentoForm');
    const dataConsultaInput = document.getElementById('dataConsulta');
    const mensagemAgendamentoDiv = document.getElementById('mensagemAgendamento'); 

    
    if (dataConsultaInput) {
        const today = new Date().toISOString().split('T')[0];
        dataConsultaInput.setAttribute('min', today);
    }

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async function (event) {
            event.preventDefault(); 

            const formData = new FormData(formAgendamento);
            const dadosAgendamento = {};
            formData.forEach((value, key) => {
                dadosAgendamento[key] = value;
            });

            
            
            const especialidadeSelect = document.getElementById('especialidade');
            const medicoSelect = document.getElementById('medico');
            if (especialidadeSelect && especialidadeSelect.selectedOptions.length > 0) {
                dadosAgendamento.especialidadeTexto = especialidadeSelect.selectedOptions[0].text;
            }
            if (medicoSelect && medicoSelect.selectedOptions.length > 0) {
                dadosAgendamento.medicoTexto = medicoSelect.selectedOptions[0].text;
            }

            console.log('Dados do agendamento a serem enviados:', dadosAgendamento); 

            
            if (mensagemAgendamentoDiv) {
                mensagemAgendamentoDiv.textContent = '';
                mensagemAgendamentoDiv.style.display = 'none';
                mensagemAgendamentoDiv.className = 'form-message'; 
            }

            try {
                const response = await fetch('/novo-agendamento', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosAgendamento)
                });

                const responseText = await response.text(); 

                if (response.ok) {
                    try {
                        const resultado = JSON.parse(responseText);
                        if (mensagemAgendamentoDiv) {
                            mensagemAgendamentoDiv.textContent = resultado.message || 'Agendamento enviado com sucesso!';
                            mensagemAgendamentoDiv.style.display = 'block';
                            mensagemAgendamentoDiv.classList.add('sucesso'); 
                        } else {
                            alert(resultado.message || 'Agendamento enviado com sucesso!');
                        }
                        formAgendamento.reset(); 
                        if (dataConsultaInput) {
                            const today = new Date().toISOString().split('T')[0];
                            dataConsultaInput.setAttribute('min', today); 
                        }

                        mostraAgendamentos();
                        
                        
                        
                    } catch (jsonError) {
                        console.error('Erro ao parsear JSON da resposta de sucesso (agendamento):', jsonError);
                        console.error('Texto da resposta (sucesso, mas não JSON):', responseText);
                        if (mensagemAgendamentoDiv) {
                            mensagemAgendamentoDiv.textContent = 'Agendamento enviado, mas resposta inesperada do servidor.';
                            mensagemAgendamentoDiv.style.display = 'block';
                            mensagemAgendamentoDiv.classList.add('aviso'); 
                        } else {
                            alert('Agendamento enviado, mas resposta inesperada do servidor.');
                        }
                    }
                } else {
                    let erroMsg = `Erro ao enviar agendamento. Status: ${response.status}`;
                    try {
                        const erroResultado = JSON.parse(responseText);
                        erroMsg = `Erro: ${erroResultado.error || erroResultado.message || response.statusText}`;
                    } catch (e) {
                        erroMsg = `Erro ao enviar agendamento: ${response.statusText} (Status: ${response.status})`;
                    }
                    if (mensagemAgendamentoDiv) {
                        mensagemAgendamentoDiv.textContent = erroMsg;
                        mensagemAgendamentoDiv.style.display = 'block';
                        mensagemAgendamentoDiv.classList.add('erro'); 
                    } else {
                        alert(erroMsg);
                    }
                }

            } catch (networkError) {
                console.error('Erro de rede ao tentar agendar:', networkError);
                if (mensagemAgendamentoDiv) {
                    mensagemAgendamentoDiv.textContent = 'Erro de comunicação ao tentar agendar. Verifique sua conexão.';
                    mensagemAgendamentoDiv.style.display = 'block';
                    mensagemAgendamentoDiv.classList.add('erro');
                } else {
                    alert('Erro de comunicação ao tentar agendar. Verifique sua conexão.');
                }
            }
        });
    } else {
        console.error("Elemento do formulário de agendamento não encontrado. Verifique o ID 'agendamentoForm'.");
    }
});

document.querySelector('body').style.display = 'none';

fetch('/get-cookie', {
    method: "GET"
}).then(response => {
    if (response.status == 403) {
        window.location.href = "/login";
    } else {
        document.querySelector('body').style.display = '';
    }
});


document.querySelector("#sair").addEventListener('click', () => {
    fetch('/logout', {
        method: "GET"
    }).then(response => {
        if (response.status == 200) {
            window.location.href = "/login";
        }
    })
});

function mostraAgendamentos() {
    document.querySelector("#lista-agendamentos").innerHTML = "";
    fetch("/agendamentos", {
        method: "GET"
    }).then(response => {
        return response.json();
    }).then(dados => {
        dados.forEach(dado => {
            const div = document.createElement('div');
            div.classList.add('appointment-item');
            div.innerHTML = `
                <p><strong>Especialidade:</strong>${dado.especialidade}</p>
                <p><strong>Profissional:</strong>${dado.medico}</p>
                <p><strong>Data:</strong> ${dado.data}</p>
                <p><strong>Horário:</strong>${dado.horario}</p>
                <button class="btn btn-danger btn-sm" id="${dado.id_agendamento}" onClick="deletaAgendamento(this.id)">Cancelar</button>   
            `;
            document.querySelector("#lista-agendamentos").insertBefore(div, document.querySelector("#lista-agendamentos").firstChild);
        });

    });
}


mostraAgendamentos();

function buscaDados() {
    fetch('/perfil', {
        method: "GET"
    }).then(response => {
        return response.json();
    }).then(dados => {

        document.querySelector("#perfilNome").innerHTML = dados[0].nome;
        document.querySelector("#perfilCpf").innerHTML = dados[0].cpf;
        document.querySelector("#perfilEmail").innerHTML = dados[0].email;
        document.querySelector("#perfilDataNascimento").innerHTML = dados[0].data_nascimento;
        document.querySelector("#perfilTelefone").innerHTML = dados[0].telefone;
        document.querySelector("#perfilEndereco").innerHTML = dados[0].endereco;
        document.querySelector("#perfilGenero").innerHTML = dados[0].genero;
    });
}

buscaDados();

function deletaAgendamento(id) {
    fetch('/deleta-agendamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_agendamento : id})
        }).then(response => {
            if (response.status == 200) {
                mostraAgendamentos();  
            }
        });   
}
