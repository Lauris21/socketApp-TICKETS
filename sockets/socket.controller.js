const ticketControl = require('../controller/ticket.model');

const ticketController = ticketControl();

//Al llamar a la función asyncrona siguiente() debemos convertir esta tambien para esperar a recibir los datos
const socketController = async (cliente) => {
  cliente.on('disconnect', () => {});

  //Escuchamos la emision 'solicitar-ticket' recibimos el escritorio, devolvemos mediante callback un objeto
  cliente.on('solicitar-ticket', async ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio',
      });
    }
    const ticket = await ticketController.atenderTicket(escritorio);
    console.log(ticket);
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

  //Escuchamos la emision de 'siguiente-ticket' que emite el front
  cliente.on('siguiente-ticket', async (payload, callback) => {
    try {
      const siguienteTicket = await ticketController.siguiente();
      console.log(siguienteTicket);
      //Devolvemos el ticket en la callback para que lo reciba el front
      callback(siguienteTicket);
    } catch (error) {}
  });
};

module.exports = { socketController };
