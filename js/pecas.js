const STRING_PEAO = "peao"
const STRING_CAVALO = "cavalo"
const STRING_BISPO = "bispo"
const STRING_TORRE = "torre"
const STRING_DAMA = "dama"
const STRING_REI = "rei"

function inicializar_peca(nomePeca, corPeca) {
    let peca = document.createElement('img')
    peca.cor = corPeca
    peca.draggable = false
    if (corPeca == COR_BRANCA) {
        peca.src = `sprites/${nomePeca}-${cor_para_string(COR_BRANCA)}.png`
        peca.className = `${nomePeca}-${cor_para_string(COR_BRANCA)} responsive-img`
    } else {
        peca.src = `sprites/${nomePeca}-${cor_para_string(COR_PRETA)}.png`
        peca.className = `${nomePeca}-${cor_para_string(COR_PRETA)} responsive-img`
    }
    return peca
}

function coluna_para_inteiro(coluna) {
    // Transforma um valor de coluna (deve ser um caractere entre 'A' e 'H') em um inteiro ('A'=1,'B'=2,...,'H'=8)
    return coluna.charCodeAt(0) - 'A'.charCodeAt(0) + 1
}

/** 
    @param {int} linha_origem - linha origem do movimento (linha onde a peça a ser movimentada está)
    @param {int} linha_destino - linha de destino do movimento (linha onde a peça pretende ir)
*/
function calcular_deslocamento_vertical(linha_origem, linha_destino) {
    return Math.abs(linha_origem - linha_destino)
}

/** 
    @param {char} coluna_origem - coluna origem do movimento (coluna onde a peça a ser movimentada está)
    @param {char} coluna_destino - coluna de destino do movimento (coluna onde a peça pretende ir)
*/
function calcular_deslocamento_horizontal(coluna_origem, coluna_destino) {
    return Math.abs(coluna_para_inteiro(coluna_origem.toUpperCase()) - coluna_para_inteiro(coluna_destino.toUpperCase()))
}

function eh_peao(peca) {
    return peca.className.indexOf(STRING_PEAO) != -1
}

function eh_cavalo(peca) {
    return peca.className.indexOf(STRING_CAVALO) != -1
}

function eh_bispo(peca) {
    return peca.className.indexOf(STRING_BISPO) != -1
}

function eh_torre(peca) {
    return peca.className.indexOf(STRING_TORRE) != -1
}

function eh_dama(peca) {
    return peca.className.indexOf(STRING_DAMA) != -1
}

function eh_rei(peca) {
    return peca.className.indexOf(STRING_REI) != -1
}

function criar_peao(cor) {
    let peao = inicializar_peca(STRING_PEAO, cor)
    peao.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        if (cor == COR_BRANCA) {
            return (linha_origem == 2 && linha_destino == 4 && coluna_origem == coluna_destino) || (linha_origem - linha_destino == -1 && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) <= 1)
        } else {
            return (linha_origem == 7 && linha_destino == 5 && coluna_origem == coluna_destino) || (linha_origem - linha_destino == 1 && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) <= 1)
        }
    }
    return peao
}

function criar_cavalo(cor) {
    let cavalo = inicializar_peca(STRING_CAVALO, cor)
    cavalo.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        let deslocamento_vertical = calcular_deslocamento_vertical(linha_origem, linha_destino)
        let deslocamento_horizontal = calcular_deslocamento_horizontal(coluna_origem, coluna_destino)
        return (deslocamento_vertical == 2 && deslocamento_horizontal == 1) || (deslocamento_vertical == 1 && deslocamento_horizontal == 2)
    }
    return cavalo
}

function criar_bispo(cor) {
    let bispo = inicializar_peca(STRING_BISPO, cor)
    bispo.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        return calcular_deslocamento_vertical(linha_origem, linha_destino) == calcular_deslocamento_horizontal(coluna_origem, coluna_destino)
    }
    return bispo
}

function criar_torre(cor) {
    let torre = inicializar_peca(STRING_TORRE, cor)
    torre.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        return linha_origem == linha_destino || coluna_origem == coluna_destino
    }
    return torre
}

function criar_dama(cor) {
    
    let dama = inicializar_peca(STRING_DAMA, cor)
    dama.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        return (linha_origem == linha_destino || coluna_origem == coluna_destino) || (calcular_deslocamento_vertical(linha_origem, linha_destino) == calcular_deslocamento_horizontal(coluna_origem, coluna_destino))
    }
    return dama
}

function criar_rei(cor) {
    let rei = inicializar_peca(STRING_REI, cor)
    rei.checa_movimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        
        return calcular_deslocamento_vertical(linha_origem, linha_destino) <= 1 && calcular_deslocamento_horizontal(coluna_origem, coluna_destino) <= 1
    }
    return rei
}