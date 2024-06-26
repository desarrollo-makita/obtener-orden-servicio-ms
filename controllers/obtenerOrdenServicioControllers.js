const axios = require('axios');
const logger = require('../config/logger.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const sql = require('mssql');
require('dotenv').config();

async function obtenerOrdenServicio(req, res) {
    try {
        
        logger.info(`Iniciamos la funcion obtenerOrdenServicio`); 
        const data = req.body;
        const osArray = [];
        const osSet = new Set();
        let objetosUnicos = [];
        let response;

        // Recorremos el arreglo de pedidos para obtener las órdenes de servicio
        for (const item of data.pedidos) {
            for (const element of item.itens) {
                // Consultamos la orden de servicio en el servicio de telecontrol
                response = await axios.get(`http://api2.telecontrol.com.br/os/ordem/os/${element.os}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Application-Key': '3d137dea1d13220aa9a10ee57d69f6b30d247f28',
                        'Access-Env': 'HOMOLOGATION',
                        'X-Custom-Header': 'value'
                    }
                });

                // Verificamos si la respuesta contiene datos válidos
                if (response.data && response.data.os) {
                    // Agregamos la propiedad idPedido a la orden de servicio
                    const osArrayWithIdPedido = response.data.os.map(obj => ({ ...obj, idPedido: item.pedido }));
                    objetosUnicos.push(...osArrayWithIdPedido);
                }
            }
        }

        // Iteramos sobre cada objeto en el arreglo para eliminar duplicados
        for (const objeto of objetosUnicos) {
            // Verificamos si el valor de 'os' ya está en el conjunto
            if (!osSet.has(objeto.os)) {
                // Añadimos el valor de 'os' al conjunto
                osSet.add(objeto.os);
                // Si no está en el conjunto, añadimos el objeto al arreglo de objetos únicos
                osArray.push(objeto);
            }
        }

        // Depuramos el arreglo de órdenes de servicio
        logger.debug(`osArray: ${JSON.stringify(osArray)}`);
        logger.info(`Fin de la funcion obtenerOrdenServicio`); 
        
        // Enviamos la respuesta con el arreglo de órdenes de servicio únicas
        res.status(response.status).json(osArray);
    } catch (error) {
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en obtenerOrdenServicio: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [obtener-orden-servicio-ms] :  ${error.message}`  });
       
    }
}

/**
 * Se obtienen ordenes de servicio utilizando rut de la entidad del servicio tecnico
 * @param {*} entidadesList 
 * @returns 
 */
async function obtenerOrdenesRut(req, res) {
    logger.info(`Iniciamos la función obtenerOrdenesPorRut`);

    try {
        let entidadesList = req.body;
        const dateInicio = await fechaInicio();
        const dateFin = await fechaFin();
        let ordenesPendientesList = [];
        //const ordenesPendientesList2 = [{Entidad:'76890098-0' , Direccion:'SANTA ROSA1508-1510' }, {Entidad:'76279534-5',Direccion:'SANTA ROSA1508-1510'} , {Entidad:'16205650-8',Direccion:'SANTA ROSA1508-1510'},]; // se deja a modo de prueba
        for (const entidad of entidadesList) {
            try {
                entidad.Entidad = entidad.Entidad.replace(/-/g, '');
                const url = `http://api2.telecontrol.com.br/os/ordem/cnpj/${entidad.Entidad}/dataInicio/${dateInicio}/dataFim/${dateFin}`;
                logger.info(`URL :  ${url}`);

                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Application-Key': '588b56a33c722da5e49170a311e872d9ee967291',
                        'Access-Env': 'PRODUCTION',
                        'X-Custom-Header': 'value'
                    }
                });

            if (response.data && response.data.os) {
                const updatedOs = response.data.os.map(os => ({
                    ...os,
                    direccion: entidad.Direccion
                  }));
                ordenesPendientesList = ordenesPendientesList.concat(updatedOs);
            }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    logger.error(`Error ${JSON.stringify(error.response.data)}`);
                } else {
                    logger.error(`Error al procesar la entidad ${entidad.Entidad}: ${error.message}`);
                    throw error; 
                }
            }
        }

        const filtradas = ordenesPendientesList.filter(orden => orden.descricao_tipo_atendimento === "Puesta En Marcha")
                                               .map(orden => ({ ...orden, idPedido: null }));;


        logger.info(`Fin de la función obtenerOrdenesPorRut`);
       
        res.status(200).json(filtradas);
    
    } catch (error) {
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en obtenerOrdenServicioPorRut: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [obtener-orden-servicio-ms/obtenerOrdenServicioPorRut] :  ${error.message}`  });
       
    }
}


async function  fechaFin(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-11
    const day = String(today.getDate()).padStart(2, '0'); // Los días son 1-31

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}


async function fechaInicio(){
    const today = new Date();
    const back = new Date(today);
    back.setDate(today.getDate() - 30);

    const year = back.getFullYear();
    const month = String(back.getMonth() + 1).padStart(2, '0');
    const day = String(back.getDate()).padStart(2, '0');

    const formattedBackDate = `${year}-${month}-${day}`;

    return formattedBackDate;
}

module.exports = {
    obtenerOrdenServicio , obtenerOrdenesRut
};
