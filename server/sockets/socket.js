const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const usuarios = new Usuarios()
const { crearMensaje } = require('../utils/utilidades')



io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'

            })
        }

        client.join(data.sala)
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        return callback(personas);

    })
    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`))

    })
    client.on('mensajePrivado', (data) => {
        if (!data.mensaje) {
            return {
                error: true,
                mensaje: 'El mensaje es necesario'

            }
        }
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(data.para).emit('crearMensaje', mensaje)



    })


});