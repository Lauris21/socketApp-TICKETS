const etiquetaTicket = document.getElementById('lblNuevoTicket');
const crearTicket = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
  //Si el servidor se cae habilitamos boton
  crearTicket.disabled = false;
});

socket.on('disconnect', () => {
  //Si el servidor se cae desabilitamos boton
  crearTicket.disabled = true;
});

crearTicket.addEventListener('click', () => {
  //Emitimos el siguiente ticket
  socket.emit('siguiente-ticket', null, (ticket) => {
    //Pintamos el ticket recibo por la callback del controller
    etiquetaTicket.innerText = ticket;
  });
});
