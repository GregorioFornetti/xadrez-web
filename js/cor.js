
const COR_BRANCA = 0
const COR_PRETA = 1
const CORES_EM_STRING = ["branco", "preto"]
const CORES_EM_STRING_PLURAL = ["brancas", "pretas"]

function cor_para_string(cor) {
    return CORES_EM_STRING[cor]
}

function cor_para_string_plural(cor) {
    return CORES_EM_STRING_PLURAL[cor]
}

function verificar_cor_valida(cor) {
    if (cor != COR_BRANCA && cor != COR_PRETA)
        throw new Error("O valor passado não representa uma cor")   
}

function coletar_cor_oponente(corJogador) {
    if (corJogador == COR_BRANCA)
        return COR_PRETA
    else if (corJogador == COR_PRETA)
        return COR_BRANCA
}