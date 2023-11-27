// Se crea el socket del cliente pero como es con ecma6  por eso tiene en la url el .esm.min.js

import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
const socket = io()

const formulario = document.getElementById('formularioChat')
const input = document.getElementById('mensaje')
const lista = document.getElementById('Listamensajes')
console.log("Este es el form",formulario)

// evento de que si se hace un submit en el formulario

formulario.addEventListener('submit', (e) =>{
    e.preventDefault()
    let mensaje
    if (input.value){
        mensaje = input.value
        socket.emit('mensaje Usuario', mensaje)
        // se limpia el input 
        input.value = ''
    }
})


socket.on ('recibir mensaje del server', (arg)=> {
    let nuevoLi = document.createElement('li')
    nuevoLi.textContent = arg
    lista.appendChild(nuevoLi)
})

socket.on ('mensaje Usuario', (arg)=> {
    let nuevoLi = document.createElement('li')
    nuevoLi.textContent = arg
    lista.appendChild(nuevoLi)
})
