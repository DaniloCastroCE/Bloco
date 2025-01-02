document.querySelector('#sair').removeEventListener('click', (e) => {})
document.querySelector('#sair').addEventListener('click', () => {
    //alert("Deslogando (Saindo)")

    abrirModal()
    const titulo = document.querySelector('#tituloModal')
    const conteudo = document.querySelector('#conteudo-modal')

    titulo.textContent = 'SAIR'

    conteudo.innerHTML = `
        <div class="box-sair">
            <h2>Tem certeza que deseja sair?</h2>
            <div>
                <button onclick="sair()">SIM</button>
                <button onclick="fecharModal()">NÃO</button>
            </div>
        </div>    
    `

    //
})

const sair = () => {
    window.location.href = "/logout"
}

var usuario

let grupoPadrao = ["atendimento", "outras ocorrências"]
let padrao = [
    {
        scripts: [
            {
                key: "CONFIRMADO",
                script: "Dados confirmados com sucesso.",
                grupo: "atendimento",
            },
            {
                key: "DESCE",
                script: "Contato desce para receber.",
                grupo: "atendimento",
            },
            {
                key: "ACESSO LIBERADO",
                script: "Acesso liberado pelo contato.",
                grupo: "atendimento",
            },
            {
                key: "DISPENSA",
                script: "Não precisou do auxílio da portaria.",
                grupo: "atendimento",
            },
            {
                key: "LIG. ENCERRADA",
                script: "Ligação encerrada por falta de comunicação.",
                grupo: "atendimento",
            },
            {
                key: "SEM CÂMERA",
                script: "Atendimento sem o auxílio adequado das imagens das câmeras.",
                grupo: "atendimento",
            },
            {
                key: "NÃO ATENDEU",
                script: "Não foi atendido: Interfone da unidade, ",
                grupo: "atendimento",
            },

        ],
        nome: "A - Atendimento",
    },
    {
        scripts: [
            {
                key: "PORTÃO ABERTO",
                script: "Aparentemente, o portão encontra-se fechado nas imagens ao vivo, não é possível identificar portões abertos.",
                grupo: "outras ocorrências",
            },
            {
                key: "ELEVADOR",
                script: "Elevador livre nas imagens ao vivo.",
                grupo: "outras ocorrências",
            },
            {
                key: "CARONA",
                script: "Falso negativo. Não houve acesso carona. Contagem errada.",
                grupo: "outras ocorrências",
            },
            {
                key: "PÂNICO",
                script: "Na análise dos vídeos não é possível identificar alteração no local, aparentemente tudo bem e sem alteração.",
                grupo: "outras ocorrências",
            },
            {
                key: "SEM GRAVAÇÃO",
                script: "Gravações não processadas ou indisponível para visualização, aparentemente tudo normal nas imagens ao vivo.",
                grupo: "outras ocorrências",
            },
            {
                key: "ALARME",
                script: "Na análise das imagens ao vivo, não foram identificadas situação preocupantes no condomínio.",
                grupo: "outras ocorrências",
            },
        ],
        nome: "B - Outras Ocorrências",
    },
    {
        scripts: [
            {
                key: "",
                script: "",
                grupo: "",
            },
        ],
        nome: "A + B - Atendimento com Outras Ocorrências ",
    },

    {
        scripts: [
            {
                key: "",
                script: "",
                grupo: "",
            },
        ],
        nome: "Vazio",
    },
]

padrao[2].scripts = padrao[0].scripts.concat(padrao[1].scripts)

const checkPadrao = (idBox) => {
    const box = document.querySelector(`#${idBox}`)
    if(usuario.config.scripts.length === 0){
        box.innerHTML = `
            <div class="boxPadrao" id="boxPadrao">
                <label for="selectPadrao">Escolha os textos padrões </label>
                <select id="selectPadrao" onchange="onchangeSelectPadrao(event)"></select>
                <button type"button" class="custom-button" onclick="buttonPadrao()">Criar</button>
                <div class="checkboxs">
                    <label class="checkbox-container">
                        <input type="checkbox" id="addGrupoPadrao" checked />
                        <span class="custom-checkbox"></span>
                        <span class="checkbox-label">Organizar em grupos</span>
                    </label>
                </div>
            </div>
                
            <div id="listPadrao"></div>
        `
        const selectPadrao = document.querySelector(`#selectPadrao`)

        padrao.forEach((el, index) => {
            let nome
            if(el.nome.length > 15){
                nome = `${el.nome.substring(0,15)}...`
            }else {
                nome = el.nome
            }
            if(index === 2 && el.scripts.length > 0){
                selectPadrao.innerHTML += `
                    <option value="${index}" selected>${nome.toLocaleUpperCase()}</option>
                `
            }else if(el.scripts.length > 0){
                selectPadrao.innerHTML += `
                    <option value="${index}">${nome.toLocaleUpperCase()}</option>
                `
            }
        })

        addlistPadrao()
    }
}

