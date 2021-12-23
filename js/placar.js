
function criar_placar(container_pai) {
    let placar = document.createElement('div')
    placar.className = 'placar'

    container_pai.appendChild(placar)
    return placar
}