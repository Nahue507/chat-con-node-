var socket = io();
const params = new URLSearchParams(window.location.search);


if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios')

}
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {


    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});




// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


socket.on('listaPersonas', (usuarios) => {

    console.log(usuarios);

});

socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado : ', mensaje);
})