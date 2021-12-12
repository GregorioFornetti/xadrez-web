
function verifica_linha_valida(linha) {
    if (linha < 1 || linha > 8)
        throw Error("Linha inválida, deve ser um número entre 1 e 8")
}

function verifica_coluna_valida(coluna) {
    if (coluna.length != 1 || !(coluna.charCodeAt(0) >= 'A'.charCodeAt(0) && coluna.charCodeAt(0) <= 'H'.charCodeAt(0)))
        throw Error("Coluna inválida, deve ser um caractere de A a H")
}



function criar_tabuleiro() {
    let tabuleiro = document.createElement("div")
    tabuleiro.className = "tabuleiro"

    for (let linha = 8; linha >= 1; linha--) {
        for (let coluna = 0; coluna < 8; coluna++) {
            let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
            let posicao_atual = document.createElement("div")

            posicao_atual.id = char_coluna + linha
            if ((linha + coluna) % 2 == 0)
                posicao_atual.className = "posicao-preta"
            else
                posicao_atual.className = "posicao-branca"
            tabuleiro.appendChild(posicao_atual)
        }
    }
    colocar_pecas_no_tabuleiro(tabuleiro)
    return tabuleiro
}

function colocar_pecas_no_tabuleiro(tabuleiro) {
    for (let coluna = 0; coluna < 8; coluna++) {
        let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
        tabuleiro.querySelector(`#${char_coluna}7`).appendChild(criar_peao(COR_PRETA))
        tabuleiro.querySelector(`#${char_coluna}2`).appendChild(criar_peao(COR_BRANCA))
    }

    tabuleiro.querySelector("#A8").appendChild(criar_torre(COR_PRETA))
    tabuleiro.querySelector("#B8").appendChild(criar_cavalo(COR_PRETA))
    tabuleiro.querySelector("#C8").appendChild(criar_bispo(COR_PRETA))
    tabuleiro.querySelector("#D8").appendChild(criar_dama(COR_PRETA))
    tabuleiro.querySelector("#E8").appendChild(criar_rei(COR_PRETA))
    tabuleiro.querySelector("#F8").appendChild(criar_bispo(COR_PRETA))
    tabuleiro.querySelector("#G8").appendChild(criar_cavalo(COR_PRETA))
    tabuleiro.querySelector("#H8").appendChild(criar_torre(COR_PRETA))

    tabuleiro.querySelector("#A1").appendChild(criar_torre(COR_BRANCA))
    tabuleiro.querySelector("#B1").appendChild(criar_cavalo(COR_BRANCA))
    tabuleiro.querySelector("#C1").appendChild(criar_bispo(COR_BRANCA))
    tabuleiro.querySelector("#D1").appendChild(criar_dama(COR_BRANCA))
    tabuleiro.querySelector("#E1").appendChild(criar_rei(COR_BRANCA))
    tabuleiro.querySelector("#F1").appendChild(criar_bispo(COR_BRANCA))
    tabuleiro.querySelector("#G1").appendChild(criar_cavalo(COR_BRANCA))
    tabuleiro.querySelector("#H1").appendChild(criar_torre(COR_BRANCA))
}
