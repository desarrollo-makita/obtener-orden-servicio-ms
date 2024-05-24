const axios = require('axios');
const logger = require('../config/logger.js');

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
        res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
}

module.exports = {
    obtenerOrdenServicio
};
