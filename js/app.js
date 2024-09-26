$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

var CELULAR_EMPRESA = '"';

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
    cardapio.metodos.carregarBotaoReserva();
    cardapio.metodos.carregarBotaoLigar();
  },
};

cardapio.metodos = {
  // obtem a lista de itens do cardápio
  obterItensCardapio: (categoria = 'burgers-industriais', vermais = false) => {
    var filtro = MENU[categoria];
    // console.log(filtro);

    if (!vermais) {
      $('#itensCardapio').html('');
      $('#btnVerMais').removeClass('hidden');
    }

    $.each(filtro, (i, e) => {
      // console.log(e.name)

      let template = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
       
        .replace(/\${id}/g, e.id);

      //Botão ver mais foi clicado (12 itens)
      if (vermais && i >= 8 && i <= 12) {
        $('#itensCardapio').append(template);
      }

      //paginação inicial (8 itens)
      if (!vermais && i < 8) {
        $('#itensCardapio').append(template);
      }
    });

    //remover o item ativa
    $('.container-menu a').removeClass('active');

    //seta o menu para ativa
    $('#menu-' + categoria).addClass('active');
  },

  //clique no botão de ver mais
  verMais: () => {
    var ativo = $('.container-menu a.active').attr('id').split('menu-')[1];
    cardapio.metodos.obterItensCardapio(ativo, true);

    $('#btnVerMais').addClass('hidden');
  },

  // diminui a quantidade do item no cardapio
  diminuirQuantidade: (id) => {
    let qtdAtual = parseInt($('#qtd-' + id).text());

    if (qtdAtual > 0) {
      $('#qtd-' + id).text(qtdAtual - 1);
    }
  },
  // aumenta a quantidade do item no cardapio
  aumentarQuantidade: (id) => {
    let qtdAtual = parseInt($('#qtd-' + id).text());
    $('#qtd-' + id).text(qtdAtual + 1);
  },

  // adicionar ao cainho o item do cardapio
  adicionarAoCarrinho: (id) => {
    let qtdAtual = parseInt($('#qtd-' + id).text());
    if (qtdAtual > 0) {
      //obter a categoria ativa
      var categoria = $('.container-menu a.active')
        .attr('id')
        .split('menu-')[1];

      let filtro = MENU[categoria];

      //obtem o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        // validar se já existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (elemento, index) => {
          return elemento.id == id;
        });

        //caso já exista o item no carrinho, só altera a quantidade
        if (existe.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qtd = MEU_CARRINHO[objIndex].qtd + qtdAtual;
        }
        //caso ainda não exista o item no carrinho, adiciona ele
        else {
          item[0].qtd = qtdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
        $('#qtd-' + id).text(0);

        cardapio.metodos.atualizarbadgeTotal();
      }
    }
  },

  //atualiza o badge de totais dos botões "Meu Carrinho"
  atualizarbadgeTotal: () => {
    var total = 0;

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qtd;
    });

    if (total > 0) {
      $('.botao-carrinho').removeClass('hidden');
      $('.container-total-carrinho').removeClass('hidden');
    } else {
      $('.botao-carrinho').addClass('hidden');
      $('.container-total-carrinho').addClass('hidden');
    }

    $('.badge-total-carrinho').html(total);
  },

  //abrir a modal do carrinho
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $('#modalCarrinho').removeClass('hidden');
      cardapio.metodos.carregarCarrinho();
    } else {
      $('#modalCarrinho').addClass('hidden');
    }
  },

  //altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {
    if (etapa == 1) {
      $('#lblTituloEtapa').text('Seu carrinho: ');
      $('#itensCarrinho').removeClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').addClass('hidden');
      $('#entregaPagamento').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');

      $('#btnEtapaPedido').removeClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaEntregaPagamento').addClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnVoltar').addClass('hidden');
    }
    if (etapa == 2) {
      $('#lblTituloEtapa').text('Endereço de entrega: ');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').removeClass('hidden');
      $('#resumoCarrinho').addClass('hidden');
      $('#entregaPagamento').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').removeClass('hidden');
      $('#btnEtapaEntregaPagamento').addClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnVoltar').removeClass('hidden');
    }
    if (etapa == 3) {
      $('#lblTituloEtapa').text('Forma de entrega e pagamento: ');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').addClass('hidden');
      $('#entregaPagamento').removeClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');
      $('.etapa3').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaEntregaPagamento').removeClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnVoltar').removeClass('hidden');
    }
    if (etapa == 4) {
      $('#lblTituloEtapa').text('Resumo do pedido: ');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').removeClass('hidden');
      $('#entregaPagamento').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');
      $('.etapa3').addClass('active');
      $('.etapa4').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaEntregaPagamento').addClass('hidden');
      $('#btnEtapaResumo').removeClass('hidden');
      $('#btnVoltar').removeClass('hidden');
    }
  },

  //botão de voltar etapa
  voltarEtapa: () => {
    let etapa = $('.etapa.active').length;
    cardapio.metodos.carregarEtapa(etapa - 1);
  },

  // carrega a lista de itens do carrinho
  carregarCarrinho: () => {
    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {
      $('#itensCarrinho').html('');

      $.each(MEU_CARRINHO, (i, e) => {
        let template = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img)
          .replace(/\${nome}/g, e.name)
          .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
          .replace(/\${id}/g, e.id)
          .replace(/\${qtd}/g, e.qtd);

        $('#itensCarrinho').append(template);

        //último item
        if (i + 1 == MEU_CARRINHO.length) {
          cardapio.metodos.carregarValores();
        }
      });
    } else {
      $('#itensCarrinho').html(
        '<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>',
      );
      cardapio.metodos.carregarValores();
    }
  },

  //diminuir quantidade do item no carrinho
  diminuirQuantidadeCarrinho: (id) => {
    let qtdAtual = parseInt($('#qtd-carrinho-' + id).text());

    if (qtdAtual > 1) {
      $('#qtd-carrinho-' + id).text(qtdAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, qtdAtual - 1);
    } else {
      cardapio.metodos.removerItemCarrinho(id);
    }
  },

  //aumentar quantidade do item no carrinho
  aumentarQuantidadeCarrinho: (id) => {
    let qtdAtual = parseInt($('#qtd-carrinho-' + id).text());
    $('#qtd-carrinho-' + id).text(qtdAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, qtdAtual + 1);
  },

  // bitão remover item do carrinho
  removerItemCarrinho: (id) => {
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {
      return e.id != id;
    });
    cardapio.metodos.carregarCarrinho();

    cardapio.metodos.atualizarbadgeTotal();
  },

  //atualiza o carrinho com a quantidade atual
  atualizarCarrinho: (id, qtd) => {
    let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
    MEU_CARRINHO[objIndex].qtd = qtd;

    //atualiza o botão carrinho com a quantidade atualizada
    cardapio.metodos.atualizarbadgeTotal();
    //atualiza os valores em (R$) totais do carrinho
    cardapio.metodos.carregarValores();
  },
  /*
  calcularFrete: () => {
    let tipoEntrega = $("input[name='tipoEntrega']:checked").val();
    let cidade = document.getElementById('txtCidade').value;

    if (tipoEntrega === 'Entrega') {
      if (cidade === 'Demerval') {
        VALOR_ENTREGA = 4;
      } 
       else {
        VALOR_ENTREGA = 0; // Valor padrão para entrega
      }
    } else if (tipoEntrega === 'Retirada') {
      VALOR_ENTREGA = 0;
    }

    return VALOR_ENTREGA;
  
  },
*/
  // carrega valores de subtotal, entrega e total
  carregarValores: () => {
    VALOR_CARRINHO = 0;
    cardapio.metodos.calcularFrete();

    $('#lblSubTotal').text('R$ 0,00');
    $('#lblValorEntrega').text(' + R$ 0,00');
    $('#lblValorTotal').text('R$ 0,00');

    $.each(MEU_CARRINHO, (i, elemento) => {
      VALOR_CARRINHO += parseFloat(elemento.price * elemento.qtd);

      if (i + 1 == MEU_CARRINHO.length) {
        $('#lblSubTotal').text(
          `R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`,
        );
        $('#lblValorEntrega').text(
          `+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`,
        );
        $('#lblValorTotal').text(
          `R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`,
        );
      }
    });
  },

  //carregar a etapa endereços
  carregarEndereco: () => {
    if (MEU_CARRINHO.length <= 0) {
      cardapio.metodos.mensagem('Seu carrinho está vazio.');
      return;
    }

    cardapio.metodos.carregarEtapa(2);
    console.log("Carregando para segunda tela 2")
  },

  finalizarPedido: () => {
    let formaPagamento = $('#formaPagamento').val();
    let tipoEntrega = $("input[name='tipoEntrega']:checked").val();

    if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
        let itens = '';
        let texto = 'Olá gostaria de fazer um pedido: \n';
        texto += 'Itens do pedido:\n\n${itens}';
        texto += `\nENDEREÇO DE ENTREGA:`;
        texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
        texto += `\nCIDADE: ${MEU_ENDERECO.cidade}`;
       texto +=`\n\nOU RETIRADA: ${tipoEntrega}`;
       texto += `\nPRECISA DE TROCO: ${MEU_ENDERECO.complemento}`;
       texto += `\nOBSERVAÇÃO: ${document.getElementById('txtObservacao').value}`;
        texto += `\nVALOR DE ENTREGA:${(VALOR_ENTREGA).toFixed(2).replace('.', ',')}`;
        texto += `\nFORMA DE PAGAMENTO: ${formaPagamento}`;
        texto += `\n\nTotal: R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`;

        $.each(MEU_CARRINHO, (i, e) => {
            itens += `*${e.qtd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

            if (i + 1 === MEU_CARRINHO.length) {
                texto = texto.replace('${itens}', itens);

                // Converte a URL
                let encode = encodeURI(texto);
                let URL = `https://wa.me/5586995008583?text=${encode}`;

                $('#btnEtapaResumo').attr('href', URL);
            }
        });
    }
},


  carregarBotaoWhatsapp: () => {
    var texto = 'Olá! gostaria de saber mais sobre seus serviços';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;
    console.log('Enviar para whatsapp', texto);
    $('.btnWhats').attr('href', URL);

    cardapio.metodos.finalizarPedido();
  },

  // Validação e carregamento da etapa de entrega e pagamento
  validarEntregaPagamento: () => {
    let tipoEntrega = $("input[name='tipoEntrega']:checked").val();
    let formaPagamento = $('#formaPagamento').val();

    if (!tipoEntrega) {
      cardapio.metodos.mensagem('Escolha o tipo de entrega, por favor.');
      return;
    }

    if (!formaPagamento) {
      cardapio.metodos.mensagem('Escolha a forma de pagamento, por favor.');
      return;
    }

    MEU_PEDIDO = {
      tipoEntrega: tipoEntrega,
      formaPagamento: formaPagamento,
    };

    cardapio.metodos.carregarEtapa(4);
    cardapio.metodos.carregarValores();
    cardapio.metodos.finalizarPedido();
    console.log("carregando apra 4 tela")
  },

  //validação antes de prosseguir para a etapa 3
  resumoPedido: () => {
    //let cep = $("#txtCEP").val().trim();
    let endereco = $('#txtEndereco').val().trim();
    let bairro = $('#txtBairro').val().trim();
    let cidade = $('#txtCidade').val().trim();
    //let uf = $("#ddlUF").val().trim();
    let numero = $('#txtNumero').val().trim();
    let complemento = $('#txtComplemento').val().trim();

    /* if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }*/

 

    MEU_ENDERECO = {
      //cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      //uf: uf,
      numero: numero,
      complemento: complemento,
    };

    cardapio.metodos.carregarResumo();
    cardapio.metodos.carregarEtapa(3);
    console.log("carrega para 3 tela")

    console.log("informacoes: ", cardapio.metodos.carregarResumo())
  },

  //carrega a etapa de resumo do pedido.
  carregarResumo: () => {
    $('#listaItensResumo').html('');

    $.each(MEU_CARRINHO, (i, e) => {
      let template = cardapio.templates.itemResumo
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${qtd}/g, e.qtd);

      $('#listaItensResumo').append(template);
    });

    $('#resumoEndereco').html(
      `${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`,
    );
    $('#cidadeEndereco').html(
      `${MEU_ENDERECO.cidade}, ${MEU_ENDERECO.complemento}`,
    );
  },


 

  //Mensagens
  mensagem: (texto, cor = 'red', tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $('#container-mensagens').append(msg);

    setTimeout(() => {
      $('#msg-' + id).removeClass('fadeInDown');
      $('#msg-' + id).addClass('fadeOutUp');
      setTimeout(() => {
        $('msg-' + id).remove();
      }, 800);
    }, tempo);
  },
};

