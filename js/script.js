/* =========================================================
   PORTELA DECORAÇÕES
   Menu, carrossel, FAQ e ano automático
   ========================================================= */

function iniciarPagina() {
    iniciarMenu();
    iniciarCarrossel();
    iniciarFaq();
    atualizarAno();
}


/* Garante que o código funcione com ou sem defer */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPagina
    );
} else {
    iniciarPagina();
}


/* =========================================================
   MENU MOBILE
   ========================================================= */

function iniciarMenu() {
    const botaoMenu = document.querySelector(
        "#menu-toggle, #botaoMenu, .menu-toggle, .botao-menu"
    );

    const menu = document.querySelector(
        "#nav-menu, #menuPrincipal, .nav-menu, .menu-principal"
    );

    if (!botaoMenu || !menu) {
        return;
    }

    const icone = botaoMenu.querySelector("i");


    function abrirMenu() {
        menu.classList.add("active", "ativo");
        document.body.classList.add("menu-open");

        botaoMenu.setAttribute(
            "aria-expanded",
            "true"
        );

        botaoMenu.setAttribute(
            "aria-label",
            "Fechar menu"
        );

        if (icone) {
            icone.classList.remove("fa-bars");
            icone.classList.add("fa-xmark");
        }
    }


    function fecharMenu() {
        menu.classList.remove("active", "ativo");
        document.body.classList.remove("menu-open");

        botaoMenu.setAttribute(
            "aria-expanded",
            "false"
        );

        botaoMenu.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        if (icone) {
            icone.classList.remove("fa-xmark");
            icone.classList.add("fa-bars");
        }
    }


    botaoMenu.addEventListener("click", function () {
        const estaAberto =
            menu.classList.contains("active") ||
            menu.classList.contains("ativo");

        if (estaAberto) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    });


    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", fecharMenu);
    });


    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharMenu();
        }
    });


    window.addEventListener("resize", function () {
        if (window.innerWidth > 800) {
            fecharMenu();
        }
    });
}


/* =========================================================
   CARROSSEL
   ========================================================= */

