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
  console.log(payload);
  //Traemos los ultimos tickets
  const [ticket1, ticket2, ticket3, ticket4] = payload;
  //Renderizamos
  etiquetaTicket1.innerText = `Ticket ${ticket1.numero}`;
  etiquetaEscritorio1.innerText = `Ticket ${ticket1.escritorio}`;

  etiquetaTicket2.innerText = `Ticket ${ticket2.numero}`;
  etiquetaEscritorio2.innerText = `Ticket ${ticket2.escritorio}`;

  etiquetaTicket3.innerText = `Ticket ${ticket3.numero}`;
  etiquetaEscritorio3.innerText = `Ticket ${ticket3.escritorio}`;

  etiquetaTicket4.innerText = `Ticket ${ticket4.numero}`;
  etiquetaEscritorio4.innerText = `Ticket ${ticket4.escritorio}`;
});
