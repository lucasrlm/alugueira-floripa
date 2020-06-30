let deferredInstallPrompt = null;
const botaoInstalar = document.getElementById('btInstalar');

let initialiseUI = function(){

    botaoInstalar.removeAttribute('hidden');
    botaoInstalar.addEventListener('click', function(){

        deferredInstallPrompt.prompt();

        deferredInstallPrompt.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){

                console.log("Usuário aceitou a instalação");

            }else{

                console.log("Usuário não aceitou a instalação");

            }

        });

    });

}

window.addEventListener('beforeinstallprompt', gravarEvento);

function gravarEvento(evt){
    deferredInstallPrompt = evt;
}

//Carregar produtos
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);

        var conteudo = document.getElementById('content_result');

        if(data_json.itens.length == 0){

            conteudo.innerHTML = '<div class="row"><div class="col-12"><div class="alert alert-danger" role="alert">Nenhum produto cadastrado!</div></div></div>';
            
        }else{

            let html_conteudo='<div class="row">';
            for(var i=0; i < data_json.itens.length; i++){
                html_conteudo+= card_produto(data_json.itens[i].nome,data_json.itens[i].imagem,data_json.itens[i].descricao,data_json.itens[i].preco);
            }
            html_conteudo+='</div>';

            //Gravar a criação dos elementos
            conteudo.innerHTML = html_conteudo;
            cache_cards(data_json);
        }
    }
}

var card_produto = function(nome, imagem, descricao, preco){

    return '<div class="col-6 card-container">'+
                '<div class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="...">'+
                    '<div class="card-body">'+
                        '<h4>'+nome+'</h4>'+
                    '<p class="card-text">'+descricao+'</p>'+
                    '<h5 class="card-text">R$'+preco+'</h5>'+
                    '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#produto">' +
                        'Alugar produto' +
                    '</button>' +
                    '</div>'+
                '</div>'+
            '</div>';

}

//Cache conteúdo dinâmico
var cache_cards = function(data_json){

    if('caches' in window){

        caches.delete('alugueira-floripa-conteudo').then(function(){

            console.log('Deletando cache de conteúdo antigo');

            if(data_json.itens.length > 0){

                var files = ['dados.json'];

                for(var i = 0; i < data_json.itens.length; i++){

                    if(files.indexOf(data_json.itens[i].imagem) == -1){
                        files.push(data_json.itens[i].imagem);
                    }
                }

                caches.open('alugueira-floripa-conteudo').then(function (cache){

                    cache.addAll(files).then(function(){
                        console.log("Arquivos de conteúdo cacheados!");
                    });

                });
            }

        });

    }
}
