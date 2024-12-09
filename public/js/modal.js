function abrirModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'; // Torna o modal visível
    const boxConteudoModal = document.getElementById('boxConteudoModal');
    boxConteudoModal.style.animation = 'slideIn 0.5s forwards'; // Animação de aparecer
}

// Função para fechar o modal com animação
function fecharModal() {
    const modal = document.getElementById('modal');
    const boxConteudoModal = document.getElementById('boxConteudoModal');

    try {
        document.querySelector('#tituloModal').textContent = ''
        document.querySelector('#conteudo-modal').innerHTML = ''
    } catch (err) {
        console.error(err)
    }

    // Aplica a animação de fechamento
    boxConteudoModal.style.animation = 'slideOut 0.5s forwards'; // Animação de desaparecer

    // Espera o tempo da animação e depois esconde o modal completamente
    setTimeout(() => {
        modal.style.display = 'none'; // Esconde o modal após a animação
    }, 500); // Tempo igual à duração da animação
}