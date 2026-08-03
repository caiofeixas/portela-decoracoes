/* =========================================================
   PORTELA DECORAÃ‡Ã•ES â€” INTERAÃ‡Ã•ES DA PÃGINA
   Menu mobile, carrossel, FAQ e ano automÃ¡tico
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    iniciarMenuMobile();
    iniciarCarrossel();
    iniciarFaq();
    atualizarAnoDoRodape();
});

/* =========================================================
   MENU MOBILE
   ========================================================= */

function iniciarMenuMobile() {
    const botaoMenu = document.querySelector(
        "#menu-toggle, .menu-toggle, .mobile-menu-button"
    );

    const menu = document.querySelector("#nav-menu, .nav-menu, .main-nav");

    if (!botaoMenu || !menu) return;

    const abrirMenu = () => {
        menu.classList.add("active", "is-open");
        document.body.classList.add("menu-open");
        botaoMenu.classList.add("active");
        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.setAttribute("aria-label", "Fechar menu");
        atualizarIconeMenu(botaoMenu, true);
    };

    const fecharMenu = () => {
        menu.classList.remove("active", "is-open");
        document.body.classList.remove("menu-open");
        botaoMenu.classList.remove("active");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        atualizarIconeMenu(botaoMenu, false);
    };

    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-controls", menu.id || "nav-menu");

    botaoMenu.addEventListener("click", () => {
        const menuEstaAberto = menu.classList.contains("active");
        menuEstaAberto ? fecharMenu() : abrirMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("click", (evento) => {
        const clicouForaDoMenu =
            !menu.contains(evento.target) && !botaoMenu.contains(evento.target);

        if (clicouForaDoMenu && menu.classList.contains("active")) {
            fecharMenu();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && menu.classList.contains("active")) {
            fecharMenu();
            botaoMenu.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) fecharMenu();
    });
}

function atualizarIconeMenu(botao, menuAberto) {
    const icone = botao.querySelector("i");

    if (!icone) return;

    icone.classList.toggle("fa-bars", !menuAberto);
    icone.classList.toggle("fa-xmark", menuAberto);
}

/* =========================================================
   CARROSSEL
   ========================================================= */

function iniciarCarrossel() {
    const carrossel = document.querySelector(
        "#carousel, .carousel, .hero-carousel"
    );

    if (!carrossel) return;

    const slides = Array.from(carrossel.querySelectorAll(".slide"));

    if (slides.length === 0) return;

    const botaoAnterior = carrossel.querySelector(
        ".carousel-prev, .carousel-arrow.prev, .carousel-button.prev, [data-carousel='prev']"
    );

    const botaoProximo = carrossel.querySelector(
        ".carousel-next, .carousel-arrow.next, .carousel-button.next, [data-carousel='next']"
    );

    const areaDosIndicadores = carrossel.querySelector(
        ".carousel-dots, .dots"
    );

    let indicadores = areaDosIndicadores
        ? Array.from(areaDosIndicadores.querySelectorAll(".carousel-dot, .dot"))
        : [];

    let slideAtual = slides.findIndex(
        (slide) =>
            slide.classList.contains("active") || slide.classList.contains("is-active")
    );

    let temporizador = null;
    let inicioDoToque = 0;

    const intervaloAutomatico = 6000;

    if (slideAtual < 0) slideAtual = 0;

    if (areaDosIndicadores && indicadores.length !== slides.length) {
        areaDosIndicadores.innerHTML = "";

        slides.forEach((_, indice) => {
            const indicador = document.createElement("button");
            indicador.type = "button";
            indicador.className = "carousel-dot dot";
            indicador.setAttribute("aria-label", `Ir para o slide ${indice + 1}`);
            indicador.dataset.slide = String(indice);
            areaDosIndicadores.appendChild(indicador);
        });

        indicadores = Array.from(
            areaDosIndicadores.querySelectorAll(".carousel-dot, .dot")
        );
    }

    const mostrarSlide = (novoIndice) => {
        slideAtual = (novoIndice + slides.length) % slides.length;

        slides.forEach((slide, indice) => {
            const estaAtivo = indice === slideAtual;

            slide.classList.toggle("active", estaAtivo);
            slide.classList.toggle("is-active", estaAtivo);
            slide.setAttribute("aria-hidden", String(!estaAtivo));
        });

        indicadores.forEach((indicador, indice) => {
            const estaAtivo = indice === slideAtual;

            indicador.classList.toggle("active", estaAtivo);
            indicador.setAttribute("aria-current", estaAtivo ? "true" : "false");
        });
    };

    const avancarSlide = () => mostrarSlide(slideAtual + 1);
    const voltarSlide = () => mostrarSlide(slideAtual - 1);

    const pararRotacaoAutomatica = () => {
        if (temporizador) {
            window.clearInterval(temporizador);
            temporizador = null;
        }
    };

    const iniciarRotacaoAutomatica = () => {
        pararRotacaoAutomatica();

        if (slides.length > 1 && !document.hidden) {
            temporizador = window.setInterval(avancarSlide, intervaloAutomatico);
        }
    };

    const reiniciarRotacaoAutomatica = () => {
        iniciarRotacaoAutomatica();
    };

    botaoAnterior?.addEventListener("click", () => {
        voltarSlide();
        reiniciarRotacaoAutomatica();
    });

    botaoProximo?.addEventListener("click", () => {
        avancarSlide();
        reiniciarRotacaoAutomatica();
    });

    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener("click", () => {
            mostrarSlide(indice);
            reiniciarRotacaoAutomatica();
        });
    });

    carrossel.addEventListener("mouseenter", pararRotacaoAutomatica);
    carrossel.addEventListener("mouseleave", iniciarRotacaoAutomatica);
    carrossel.addEventListener("focusin", pararRotacaoAutomatica);
    carrossel.addEventListener("focusout", iniciarRotacaoAutomatica);

    carrossel.addEventListener(
        "touchstart",
        (evento) => {
            inicioDoToque = evento.changedTouches[0].clientX;
            pararRotacaoAutomatica();
        },
        { passive: true }
    );

    carrossel.addEventListener(
        "touchend",
        (evento) => {
            const fimDoToque = evento.changedTouches[0].clientX;
            const distancia = inicioDoToque - fimDoToque;

            if (Math.abs(distancia) > 45) {
                distancia > 0 ? avancarSlide() : voltarSlide();
            }

            iniciarRotacaoAutomatica();
        },
        { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
        document.hidden ? pararRotacaoAutomatica() : iniciarRotacaoAutomatica();
    });

    mostrarSlide(slideAtual);
    iniciarRotacaoAutomatica();
}

