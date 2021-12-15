
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
                posicao_atual.className = "posicao posicao-preta"
            else
                posicao_atual.className = "posicao posicao-branca"
            
            posicao_atual.addEventListener("click", () => {
                posicao_atual.className += ' posicao-inicial'
                console.log(posicao_atual.className)
            })
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

function eh_posicao_livre(linha, coluna, tabuleiro) {  
    // Verifica se a posição não possui peça (a div de posição não pode ter nada, no caso a peça de img)
    return tabuleiro.querySelector(`#${coluna}${linha}`).childElementCount == 0
}

function coletar_peca(linha, coluna, tabuleiro) {
    // Coleta a peça disponível em uma posição do tabuleiro
    // OBS: se for usado com uma posição vazia, ocorrerá um erro
    return tabuleiro.querySelector(`#${coluna}${linha}`).children[0]
}

function eh_posicao_livre(linha, coluna, tabuleiro) {  
    // Verifica se a posição não possui peça (a div de posição não pode ter nada, no caso a peça de img)
    return tabuleiro.querySelector(`#${coluna}${linha}`).childElementCount == 0
}

function eh_caminho_livre(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se o caminho até o destino está livre (não possui peças no caminho)
    let coluna_origem_int = coluna_para_inteiro(coluna_origem)
    let coluna_destino_int = coluna_para_inteiro(coluna_destino)
    
    if ((linha_origem == linha_destino) && (coluna_origem_int < coluna_destino_int)) {	//Direita Reto
        for (let j = coluna_origem_int + 1; j < coluna_destino_int; j++ ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) + j)
            if (eh_posicao_livre(linha_origem, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem == linha_destino) && (coluna_origem_int > coluna_destino_int)) {	//Esquerda Reto
        for (let j = coluna_origem_int - 1; j > coluna_destino_int; j-- ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) + j)
            if (eh_posicao_livre(linha_origem, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem < linha_destino) && (coluna_origem_int == coluna_destino_int)) {	//Cima Reto
        for (let linha_atual = linha_origem + 1; linha_atual < linha_destino; linha_atual++ ) {
            if (eh_posicao_livre(linha_atual, coluna_origem, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem > linha_destino) && (coluna_origem_int == coluna_destino_int)) {	//Baixo Reto
        for (let linha_atual = linha_origem - 1; linha_atual > linha_destino; linha_atual-- ) {
            if (eh_posicao_livre(linha_atual, coluna_origem, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int > coluna_origem_int) && (-(linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Direita Baixo
        for (let k = 1; k < coluna_destino_int - coluna_origem_int; k++ ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) + k)
            if (eh_posicao_livre(linha_origem - k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int > coluna_origem_int) && ((linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Direita Cima
        for (let k = 1; k < coluna_destino_int - coluna_origem_int; k++ ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) + k)
            if (eh_posicao_livre(linha_origem + k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int < coluna_origem_int) && ((linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Esquerda Baixo
        for (let k = 1; k < coluna_origem_int - coluna_destino_int; k++ ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) - k)
            if (eh_posicao_livre(linha_origem - k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int < coluna_origem_int) && (-(linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))){	//Esquerda Cima
        for (let k = 1; k < coluna_origem_int - coluna_destino_int; k++ ) {
            let coluna_atual = String.fromCharCode('A'.charCodeAt(0) - k)
            if (eh_posicao_livre(linha_origem + k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    }
    return true;
}


function eh_pecas_cores_diferentes(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {  
    // Verifica se a peça da origem é de cor diferente da de destino
    // OBS: nas duas posições precisam possuir peças, caso contrário ocorrerá um erro
    return coletar_cor_peca(coletar_peca(linha_origem, coluna_origem, tabuleiro)) != coletar_cor_peca(coletar_peca(linha_destino, coluna_destino, tabuleiro))
}

function eh_movimento_peao_para_diagonal(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se é um movimento de um peao para diagonal
    // Caso a posição não possua uma peça, um erro ocorrerá 
    
    return eh_peao(coletar_peca(linha_origem, coluna_origem, tabuleiro)) && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) == 1 && calcular_deslocamento_vertical(linha_origem, linha_destino) == 1
	
}

function eh_movimento_peao_para_frente(linha_origem, coluna_origem, linha_destino, coluna_destino) {
    // Verifica se o peao pode ir para frente (não pode comer para frente)
    return eh_peao(coletar_peca(linha_origem, coluna_origem, tabuleiro)) && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) == 0
}

function checaMovimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se o movimento é válido da posição origem até a posição de destino.
    // OBS: não é verificado movimentos especiais nesse método
    if (eh_posicao_livre(linha_origem, coluna_origem, tabuleiro)) {
        return false;
    }
    
    if (coletar_peca(linha_origem, coluna_origem, tabuleiro).checa_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino)) {
        return false;
    }
    
    if (!eh_caminho_livre(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
        return false;
    }
    
    if(eh_posicao_livre(linha_destino, coluna_destino, tabuleiro)) {
        if(eh_movimento_peao_para_diagonal(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
            return false;
        }
        return true;
    }
    
    if(eh_pecas_cores_diferentes(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
        if (checaMovimentoPeaoFrente(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
            return false;
        }
        return true;
    } else {
        return false;
    }
    
}