function iniciarCarrossel() {
    const carrossel = document.querySelector(
        "#carousel, .carousel, .carrossel"
    );

    if (!carrossel) {
        console.error("Carrossel não encontrado no HTML.");
        return;
    }


    const slides = Array.from(
        carrossel.querySelectorAll(".slide")
    );


    const botaoAnterior = carrossel.querySelector(
        "#slideAnterior, .carousel-prev, .seta-anterior, [data-carousel='prev']"
    );


    const botaoProximo = carrossel.querySelector(
        "#proximoSlide, .carousel-next, .seta-proximo, [data-carousel='next']"
    );


    const indicadores = Array.from(
        carrossel.querySelectorAll(
            ".carousel-dot, .dot, .indicador"
        )
    );


    if (slides.length === 0) {
        console.error(
            "Nenhum elemento com a classe .slide foi encontrado."
        );

        return;
    }


    let slideAtual = 0;
    let temporizador = null;
    let inicioDoToque = 0;

    const tempoAutomatico = 5000;


    /* Procura qual slide começa selecionado */

    const indiceInicial = slides.findIndex(
        function (slide) {
            return (
                slide.classList.contains("active") ||
                slide.classList.contains("ativo")
            );
        }
    );


    if (indiceInicial >= 0) {
        slideAtual = indiceInicial;
    }


    function mostrarSlide(indice) {
        /*
         * Esta conta permite voltar do primeiro
         * slide diretamente para o último.
         */

        slideAtual =
            (indice + slides.length) % slides.length;


        slides.forEach(function (slide, posicao) {
            const estaSelecionado =
                posicao === slideAtual;

            slide.classList.toggle(
                "active",
                estaSelecionado
            );

            slide.classList.toggle(
                "ativo",
                estaSelecionado
            );

            slide.setAttribute(
                "aria-hidden",
                String(!estaSelecionado)
            );
        });


        indicadores.forEach(
            function (indicador, posicao) {
                const estaSelecionado =
                    posicao === slideAtual;

                indicador.classList.toggle(
                    "active",
                    estaSelecionado
                );

                indicador.classList.toggle(
                    "ativo",
                    estaSelecionado
                );

                if (estaSelecionado) {
                    indicador.setAttribute(
                        "aria-current",
                        "true"
                    );
                } else {
                    indicador.removeAttribute(
                        "aria-current"
                    );
                }
            }
        );
    }


    function avancarSlide() {
        mostrarSlide(slideAtual + 1);
    }


    function voltarSlide() {
        mostrarSlide(slideAtual - 1);
    }


    function pararAutomatico() {
        if (temporizador !== null) {
            clearInterval(temporizador);
            temporizador = null;
        }
    }


    function iniciarAutomatico() {
        pararAutomatico();

        if (slides.length > 1) {
            temporizador = setInterval(
                avancarSlide,
                tempoAutomatico
            );
        }
    }


    function reiniciarAutomatico() {
        pararAutomatico();
        iniciarAutomatico();
    }


    /* SETA ANTERIOR */

    if (botaoAnterior) {
        botaoAnterior.addEventListener(
            "click",
            function () {
                voltarSlide();
                reiniciarAutomatico();
            }
        );
    } else {
        console.error(
            "Botão de slide anterior não encontrado."
        );
    }


    /* PRÓXIMA SETA */

    if (botaoProximo) {
        botaoProximo.addEventListener(
            "click",
            function () {
                avancarSlide();
                reiniciarAutomatico();
            }
        );
    } else {
        console.error(
            "Botão de próximo slide não encontrado."
        );
    }


    /* BOLINHAS */

    indicadores.forEach(
        function (indicador, indice) {
            indicador.addEventListener(
                "click",
                function () {
                    mostrarSlide(indice);
                    reiniciarAutomatico();
                }
            );
        }
    );


    /* SETAS DO TECLADO */

    carrossel.setAttribute("tabindex", "0");

    carrossel.addEventListener(
        "keydown",
        function (evento) {
            if (evento.key === "ArrowRight") {
                avancarSlide();
                reiniciarAutomatico();
            }

            if (evento.key === "ArrowLeft") {
                voltarSlide();
                reiniciarAutomatico();
            }
        }
    );


    /* DESLIZAR NO CELULAR */

    carrossel.addEventListener(
        "touchstart",
        function (evento) {
            inicioDoToque =
                evento.changedTouches[0].clientX;
        },
        {
            passive: true
        }
    );


    carrossel.addEventListener(
        "touchend",
        function (evento) {
            const finalDoToque =
                evento.changedTouches[0].clientX;

            const distancia =
                inicioDoToque - finalDoToque;

            if (Math.abs(distancia) > 45) {
                if (distancia > 0) {
                    avancarSlide();
                } else {
                    voltarSlide();
                }

                reiniciarAutomatico();
            }
        },
        {
            passive: true
        }
    );


    /* Para quando a aba fica escondida */

    document.addEventListener(
        "visibilitychange",
        function () {
            if (document.hidden) {
                pararAutomatico();
            } else {
                iniciarAutomatico();
            }
        }
    );


    mostrarSlide(slideAtual);
    iniciarAutomatico();

    console.log(
        "Carrossel iniciado com sucesso:",
        slides.length,
        "slides."
    );
}


/* =========================================================
   FAQ
   ========================================================= */

function iniciarFaq() {
    const itensFaq = document.querySelectorAll(
        ".faq-item"
    );


    function fecharFaq(item) {
        const pergunta = item.querySelector(
            ".faq-question"
        );

        const resposta = item.querySelector(
            ".faq-answer"
        );

        item.classList.remove("active", "ativo");

        if (pergunta) {
            pergunta.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (resposta) {
            resposta.style.maxHeight = "0px";
        }
    }


    function abrirFaq(item) {
        const pergunta = item.querySelector(
            ".faq-question"
        );

        const resposta = item.querySelector(
            ".faq-answer"
        );

        item.classList.add("active", "ativo");

        if (pergunta) {
            pergunta.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        if (resposta) {
            resposta.style.maxHeight =
                resposta.scrollHeight + "px";
        }
    }


    itensFaq.forEach(function (item) {
        const pergunta = item.querySelector(
            ".faq-question"
        );

        if (!pergunta) {
            return;
        }

        pergunta.addEventListener(
            "click",
            function () {
                const estavaAberto =
                    item.classList.contains("active") ||
                    item.classList.contains("ativo");

                itensFaq.forEach(function (outroItem) {
                    fecharFaq(outroItem);
                });

                if (!estavaAberto) {
                    abrirFaq(item);
                }
            }
        );
    });
}


/* =========================================================
   ANO DO RODAPÉ
   ========================================================= */

function atualizarAno() {
    const elementos = document.querySelectorAll(
        "[data-current-year], #current-year"
    );

    const anoAtual = new Date().getFullYear();

    elementos.forEach(function (elemento) {
        elemento.textContent = anoAtual;
    });
}