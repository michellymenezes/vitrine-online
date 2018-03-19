"use strict";


const barra_titulo = document.getElementById('titulo-barra');
const visitado = document.getElementById('visitado')
const sugestao = document.getElementById('sugestao')


create_bar("Você visitou:", "e talvez se interesse por:")

let link = 'http://roberval.chaordicsystems.com/challenge/challenge.json?callback=X';

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

let data, recommendations, product;

get_data(link).then(function(value) {
  recommendations = value.data.recommendation
  recommendations.map((e) => produto(e))
  product = produto(value.data.reference.item)

  create_visitado(product)
  create_sugestao(recommendations.slice(0,3))

  console.log(recommendations.slice(0,4));
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
                      				<img class="row imagem-vitrine" src='${produto.imageName}' >
                      				<div class="row">
                      					<div class="descricao"> ${produto.name}</div>
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
                    			<a class="page-link" href="#" aria-label="Previous">
                    				<span aria-hidden="true">&laquo;</span>
                    			</a>
                          </div>`
                          + lista.map((produto) => `<div class="produto col-md-2">
                      				<img class="row imagem-vitrine" src='${produto.imageName}' >
                      				<div class="row">
                      					<div class="descricao"> ${produto.name}</div>
                      				</div>
                      				<div class="texto-simples row"> De: ${produto.oldPrice}</div>
                      				<div class="row">
                      					<span class="texto-destaque">  Por: </span>
                      					<span class="super-preco">${produto.price}</span> </div>
                      				<div class="texto-destaque row"><strong> ${produto.productInfo.paymentConditions}</strong></div>
                      				<div class="texto-destaque row">sem juros</div>
                      			</div>`).join('\n')
                            + 	`<div class="seta col-md-1">
                            			<a class="page-link" href="#" aria-label="Previous">
                            				<span aria-hidden="true">&raquo;</span>
                            			</a>
                            </div>`

}