const buttonPadrao = (event) => {
    const valor = document.querySelector(`#selectPadrao`).value
    usuario.config.scripts = padrao[valor].scripts
    if(document.querySelector("#addGrupoPadrao").checked){
        usuario.config.grupos = grupoPadrao
    }else if(usuario.config.grupos.length === grupoPadrao.length && usuario.config.grupos.every((el, i) => el === grupoPadrao[i])){
        usuario.config.grupos = []
    }


    init("boxBloco", usuario.config.scripts)
    atualizarConfig()
}

const onchangeSelectPadrao = (event) => {
    addlistPadrao(event.target.value)
}


const addlistPadrao = (valor) => {
    if(!valor){
        valor = document.querySelector(`#selectPadrao`).value
    }

    try {
        const listPadrao = document.querySelector('#listPadrao')
        listPadrao.innerHTML = `<h2 id="ttListPadrao">${padrao[valor].nome}</h2>`
        padrao[valor].scripts.forEach(el => {
            listPadrao.innerHTML += `
                <table>
                    <tr>
                        <td>Key:</td><td>${el.key}</td>
                    </tr>
                    <tr>
                        <td>Grupo:</td><td>${(el.grupo) ? el.grupo : "Sem Grupo"}</td>
                    </tr>
                    <tr style="margin-bottom: 10px;">
                        <td>Script:</td><td class="tdScript">${el.script}</td>
                    </tr>
                </table>
            `
        })
    } catch (err) {
        console.error("ERROR:\n", err)
        document.querySelector('#boxBloco').innerHTML = ''
    }
  
}

const getUser = async () => {
    fetch("/getUser")
        .then(resp => resp.json())
        .then((data) => {
            const nomeCliente = (data.nome.length > 20) ? `${data.nome.substring(0,20)}...` : data.nome
            document.title = `${data.nome.toUpperCase()}`
            document.querySelector('#meuNome').textContent = nomeCliente.toUpperCase()
            //alert(`Olá ${data.nome}, seja bem-vindo`)
            usuario = data
            if (usuario.config.scripts === undefined) {
                usuario.config.scripts = []
                //console.log("'usuario.config.scripts' === undefined")
            }
            //!usuario.config.hasOwnProperty('grupos')
            if (!("grupos" in usuario.config)) {
                Object.assign(usuario.config, { grupos: [] })
                console.log('Criando um array de grupos')
                atualizarConfig()
            }

            if (!("rascunho" in usuario.config)) {
                Object.assign(usuario.config, { rascunho: { hidden: false, texto: "" } })
                atualizarConfig()
                console.log('Criado um rascunho ', usuario.config.rascunho)
            }

            if (!("draggable" in usuario.config)) {
                Object.assign(usuario.config, { draggable: true })
            }

            if(!("widthBloco" in usuario.config)) {
                Object.assign(usuario.config, { widthBloco: "100" })
            }
            alterarWidthBoxBloco(usuario.config.widthBloco)

            init("boxBloco", usuario.config.scripts)
            controleCores()

        }).finally(() => {
            if (usuario.config.hidden === "esconder") {
                toggleHidden()
            }
            console.log({ msg: "Sistema iniciado", obj: usuario })
        })
}
getUser()

