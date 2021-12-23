
const tabuleiro_movimento_realizado = new CustomEvent("mudanca")
const tabuleiro_promocao_realizada = new CustomEvent("mudanca")

const CLASSE_MARCACAO_POSIC_INICIAL = "posicao-inicial"
const CLASSE_MARCACAO_POSIC_ALCANCAVEL = "posicao-alcancavel"
const CLASSE_MARCACAO_POSIC_HOVER = "posicao-hover"
const PORCENTAGEM_PADDING = 0.1  // Porcentagem decimal do padding das posições 
var padding_atual

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

function redimensionar_tabuleiro(tabuleiro, tamanho) {
    let tamanho_posicao = `${(tamanho / 8) * (1 - PORCENTAGEM_PADDING)}px`
    padding_atual = `${(tamanho / 8) * (PORCENTAGEM_PADDING) / 2}px`

    for (let posicao of tabuleiro.children) {
        posicao.style.width = tamanho_posicao
        posicao.style.height = tamanho_posicao

        if (posicao.className.indexOf(CLASSE_MARCACAO_POSIC_ALCANCAVEL) != -1 || posicao.className.indexOf(CLASSE_MARCACAO_POSIC_HOVER) != -1) {
            posicao.style.borderWidth = padding_atual
        } else {
            posicao.style.padding = padding_atual
        }
    }
}


function criar_tabuleiro(container_pai) {
    let tabuleiro = document.createElement("div")
    inicializar_props_tabuleiro(tabuleiro)

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

            posicao_atual.addEventListener('mouseenter', () => {
                if (posicao_atual.className.indexOf(CLASSE_MARCACAO_POSIC_ALCANCAVEL) != -1) {
                    posicao_atual.style.borderColor = 'blue'
                } else {
                    posicao_atual.style.border = `${padding_atual} solid gray`
                    posicao_atual.style.padding = '0px'
                    posicao_atual.className += ` ${CLASSE_MARCACAO_POSIC_HOVER}`
                }
            })

            posicao_atual.addEventListener('mouseleave', () => {
                if (posicao_atual.className.indexOf(CLASSE_MARCACAO_POSIC_ALCANCAVEL) != -1) {
                    posicao_atual.style.borderColor = 'red'
                } else {
                    
                    posicao_atual.style.padding = padding_atual
                    posicao_atual.style.border= '0px'
                    posicao_atual.className = posicao_atual.className.replace(` ${CLASSE_MARCACAO_POSIC_HOVER}`, '')
                }
            })

            tabuleiro.appendChild(posicao_atual)
        }
    }
    
    colocar_pecas_no_tabuleiro(tabuleiro)
    container_pai.appendChild(tabuleiro)
    redimensionar_tabuleiro(tabuleiro, tabuleiro.offsetWidth)
    return tabuleiro
}

function inicializar_props_tabuleiro(tabuleiro) {
    tabuleiro.className = "tabuleiro"
    tabuleiro.cor_jogador_atual = COR_BRANCA
    tabuleiro.qnt_jogadas = 0
    tabuleiro.posicao_inicial = null
    tabuleiro.em_xeque = false
    tabuleiro.posicao_peao_que_movimentou_duas_para_frente = null
    window.addEventListener('resize', () => {
        redimensionar_tabuleiro(tabuleiro, tabuleiro.offsetWidth)
    })
}

function coletar_posicao(linha, coluna, tabuleiro) {
    return tabuleiro.querySelector(`#${coluna}${linha}`)
}

function eh_posicao_livre(linha, coluna, tabuleiro) {  
    // Verifica se a posição não possui peça (a div de posição não pode ter nada, no caso a peça de img)
    return coletar_posicao(linha, coluna, tabuleiro).childElementCount == 0
}

