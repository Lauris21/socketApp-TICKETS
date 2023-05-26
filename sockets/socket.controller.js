const ticketControl = require('../controller/ticket.model');

const ticketController = ticketControl();

//Al llamar a la función asyncrona siguiente() debemos convertir esta tambien para esperar a recibir los datos
const socketController = async (cliente) => {
  cliente.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  //Escuchamos la emision de 'siguiente-ticket' que emite el front
  cliente.on('siguiente-ticket', async (payload, callback) => {
    try {
      const siguienteTicket = await ticketController.siguiente();
      console.log(siguienteTicket);
      //Devolvemos el ticket en la callback para que lo reciba el front
      callback(siguienteTicket);
    } catch (error) {}
    //ticketController.guardarenDB();
    //LLamamos a la función siguiente que genera nuevo ticket

    //Notificar que hay nuevo ticket pendiente de asignar
  });
};

module.exports = { socketController };