const init = (idBox, scripts) => {
    const box = document.querySelector(`#${idBox}`)
    box.innerHTML = ""
    try {
        let numId = 0
        if (usuario.config.grupos !== undefined && usuario.config.grupos.length > 0) {
            
            usuario.config.grupos.forEach((el, index) => {
                let nomeSimples = el.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/g, "");
                box.innerHTML += `
                <fieldset class="grupo" id="grupo${nomeSimples}" style="display:none;">
                    <legend>${el.toUpperCase()}</legend>
                    <div id="boxGrupo${nomeSimples}"></div>
                </fieldset>
               `
            })

            usuario.config.scripts.forEach(el => {
                const nomeGrupo = usuario.config.grupos.find(nome => nome === el.grupo)
                
                if (!nomeGrupo || el.grupo === '') {
                    numId = addKeyScriptMult([el], box, numId)
                } else {
                    let nomeSimples = nomeGrupo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/g, "");
                    const fildGrup = document.querySelector(`#grupo${nomeSimples}`)
                    const divBox = document.querySelector(`#boxGrupo${nomeSimples}`)
                    numId = addKeyScriptMult([el], divBox, numId);
                    fildGrup.style = 'display: block;'
                }
            })

        } else {
            numId = addKeyScriptMult(usuario.config.scripts, box, numId)
        }

        if (usuario.config.hidden === "btn") {
            toggleHidden("init")
        }

        box.innerHTML += `
            <div class="boxRascunho">
                <textarea class="rascunho" id="rascunho" placeholder="Escreva o seu rascunho aqui">${usuario.config.rascunho.texto}</textarea>
            </div>
        `
        if (!usuario.config.rascunho.hidden) {
            onclickRascunho(true)
        }

        document.querySelector('#rascunho').removeEventListener('change', (e) => {})
        document.querySelector('#rascunho').addEventListener('change', (event) => {
            usuario.config.rascunho.texto = event.target.value
            atualizarConfig()
        })

        eventosDragDrog(box)
        checkPadrao(idBox)


    } catch (err) {
        console.error('Erro no init\nError:', err)
    }
}

const removerEventos = (box) => {
    try{
        box.removeEventListener('dragstart', (e) => {})
        box.removeEventListener('dragend', (e) => {})
        box.removeEventListener('dragover', (e) => {})
        box.removeEventListener('drop', (e) => {})

    }catch (err) {
        console.error("Errou: ", err)
    }
}

const eventosDragDrog = (box) => {
    removerEventos(box)
    let itemSelecionado
    // os dragging

    box.addEventListener('dragstart', (e) => {
        itemSelecionado = e.target
        //console.log('dragstart', e)
    })
    ''
    box.addEventListener('dragend', (e) => {
        //console.log('dragend', e)
        itemSelecionado = null
    })

    box.addEventListener('dragover', (e) => {
        e.preventDefault()
        //console.log('dragover', e)
    })

    box.addEventListener('drop', (e) => {
        e.preventDefault();
        //console.log('drop', { e: e, item: itemSelecionado });

        if (!itemSelecionado) return;

        // Identifica o alvo do drop (se dentro de um grupo ou fora)
        const targetGroup = e.target.closest('.grupo'); // Verifica se está dentro de um grupo
        const targetBox = e.target.closest('.boxCopyScript'); // Verifica o elemento alvo do drop

        if (targetGroup) {
            // Movimento dentro de um grupo
            const groupContainer = targetGroup.querySelector(`#boxGrupo${targetGroup.id.replace('grupo', '')}`);
            if (groupContainer && groupContainer.contains(itemSelecionado)) {
                // Mover dentro do mesmo grupo
                if (targetBox && groupContainer.contains(targetBox)) {
                    groupContainer.insertBefore(itemSelecionado, targetBox.nextSibling);
                } else {
                    groupContainer.appendChild(itemSelecionado);
                }
            } else {
                console.warn("O elemento pertence a outro grupo e não pode ser movido para este.");
                alert("O elemento pertence a outro grupo e não pode ser movido para este.")
            }
        } else {
            // Movimento fora dos grupos
            if (targetBox && box.contains(targetBox)) {
                box.insertBefore(itemSelecionado, targetBox.nextSibling); // Insere no nível principal
            } else {
                box.appendChild(itemSelecionado); // Adiciona no final do nível principal
            }
        }
        reordenarIdsEArray(box)
        itemSelecionado = null; // Reseta a referência
    });
}

const reordenarIdsEArray = (box) => {
    const allScripts = Array.from(box.querySelectorAll('.boxCopyScript'));

    // Atualiza os IDs e organiza o array `usuario.config.scripts`
    usuario.config.scripts = []; // Limpa o array para reconstruí-lo na nova ordem

    allScripts.forEach((scriptElement, index) => {
        const newId = `boxCopyScript${index}`;
        const textarea = scriptElement.querySelector('.script');
        const scriptValue = textarea.value.trim();

        // Atualiza o ID do elemento
        scriptElement.id = newId;

        // Atualiza o botão de copiar e eventos relacionados ao novo ID
        const copyButton = scriptElement.querySelector('.copy');
        copyButton.setAttribute('id', `copy${index}`);
        copyButton.setAttribute('onclick', `clickCopy(${index})`);

        // Atualiza o evento de mudança do textarea
        textarea.setAttribute('id', `script${index}`);
        textarea.setAttribute('onchange', `onChangeScript(${index})`);

        // Adiciona o script ao array na nova ordem
        //onChangeScript(index)
        let grupo = scriptElement.closest('.grupo')?.querySelector('legend')?.innerText || ''
        let novoUsuario = tratarScript(scriptValue, grupo)

        Object.assign(novoUsuario, { grupo: grupo.toLowerCase() })
        usuario.config.scripts.push(novoUsuario);

    });
    atualizarConfig()
    
};

