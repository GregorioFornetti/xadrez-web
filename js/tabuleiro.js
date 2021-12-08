
function criar_tabuleiro() {
    let container_tabuleiro = document.createElement("div")
    container_tabuleiro.className = "tabuleiro"

    for (let linha = 8; linha >= 1; linha--) {
        for (let coluna = 0; coluna < 8; coluna++) {
            let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
            let posicao_atual = document.createElement("div")

            posicao_atual.setAttribute("name", char_coluna + linha)
            if ((linha + coluna) % 2 == 0)
                posicao_atual.className = "posicao-preta"
            else
                posicao_atual.className = "posicao-branca"
            container_tabuleiro.appendChild(posicao_atual)
        }
    }
    return container_tabuleiro
}