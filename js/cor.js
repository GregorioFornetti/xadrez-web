
const COR_BRANCA = 0
const COR_PRETA = 1

function verificar_cor_valida(cor) {
    if (cor != COR_BRANCA && cor != COR_PRETA)
        throw new Error("O valor passado não representa uma cor")   
}

function get_cor_oponente(corJogador) {
    if (corJogador == COR_BRANCA)
        return COR_PRETA
    else if (corJogador == COR_PRETA)
        return COR_BRANCA
}