const addKeyScriptMult = (array, divBox, numId) => {
    if (array !== undefined) {
        array.forEach((el, index) => {
            const key = (el.key.length > 0) ? `[${el.key.trim()}]` : ""
            let cod = ''
            const script = (key !== "") ? `${key} ${el.script}` : el.script
            cod += `
                <div class="boxCopyScript" id="boxCopyScript${numId}">
                    <button 
                        class="copy" 
                        id="copy${numId}"
                        onclick="clickCopy(${numId})"
                        >COPIAR</button>
                    <textarea 
                        class="script" 
                        id="script${numId}"
                        onchange="onChangeScript(${numId})"
                        placeholder="Digite o seu texto padrão (script)"
                        >${script}</textarea>
                    <div class="opcoes">
                        <svg onclick="clickOpcoes(${numId})"
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 -960 960 960" 
                        width="24px" 
                        fill="#e8eaed">
                            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                        </svg>
                    </div>
                </div>
            `
            divBox.innerHTML += cod

            addDraggable(usuario.config.draggable)

            numId++
        });
    }
    return numId
}

const addDraggable = (hidden) => {
    const boxCopyScriptAll = document.querySelectorAll(`.boxCopyScript`)

    boxCopyScriptAll.forEach(el => {
        if (hidden) {
            el.setAttribute('draggable', true)
        } else {
            el.setAttribute('draggable', false)
        }
    })
}

const onChangeScript = (numId) => {
    const texto = document.querySelector(`#script${numId}`)
    usuario.config.scripts[numId] = tratarScript(texto.value, usuario.config.scripts[numId].grupo)
    const key = usuario.config.scripts[numId].key
    const script = usuario.config.scripts[numId].script
    texto.value = (key.length > 0) ? `[${key}] ${script}` : script
    //attScripts("att")
    atualizarConfig()
}

const clickCopy = (numId) => {
    const textarea = document.querySelector(`#script${numId}`)

    try {
        navigator.clipboard.writeText(usuario.config.scripts[numId].script)
            .then(() => {
                //console.log(`Copiado: ${usuario.config.scripts[numId].script}`)
                //console.log(usuario)
                //textarea.select()
                const corFundo = textarea.style.backgroundColor
                const corLetra = textarea.style.color

                const estilo = window.getComputedStyle(textarea)
                if (textarea.display !== 'none' && 1 > 2) {
                    textarea.style.backgroundColor = 'lightblue'
                    textarea.style.color = 'black'

                    setTimeout(() => {
                        textarea.style.backgroundColor = corFundo
                        textarea.style.color = corLetra
                    }, 500)
                }

            }).catch((err) => {
                alert('Erro ao copiar script')
                //console.log('Erro ao copiar script\nErro: ', err)
            })
    } catch (error) {
        console.error("Erro no navigator\nErro: ", error)
        const texto = textarea.value
        const matches = texto.match(/\]/g);

        if (matches) {
            let lastBracketPosition = texto.lastIndexOf(']') + 1
            if (texto[lastBracketPosition] === " ") {
                lastBracketPosition += 1
            }
            textarea.select();
            textarea.setSelectionRange(lastBracketPosition, 99999)
            document.execCommand('copy')

        } else {
            textarea.select();
            textarea.setSelectionRange(0, 99999)
            document.execCommand('copy')
        }

    }

}