function colocar_pecas_no_tabuleiro(tabuleiro) {
    for (let coluna = 0; coluna < 8; coluna++) {
        let char_coluna = String.fromCharCode('A'.charCodeAt(0) + coluna)
        coletar_posicao(7, char_coluna, tabuleiro).appendChild(criar_peao(COR_PRETA))
        coletar_posicao(2, char_coluna, tabuleiro).appendChild(criar_peao(COR_BRANCA))
    }

    coletar_posicao(8, "A", tabuleiro).appendChild(criar_torre(COR_PRETA))
    coletar_posicao(8, "B", tabuleiro).appendChild(criar_cavalo(COR_PRETA))
    coletar_posicao(8, "C", tabuleiro).appendChild(criar_bispo(COR_PRETA))
    coletar_posicao(8, "D", tabuleiro).appendChild(criar_dama(COR_PRETA))
    coletar_posicao(8, "E", tabuleiro).appendChild(criar_rei(COR_PRETA))
    coletar_posicao(8, "F", tabuleiro).appendChild(criar_bispo(COR_PRETA))
    coletar_posicao(8, "G", tabuleiro).appendChild(criar_cavalo(COR_PRETA))
    coletar_posicao(8, "H", tabuleiro).appendChild(criar_torre(COR_PRETA))

    coletar_posicao(1, "A", tabuleiro).appendChild(criar_torre(COR_BRANCA))
    coletar_posicao(1, "B", tabuleiro).appendChild(criar_cavalo(COR_BRANCA))
    coletar_posicao(1, "C", tabuleiro).appendChild(criar_bispo(COR_BRANCA))
    coletar_posicao(1, "D", tabuleiro).appendChild(criar_dama(COR_BRANCA))
    coletar_posicao(1, "E", tabuleiro).appendChild(criar_rei(COR_BRANCA))
    coletar_posicao(1, "F", tabuleiro).appendChild(criar_bispo(COR_BRANCA))
    coletar_posicao(1, "G", tabuleiro).appendChild(criar_cavalo(COR_BRANCA))
    coletar_posicao(1, "H", tabuleiro).appendChild(criar_torre(COR_BRANCA))
}

function coletar_peca(linha, coluna, tabuleiro) {
    // Coleta a peça disponível em uma posição do tabuleiro
    // OBS: se for usado com uma posição vazia, ocorrerá um erro
    let posicao = coletar_posicao(linha, coluna, tabuleiro)
    if (posicao.childElementCount == 1)
        return posicao.children[0]
    return null
}

