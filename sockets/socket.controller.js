const ticketControl = require('../controller/ticket.model');

const ticketController = ticketControl();

const socketController = (cliente) => {
  cliente.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  cliente.on('siguiente-ticket', (payload, callback) => {
    //LLamamos a la función siguiente que genera nuevo ticket
    const siguienteTicket = ticketController.siguiente();

    //Devolvemos el ticket en la callback
    callback(siguienteTicket);

    //Notificar que hay nuevo ticket pendiente de asignar
  });
};

module.exports = { socketController };