const tratarScript = (script, grupo) => {
    const regex = /\[([^\]]+)]\s*(.+)/;
    // Detalhamento da expressão regular:
    // 1. /\[([^\]]+)]\s*(.+)/
    //    a. `\[`: Procura por um colchete de abertura "[" literal. O colchete precisa ser escapado (\) porque é um caractere especial em expressões regulares.
    //    b. `([^\]]+)`: Captura qualquer texto dentro dos colchetes até encontrar o colchete de fechamento "]".
    //       - `[^\]]`: Conjunto negado. Captura qualquer caractere que **não seja** o colchete de fechamento (`]`).
    //       - `+`: Indica "uma ou mais ocorrências" de caracteres não colchetes.
    //    c. `]`: Procura por um colchete de fechamento "]" literal.
    //    d. `\s*`: Ignora qualquer quantidade (inclusive nenhuma) de espaços em branco após o colchete de fechamento.
    //       - `\s`: Representa qualquer espaço em branco (espaço, tab, etc.).
    //       - `*`: Zero ou mais ocorrências.
    //    e. `(.+)`: Captura qualquer texto restante após os espaços.
    //       - `.`: Representa qualquer caractere (exceto quebras de linha).
    //       - `+`: Indica "uma ou mais ocorrências".
    const resultado = script.match(regex)

    if (resultado) {
        return {
            key: resultado[1],
            script: resultado[2],
            grupo: (grupo) ? grupo : ""
        }
    } else {
        return {
            key: "",
            script: script,
            grupo: (grupo) ? grupo : ""

        }
    }
}

const clickOpcoes = (numId) => {
    abrirModal()
    let script = {
        key: usuario.config.scripts[numId].key,
        script: usuario.config.scripts[numId].script
    }

    const titulo = document.querySelector('#tituloModal')
    const conteudo = document.querySelector('#conteudo-modal')
    conteudo.innerHTML = ''

    let cod = ''

    cod += addInputTextareaConteudo()
    cod += `<button type="button" class="conteudoButton" id="conteudoButtonDel" onclick="( function () {fecharModal(), rmvScripts(${numId})})();">Excluir</button>`

    titulo.textContent = `Script ${numId + 1}`
    conteudo.innerHTML = cod

    try {
        const select = document.querySelector('#selectGrupo')

        select.innerHTML += `<option id="semGrupo" value="sem grupo">Sem Grupo</option>`

        usuario.config.grupos.forEach(el => {
            if (usuario.config.scripts[numId].grupo === el) {
                select.innerHTML += `<option selected value="${el}">${el.toUpperCase()}</option>`
            } else {
                select.innerHTML += `<option value="${el}">${el.toUpperCase()}</option>`
            }
        })

    } catch (error) {
        console.error(error)
    }

    const inputKey = document.querySelector('#conteudoKey')
    const inputScript = document.querySelector('#conteudoScript')
    const selectGrupo = document.querySelector('#selectGrupo')

    inputKey.value = script.key
    inputScript.value = script.script

    inputKey.removeEventListener('change', (e) => {})
    inputKey.addEventListener('change', (event) => {
        script.key = event.target.value
        if (event.target.value.length > 0) {
            document.querySelector(`#script${numId}`).value = `[${script.key}] ${script.script}`
        } else {
            document.querySelector(`#script${numId}`).value = script.script
        }
        onChangeScript(numId)

        const textarea = document.querySelector(`#script${numId}`)
        const copy = document.querySelector(`#copy${numId}`)
        mudarTextCopy(textarea.classList.contains("esconder"), copy, numId)
    })

    inputScript.removeEventListener('change', (e) => {})
    inputScript.addEventListener('change', (event) => {
        script.script = event.target.value
        if (script.key) {
            document.querySelector(`#script${numId}`).value = `[${script.key}] ${script.script}`
        } else {
            document.querySelector(`#script${numId}`).value = script.script
        }
        onChangeScript(numId)
    })

    selectGrupo.removeEventListener('change', (e) => {})
    selectGrupo.addEventListener('change', (event) => {
        if (event.target.value !== 'sem grupo') {
            usuario.config.scripts[numId].grupo = event.target.value
        } else {
            usuario.config.scripts[numId].grupo = ""
        }
        init("boxBloco", usuario.config.scripts)
        atualizarConfig()
    })
}

const addInputTextareaConteudo = () => {
    return `
        <table class="box-itensConteudo">
            <tr>
                <td>
                    <label for="conteudoKey">Key:</label> 
                </td>
                <td>
                    <input type="text" name="key" id="conteudoKey" placeholder="Digite uma palavra chave">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="conteudoScript">Script:</label>
                </td>
                <td>
                    <textarea name="script" id="conteudoScript" placeholder="Digite seu script"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="conteudoGrupos">Grupo:</label>
                </td>
                <td>
                    <select id="selectGrupo">
                    </select>
                </td>
            </tr>
        </table>

        <button type="button" class="conteudoButton" id="conteudoButton" onclick="fecharModal()">OK</button>
    `
}