function eh_posicao_livre(linha, coluna, tabuleiro) {  
    // Verifica se a posição não possui peça (a div de posição não pode ter nada, no caso a peça de img)
    return coletar_posicao(linha, coluna, tabuleiro).childElementCount == 0
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
    
    if (eh_posicao_livre(linha_destino, coluna_destino, tabuleiro)) {
        if(eh_movimento_peao_para_diagonal(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
            return false;
        }
        return true;
    }
    
    if (eh_pecas_cores_diferentes(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
        if (eh_movimento_peao_para_frente(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
            return false;
        }
        return true;
    } else {
        return false;
    }
    
}


function verifica_roque(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se o roque pode ocorrer
    let rei = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    if (tabuleiro.em_xeque || !eh_rei(rei) || rei.ja_movimentou)
        return false;
    
    if (linha_origem == 8 && coluna_origem == 'E' && linha_destino == 8) {
        if (coluna_destino == 'G') {
            // Roque menor das pretas
            return !eh_posicao_livre(8, 'H', tabuleiro) && eh_torre(coletar_peca(8, 'H', tabuleiro)) && !coletar_peca(8, 'H', tabuleiro).ja_movimentou && eh_caminho_livre(linha_origem, coluna_origem, 8, 'H', tabuleiro) && !eh_posicao_controlada(8, 'F', tabuleiro.cor_jogador_atual, tabuleiro) && !eh_posicao_controlada(8, 'G', tabuleiro.cor_jogador_atual, tabuleiro)
        }
        else if (coluna_destino == 'C') {
            // Roque maior das pretas
            return !eh_posicao_livre(8, 'A', tabuleiro) && eh_torre(coletar_peca(8, 'A', tabuleiro)) && !coletar_peca(8, 'A', tabuleiro).ja_movimentou && eh_caminho_livre(linha_origem, coluna_origem, 8, 'A', tabuleiro) && !eh_posicao_controlada(8, 'D', tabuleiro.cor_jogador_atual, tabuleiro) && !eh_posicao_controlada(8, 'C', tabuleiro.cor_jogador_atual, tabuleiro)
        }
    }
    else if (linha_origem == 1 && coluna_origem == 'E' && linha_destino == 1) {
        if (coluna_destino == 'G') {
            // Roque menor das brancas
            return !eh_posicao_livre(1, 'H', tabuleiro) && eh_torre(coletar_peca(1, 'H', tabuleiro)) && !coletar_peca(1, 'H', tabuleiro).ja_movimentou && eh_caminho_livre(linha_origem, coluna_origem, 1, 'H', tabuleiro) && !eh_posicao_controlada(1, 'F', tabuleiro.cor_jogador_atual, tabuleiro) && !eh_posicao_controlada(1, 'G', tabuleiro.cor_jogador_atual, tabuleiro)
        } else if (coluna_destino == 'C') {
            // Roque maior das  brancas
            return !eh_posicao_livre(1, 'A', tabuleiro) && eh_torre(coletar_peca(1, 'A', tabuleiro)) && !coletar_peca(1, 'A', tabuleiro).ja_movimentou && eh_caminho_livre(linha_origem, coluna_origem, 1, 'A', tabuleiro) && !eh_posicao_controlada(1, 'D', tabuleiro.cor_jogador_atual, tabuleiro) && !eh_posicao_controlada(1, 'C', tabuleiro.cor_jogador_atual, tabuleiro)
        }
    }
    return false;
}

function realiza_roque(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Realiza o roque (utilizar esse método após verificar se o roque é válido)
    let torre
    let rei = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    mover_peca(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
    rei.ja_movimentou = true

    // Movimentar a torre
    if (linha_origem == 8) {
        if (coluna_destino == 'C') {
            // Roque maior das pretas
            torre = coletar_peca(8, 'A', tabuleiro)
            mover_peca(8, 'A', 8, 'D', tabuleiro)
        } else {
            // Roque menor das pretas
            torre = coletar_peca(8, 'H', tabuleiro)
            mover_peca(8, 'H', 8, 'F', tabuleiro)
        }
    } else {
        if (coluna_destino == 'C') {
            // Roque maior das brancas
            torre = coletar_peca(1, 'A', tabuleiro)
            mover_peca(1, 'A', 1, 'D', tabuleiro)
        } else {
            // Roque menor das brancas
            torre = coletar_peca(1, 'H', tabuleiro)
            mover_peca(1, 'H', 1, 'F', tabuleiro)
        }
    }
    torre.ja_movimentou = true
}


function verifica_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Verifica se a captura en passant é válida
    let peca_origem = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    if (tabuleiro.posicao_peao_que_movimentou_duas_para_frente != null && eh_peao(peca_origem) && linha_origem == tabuleiro.posicao_peao_que_movimentou_duas_para_frente.linha && calcular_deslocamento_horizontal(coluna_origem, tabuleiro.posicao_peao_que_movimentou_duas_para_frente.coluna) == 1) {
        // Peao que irá se movimentar está do lado do peão inimigo que se moveu duas casas. Só falta verificar se o jogador escolheu o movimento de captura en passant e se ele n causa xeque
        let peao_que_moveu_duas_casas = coletar_peca(tabuleiro.posicao_peao_que_movimentou_duas_para_frente.linha, tabuleiro.posicao_peao_que_movimentou_duas_para_frente.coluna, tabuleiro)
        if (coluna_destino == tabuleiro.posicao_peao_que_movimentou_duas_para_frente.coluna && ((peao_que_moveu_duas_casas.cor == COR_BRANCA && linha_destino - linha_origem == -1) || (peao_que_moveu_duas_casas.cor == COR_PRETA && linha_destino - linha_origem == 1))) {
            // Realizar movimento e verificar se causa xeque
            realiza_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
            if (eh_xeque(tabuleiro, tabuleiro.cor_jogador_atual)) {
                volta_movimento_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peao_que_moveu_duas_casas, tabuleiro)
                return false
            }
            volta_movimento_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peao_que_moveu_duas_casas, tabuleiro)
            return true
        }
    }
    return false
}

function volta_movimento_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, peao_ataque, peao_comido, tabuleiro) {
    // Volta a situação inicial antes de ter sido realizado a captura en passant
    let posicao_origem = coletar_posicao(linha_origem, coluna_origem, tabuleiro)
    let posicao_destino = coletar_posicao(linha_destino, coluna_destino, tabuleiro)

    posicao_destino.innerHTML = ''
    posicao_origem.appendChild(peao_ataque)
    tabuleiro.posicao_peao_que_movimentou_duas_para_frente.appendChild(peao_comido)
}

function realiza_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {
    // Realiza a captura en passant 
    let peao_ataque = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    coletar_posicao(linha_origem, coluna_origem, tabuleiro).innerHTML = ''
    coletar_posicao(linha_destino, coluna_destino, tabuleiro).appendChild(peao_ataque)
    tabuleiro.posicao_peao_que_movimentou_duas_para_frente.innerHTML = ''
}

function checa_movimento_especial(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {  // Verifica se um movimento especial pode acontecer (roque e captura em passant)
    return verifica_roque(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) || verifica_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro);
}

function marcar_posicao_inicial(posicao) {
    posicao.className += ` ${CLASSE_MARCACAO_POSIC_INICIAL}`
}

