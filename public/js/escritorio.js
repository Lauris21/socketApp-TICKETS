//Leer params URL
const searchParams = new URLSearchParams(window.location.search);

//Si no tinene el parámetro escritorio lanzamos error y devolvemos al index
if (!searchParams.has('escritorio')) {
  //de tal forma qe si escribimos otra cosa en los params devolvemos al index
  window.location = 'index.html';
  //lanzamos error
  throw new Error('El escritorio es obligatorio');
}

//Saber en que escritorio me encuentro
const escritorio = searchParams.get('escritorio');

//HTML REFERENCES
const h1 = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const etiquetaTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const ticketsPendientes = document.getElementById('lblPendientes');

//Ocultamos el div de alerta
divAlerta.style.display = 'none';

//Conectar con socket
const socket = io();

socket.on('connect', () => {
  //Si el servidor se cae habilitamos boton
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  //Si el servidor se cae desabilitamos boton
  btnAtender.disabled = true;
});

//Escuchamos los tickets-pendientes que nos devuelve la longitud de todos los tickets
socket.on('tickets-pendientes', (ticketsPorAtender) => {
  ticketsPendientes.innerText = ticketsPorAtender;
});

//Evento del botón
btnAtender.addEventListener('click', () => {
  //Emitimos 'solicitar-ticket' pasando el escritorio y recibiendo por callback el objeto
  socket.emit('solicitar-ticket', { escritorio }, ({ ok, ticket, msg }) => {
    //Si respuesta no es ok
    if (!ok) {
      //Ya no hay más tickets
      etiquetaTicket.innerText = 'Nadie';
      //Mostramos el div de alerta
      return (divAlerta.style.display = '');
    }
    //Pintamos el ticket recibo por la callback del controller
    etiquetaTicket.innerText = `Ticket ${ticket.numero}`;
  });
});