const config = () => {
    abrirModal()
    const titulo = document.querySelector('#tituloModal')
    const conteudo = document.querySelector('#conteudo-modal')
    titulo.textContent = 'Configuração'
    abas('#conteudo-modal')
}

const addScript = (alerta) => {
    if (alerta) {
        if (!confirm('Clique em OK para confirmar a adição de um script')) {
            return
        }
    }

    usuario.config.scripts.push({
        key: "",
        script: "",
        grupo: ""
    })

    init("boxBloco", usuario.config.scripts)

    clickOpcoes(usuario.config.scripts.length - 1)
}

const rmvScripts = async (id) => {
    if (confirm('Clique em OK para deletar o script'))
        usuario.config.scripts.splice(id, 1)
    init("boxBloco", usuario.config.scripts)
    atualizarConfig()
}

const atualizarConfig = async () => {
    const resp = await fetch("/attConfig",
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: usuario.email,
                valor: usuario.config
            })
        })
    //console.log({ msg: "(atualizarConfig) - Variavel config atualizada", obj: usuario })
}

const toggleHidden = (op) => {
    const boxCopyScript = document.getElementsByClassName('boxCopyScript')
    //const copy = document.getElementsByClassName('copy')
    const script = document.getElementsByClassName('script')
    const opcoes = document.getElementsByClassName('opcoes')

    for (let i = 0; i < script.length; i++) {
        script[i].classList.toggle('esconder')
        opcoes[i].classList.toggle('esconder')
        boxCopyScript[i].classList.toggle('lado-a-lado')
    }

    Array.from(script).forEach(el => {
        const index = Number(el.id.slice(6))
        const btn = document.querySelector(`#copy${index}`)
        mudarTextCopy(el.classList.contains('esconder'), btn, index)
    })

    if (op !== "init" || !op) {
        if (!usuario.config.hidden) {
            usuario.config.hidden = "btn"
        }

        if (usuario.config.hidden === "btn") {
            usuario.config.hidden = "btn+all"
        } else if (usuario.config.hidden === "btn+all") {
            usuario.config.hidden = "btn"
        }
        atualizarConfig()
    }
    svgVisivel(usuario.config.hidden)

}

const svgVisivel = (op) => {
    const pathVisivel = document.querySelector('#pathVisivel')
    const on = "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"
    const off = "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"

    if (op === "btn+all") {
        pathVisivel.setAttribute("d", on)
    } else {
        pathVisivel.setAttribute("d", off)
    }
}

const mudarTextCopy = (modificar, btn, i) => {
    if (modificar) {
        const key = usuario.config.scripts[i].key
        btn.textContent = (key !== "") ? key : `COPIAR ${(i + 1).toString().padStart(2, "0")}`
    } else {
        btn.textContent = "COPIAR"
    }
}

const abas = (idBox) => {

    const box = document.querySelector(`${idBox}`)

    box.innerHTML = `
        <div class="boxAbas">
            <div class="boxButtons">
                <div class="buttonsAbas buttonAbaAtiva" onclick="clickAbas(event, 'aba1')">CORES</div>
                <div class="buttonsAbas" onclick="clickAbas(event, 'aba2')">GRUPOS</div>
                <div class="buttonsAbas" onclick="clickAbas(event, 'aba3')">POSIÇÃO</div>
            </div>
            <div class="conteudoAbas showAba" id="aba1">

                <h3 class="tdTitulo">Menu</h3>
                <table>
                    <tr>
                        <td>
                            <label for="corMenufundo">Escolha uma cor para fundo:</label>
                        </td>
                        <td>
                            <input type="color" id="corMenufundo" value="${usuario.config.cores.menu.fundo}" onchange="changeCores(event)">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="corBGletra">Escolha uma cor para letras:</label>
                        </td>
                        <td>
                            <input type="color" id="corMenuletra" value="${usuario.config.cores.menu.letra}" onchange="changeCores(event)">
                        </td>
                    </tr>
                </table>

                <h3 class="tdTitulo">Plano de Fundo</h3>
                <table>
                    <tr>
                        <td>
                            <label for="corBGfundo">Escolha uma cor para fundo:</label>
                        </td>
                        <td>
                            <input type="color" id="corBGfundo" value="${usuario.config.cores.body.fundo}" onchange="changeCores(event)">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="corBGletra">Escolha uma cor para letras:</label>
                        </td>
                        <td>
                            <input type="color" id="corBGletra" value="${usuario.config.cores.body.letra}" onchange="changeCores(event)">
                        </td>
                    </tr>
                </table>
            </div>
            <div class="conteudoAbas" id="aba2">
                <h3 class="tdTitulo">Criar Grupo</h3>
                <table>
                    <tr>
                        <td>
                            <input class="inpListGrup" type="text" id="inpCreatGrups" placeholder="Digite o nome do grupo">
                        </td>
                        <td>
                            <button id="btnCreatGrups" onclick="onClickGrups()">CRIAR</button>
                        </td>
                    </tr>
                </table>
                <h3 class="tdTitulo">Lista de Grupos</h3>
                <table id="tableListGrups"></table>
            </div>
            <div class="conteudoAbas" id="aba3">
                <h3 class="tdTitulo">Tamanho do box dos Scripts</h3>
                <div class="boxRange">
                    <span></span>
                    <div class="rangeValor">
                        <input id="range" type="range" max="100" min="20" value="100" step="1" onchange="getRange(this)" onmousedown="mouseDown(this)" onmouseup="mouseUp(this)" oninput="inputRange(this)"/>
                        <input id="valor" type="number" max="100" min="20 value="100" onchange="changeRangePorcentagem(this)"><span>%</span>
                    </div>
                </div>
            </div>
        </div>
    `
    attNomeListGrup()

    const range = document.querySelector('#range')
    range.value = usuario.config.widthBloco
    document.querySelector('#valor').value = range.value
}