function marcar_posicao_alcancavel(posicao) {
    posicao.style.border = `${padding_atual} solid red`
    posicao.style.padding = '0px'
    posicao.className += ` ${CLASSE_MARCACAO_POSIC_ALCANCAVEL}`
}

function marcar_posicoes_alcancaveis(posicao_inicial, tabuleiro) {
    for (let posicao_final of tabuleiro.children) {
        if (checa_movimento(posicao_inicial.linha, posicao_inicial.coluna, posicao_final.linha, posicao_final.coluna, tabuleiro) || checa_movimento_especial(posicao_inicial.linha, posicao_inicial.coluna, posicao_final.linha, posicao_final.coluna, tabuleiro)) {
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
    if (posicao.className.indexOf(CLASSE_MARCACAO_POSIC_ALCANCAVEL) != -1) {
        posicao.style.padding = padding_atual
        posicao.style.border = '0px'
    }

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
    let posicao_origem = coletar_posicao(linha_origem, coluna_origem, tabuleiro)
    let posicao_destino = coletar_posicao(linha_destino, coluna_destino, tabuleiro)
    
    posicao_origem.innerHTML = ''
    posicao_destino.innerHTML = ''
    posicao_destino.appendChild(peca)
}

function volta_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peca_destino, tabuleiro) {
    let posicao_origem = coletar_posicao(linha_origem, coluna_origem, tabuleiro)
    let posicao_destino = coletar_posicao(linha_destino, coluna_destino, tabuleiro)

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

function finalizar_jogada(tabuleiro, peca_movimentada) {
    tabuleiro.cor_jogador_atual = coletar_cor_oponente(tabuleiro.cor_jogador_atual)
    tabuleiro.qnt_jogadas++
    tabuleiro.posicao_inicial = null
    peca_movimentada.ja_movimentou = true
    tabuleiro.em_xeque = eh_xeque(tabuleiro, tabuleiro.cor_jogador_atual)
    tabuleiro.dispatchEvent(tabuleiro_movimento_realizado)
    if (eh_xeque_mate(tabuleiro, tabuleiro.cor_jogador_atual)) {
        let xeque_mate_event = new CustomEvent("fimdejogo", {
            detail: {"vencedor": coletar_cor_oponente(tabuleiro.cor_jogador_atual),
                     "derrotado": tabuleiro.cor_jogador_atual}
        })
        tabuleiro.dispatchEvent(xeque_mate_event )
    }
    desmarcar_todas_posicoes(tabuleiro)
}

function realiza_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro) {

    if (!eh_linha_valida(linha_origem) || !eh_coluna_valida(coluna_origem) || !eh_linha_valida(linha_destino) || !eh_coluna_valida(coluna_destino))
        return false
    
    if (eh_posicao_livre(linha_origem, coluna_origem, tabuleiro) || coletar_peca(linha_origem, coluna_origem, tabuleiro).cor != tabuleiro.cor_jogador_atual)
        return false
    
    if (verifica_roque(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
        
        realiza_roque(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
        finalizar_jogada(tabuleiro, coletar_peca(linha_destino, coluna_destino, tabuleiro))
        return true
    }

    if (verifica_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)) {
        realiza_captura_en_passant(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
        finalizar_jogada(tabuleiro, coletar_peca(linha_destino, coluna_destino, tabuleiro))
        return true
    }

    if (!checa_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro))
        return false
    
    let peca_origem = coletar_peca(linha_origem, coluna_origem, tabuleiro)
    let peca_destino = coletar_peca(linha_destino, coluna_destino, tabuleiro)

    mover_peca(linha_origem, coluna_origem, linha_destino, coluna_destino, tabuleiro)
    if (eh_xeque(tabuleiro, tabuleiro.cor_jogador_atual)) {
        volta_movimento(linha_origem, coluna_origem, linha_destino, coluna_destino, peca_origem, peca_destino, tabuleiro)
        return false
    }

    if (verifica_promocao(linha_destino, coluna_destino, tabuleiro))
        criar_tela_de_promocao(coletar_posicao(linha_destino, coluna_destino, tabuleiro), tabuleiro.cor_jogador_atual, tabuleiro)

    if (eh_peao(peca_origem) && calcular_deslocamento_vertical(linha_origem, linha_destino) == 2) {
        tabuleiro.posicao_peao_que_movimentou_duas_para_frente = coletar_posicao(linha_destino, coluna_destino, tabuleiro)
    } else {
        tabuleiro.posicao_peao_que_movimentou_duas_para_frente = null
    }
    finalizar_jogada(tabuleiro, peca_origem)
    return true
}


function verifica_promocao(linha_destino, coluna_destino, tabuleiro) {
    // Usar essa função apenas após realizar o movimento em si.
    return (linha_destino == 1 || linha_destino == 8) && eh_peao(coletar_peca(linha_destino, coluna_destino, tabuleiro))
}

function criar_btn_promocao(posicao_peao_promovido, modal, texto_btn, cor_peao, criar_peca, tabuleiro) {
    let btn_promocao = document.createElement('button')
    btn_promocao.innerText = texto_btn
    btn_promocao.className = "btn-promocao"
    btn_promocao.addEventListener('click', () => {
        let peca_promocao = criar_peca(cor_peao)
        posicao_peao_promovido.innerHTML = ''
        posicao_peao_promovido.appendChild(peca_promocao)
        modal.remove()
        tabuleiro.dispatchEvent(tabuleiro_promocao_realizada)
    })
    return btn_promocao
}

function criar_tela_de_promocao(posicao_peao_promovido, cor_peao, tabuleiro) {
    let modal = document.createElement('div')
    modal.className = 'modal'

    let container_btns = document.createElement('div')
    container_btns.className = 'container-promocao'
    modal.appendChild(container_btns)

    let titulo_promocao = document.createElement('h2')
    titulo_promocao.innerText = 'Escolha uma peça para promover o seu peão'
    titulo_promocao.style.textAlign = 'center'
    container_btns.appendChild(titulo_promocao)

    let btn_cavalo = criar_btn_promocao(posicao_peao_promovido, modal, STRING_CAVALO, cor_peao, criar_cavalo, tabuleiro)
    container_btns.appendChild(btn_cavalo)

    let btn_bispo = criar_btn_promocao(posicao_peao_promovido, modal, STRING_BISPO, cor_peao, criar_bispo, tabuleiro)
    container_btns.appendChild(btn_bispo)

    let btn_torre = criar_btn_promocao(posicao_peao_promovido, modal, STRING_TORRE, cor_peao, criar_torre, tabuleiro)
    container_btns.appendChild(btn_torre)

    let btn_dama = criar_btn_promocao(posicao_peao_promovido, modal, STRING_DAMA, cor_peao, criar_dama, tabuleiro)
    container_btns.appendChild(btn_dama)

    document.body.appendChild(modal)
}


function remover_pecas_tabuleiro(tabuleiro) {
    for (let posicao of tabuleiro.children)
        posicao.innerHTML = ''
}

function reiniciar_tabuleiro(tabuleiro) {
    inicializar_props_tabuleiro(tabuleiro)
    remover_pecas_tabuleiro(tabuleiro)
    colocar_pecas_no_tabuleiro(tabuleiro)
}


function coletar_qnt_pecas(tabuleiro, cor) {
    let qnt_pecas = {
        "peao" : 0,
        "cavalo" : 0,
        "bispo" : 0,
        "torre" : 0,
        "dama" : 0
    }
    for (let posicao of tabuleiro.children) {
        if (!eh_posicao_livre(posicao.linha, posicao.coluna, tabuleiro) && coletar_peca(posicao.linha, posicao.coluna, tabuleiro).cor == cor) {
            if (eh_peao(coletar_peca(posicao.linha, posicao.coluna, tabuleiro))) {
                qnt_pecas['peao']++
            } else if (eh_cavalo(coletar_peca(posicao.linha, posicao.coluna, tabuleiro))) {
                qnt_pecas['cavalo']++
            } else if (eh_bispo(coletar_peca(posicao.linha, posicao.coluna, tabuleiro))) {
                qnt_pecas['bispo']++
            } else if (eh_torre(coletar_peca(posicao.linha, posicao.coluna, tabuleiro))) {
                qnt_pecas['torre']++
            } else if (eh_dama(coletar_peca(posicao.linha, posicao.coluna, tabuleiro))) {
                qnt_pecas['dama']++
            }
        }
    }
    return qnt_pecas
}

function coletar_status_tabuleiro(tabuleiro) {
    return {
        "num_jogada" : tabuleiro.qnt_jogadas + 1,
        "cor_jogador_atual" : tabuleiro.cor_jogador_atual,
        "qnt_pecas_brancas" : coletar_qnt_pecas(tabuleiro, COR_BRANCA),
        "qnt_pecas_pretas" : coletar_qnt_pecas(tabuleiro, COR_PRETA)
    }
}