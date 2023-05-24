const textoMensaje = document.getElementById('mensaje');
const btnEnviar = document.getElementById('enviar');
const pOnline = document.querySelector('.pOnline');
const pOffline = document.querySelector('.pOffline');

const socket = io();

socket.on('connect', () => {
  pOnline.style.display = 'block';
  pOffline.style.display = 'none';
});

socket.on('disconnect', () => {
  pOnline.style.display = 'none';
  pOffline.style.display = 'block';
});

socket.on('enviar-mensaje', (payload) => {
  console.log('En el front', payload);
});

btnEnviar.addEventListener('click', () => {
  const mensaje = textoMensaje.value;
  const payload = {
    mensaje,
    id: 12345,
    fecha: new Date(),
  };

  socket.emit('enviar-mensaje', payload, (id) => {
    console.log('Desde el server', id);
  });
});
