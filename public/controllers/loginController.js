const formLogin = document.getElementById('formLogin'); 
    
    

    if (formLogin) {
        formLogin.addEventListener('submit', async function(event) {

            event.preventDefault(); 

            const formData = new FormData(formLogin);
            const dadosLogin = {};
            formData.forEach((value, key) => {
                dadosLogin[key] = value;
            });

            console.log('Dados de login a serem enviados:', dadosLogin);

            try {
                const response = await fetch('/login-usuario', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosLogin)
                });

                const responseText = await response.text(); 

                if (response.ok) {
                    try {
                        const resultado = JSON.parse(responseText);
                        alert(resultado.message || 'Login realizado com sucesso!');
                        
                        window.location.href = '/home'; 
                    } catch (jsonError) {
                        console.error('Erro ao parsear JSON da resposta de sucesso (login):', jsonError);
                        console.error('Texto da resposta (sucesso, mas não JSON):', responseText);
                        alert('Login bem-sucedido, mas resposta inesperada do servidor. Texto: ' + responseText.substring(0, 100));
                         window.location.href = '/agendamento'; 
                    }
                } else {
                    console.error('Erro de login. Status:', response.status);
                    console.error('Texto da resposta de erro (login):', responseText);
                    try {
                        const erroResultado = JSON.parse(responseText);
                        alert(`Erro no login: ${erroResultado.error || erroResultado.message || response.statusText}`);
                    } catch (jsonError) {
                        alert(`Erro no login (status ${response.status}): ${responseText.substring(0, 200)}...`);
                    }
                }
            } catch (networkError) {
                console.error('Erro de rede ao tentar fazer login:', networkError);
                alert('Ocorreu um erro de comunicação ao tentar fazer login. Verifique sua conexão.');
            }
        });
    } else {
        console.error("Elemento do formulário de login não encontrado. Verifique o ID 'loginForm'.");
    }