const getRange = (range) => {
    const valorPorcentagem = document.querySelector('#valor')
    valorPorcentagem.value = range.value
    alterarWidthBoxBloco(range.value)
}

const changeRangePorcentagem = (input) => {
    const range = document.querySelector('#range')
    if(input.value < 20){
        input.value = 20
        range.value = 20
    }else if(input.value > 100){
        input.value = 100
        range.value = 100
    }else {
        range.value = input.value
    }
    alterarWidthBoxBloco(input.value)
}

const alterarWidthBoxBloco = (valor) => {
    const boxBloco = document.querySelector('#boxBloco')
    boxBloco.style.width = `${valor}%`;
    usuario.config.widthBloco = valor
    atualizarConfig()
}

const inputRange = (range) => {
    const boxBloco = document.querySelector('#boxBloco')
    boxBloco.style.width = `${range.value}%`
    const valorPorcentagem = document.querySelector('#valor')
    valorPorcentagem.value = range.value
}

const mouseDown = (obj) => {
    document.querySelector('#tituloModal').style.background = 'none'
    document.querySelector('#boxConteudoModal').style.backgroundColor = 'rgba(255,255,255,0.1)'
    const buttonsAbasAll = document.querySelectorAll('.buttonsAbas')
    
    const boxBloco = document.querySelector('#boxBloco')
    const root = document.documentElement
    const corLetra = getComputedStyle(root).getPropertyValue('--corLetra').trim();
    boxBloco.style.border = `1px solid ${corLetra}`
    
    buttonsAbasAll.forEach(el => {
        el.style.background = 'none'
    })
}

const mouseUp = (obj) => {
    document.querySelector('#tituloModal').style.backgroundColor = '#2d4b7b'
    document.querySelector('#boxConteudoModal').style.backgroundColor = 'white'

    const boxBloco = document.querySelector('#boxBloco')
    boxBloco.style.border = 'none'

    const buttonsAbasAll = document.querySelectorAll('.buttonsAbas')    
    buttonsAbasAll.forEach(el => {
        el.style.background = '#f1f1f1'
    })
    
}

const attNomeListGrup = () => {
    const tableListGrups = document.querySelector('#tableListGrups')
    tableListGrups.innerHTML = ''
    for (let i = 0; i < usuario.config.grupos.length; i++) {
        tableListGrups.innerHTML += `
            <tr>
                <td>
                    <b>Nome:</b>
                </td>
                <td>
                    <input class="inpListGrup" type="text" value="${usuario.config.grupos[i].trim().toUpperCase()}" onchange="mudarNomeGrupo(event,${i})">
                </td>
            </tr>
        `
    }
}

const compararNomeGrupo = (str) => {
    let compare =  false
    const nomeSimples = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim()

    usuario.config.grupos.forEach((el, index) => {
        const nomeGrupo = el.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim()
   
        if(nomeGrupo === nomeSimples){
            compare = true
        }
        console.log({str: nomeSimples, grupo: nomeGrupo, compare: compare })
    })
    return compare
}    

