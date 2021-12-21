

document.addEventListener("DOMContentLoaded", () => {
    let tabuleiro = criar_tabuleiro()
    document.querySelector('body').appendChild(tabuleiro)
    
    tabuleiro.addEventListener("mudanca", () => {
        console.log("SALVE JOGADA")
    })

    tabuleiro.addEventListener("fimdejogo", (e) => {
        let modal = document.createElement('div')
        modal.className = 'modal'
        
        let container = document.createElement('div')
        container.className = 'container-fim-de-jogo'
        modal.appendChild(container)

        let btn_close = document.createElement('button')
        btn_close.className = 'modal-close-btn'
        btn_close.addEventListener("click", () => {
            modal.remove()
        })
        container.appendChild(btn_close)

        container.appendChild(document.createElement('br'))

        let texto_vitoria = document.createElement('h2')
        texto_vitoria.innerText = `O jogador das ${(e.detail.vencedor == COR_BRANCA) ? ("brancas") : ("pretas")} venceu !`
        texto_vitoria.style.textAlign = 'center'
        container.appendChild(texto_vitoria)
        
        let btn_reiniciar = document.createElement('button')
        btn_reiniciar.innerText = 'Reiniciar'
        btn_reiniciar.className = 'btn-fim-de-jogo'
        btn_reiniciar.addEventListener('click', () => {
            reiniciar_tabuleiro(tabuleiro)
            modal.remove()
        })
        container.appendChild(btn_reiniciar)

        document.body.appendChild(modal)
    })
})
