var tarefas = []; // Array para armazenar as tarefas
        var atividadesEmAndamento = []; // Array para armazenar as atividades em andamento
        var atividadesRealizadas = []; // Array para armazenar as atividades realizadas

        // Função para salvar os dados no Local Storage e retornar os dados atualizados
        function salvarDados(chave, dados) {
            localStorage.setItem(chave, JSON.stringify(dados));
            return dados; // Retorna os dados atualizados
        }

        // Função para carregar os dados do Local Storage
        function carregarDados(chave, array) {
            var dadosSalvos = localStorage.getItem(chave);
            if (dadosSalvos) {
                array = JSON.parse(dadosSalvos);
                return array;
            }
            return array;
        }
// Função para verificar se o evento contém um número
function isNumber(event) {
    var charCode = event.which || event.keyCode;

    // Garanta que apenas números sejam aceitos (códigos de tecla 48 a 57 são números)
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
        return false;
    }

    return true;
}



  
      
        

        // Função para exibir os dados em uma lista
        function exibirDados(array, listaId) {
    var lista = document.getElementById(listaId);
    lista.innerHTML = "";

    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        var novoItem = document.createElement("li");

        // Verifica se o item está vencido
        var dataVencimento = new Date(item.dataVencimento);
        var hoje = new Date();
        if (dataVencimento < hoje) {
            novoItem.classList.add("tarefaVencida");
        }

        // Verifica se a atividade está atrasada com base no prazo máximo
        var prazoMaximo = parseInt(item.prazoMaximo);
        if (!isNaN(prazoMaximo)) {
            var dataLimite = new Date(item.dataVencimento);
            dataLimite.setDate(dataLimite.getDate() + prazoMaximo);
            if (hoje > dataLimite) {
                novoItem.classList.add("atrasada");
            }
        }

        var descricao = `Acontecido: ${item.tarefa} - OS ${item.numeroOs} - Setor: ${item.textoConcatenar} - Responsável: ${item.responsavel} - Vencimento: ${item.dataVencimento}`;

        novoItem.innerHTML = `<span style="color: ${item.prioridade};">${descricao}</span>`;

        if (listaId === "listaTarefas") {
            var botaoIniciar = document.createElement("button");
            botaoIniciar.innerText = "Iniciar Atividade";
            botaoIniciar.onclick = function(index) {
                return function() {
                    marcarTarefaEmAndamento(index);
                }
            }(i);
            novoItem.appendChild(botaoIniciar);
        
            var botaoEditar = document.createElement("button");
            botaoEditar.innerText = "Editar";
            botaoEditar.onclick = function(index) {
                return function() {
                    editarTarefa(index); // Chame a função editarTarefa para editar a tarefa
                }
            }(i);
        
            var botaoExcluir = document.createElement("button");
            botaoExcluir.innerText = "Excluir";
            botaoExcluir.onclick = function(index) {
                return function() {
                    excluirTarefa(index);
                }
            }(i);
        
            novoItem.appendChild(botaoEditar); // Adicione o botão "Editar" à tarefa
            novoItem.appendChild(botaoExcluir);
        
        
        } else if (listaId === "listaAtividadesEmAndamento") {
            var botaoFinalizar = document.createElement("button");
            botaoFinalizar.innerText = "Finalizar Atividade";
            botaoFinalizar.onclick = function(index) {
                return function() {
                    cadastrarAtividade(index);
                }
            }(i);
            novoItem.appendChild(botaoFinalizar);

            var botaoEditarEmAndamento = document.createElement("button");
            botaoEditarEmAndamento.innerText = "Editar";
            botaoEditarEmAndamento.onclick = function(index) {
                return function() {
                    editarTarefa(index, true);
                }
            }(i);
            novoItem.appendChild(botaoEditarEmAndamento);
        } else if (listaId === "listaAtividadesRealizadas") {
            var botaoApagar = document.createElement("button");
            botaoApagar.innerText = "Apagar";
            botaoApagar.onclick = function(index) {
                return function() {
                    apagarAtividadeRealizada(index);
                }
            }(i);
            novoItem.appendChild(botaoApagar);
        }
        

        // Adicione o novoItem à lista
        lista.appendChild(novoItem);

        // Atualize o campo "responsável" para refletir o valor correto
        if (listaId === "listaTarefas" || listaId === "listaAtividadesEmAndamento") {
            document.getElementById("responsavel").value = item.responsavel;
        }
        var botaoGerarQRCode = document.createElement("button");
                botaoGerarQRCode.innerText = "Gerar QR Code";
                botaoGerarQRCode.onclick = function(item) {
                    return function() {
                        gerarQRCode(item, novoItem);
                    };
                }(item);
                novoItem.appendChild(botaoGerarQRCode);
        
                // ... Resto do seu código ...
        
                // Adicione o novoItem à lista
                lista.appendChild(novoItem);

    }
}


        // Função para marcar uma tarefa como em andamento
        function marcarTarefaEmAndamento(index) {
    var tarefaEmAndamento = tarefas.splice(index, 1)[0];
    
    // Obtenha a pessoa responsável da entrada correspondente
    var responsavel = document.getElementById("responsavel").value;
    
    // Adicione a pessoa responsável à atividade em andamento
    tarefaEmAndamento.responsavel = responsavel;
    
    atividadesEmAndamento.push(tarefaEmAndamento);
    tarefas = salvarDados("tarefas", tarefas);
    atividadesEmAndamento = salvarDados("atividadesEmAndamento", atividadesEmAndamento);
    exibirDados(tarefas, "listaTarefas");
    exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
    
    // Limpe o campo de entrada da pessoa responsável
    document.getElementById("responsavel").value = "";

    // Defina o placeholder novamente
    document.getElementById("responsavel").placeholder = "Responsável pela Tarefa";
}

