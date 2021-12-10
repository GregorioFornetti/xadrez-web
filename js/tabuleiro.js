
function verifica_linha_valida(linha) {
    if (linha < 1 || linha > 8)
        throw Error("Linha inválida, deve ser um número entre 1 e 8")
}

function verifica_coluna_valida(coluna) {
    if (coluna.length != 1 || !(coluna.charCodeAt(0) >= 'A'.charCodeAt(0) && coluna.charCodeAt(0) <= 'H'.charCodeAt(0)))
        throw Error("Coluna inválida, deve ser um caractere de A a H")
}


function criar_tabuleiro() {
    let container_tabuleiro = document.createElement("div")
    container_tabuleiro.className = "tabuleiro"

    for (let linha = 8; linha >= 1; linha--) {
        for (let coluna = 0; coluna < 8; coluna++) {
            let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
            let posicao_atual = document.createElement("div")

            posicao_atual.id = char_coluna + linha
            if ((linha + coluna) % 2 == 0)
                posicao_atual.className = "posicao-preta"
            else
                posicao_atual.className = "posicao-branca"
            container_tabuleiro.appendChild(posicao_atual)
        }
    }
    return container_tabuleiro
}
