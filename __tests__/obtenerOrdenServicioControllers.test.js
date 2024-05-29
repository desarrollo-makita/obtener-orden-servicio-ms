const { obtenerOrdenServicio } = require('../controllers/obtenerOrdenServicioControllers.js');
const mock = require('../config/mock.js');
const axios = require('axios');

jest.mock('axios');
jest.mock('../config/logger');

describe('obtenerOrdenServicio', () => {

  let req;
  let res;

  beforeEach(() => {
      req = mock.request;
      res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
      };
  });

  it('se realiza el proceso exitoso 200', async () => {
    // Mockear la respuesta de obtenerPedidos
    axios.get.mockResolvedValueOnce(mock.obtenerOrdenServicio);

    await obtenerOrdenServicio(req, res);
       
    // Verificar que el estado y la respuesta JSON sean correctos
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mock.obtenerOrdenServicio.data.os);
   
    
  });

  it('should handle error and return 500', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await obtenerOrdenServicio(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: `Error en el servidor [obtener-orden-servicio-ms] :  ${errorMessage}` });
});

});