//funcao que crira um campo de entrada para colocar a cidade
function toggleDropdown() {
  document.getElementById('myDropdown').classList.toggle('show');
}

function selectCity(city) {
  document.getElementById('txtCidade').value = city;
  document.getElementById('myDropdown').classList.remove('show');
}

window.onclick = function (event) {
  if (!event.target.matches('#txtCidade')) {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

cardapio.templates = {
  item: `
                        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
                            <div class="card card-item" id="\${id}">
                                <div class="img-produto">
                                    <img src="\${img}" alt=""/ >
                                </div>
                                <p class="title-produto text-center mt-4">
                                    <b>\${nome}</b>
                                </p>
                                
                                <p class="price-produto text-center">
                                    <b>R$ \${preco}</b>
                                </p>
                                 

                                <div class="add-carrinho">
                                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fa fa-minus"></i></span>
                                    <span class="add-numero-itens" id="qtd-\${id}">0</span>
                                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fa fa-plus"></i></span>
                                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                                </div>
                            </div>
                        </div>

    `,

  itemCarrinho: `
    
                    <div class="col-12 item-carrinho">
                        <div class="img-produto">
                            <img
                                src="\${img}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto"><b>\${nome}</b></p>
                            <p class="price-produto"><b>R$ \${preco}</b></p>
                        </div>
                        <div class="add-carrinho">
                           <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fa fa-minus"></i></span>
                                    <span class="add-numero-itens" id="qtd-carrinho-\${id}">\${qtd}</span>
                                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fa fa-plus"></i></span>
                            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
                        </div>
                    </div>


    `,

  itemResumo: `
    <div class="col-12 item-carrinho resumo">
                                <div class="img-produto-resumo">
                                    <img src="\${img}"
                                        alt="">
                                </div>
                                <div class="dados-produto">
                                    <p class="title-produto-resumo">
                                        <b>\${nome}</b>
                                    </p>
                                    <p class="price-produto-resumo">
                                        <b>\${preco}</b>
                                    </p>
                                </div>
                                <p class="quantidade-produto-resumo">
                                    x <b>\${qtd}</b>
                                </p>
                            </div>
                            `,
};
