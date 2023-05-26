const etiquetaTicket = document.getElementById('lblNuevoTicket');
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
  socket.emit('siguiente-ticket', null, (ticket) => {
    console.log(ticket);
    //Pintamos el ticket recibo por la callback del controller
    etiquetaTicket.innerText = ticket;
  });
});
