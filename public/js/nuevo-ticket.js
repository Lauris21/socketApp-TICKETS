const etiquetaTicket = document.querySelector('lblNuevoTicket');
const crearTicket = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
  crearTicket.disabled = false;
});

socket.on('disconnect', () => {
  crearTicket.disabled = true;
});

crearTicket.addEventListener('click', () => {
  //Emitimos el siguiente ticket
  socket.emit('siguiente-ticket', null, (ticket) =>
    console.log('En front ticket', ticket)
  );
});