const mudarNomeGrupo = (event, i) => {

    console.log(compararNomeGrupo(event.target.value))
    
    if (!event.target.value) {
        usuario.config.grupos.splice(i, 1)
        init("boxBloco", usuario.config.scripts)
        atualizarConfig()
        attNomeListGrup()
    } else if(!( usuario.config.grupos.includes(event.target.value.trim().toLowerCase()) )){
        usuario.config.grupos[i] = event.target.value.trim().toLowerCase()
        init("boxBloco", usuario.config.scripts)
        atualizarConfig()
        attNomeListGrup()
    } else {
        alert(`Já existe o grupo ${event.target.value.toUpperCase()}, escolha outro nome`)
        event.target.value = usuario.config.grupos[i].trim().toUpperCase()
        init("boxBloco", usuario.config.scripts)
    }
}

const clickAbas = (event, aba) => {
    const buttonsAbas = document.querySelectorAll('.buttonsAbas')
    const conteudoAbas = document.querySelectorAll('.conteudoAbas')

    buttonsAbas.forEach(el => {
        el.classList.remove('buttonAbaAtiva')
    })
    event.currentTarget.classList.add('buttonAbaAtiva');

    conteudoAbas.forEach(el => {
        el.style.display = 'none';
    })
    document.querySelector(`#${aba}`).style.display = 'block';
}

const changeCores = (event) => {

    if (event.target.id === 'corMenufundo') {
        usuario.config.cores.menu.fundo = event.target.value
    }

    else if (event.target.id === 'corMenuletra') {
        usuario.config.cores.menu.letra = event.target.value
    }

    else if (event.target.id === 'corBGfundo') {
        usuario.config.cores.body.fundo = event.target.value
    }

    else if (event.target.id === 'corBGletra') {
        usuario.config.cores.body.letra = event.target.value
    }

    atualizarConfig()
    controleCores()
}

const controleCores = () => {
    if (!usuario.config.cores) {
        let cores = {
            body: {
                fundo: '#000000',
                letra: '#ffffff',
            },
            menu: {
                fundo: '#000000',
                letra: '#ffffff',
            },
        }

        Object.assign(usuario.config, { cores: cores })
    }


    document.documentElement.style.setProperty('--corFundo', usuario.config.cores.body.fundo)
    document.documentElement.style.setProperty('--corLetra', usuario.config.cores.body.letra)

    document.documentElement.style.setProperty('--corFundoMenu', usuario.config.cores.menu.fundo)
    document.documentElement.style.setProperty('--corLetraMenu', usuario.config.cores.menu.letra)

    atualizarConfig()
}

const onClickGrups = () => {
    const input = document.querySelector('#inpCreatGrups')
    if (input.value.trim() !== "" && !usuario.config.grupos.includes(input.value.trim().toLowerCase())) {
        const valor = input.value.trim().toLowerCase()
        usuario.config.grupos.push(valor)
        input.value = ""
        atualizarConfig()
        attNomeListGrup()
        init("boxBloco", usuario.config.scripts)
    } else if (usuario.config.grupos.includes(input.value.trim().toLowerCase())) {
        alert('grupo já cadastrado')
        input.value = ""
    } else {
        input.value = ""
    }
}

const onclickRascunho = (init) => {
    const iconRascunho = document.querySelector('#iconRascunho')
    const rascunho = document.querySelector('#rascunho')
    const off = "m622-453-56-56 82-82-57-57-82 82-56-56 195-195q12-12 26.5-17.5T705-840q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L622-453ZM200-200h57l195-195-28-29-29-28-195 195v57ZM792-56 509-338 290-120H120v-169l219-219L56-792l57-57 736 736-57 57Zm-32-648-56-56 56 56Zm-169 56 57 57-57-57ZM424-424l-29-28 57 57-28-29Z"
    const on = "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"

    if (init) {
        iconRascunho.setAttribute('d', off)
        rascunho.style.display = "none"
        return
    }

    if (usuario.config.rascunho.hidden && usuario.config.scripts.length > 0) {
        iconRascunho.setAttribute('d', off)
        rascunho.style.display = "none"
        usuario.config.rascunho.hidden = false
    } else if(usuario.config.scripts.length > 0){
        iconRascunho.setAttribute('d', on)
        rascunho.style.display = "block"
        usuario.config.rascunho.hidden = true
    }
    atualizarConfig()
}
