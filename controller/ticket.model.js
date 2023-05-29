//Para construir el path
const path = require('path');

//Para poder grabar información
const fs = require('fs');

//Controlador del ticket
const ticketControl = () => {
  //Creamos un objeto nuevo al comenzar el día
  let ultimo = 0;
  let hoy = new Date().getDate();
  let tickets = [];
  let ultimos4 = [];

  const dbPath = path.join(__dirname, '../db/data.json');

  //Creamos un ticket
  const ticket = (numero, escritorio) => {
    return { numero, escritorio };
  };

  //Devolvemos el objeto
  const toJson = () => {
    return {
      ultimoguardado: ultimo,
      diaHoy: hoy,
      allTickets: tickets,
      lastTickets: ultimos4,
    };
  };

  const guardarenDB = () => {
    //Ruta donde esta la DB
    //Convertimos el objeto a JSON y lo escribimos en la DB
    fs.writeFileSync(dbPath, JSON.stringify(toJson()));
  };

  //Función iniciadora que trae los datos
  const init = () => {
    //Debemos hacer una promesa asi la funciñon que la ejecuta será asyncrona
    // y no continuará hasta tener la respuesta de esta función
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          //Parseamos la respuesta
          const dataParser = JSON.parse(data);
          //Destructuring
          const { ultimoguardado, diaHoy, allTickets, lastTickets } =
            dataParser;
          console.log('init ultimos', ultimo, ultimoguardado);
          //Comparamos el día traido de la DB con el día de hoy
          if (hoy === diaHoy) {
            ultimo = ultimoguardado;
            console.log('antes push', tickets);
            tickets.push(...allTickets);
            console.log('despues', tickets);
            ultimos4.push(...lastTickets);
          } else {
            ultimo = 0;
            hoy = new Date().getDate();
            tickets = [];
            ultimos4 = [];
            // Sino es que ha empezado un día nuevo y deberá guardarse en la DB haciendo un formateo
            guardarenDB();
          }
          resolve();
        }
      });
    });
    //Leemos la DB
  };

  //Generamos un nuevo ticket
  //Hacemos la funciñon asyncrona para esperar que init se resuelva y continuar
  const siguiente = async () => {
    //LLamamos a init para recuperar los datos
    await init();
    ultimo++;
    //Creamos un nuevo ticket
    const newTicket = ticket(ultimo, null);
    //Añadimos el ticket al array de tickets
    tickets.push(newTicket);
    console.log('antes guardar', tickets);
    //Guardamos los cambios en DB
    guardarenDB();
    //Devolvemos el número del ticket
    return `Ticket ${newTicket.numero}`;
  };

  //Quién atenderá los tickets
  const atenderTicket = (escritorio) => {
    //No tenemos tickets
    if (tickets.length === 0) {
      return null;
    }
    //Cogemos primer ticket
    const ticket = tickets.shift();
    //Igualamos el escritorio del ticket al escritorio que hemos recibido por argumento
    ticket.escritorio = escritorio;
    //Lo añadimos al inicio del array de últimos4
    ultimos4.unshift(ticket);
    //Comprobamos que el array sea mayor que 4 para borrar el último
    if (ultimos4.length > 4) {
      //Eliminiamos el último
      ultimos4.splice(-1, 1);
    }
    //Guardamos en la DB
    guardarenDB();
    //Devolveos el ticket que atendemos
    return ticket;
  };

  return {
    init,
    siguiente,
    atenderTicket,
    guardarenDB,
  };
};

module.exports = ticketControl;
