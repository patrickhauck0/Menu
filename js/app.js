$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    //Obtem a lista de itens do cardápio.
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            // Botão ver mais foi clicado (12 Itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp);
            }

            //Paginação inicial (8 Itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp);
            }

        })

        //Remove o botão ativo
        $(".container-menu a").removeClass('active');

        //Adiciona o botão ativo
        $("#menu-" + categoria).addClass('active');

    },

    // Função para o clique do botão ver mais.
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]//   0[menu-]1[burger]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    //Diminuir a quantidade do item no cardápio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    //Aumentar a quantidade do item no cardápio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        $("#qntd-" + id).text(qntdAtual + 1)
    },

    //Adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            //Obter a categoria ativa

            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //Obtem a lista de Itens
            let filtro = MENU[categoria];

            // Obtem o Item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if(item.length > 0) {

                //Validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // Caso já exista, só altera a quantidade
                if (existe.length > 0) {
                    let objindex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    MEU_CARRINHO[objindex].qntd = MEU_CARRINHO[objindex].qntd + qntdAtual;
                }
                // Caso não exista, ele adiciona o item na lista de compras
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                $("#qntd-" + id).text(0);
            }

        }

    },

}

cardapio.templates = {
    
    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="" />
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

}