const ticketControl = require('../controller/ticket.model');

const ticketController = ticketControl();

//Al llamar a la función asyncrona siguiente() debemos convertir esta tambien para esperar a recibir los datos
const socketController = async (cliente) => {
  let { lastTickets, allTickets, ultimoguardado } =
    await ticketController.getData();

  cliente.on('disconnect', () => {});
  //Cada vez que un cliente se conecta
  //!Emisión 'ultimo-tickets'
  cliente.emit('ultimo-ticket', ultimoguardado);

  //!Emisión 'ultimos-tickets'
  cliente.emit('ultimos-ticket', lastTickets);

  //!Emisión 'tickets-pendientes'
  cliente.emit('tickets-pendientes', allTickets.length);

  //!Escuchamos la emision 'solicitar-ticket' recibimos el escritorio, devolvemos mediante callback un objeto
  cliente.on('solicitar-ticket', async ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio',
      });
    }
    const respuesta = await ticketController.atenderTicket(escritorio);
    //Creamos el ticket
    const ticket = respuesta.ticket;

    //Notificamos que los 4 ultimos cambiaron para actualizar la pantalla publico
    //Añadimos broadcast para que lo reciban las demás pantallas
    cliente.broadcast.emit('ultimos-ticket', respuesta.lastTickets);

    //Notificamos los tickets pendientes a todos y a la pantalla que lo activa
    cliente.emit('tickets-pendientes', respuesta.allTickets.length);
    cliente.broadcast.emit('tickets-pendientes', respuesta.allTickets.length);

    //Cuando no haya más tickets que atender ticket = null
    if (!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendientes',
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });

  //!Escuchamos la emision de 'siguiente-ticket' que emite el front y enviamos un callback con el siguienteTicket
  cliente.on('siguiente-ticket', async (payload, callback) => {
    try {
      const respuesta = await ticketController.siguiente();
      const siguienteTicket = respuesta.ticket;

      //Devolvemos el ticket en la callback para que lo reciba el front
      callback(siguienteTicket);
      //Emitimos los tickets pendientes para que los escuche el escritorio
      cliente.broadcast.emit('tickets-pendientes', respuesta.tickets.length);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { socketController };
