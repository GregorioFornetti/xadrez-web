

document.addEventListener("DOMContentLoaded", () => {
    let main_container = document.querySelector('#main-container')
    let tabuleiro = criar_tabuleiro(main_container)

    let placar = criar_placar(main_container)
    atualizacao_do_placar(placar, tabuleiro)
    
    tabuleiro.addEventListener("mudanca", () => {
        atualizacao_do_placar(placar, tabuleiro)
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
        texto_vitoria.innerText = `O jogador das ${cor_para_string_plural(e.detail.vencedor)} venceu !`
        texto_vitoria.style.textAlign = 'center'
        container.appendChild(texto_vitoria)
        
        let btn_reiniciar = document.createElement('button')
        btn_reiniciar.innerText = 'Reiniciar'
        btn_reiniciar.className = 'btn-fim-de-jogo'
        btn_reiniciar.addEventListener('click', () => {
            reiniciar_tabuleiro(tabuleiro)
            atualizacao_do_placar(placar, tabuleiro)
            modal.remove()
        })
        container.appendChild(btn_reiniciar)

        document.body.appendChild(modal)
    })

})

function atualizacao_do_placar(placar, tabuleiro) {
    let status_tabuleiro = coletar_status_tabuleiro(tabuleiro)
    atualizar_placar(placar, status_tabuleiro['num_jogada'], status_tabuleiro['cor_jogador_atual'], status_tabuleiro['qnt_pecas_brancas'], status_tabuleiro['qnt_pecas_pretas'])
}