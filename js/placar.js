
function criar_box_pequena(titulo, id) {
    let box = document.createElement('div')
    box.className = 'placar-box-small'

    let box_top = document.createElement('div')
    box_top.className = 'placar-box-top'
    box_top.innerText = titulo

    let box_bottom = document.createElement('div')
    box_bottom.className = 'placar-box-bottom'
    box_bottom.id = id

    box.appendChild(box_top)
    box.appendChild(box_bottom)
    return box
}

function criar_box_peca(src_peca, id) {
    let box_peca = document.createElement('div')
    box_peca.className = 'placar-box-peca'
    
    let img_peca = document.createElement('img')
    img_peca.src = src_peca

    let txt_qnt_peca = document.createElement('div')
    txt_qnt_peca.className = 'placar-texto-qnt-pecas'
    txt_qnt_peca.id = id

    box_peca.appendChild(img_peca)
    box_peca.appendChild(txt_qnt_peca)
    return box_peca
}

function criar_box_pecas(cor) {
    let box = document.createElement('div')
    box.className = 'placar-box-big'

    let box_top = document.createElement('div')
    box_top.className = 'placar-box-top'
    box_top.innerText = `Peças ${cor_para_string_plural(cor)}`

    let box_bottom = document.createElement('div')
    box_bottom.className = 'placar-box-bottom placar-pecas-container'
    if (cor == COR_BRANCA) {
        box_bottom.style.color = 'black'
    }

    box_bottom.appendChild(criar_box_peca(`sprites/peao-${cor_para_string(cor)}.png`, `qnt-peao-${cor_para_string(cor)}`))
    box_bottom.appendChild(criar_box_peca(`sprites/cavalo-${cor_para_string(cor)}.png`, `qnt-cavalo-${cor_para_string(cor)}`))
    box_bottom.appendChild(criar_box_peca(`sprites/bispo-${cor_para_string(cor)}.png`, `qnt-bispo-${cor_para_string(cor)}`))
    box_bottom.appendChild(criar_box_peca(`sprites/torre-${cor_para_string(cor)}.png`, `qnt-torre-${cor_para_string(cor)}`))
    box_bottom.appendChild(criar_box_peca(`sprites/dama-${cor_para_string(cor)}.png`, `qnt-dama-${cor_para_string(cor)}`))

    box.appendChild(box_top)
    box.appendChild(box_bottom)
    return box
}



function criar_placar(container_pai) {
    let placar = document.createElement('div')
    placar.className = 'placar'

    let container_jogada = document.createElement('div')
    container_jogada.className = 'placar-container placar-container-half-left'
    container_jogada.appendChild(criar_box_pequena('jogada n°', 'num_jogada'))

    let container_cor_jogador = document.createElement('div')
    container_cor_jogador.className = 'placar-container placar-container-half-right'
    container_cor_jogador.appendChild(criar_box_pequena('Vez das', 'cor_jogador_atual'))

    let container_pecas_brancas = document.createElement('div')
    container_pecas_brancas.className = 'placar-container placar-container-full'
    container_pecas_brancas.appendChild(criar_box_pecas(COR_BRANCA))

    let container_pecas_pretas = document.createElement('div')
    container_pecas_pretas.className = 'placar-container placar-container-full'
    container_pecas_pretas.appendChild(criar_box_pecas(COR_PRETA))

    placar.appendChild(container_jogada)
    placar.appendChild(container_cor_jogador)
    placar.appendChild(container_pecas_brancas)
    placar.appendChild(container_pecas_pretas)
    
    container_pai.appendChild(placar)
    return placar
}


function atualizar_placar(placar, num_jogada, cor_jogador_atual, qnt_pecas_brancas, qnt_pecas_pretas) {
    placar.querySelector("#num_jogada").innerText = `${num_jogada}`
    placar.querySelector("#cor_jogador_atual").innerText = cor_para_string_plural(cor_jogador_atual)

    for (let peca of ["peao", "cavalo", "bispo", "torre", "dama"]) {
        placar.querySelector(`#qnt-${peca}-branco`).innerText = `${qnt_pecas_brancas[peca]}`
        placar.querySelector(`#qnt-${peca}-preto`).innerText = `${qnt_pecas_pretas[peca]}`
    }
}