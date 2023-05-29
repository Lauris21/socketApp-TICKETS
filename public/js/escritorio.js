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

const socket = io();

socket.on('connect', () => {
  //Si el servidor se cae habilitamos boton
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  //Si el servidor se cae desabilitamos boton
  btnAtender.disabled = true;
});

btnAtender.addEventListener('click', () => {
  //Emitimos 'solicitar-ticket' pasando el escritorio y recibiendo por callback el objeto
  console.log(escritorio);
  socket.emit('solicitar-ticket', { escritorio }, (callback) => {
    //Pintamos el ticket recibo por la callback del controller
  });
});