function gerarQRCode(item, elementoLista) {
    // Verifique se já existe um QR code na linha
    if (elementoLista.querySelector('img[data-qr-generated]')) {
        return;
    }

    var textoQRCode = `Tarefa: ${item.tarefa}\nNúmero OS: ${item.numeroOs}\nSetor: ${item.textoConcatenar}\nResponsável: ${item.responsavel}\nVencimento: ${item.dataVencimento}`;

    // Construa a URL da API com o texto codificado
    var qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(textoQRCode)}&size=80x80`;

    // Crie um elemento <img> para exibir o código QR
    var qrCodeImg = document.createElement('img');
    qrCodeImg.src = qrCodeUrl;
    qrCodeImg.alt = "Código QR";

    // Defina um atributo personalizado para marcar que o QR code foi gerado
    qrCodeImg.setAttribute('data-qr-generated', 'true');

    // Insira o código QR no elemento de lista correspondente
    elementoLista.appendChild(qrCodeImg);
}






function validarNumeroOs(input) {
    // Remove qualquer caractere não numérico do valor do campo
    input.value = input.value.replace(/\D/g, '');

    // Limita o tamanho do campo para 7 caracteres
    if (input.value.length > 7) {
        input.value = input.value.slice(0, 7);
    }

    // Obtém o botão "Cadastrar Atividade"
    var cadastrarAtividadeButton = document.getElementById("cadastrarAtividadeButton");

    // Habilita ou desabilita o botão com base no tamanho do número OS
    if (input.value.length === 7) {
        cadastrarAtividadeButton.disabled = false;
    } else {
        cadastrarAtividadeButton.disabled = true;
    }
    // Seletor para o botão "Sem OS"
    var botaoSemOs = document.getElementById("botaoSemOs");

// Adicionar um ouvinte de evento de clique ao botão
botaoSemOs.addEventListener("click", function () {
    validarNumeroOs(document.getElementById("numeroOs"));
});
// ... (Código anterior)

// Adicione esta função para verificar o campo "numeroOs" automaticamente
function verificarNumeroOs() {
    var campoNumeroOs = document.getElementById("numeroOs");
    var cadastrarAtividadeButton = document.getElementById("cadastrarAtividadeButton");

    if (campoNumeroOs.value.length === 7) {
        cadastrarAtividadeButton.removeAttribute("disabled");
    } else {
        cadastrarAtividadeButton.setAttribute("disabled", "true");
    }
}

// Adicione um evento de escuta para o campo "numeroOs" quando a entrada é alterada
var campoNumeroOs = document.getElementById("numeroOs");
campoNumeroOs.addEventListener("input", verificarNumeroOs);

// Adicione um evento de escuta para o campo "numeroOs" quando a tecla Enter é pressionada
campoNumeroOs.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        verificarNumeroOs();
    }
});

// Chame a função inicialmente para verificar o estado inicial do campo
verificarNumeroOs();

// Função para preencher o campo "Data de Vencimento" com a data de hoje
function preencherDataDeHoje() {
    var dataDeHoje = new Date();
    var ano = dataDeHoje.getFullYear();
    var mes = (dataDeHoje.getMonth() + 1).toString().padStart(2, '0');
    var dia = dataDeHoje.getDate().toString().padStart(2, '0');
    
    var dataFormatada = `${ano}-${mes}-${dia}`;
    document.getElementById("dataVencimento").value = dataFormatada;
}

function preencherNumeroOsPadrao() {
    var campoNumeroOs = document.getElementById("numeroOs");
    campoNumeroOs.value = "0000000";
}

// ... (Restante do código)

// Carrega os dados do Local Storage ao carregar a página
tarefas = carregarDados("tarefas", tarefas);
atividadesEmAndamento = carregarDados("atividadesEmAndamento", atividadesEmAndamento);
atividadesRealizadas = carregarDados("atividadesRealizadas", atividadesRealizadas);

// Exibe os dados carregados
exibirDados(tarefas, "listaTarefas");
exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
exibirDados(atividadesRealizadas, "listaAtividadesRealizadas");


}

// Adicione esta função para verificar o campo "numeroOs" automaticamente
// Adicione esta função para verificar o campo "numeroOs" quando a entrada é alterada
function verificarNumeroOs() {
    var campoNumeroOs = document.getElementById("numeroOs");
    var cadastrarAtividadeButton = document.getElementById("cadastrarAtividadeButton");

    if (campoNumeroOs.value.length === 7) {
        cadastrarAtividadeButton.removeAttribute("disabled");
    } else {
        cadastrarAtividadeButton.setAttribute("disabled", "true");
    }
}

// Adicione um evento de escuta para o campo "numeroOs" quando a entrada é alterada
var campoNumeroOs = document.getElementById("numeroOs");
campoNumeroOs.addEventListener("input", verificarNumeroOs);

// Adicione um evento de escuta para o campo "numeroOs" quando a tecla Enter é pressionada
campoNumeroOs.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        verificarNumeroOs();
    }
});

// Chame a função inicialmente para verificar o estado inicial do campo
verificarNumeroOs();


// Adicione um evento de escuta para o campo "numeroOs"
var campoNumeroOs = document.getElementById("numeroOs");
campoNumeroOs.addEventListener("input", verificarNumeroOs);

// Chame a função inicialmente para verificar o estado inicial do campo
verificarNumeroOs();


// Adicione um evento de escuta para o campo "numeroOs"
var campoNumeroOs = document.getElementById("numeroOs");
campoNumeroOs.addEventListener("input", verificarNumeroOs);

// Chame a função inicialmente para verificar o estado inicial do campo
verificarNumeroOs();




function editarTarefa(index, emAndamento = false) {
    var array = emAndamento ? atividadesEmAndamento : tarefas;
    var tarefa = array[index];
    
    // Preencha os campos de entrada com os valores atuais, incluindo "responsavel"
    document.getElementById("tarefa").value = tarefa.tarefa;
    document.getElementById("numeroOs").value = tarefa.numeroOs;
    document.getElementById("placeholderConcatenar").value = tarefa.textoConcatenar;
    document.getElementById("prioridade").value = tarefa.prioridade;
    document.getElementById("dataVencimento").value = tarefa.dataVencimento;
    document.getElementById("prazoMaximo").value = tarefa.prazoMaximo;
    
    // Preencha o campo de responsável
    document.getElementById("responsavel").value = tarefa.responsavel;
    
    // Remova a tarefa do array
    array.splice(index, 1);
    
    // Atualize a lista de tarefas em andamento ou tarefas
    if (emAndamento) {
        atividadesEmAndamento = salvarDados("atividadesEmAndamento", atividadesEmAndamento);
        exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
    } else {
        tarefas = salvarDados("tarefas", tarefas);
        exibirDados(tarefas, "listaTarefas");
    }
}




        // Função para cadastrar uma atividade em andamento
        function cadastrarAtividade(index) {
            var atividade = atividadesEmAndamento.splice(index, 1)[0];
            atividadesRealizadas.push(atividade);
            atividadesEmAndamento = salvarDados("atividadesEmAndamento", atividadesEmAndamento);
            atividadesRealizadas = salvarDados("atividadesRealizadas", atividadesRealizadas);
            exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
            exibirDados(atividadesRealizadas, "listaAtividadesRealizadas");
        }


        
        // Função para preencher o campo "Data de Vencimento" com a data de hoje
        function preencherDataDeHoje() {
            var dataDeHoje = new Date();
            var ano = dataDeHoje.getFullYear();
            var mes = (dataDeHoje.getMonth() + 1).toString().padStart(2, '0'); // O mês é base 0, então somamos 1 e formatamos com dois dígitos.
            var dia = dataDeHoje.getDate().toString().padStart(2, '0'); // Formata o dia com dois dígitos.
            
            var dataFormatada = `${ano}-${mes}-${dia}`; // Formato: "YYYY-MM-DD"

            // Define o valor do campo "Data de Vencimento" com a data atual
            document.getElementById("dataVencimento").value = dataFormatada;
        }
        function preencherNumeroOsPadrao() {
            var campoNumeroOs = document.getElementById("numeroOs");
            campoNumeroOs.value = "0000000";
            
        }
        


        // Função para editar uma tarefa
        function editarTarefa(index, emAndamento = false) {
            var array = emAndamento ? atividadesEmAndamento : tarefas;
            var tarefa = array[index];
            
            // Preencha os campos de entrada com os valores atuais
            document.getElementById("tarefa").value = tarefa.tarefa;
            document.getElementById("numeroOs").value = tarefa.numeroOs;
            document.getElementById("placeholderConcatenar").value = tarefa.textoConcatenar;
            document.getElementById("prioridade").value = tarefa.prioridade;
            document.getElementById("dataVencimento").value = tarefa.dataVencimento;
            document.getElementById("prazoMaximo").value = tarefa.prazoMaximo;
            
            // Preencha o campo de responsável
            document.getElementById("responsavel").value = tarefa.responsavel;
            
            // Remova a tarefa do array
            array.splice(index, 1);
            
            // Atualize a lista de tarefas em andamento ou tarefas
            if (emAndamento) {
                atividadesEmAndamento = salvarDados("atividadesEmAndamento", atividadesEmAndamento);
                exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
            } else {
                
                tarefas = salvarDados("tarefas", tarefas);
                exibirDados(tarefas, "listaTarefas");
            }
        }

        // Função para apagar uma tarefa
        function excluirTarefa(index) {
            var confirmacao = confirm("Tem certeza de que deseja excluir esta tarefa?");
            if (confirmacao) {
                tarefas.splice(index, 1);
                tarefas = salvarDados("tarefas", tarefas);
                exibirDados(tarefas, "listaTarefas");
            }
        }

        // Função para apagar uma atividade realizada específica com confirmação
        function apagarAtividadeRealizada(index) {
            var confirmacao = confirm("Tem certeza de que deseja apagar esta atividade realizada?");
            if (confirmacao) {
                atividadesRealizadas.splice(index, 1);
                atividadesRealizadas = salvarDados("atividadesRealizadas", atividadesRealizadas);
                exibirDados(atividadesRealizadas, "listaAtividadesRealizadas");
            }
        }

        // Função para adicionar ou concatenar uma tarefa
        function adicionarOuConcatenarTarefa() {
            var tarefa = document.getElementById("tarefa").value;
            if (tarefa === "") {
                alert("Por favor, digite uma tarefa.");
                return;
            }

            // Obtém a prioridade atual selecionada
            var prioridade = document.getElementById("prioridade").value;

            // Obtém o número de OS
            var numeroOs = document.getElementById("numeroOs").value;

            // Obtém o texto para concatenar
            var textoConcatenar = document.getElementById("placeholderConcatenar").value;

            // Obtém a data de vencimento e valide-a
            var dataVencimento = document.getElementById("dataVencimento").value;
            if (!dataVencimento) {
                alert("Por favor, selecione uma data de vencimento.");
                return;
            }

            // Converta a data de vencimento em um objeto Date e verifique se é uma data válida
            var dataVencimentoObj = new Date(dataVencimento);
            if (isNaN(dataVencimentoObj.getTime())) {
                alert("A data de vencimento inserida não é válida.");
                return;
            }

            // Obtém o prazo máximo (em dias)
            var prazoMaximo = document.getElementById("prazoMaximo").value;

            // Obtém a pessoa responsável
            var responsavel = document.getElementById("responsavel").value;

            // Adiciona a tarefa ao array
            tarefas.push({ tarefa, prioridade, numeroOs, textoConcatenar, dataVencimento, prazoMaximo, responsavel });

            // Salva as tarefas no Local Storage
            tarefas = salvarDados("tarefas", tarefas);

            // Limpa os campos de entrada
            document.getElementById("tarefa").value = "";
            document.getElementById("numeroOs").value = "";
            document.getElementById("placeholderConcatenar").value = "";
            document.getElementById("dataVencimento").value = "";
            document.getElementById("prazoMaximo").value = "";
            document.getElementById("responsavel").value = "";

            // Atualiza o placeholder do input de responsável para "Responsável pela Tarefa"
            document.getElementById("responsavel").placeholder = "Responsável pela Tarefa";

            // Atualiza a lista de tarefas
            exibirDados(tarefas, "listaTarefas");
        }

        // Função para definir a prioridade
        function definirPrioridade(cor) {
            document.getElementById("prioridade").value = cor;

            // Define a classe de prioridade selecionada para o botão atual
            var buttons = document.querySelectorAll("#prioridadeButtons button");
            buttons.forEach(function(button) {
                button.classList.remove("prioridadeSelecionada");
                if (button.getAttribute("data-cor") === cor) {
                    button.classList.add("prioridadeSelecionada");
                }
            });
        }
        

        // Carrega os dados do Local Storage ao carregar a página
        tarefas = carregarDados("tarefas", tarefas);
        atividadesEmAndamento = carregarDados("atividadesEmAndamento", atividadesEmAndamento);
        atividadesRealizadas = carregarDados("atividadesRealizadas", atividadesRealizadas);

        // Exibe os dados carregados
        exibirDados(tarefas, "listaTarefas");
        exibirDados(atividadesEmAndamento, "listaAtividadesEmAndamento");
        exibirDados(atividadesRealizadas, "listaAtividadesRealizadas");