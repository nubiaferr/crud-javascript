'use strict'

/* MODEL de teste
const tempClient = {
    nome: "Nubia update",
    email: "nubiaferrsvd@gmail.com",
    celular: "(11) 969447131",
    cidade: "São Paulo - SP"
}
*/

//CRUD
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] 
const setLocalStorage = (db_client) => localStorage.setItem("db_client",JSON.stringify(db_client))
/* O Get cria o database (em formato de array) e lê em JSon, a sintaxe é (key, value).
O Set recebe o objeto e insere no database, em formato de string.
*/

//Create - POST
const createClient = (client) => {
    const db_client = getLocalStorage()
    db_client.push (client) //acrescenta mais clients
    setLocalStorage(db_client)   
}
/* O Create cria o banco de dados, recebe o objeto do template, faz suas conversoes de JSON e armazena e atualiza o localstorage */

//Read - GET
const readClient = () => getLocalStorage()
/* Lê o banco de dados */

//Update - PUT
const updateClient = (index, client) => {
    const db_client = readClient()
    db_client[index] = client
    setLocalStorage(db_client)
}
/* Coloca todos os dados do db numa variavel, substitui um elemento a partir do indice e atualiza */

//Delete - DELETE
const deleteClient = (index) => {
    const db_client = readClient()
    db_client.splice(index, 1)
    setLocalStorage(db_client)
}
/* Coloca todos os dados do db numa variavel, localiza um elemento a partir do indice, joga pra fora do array e atualiza */


//INTERAÇÃO COM O LAYOUT

//Aparece e desaparece o modal de cadastro
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

//Validação de campos
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
/*No HTML, tem o atributo required. Essa função verifica se é true ou false */

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}
/*Seleciona todos os elementos com essa clase e aplica um for pra substituir os valores*/

//Salvar o cadastro
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

//atualizar tela
const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tb_client>tbody').appendChild(newRow)
}
/* Aplico a model no HTML e coloco identificação nos buttons pra capturar evento */

const clearTable = () => {
    const rows = document.querySelectorAll('#tb_client>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
/* Acho todos os elementos da tabela e removo */

const updateTable = () => {
    const db_client = readClient()
    clearTable()
    db_client.forEach(createRow)
}
/* Leio o database, limpo e depois aplico */


const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) =>{
    if (event.target.type == 'button'){

    const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}?`)
            if (response){
                deleteClient(index)
                updateTable()
            }
            
        }
    }
    
}

updateTable()

//Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tb_client>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)