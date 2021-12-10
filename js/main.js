
document.addEventListener("DOMContentLoaded", () => {
    let tabuleiro = criar_tabuleiro()
    document.querySelector('body').appendChild(tabuleiro)
    let bispo = criar_bispo(COR_BRANCA)
    bispo.className += " responsive-img"
    tabuleiro.querySelector("#A8").appendChild(bispo)
})