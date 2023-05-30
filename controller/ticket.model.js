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

  //Leer DB hacemos una promesa para que al ejecutar la función espere a ver si se ha resuelto
  const getData = (url = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(url, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          const { ultimoguardado, diaHoy, allTickets, lastTickets } =
            JSON.parse(data);
          resolve({ ultimoguardado, diaHoy, allTickets, lastTickets });
        }
      });
    });
  };

  //Función iniciadora que trae los datos
  const init = async () => {
    try {
      //LLamamos a la función que nos trae la data y hacemos destructuring
      const { ultimoguardado, diaHoy, lastTickets, allTickets } = await getData(
        dbPath
      );
      //Comparamos el día traido de la DB con el día de hoy
      if (hoy === diaHoy) {
        ultimo = ultimoguardado;
        ultimos4 = lastTickets;
        tickets = allTickets;
      } else {
        ultimo = 0;
        hoy = new Date().getDate();
        tickets = [];
        ultimos4 = [];
        // Sino es que ha empezado un día nuevo y deberá guardarse en la DB haciendo un formateo
        guardarenDB();
      }
    } catch (error) {
      throw new Error(error);
    }
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
    //Guardamos los cambios en DB
    guardarenDB();

    const res = {
      ticket: `Ticket ${newTicket.numero}`,
      ultimo,
      tickets,
      ultimos4,
    };
    //Devolvemos el número del ticket
    return res;
  };

  //Quién atenderá los tickets -> Sacaremos el ticket más antiguo de allTickets y lo introduciremos el primero de lastTickets
  const atenderTicket = async (escritorio) => {
    try {
      const { ultimoguardado, allTickets, lastTickets } = await getData(dbPath);
      //No tenemos tickets
      if (allTickets.length === 0) {
        return { ticket: null, ultimoguardado, lastTickets, allTickets };
      }
      //Cogemos primer ticket
      const ticket = allTickets.shift();
      //Igualamos el escritorio del ticket al escritorio que hemos recibido por argumento
      ticket.escritorio = escritorio;
      //Lo añadimos al inicio del array de últimos4
      lastTickets.unshift(ticket);
      //Comprobamos que el array sea mayor que 4 para borrar el último
      if (lastTickets.length > 4) {
        //Eliminiamos el último
        lastTickets.splice(-1, 1);
      }
      //Actualizamos variables
      ultimo = ultimoguardado;
      tickets = allTickets;
      ultimos4 = lastTickets;
      //Guardamos en la DB
      guardarenDB();

      const respuesta = { ticket, ultimoguardado, lastTickets, allTickets };
      //Devolvemos la respuesta con los datos actualizados
      return respuesta;
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    init,
    siguiente,
    atenderTicket,
    guardarenDB,
    getData,
  };
};

module.exports = ticketControl;
