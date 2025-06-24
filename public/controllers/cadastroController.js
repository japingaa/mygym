const formulario = document.querySelector("#formCadastro");




formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const form = event.target;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    
    const formData = new FormData(form);

    
    const dadosParaEnviar = {};
    formData.forEach((value, key) => {
        
        if (key !== 'confirmarSenha') {
            dadosParaEnviar[key] = value;
        }
    });

    
    console.log('Dados a serem enviados:', dadosParaEnviar);

    
    



try {
    const response = await fetch('/cadastra-usuario', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(dadosParaEnviar) 
    });

    
    const responseText = await response.text(); 

    if (response.ok) { 
        try {
            const resultado = JSON.parse(responseText); 
            alert(resultado.message || 'Cadastro realizado com sucesso!');
            window.location.href = '/login'; 
        } catch (jsonError) {
            
            console.error('Erro ao parsear JSON da resposta de sucesso:', jsonError);
            console.error('Texto da resposta recebida (sucesso, mas não JSON):', responseText);
            alert('Resposta inesperada do servidor após sucesso. Texto: ' + responseText.substring(0, 100)); 
        }
    } else { 
        console.error('Erro do servidor. Status:', response.status);
        console.error('Texto da resposta de erro recebida:', responseText); 
        try {
            const erroResultado = JSON.parse(responseText); 
            alert(`Erro no cadastro: ${erroResultado.error || erroResultado.message || response.statusText}`);
        } catch (jsonError) {
            
            alert(`Erro do servidor (status ${response.status}): ${responseText.substring(0, 200)}...`); 
        }
    }

} catch (networkError) {
    
    console.error('Erro de rede ao enviar formulário:', networkError);
    alert('Ocorreu um erro de comunicação ao tentar cadastrar. Verifique sua conexão e tente novamente.');
}
});

const telefoneInput = document.getElementById('telefone');

  telefoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    let formattedValue = '';

    if (value.length > 0) {
      formattedValue = '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
      formattedValue += ') ' + value.substring(2, 3);
    }
    if (value.length > 3) {
      formattedValue += ' ' + value.substring(3, 7);
    }
    if (value.length > 7) {
      formattedValue += '-' + value.substring(7, 11);
    }

    e.target.value = formattedValue;
  });