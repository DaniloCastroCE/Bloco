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

const getUser = async () => {
    fetch("/getUser")
        .then(resp => resp.json())
        .then((data) => {
            document.title = `${data.nome.toUpperCase()}`
            document.querySelector('#meuNome').textContent = data.nome.toUpperCase()
            //alert(`Olá ${data.nome}, seja bem-vindo`)
            usuario = data
            if (usuario.config.scripts === undefined) {
                usuario.config.scripts = []
                //console.log("'usuario.config.scripts' === undefined")
            }
            init("boxBloco", usuario.config.scripts)
            controleCores()
            controleGrupos()


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
        if(usuario.config.grupos.length > 0 || usuario.config.grupos.length !== undefined){
            usuario.config.grupos.forEach((el, index) => {
                box.innerHTML += `
                <fieldset class="grupo" id="grupo${el.replace(/\s+/g, '')}" style="display:none;">
                    <legend>${el.toUpperCase()}</legend>
                    <div id="boxGrupo${el.replace(/\s+/g, '')}"></div>
                </fieldset>
               `
            })

            usuario.config.scripts.forEach(el => {
                const nomeGrupo = usuario.config.grupos.find(nome => nome === el.grupo)
                if(!nomeGrupo || el.grupo === '') {
                    numId = addKeyScriptMult([el],box, numId)
                }else {
                    const fildGrup = document.querySelector(`#grupo${nomeGrupo.replace(/\s+/g, '')}`)
                    const divBox = document.querySelector(`#boxGrupo${nomeGrupo.replace(/\s+/g, '')}`)
                    numId = addKeyScriptMult([el],divBox, numId);
                    fildGrup.style = 'display: block;'
                }
            })

            
        }else {
            numId = addKeyScriptMult(usuario.config.scripts,box, numId)
        }

        if (usuario.config.hidden === "btn") {
            toggleHidden("init")
        }

    } catch (err) {
        console.error('Erro no init\nError:', err)
    }
}

const addKeyScriptMult = (array, divBox, numId) => {
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
        numId++
        
    });
    return numId
}

const onChangeScript = (numId) => {
    const texto = document.querySelector(`#script${numId}`)
    usuario.config.scripts[numId] = tratarScript(texto.value)
    const key = usuario.config.scripts[numId].key
    const script = usuario.config.scripts[numId].script
    texto.value = (key.length > 0) ? `[${key}] ${script}` : script
    attScripts("att")
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
                if(textarea.display !== 'none' && 1 > 2){
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

const tratarScript = (script) => {
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
            script: resultado[2]
        }
    } else {
        return {
            key: "",
            script: script
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
    cod += `<button type="button" class="conteudoButton" id="conteudoButtonDel" onclick="( function () {fecharModal(), attScripts('rmv', ${numId})})();">Excluir</button>`

    titulo.textContent = `Script ${numId + 1}`
    conteudo.innerHTML = cod

    try {
        const select = document.querySelector('#selectGrupo')

        select.innerHTML += `<option id="semGrupo" value="sem grupo">Sem Grupo</option>`

        usuario.config.grupos.forEach(el => {
            if(usuario.config.scripts[numId].grupo === el){
                select.innerHTML += `<option selected value="${el}">${el.toUpperCase()}</option>`
            }else {
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
    inputScript.addEventListener('change', (event) => {
        script.script = event.target.value
        if (script.key) {
            document.querySelector(`#script${numId}`).value = `[${script.key}] ${script.script}`
        } else {
            document.querySelector(`#script${numId}`).value = script.script
        }
        onChangeScript(numId)
    })
    selectGrupo.addEventListener('change', (event) => {
        if(event.target.value !== 'sem grupo'){
            usuario.config.scripts[numId].grupo = event.target.value
        }else {
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
        script: ""
    })

    init("boxBloco", usuario.config.scripts)

    clickOpcoes(usuario.config.scripts.length - 1)
}

const attScripts = async (op, id) => {

    if (op === 'rmv') {
        if (confirm('Clique em OK para deletar o script'))
            usuario.config.scripts.splice(id, 2)
        init("boxBloco", usuario.config.scripts)
    }

    const resp = await fetch("/attScripts",
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: usuario.email,
                valor: usuario.config.scripts,
            })
        }
    )
    //console.log({ msg: "(attScripts) - Variavel script atualizada", obj: usuario })

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
        btn.textContent = (key !== "") ? key : `COPIAR ${(i+1).toString().padStart(2, "0")}`
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
                <div class="buttonsAbas" onclick="clickAbas(event, 'aba3')">Aba 3</div>
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
                            <input type="text" id="inpCreatGrups" placeholder="Digite o nome do grupo">
                        </td>
                        <td>
                            <button id="btnCreatGrups" onclick="onClickGrups()">criar</button>
                        </td>
                    </tr>
                </table>
                <h3 class="tdTitulo">Lista de Grupos</h3>
                <table id="tableListGrups"></table>
            </div>
            <div class="conteudoAbas" id="aba3">
                <h3 class="tdTitulo">Aba 3</h3>
            </div>
        </div>
    `
    attNomeListGrup()
}

const attNomeListGrup = () => {
    const tableListGrups = document.querySelector('#tableListGrups')
    tableListGrups.innerHTML = ''
    for (let i = 0; i < usuario.config.grupos.length; i++) {
        console.log(usuario.config.grupos[i])
        tableListGrups.innerHTML += `
            <tr>
                <td>
                    <b>Nome:</b>
                </td>
                <td>
                    ${usuario.config.grupos[i]}
                </td>
            </tr>
        `
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
    if(input.value.trim() !== "" && !usuario.config.grupos.includes(input.value.trim().toLowerCase())){
        const valor = input.value.trim().toLowerCase()
        usuario.config.grupos.push(valor)
        input.value = ""
        atualizarConfig()
        attNomeListGrup()
    }else if (usuario.config.grupos.includes(input.value.trim().toLowerCase())){
        alert('grupo já cadastrado')
        input.value = ""
    }else {
        input.value = ""
    }
}

const controleGrupos = () => {
    if(!usuario.config.hasOwnProperty('grupos')){
        Object.assign(usuario.config, { grupos: [] })
        console.log('Criando um array de grupos')
        atualizarConfig()
    }
}
