const axios = require('axios');
const logger = require('../config/logger.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const sql = require('mssql');
require('dotenv').config();

async function obtenerOrdenServicio(req, res) {
    try {
        logger.info(`Iniciamos la función obtenerOrdenServicio`);

        const { pedidos } = req.body;
        if (!Array.isArray(pedidos)) {
            throw new Error("El cuerpo de la solicitud debe contener un arreglo válido de 'pedidos'.");
        }

        const osSet = new Set();
        const osArray = [];

        for (const pedido of pedidos) {
            console.log("pedido : " , pedido.status_descricao);
            if (pedido.status_descricao !== 'Aguardando Exportação') {
                continue;
            }

            const solicitudes = pedido.itens.map(async (element) => {
                try {

                    console.log("element pedidos os", element.os);
                    // Consultamos la orden de servicio en el servicio de telecontrol
                    const response = await axios.get(`http://api2.telecontrol.com.br/os/ordem/os/${element.os}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Application-Key': '588b56a33c722da5e49170a311e872d9ee967291',
                            'Access-Env': 'PRODUCTION',
                            'X-Custom-Header': 'value'
                        },
                        timeout: 30000 // Timeout de 30 segundos
                    });

                    console.log("response :" , response.data)
                    // Extraemos datos relevantes de la respuesta
                    const { response: dataArchivos, os: osData } = response.data || {};
                    const os_anexos = dataArchivos?.[""]?.os_anexos || [];

                    if (osData) {
                        // Agregamos `idPedido` y `arregloLink` a cada orden de servicio
                        return osData.map((obj) => ({
                            ...obj,
                            idPedido: pedido.pedido,
                            arregloLink: os_anexos
                        }));
                    }
                } catch (err) {
                    if (err.response?.status === 404) {
                        logger.info(`Orden de servicio no encontrada: ${element.os}`);
                    } else {
                        throw err; // Relanza el error si no es un 404
                    }
                }
                return [];
            });

            // Esperamos todas las solicitudes para este pedido
            const resultados = await Promise.all(solicitudes);


            console.log("resultadoooooooos : " , resultados);
            // Procesamos resultados únicos
            for (const resultado of resultados.flat()) {
                if (resultado?.os && !osSet.has(resultado.os)) {
                    osSet.add(resultado.os);
                    osArray.push(resultado);
                }
            }
        }

        // Enviamos la respuesta con las órdenes de servicio únicas
        logger.debug(`osArray: ${JSON.stringify(osArray)}`);
        logger.info(`Fin de la función obtenerOrdenServicio`);
        res.status(200).json(osArray);

    } catch (error) {
        logger.error(`Error en obtenerOrdenServicio: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [obtener-orden-servicio-ms]: ${error.message}` });
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

        const filtradas = ordenesPendientesList.filter(orden => orden.descricao_tipo_atendimento === "Puesta En Marcha" &&
                                                                orden.status_os !== "Finalizada"
         )
                                               .map(orden => ({ ...orden, idPedido: null }));


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
