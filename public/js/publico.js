//REFERENCIAS HTML
let etiquetaTicket1 = document.getElementById('lblTicket1');
let etiquetaEscritorio1 = document.getElementById('lblEscritorio1');

let etiquetaTicket2 = document.getElementById('lblTicket2');
let etiquetaEscritorio2 = document.getElementById('lblEscritorio2');

let etiquetaTicket3 = document.getElementById('lblTicket3');
let etiquetaEscritorio3 = document.getElementById('lblEscritorio3');

let etiquetaTicket4 = document.getElementById('lblTicket4');
let etiquetaEscritorio4 = document.getElementById('lblEscritorio4');

const socket = io();

socket.on('connect', () => {});

socket.on('disconnect', () => {});

//Escuchamos los ultimos 4
socket.on('ultimos-ticket', (payload) => {
  //Traemos los ultimos tickets
  const [ticket1, ticket2, ticket3, ticket4] = payload;
  //Comprobamos que existan y pintamos
  if (ticket1) {
    etiquetaTicket1.innerText = `Ticket ${ticket1.numero}`;
    etiquetaEscritorio1.innerText = `Escritorio ${ticket1.escritorio}`;
  }

  if (ticket2) {
    etiquetaTicket2.innerText = `Ticket ${ticket2.numero}`;
    etiquetaEscritorio2.innerText = `Escritorio ${ticket2.escritorio}`;
  }

  if (ticket3) {
    etiquetaTicket3.innerText = `Ticket ${ticket3.numero}`;
    etiquetaEscritorio3.innerText = `Escritorio ${ticket3.escritorio}`;
  }

  if (ticket4) {
    etiquetaTicket4.innerText = `Ticket ${ticket4.numero}`;
    etiquetaEscritorio4.innerText = `Escritorio ${ticket4.escritorio}`;
  }
});

//Escuchamos los tickets-pendientes que nos devuelve la longitud de todos los tickets
socket.on('tickets-pendientes', (payload) => {
  console.log(payload);
});
