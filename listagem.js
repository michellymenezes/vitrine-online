"use strict";


const barra_titulo = document.getElementById('titulo-barra');
const visitado = document.getElementById('visitado')
const sugestao = document.getElementById('sugestao')


create_bar("Você visitou:", "e talvez se interesse por:")

let link = 'https://cors-anywhere.herokuapp.com/http://roberval.chaordicsystems.com/challenge/challenge.json?callback=X';

let get_data = (url) => {
  return fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            let match = responseText.replace("X(", "").replace(");", "");
            if (! match) throw new Error('invalid JSONP response');
            let json = JSON.parse(match);
            let promise = new Promise((resolve, reject) => {
              resolve(json);
            });
            return promise;
        })
        .catch((error) => {
            console.error(error);
        });
}

let data, recommendations, product, n_sugestoes;

get_data(link).then(function(value) {
  recommendations = value.data.recommendation
  recommendations.map((e) => produto(e))
  product = produto(value.data.reference.item)
  n_sugestoes = 0

  create_visitado(product)
  create_sugestao(recommendations.slice(0,3))
});


const proto_produto = {
    businessId: "",
    name: "",
    imageName: "",
    detailUrl: "",
    price: "",
    oldPrice: "",
    productInfo:{
       paymentConditions: ""
    }
};

function produto(data) {
    const nova = Object.create(proto_produto);
    Object.assign(nova, data);
    return nova;
}

function create_bar(text1, text2){
  barra_titulo.innerHTML = `<div class="titulo-barra row">
                            <span class="col-md-3">${text1} </span>
                            <span class="col-md-9">${text2}</span>
                            </div>`

}

function create_visitado(produto){
  visitado.innerHTML = `<div class="produto">
                      				<img onclick="window.location.href='${produto.detailUrl}'" class="row center" src='${produto.imageName}' >
                      				<div class="row">
                      					<div onclick="window.location.href='${produto.detailUrl}'" class="descricao"> ${produto.name}</div>
                      				</div>
                      				<div class="texto-simples row"> De: ${produto.oldPrice}</div>
                      				<div class="row">
                      					<span class="texto-destaque">  Por: </span>
                      					<span class="super-preco">${produto.price}</span> </div>
                      				<div class="texto-destaque row"><strong> ${produto.productInfo.paymentConditions}</strong></div>
                      				<div class="texto-destaque row">sem juros</div>
                      			</div>`

}

function create_sugestao(lista){
  sugestao.innerHTML = `<div class="seta col-md-1">
                    			<a  id="seta-esquerda" class="page-link" href="#" aria-label="Previous">
                    				<span style="color:gray" onclick="more_recommendation(-3)" aria-hidden="true">&laquo;</span>
                    			</a>
                          </div>`

                          + lista.map((produto) => {
                                let elemment = `<div class="produto col-md-2">
                                        				<img onclick="window.location.href='${produto.detailUrl}'" class="row center" src='${produto.imageName}' >
                                        				<div class="row">
                                        					<div onclick="window.location.href='${produto.detailUrl}'" class="descricao"> ${produto.name}</div>
                                        				</div>`

                                if(produto.oldPrice != null){
                          				elemment += `<div class="texto-simples row"> De: ${produto.oldPrice}</div>`
                                }

                          			elemment +=	`<div class="row">
                                  					<span class="texto-destaque">  Por: </span>
                                  					<span class="super-preco">${produto.price}</span> </div>
                                      				<div class="texto-destaque row"><strong> ${produto.productInfo.paymentConditions}</strong></div>
                                      				<div class="texto-destaque row">sem juros</div>
                                      			</div>`

                                return elemment;
                          }).join('\n')

                            + 	`<div class="seta col-md-1">
                            			<a  id="seta-direita" class="page-link" href="#" aria-label="Previous">
                            				<span onclick="more_recommendation(3)" aria-hidden="true">&raquo;</span>
                            			</a>
                            </div>`
}

function more_recommendation(n){
  if(n > 0 & (n_sugestoes + 3) < recommendations.length){
    create_sugestao(recommendations.slice(n_sugestoes + 3, n_sugestoes + 6))
    n_sugestoes = n_sugestoes + 3
  }

  if(n < 0 & (n_sugestoes - 3) > -1){
    create_sugestao(recommendations.slice(n_sugestoes - 3, n_sugestoes))
    n_sugestoes = n_sugestoes - 3
  }
  let esquerda = document.getElementById('seta-esquerda')
  let direita = document.getElementById('seta-direita')

  if(n_sugestoes === 0){
    esquerda.innerHTML = `<span onclick="more_recommendation(-3)" style="color:gray" aria-hidden="true">&laquo;</span>`
  } else{
    esquerda.innerHTML = `<span onclick="more_recommendation(-3)" style="color:#23527c" aria-hidden="true">&laquo;</span>`
  }

  if(n_sugestoes + 2 >= recommendations.length -1){
    direita.innerHTML = `<span onclick="more_recommendation(3)" style="color:gray" aria-hidden="true">&raquo;</span>`
  } else{
    direita.innerHTML = `<span onclick="more_recommendation(3)" style="color:#23527c" aria-hidden="true">&raquo;</span>`
  }
}
