
function coletar_src_img_peca(nomePeca, corPeca) {
    if (corPeca == COR_BRANCA)
        return `sprites/${nomePeca}-branco.png`
    return `sprites/${nomePeca}-preto.png`
}

function coluna_para_inteiro(coluna) {
    // Transforma um valor de coluna (deve ser um caractere entre 'A' e 'H') em um inteiro ('A'=1,'B'=2,...,'H'=8)
    return coluna.charCodeAt(0) - 'A'.charCodeAt(0) + 1
}


function criar_peao(cor) {
    let peao = document.createElement("img")
    peao.src = coletar_src_img_peca("peao", cor)
    peao.checaMovimento = (linhaOrigem, colunaOrigem, linhaDestino, colunaDestino) => {
        console.log("OI!")
    }
    return peao
}

function criar_cavalo(cor) {

}

function criar_bispo(cor) {
    let bispo = document.createElement("img")
    bispo.src = coletar_src_img_peca("bispo", cor)
    bispo.checaMovimento = (linha_origem, coluna_origem, linha_destino, coluna_destino) => {
        if (linha_origem == linha_destino && coluna_origem == coluna_destino)
            return false
        
        return Math.abs(linha_origem - linha_destino) == Math.abs(coluna_para_inteiro(coluna_origem.toUpperCase()) - coluna_para_inteiro(coluna_destino.toUpperCase()))
    }
    return bispo
}

function criar_torre(cor) {

}

function criar_dama(cor) {

}

function criar_rei(cor) {

}