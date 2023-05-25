//Para contruir el path
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

  //Creamos un ticket
  const ticket = (numero, escritorio) => {
    return { numero, escritorio };
  };

  //Devolvemos el objeto
  const toJson = () => {
    return {
      ultimo,
      hoy,
      tickets,
      ultimos4,
    };
  };

  const guardarenDB = () => {
    //Ruta donde esta la DB
    const dbPath = path.join(__dirname, '../db/data.json');

    //Convertimos el objeto a JSON y lo escribimos en la DB
    fs.writeFileSync(dbPath, JSON.stringify(toJson()));
  };

  const init = () => {
    //Leemos la DB
    fs.readFile('data.json', (error, data) => {
      if (error) {
        return error;
      } else {
        //Destructuramos
        const {
          ultimo: ultimoguardado,
          hoy: diaHoy,
          tickets: allTickets,
          ultimos4: lastTickets,
        } = data;

        //Si el día de hoy esta en la DB es que estamos trabajando en el dia adecuado
        //Actualizamos el servidor el servidor
        if (diaHoy) {
          if (diaHoy === hoy) {
            ultimo = ultimoguardado;
            tickets.push(...allTickets);
            ultimos4.push(...lastTickets);
          } else {
            // Sino es que ha empezado un día nuevo y deberá guardarse en la DB haciendo un formateo
            guardarenDB();
          }
        } else {
          //Sino existe el día Guardamos en la DB ya que esta vacía
          guardarenDB();
        }
      }
    });
  };

  //Generamos un nuevo ticket
  const siguiente = () => {
    //LLamamos a init para recuperar los datos
    init();
    ultimo++;

    //Creamos un nuevo ticket
    const newTicket = ticket(ultimo, null);

    //Añadimos el ticket al array de tickets
    tickets.push(newTicket);

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
  };
};

module.exports = ticketControl;