/* =========================================================
   FAQ
   ========================================================= */

function iniciarFaq() {
    const itensDoFaq = Array.from(document.querySelectorAll(".faq-item"));

    if (itensDoFaq.length === 0) return;

    itensDoFaq.forEach((item, indice) => {
        const pergunta = item.querySelector(".faq-question");
        const resposta = item.querySelector(".faq-answer");

        if (!pergunta || !resposta) return;

        const idDaResposta = resposta.id || `faq-resposta-${indice + 1}`;
        resposta.id = idDaResposta;

        pergunta.setAttribute("aria-controls", idDaResposta);
        pergunta.setAttribute("aria-expanded", "false");

        pergunta.addEventListener("click", () => {
            const itemEstavaAberto =
                item.classList.contains("active") || item.classList.contains("is-open");

            itensDoFaq.forEach((outroItem) => {
                fecharItemFaq(outroItem);
            });

            if (!itemEstavaAberto) {
                abrirItemFaq(item);
            }
        });
    });
}

function abrirItemFaq(item) {
    const pergunta = item.querySelector(".faq-question");
    const resposta = item.querySelector(".faq-answer");

    item.classList.add("active", "is-open");
    pergunta?.setAttribute("aria-expanded", "true");

    if (resposta) {
        resposta.style.maxHeight = `${resposta.scrollHeight}px`;
    }
}

function fecharItemFaq(item) {
    const pergunta = item.querySelector(".faq-question");
    const resposta = item.querySelector(".faq-answer");

    item.classList.remove("active", "is-open");
    pergunta?.setAttribute("aria-expanded", "false");

    if (resposta) {
        resposta.style.maxHeight = "0px";
    }
}

/* =========================================================
   ANO AUTOMÃTICO NO RODAPÃ‰
   ========================================================= */

function atualizarAnoDoRodape() {
    const elementosDoAno = document.querySelectorAll(
        "#current-year, [data-current-year]"
    );

    elementosDoAno.forEach((elemento) => {
        elemento.textContent = String(new Date().getFullYear());
    });
}