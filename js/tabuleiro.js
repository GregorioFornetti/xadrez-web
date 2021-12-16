
const tabuleiro_jogada_realizada = new CustomEvent("jogadarealizada")
const CLASSE_MARCACAO_POSIC_INICIAL = "posicao-inicial"
const CLASSE_MARCACAO_POSIC_ALCANCAVEL = "posicao-alcancavel"

function eh_linha_valida(linha) {
    if (linha < 1 || linha > 8)
        throw Error("Linha inválida, deve ser um número entre 1 e 8")
    return true
}

function eh_coluna_valida(coluna) {
    if (coluna.length != 1 || !(coluna.charCodeAt(0) >= 'A'.charCodeAt(0) && coluna.charCodeAt(0) <= 'H'.charCodeAt(0)))
        throw Error("Coluna inválida, deve ser um caractere de A a H")
    return true
}


function criar_tabuleiro() {
    let tabuleiro = document.createElement("div")
    tabuleiro.className = "tabuleiro"
    tabuleiro.cor_jogador_atual = COR_BRANCA
    tabuleiro.qnt_jogadas = 0
    tabuleiro.posicao_inicial = null

    for (let linha = 8; linha >= 1; linha--) {
        for (let coluna = 0; coluna < 8; coluna++) {
            let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
            let posicao_atual = document.createElement("div")

            posicao_atual.id = char_coluna + linha
            posicao_atual.linha = linha
            posicao_atual.coluna = char_coluna

            if ((linha + coluna) % 2 == 0)
                posicao_atual.className = "posicao posicao-preta"
            else
                posicao_atual.className = "posicao posicao-branca"
            
            
            posicao_atual.addEventListener("click", () => {
                if (eh_posicao_inicial_valida(posicao_atual, tabuleiro)) {
                    if (posicao_atual == tabuleiro.posicao_inicial) {
                        desmarcar_todas_posicoes(tabuleiro)
                        tabuleiro.posicao_inicial = null
                    } else if (tabuleiro.posicao_inicial != null) {
                        desmarcar_todas_posicoes(tabuleiro)
                        tabuleiro.posicao_inicial = posicao_atual
                        marcar_posicao_inicial(posicao_atual)
                        marcar_posicoes_alcancaveis(posicao_atual, tabuleiro)
                    } else {
                        tabuleiro.posicao_inicial = posicao_atual
                        marcar_posicao_inicial(posicao_atual)
                        marcar_posicoes_alcancaveis(posicao_atual, tabuleiro)
                    }
                } else if (tabuleiro.posicao_inicial != null) {
                    realiza_movimento(tabuleiro.posicao_inicial.linha, tabuleiro.posicao_inicial.coluna, posicao_atual.linha, posicao_atual.coluna, tabuleiro)
                }
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
    let posicao = tabuleiro.querySelector(`#${coluna}${linha}`)
    if (posicao.childElementCount == 1)
        return posicao.children[0]
    return null
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
        for (let k = 1; k < coluna_destino_int - coluna_origem_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) + k)
            if (!eh_posicao_livre(linha_origem, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem == linha_destino) && (coluna_origem_int > coluna_destino_int)) {	//Esquerda Reto
        for (let k = 1; k < coluna_origem_int - coluna_destino_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) - k)
            if (!eh_posicao_livre(linha_origem, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem < linha_destino) && (coluna_origem_int == coluna_destino_int)) {	//Cima Reto
        for (let linha_atual = linha_origem + 1; linha_atual < linha_destino; linha_atual++ ) {
            if (!eh_posicao_livre(linha_atual, coluna_origem, tabuleiro)) {
                return false;
            }
        }	
    } else if ((linha_origem > linha_destino) && (coluna_origem_int == coluna_destino_int)) {	//Baixo Reto
        for (let linha_atual = linha_origem - 1; linha_atual > linha_destino; linha_atual-- ) {
            if (!eh_posicao_livre(linha_atual, coluna_origem, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int > coluna_origem_int) && (-(linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Direita Baixo
        for (let k = 1; k < coluna_destino_int - coluna_origem_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) + k)
            if (!eh_posicao_livre(linha_origem - k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int > coluna_origem_int) && ((linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Direita Cima
        for (let k = 1; k < coluna_destino_int - coluna_origem_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) + k)
            if (!eh_posicao_livre(linha_origem + k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int < coluna_origem_int) && ((linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))) {	//Esquerda Baixo
        for (let k = 1; k < coluna_origem_int - coluna_destino_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) - k)
            if (!eh_posicao_livre(linha_origem - k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    } else if ((coluna_destino_int < coluna_origem_int) && (-(linha_destino - linha_origem) == (coluna_destino_int - coluna_origem_int))){	//Esquerda Cima
        for (let k = 1; k < coluna_origem_int - coluna_destino_int; k++ ) {
            let coluna_atual = String.fromCharCode(coluna_origem.charCodeAt(0) - k)
            if (!eh_posicao_livre(linha_origem + k, coluna_atual, tabuleiro)) {
                return false;
            }
        }	
    }
    return true;
}


function eh_pecas_cores_diferentes(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {  
    // Verifica se a peça da origem é de cor diferente da de destino
    // OBS: nas duas posições precisam possuir peças, caso contrário ocorrerá um erro
    return coletar_peca(linha_origem, coluna_origem, tabuleiro).cor != coletar_peca(linha_destino, coluna_destino, tabuleiro).cor
}

function eh_movimento_peao_para_diagonal(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se é um movimento de um peao para diagonal
    // Caso a posição não possua uma peça, um erro ocorrerá 
    
    return eh_peao(coletar_peca(linha_origem, coluna_origem, tabuleiro)) && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) == 1 && calcular_deslocamento_vertical(linha_origem, linha_destino) == 1
	
}

function eh_movimento_peao_para_frente(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se o peao pode ir para frente (não pode comer para frente)
    return eh_peao(coletar_peca(linha_origem, coluna_origem, tabuleiro)) && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) == 0
}

function checa_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se o movimento é válido da posição origem até a posição de destino.
    // OBS: não é verificado movimentos especiais nesse método
    if (eh_posicao_livre(linha_origem, coluna_origem, tabuleiro)) {
        return false;
    }
    
    if (!coletar_peca(linha_origem, coluna_origem, tabuleiro).checa_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino)) {
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
        if (eh_movimento_peao_para_frente(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
            return false;
        }
        return true;
    } else {
        return false;
    }
    
}

function marcar_posicao_inicial(posicao) {
    posicao.className += ` ${CLASSE_MARCACAO_POSIC_INICIAL}`
}

function marcar_posicao_alcancavel(posicao) {
    posicao.className += ` ${CLASSE_MARCACAO_POSIC_ALCANCAVEL}`
}

function marcar_posicoes_alcancaveis(posicao_inicial, tabuleiro) {
    for (let posicao_final of tabuleiro.children) {
        if (checa_movimento(posicao_inicial.linha, posicao_inicial.coluna, posicao_final.linha, posicao_final.coluna, tabuleiro)) {
            marcar_posicao_alcancavel(posicao_final)
        }
    }
}

function eh_posicao_inicial_valida(posicao, tabuleiro) {
    if (!eh_posicao_livre(posicao.linha, posicao.coluna, tabuleiro)) {
        return coletar_peca(posicao.linha, posicao.coluna, tabuleiro).cor == tabuleiro.cor_jogador_atual
    }
    return false
}

function desmarcar_posicao(posicao) {
    let re = new RegExp(`${CLASSE_MARCACAO_POSIC_ALCANCAVEL}|${CLASSE_MARCACAO_POSIC_INICIAL}`)
    posicao.className = posicao.className.replace(re, "")
}

function desmarcar_todas_posicoes(tabuleiro) {
    for (let posicao of tabuleiro.children) {
        desmarcar_posicao(posicao)
    }
}

function eh_posicao_controlada(linha, coluna, cor_jogador, tabuleiro) {
    // Verifica se a posição passada eh controlada pelo adversário

    for (let posicao of tabuleiro.children) {
        if (!eh_posicao_livre(posicao.linha, posicao.coluna, tabuleiro) &&
            coletar_peca(posicao.linha, posicao.coluna, tabuleiro).cor != cor_jogador &&
            checa_movimento(posicao.linha, posicao.coluna, linha, coluna, tabuleiro)) {
            
            return true;
        }
    }
    return false;
}

function eh_xeque(tabuleiro, cor_jogador) {
    // Verifica se o jogador com a cor passada como parâmetro está em xeque.
    for (let posicao of tabuleiro.children) {
        if (!eh_posicao_livre(posicao.linha, posicao.coluna, tabuleiro) &&
        eh_rei(coletar_peca(posicao.linha, posicao.coluna, tabuleiro)) &&
        cor_jogador == coletar_peca(posicao.linha, posicao.coluna, tabuleiro).cor) {
            return eh_posicao_controlada(posicao.linha, posicao.coluna, cor_jogador, tabuleiro);
        }
    }
    return false
}


function mover_peca(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    let peca = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    let posicao_origem = tabuleiro.querySelector(`#${coluna_origem}${linha_origem}`)
    let posicao_destino = tabuleiro.querySelector(`#${coluna_destino}${linha_destino}`)
    
    posicao_origem.innerHTML = ''
    posicao_destino.innerHTML = ''
    posicao_destino.appendChild(peca)
}

function volta_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peca_destino, tabuleiro) {
    let posicao_origem = tabuleiro.querySelector(`#${coluna_origem}${linha_origem}`)
    let posicao_destino = tabuleiro.querySelector(`#${coluna_destino}${linha_destino}`)

    posicao_origem.innerHTML = ''
    posicao_destino.innerHTML = ''

    posicao_origem.appendChild(peca_origem)
    if (peca_destino != null) {
        posicao_destino.appendChild(peca_destino)
    }
}

function impede_xeque(linha, coluna, cor_jogador, tabuleiro) {
    let peca_origem = coletar_peca(linha, coluna, tabuleiro)
    for (let posicao_final of tabuleiro.children) {
        if (checa_movimento(linha, coluna, posicao_final.linha, posicao_final.coluna, tabuleiro)) {
            let peca_destino = coletar_peca(posicao_final.linha, posicao_final.coluna, tabuleiro)
            mover_peca(linha, coluna, posicao_final.linha, posicao_final.coluna, tabuleiro)
            if (!eh_xeque(tabuleiro, cor_jogador)) {
                volta_movimento(linha, coluna, posicao_final.linha, posicao_final.coluna, peca_origem, peca_destino, tabuleiro)
                return true
            }
            volta_movimento(linha, coluna, posicao_final.linha, posicao_final.coluna, peca_origem, peca_destino, tabuleiro)
        }
    }
}

function eh_xeque_mate(tabuleiro, cor_jogador) {
    if (eh_xeque(tabuleiro, cor_jogador)) {
        for (let posicao of tabuleiro.children) {
            if (!eh_posicao_livre(posicao.linha, posicao.coluna, tabuleiro) && coletar_peca(posicao.linha, posicao.coluna, tabuleiro).cor == cor_jogador && impede_xeque(posicao.linha, posicao.coluna, cor_jogador, tabuleiro)) {
                return false
            }
        }
        return true
    }
    return false
}

function finalizar_jogada(tabuleiro) {
    tabuleiro.cor_jogador_atual = coletar_cor_oponente(tabuleiro.cor_jogador_atual)
    tabuleiro.qnt_jogadas++
    tabuleiro.posicao_inicial = null
    desmarcar_todas_posicoes(tabuleiro)
}

function realiza_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {

    if (!eh_linha_valida(linha_origem) || !eh_coluna_valida(coluna_origem) || !eh_linha_valida(linha_destino) || !eh_coluna_valida(coluna_destino))
        return false
    
    if (eh_posicao_livre(linha_origem, coluna_origem, tabuleiro) || coletar_peca(linha_origem, coluna_origem, tabuleiro).cor != tabuleiro.cor_jogador_atual)
        return false

    if (!checa_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro))
        return false
    
    let peca_origem = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    let peca_destino = coletar_peca(linha_destino, coluna_destino, tabuleiro)

    mover_peca(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
    if (eh_xeque(tabuleiro, tabuleiro.cor_jogador_atual)) {
        volta_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peca_destino, tabuleiro)
        return false
    }

    finalizar_jogada(tabuleiro)
    return true
}