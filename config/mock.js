module.exports = {
    obtenerPedidosControllers: {
        itemList: [
        {
            pedido_item: 106973043,
            referencia: '629937-8',
            qtde: '1',
            preco: '14462',
            ipi: '0',
            os: '66227517',
            qtde_cancelada: '0',
            qtde_faturada: '1'
        },
        {
            pedido_item: 107248891,
            referencia: '158472-4',
            qtde: '1',
            preco: '6195',
            ipi: '0',
            os: '66283533',
            qtde_cancelada: '0',
            qtde_faturada: '0'
        }
        ],
        pedidos: [
        {
            pedido: 48935877,
            data: '2024-04-22 16:47:02.223256-03',
            cnpj: '768900980     ',
            codigo: 'GAR',
            codigo_condicao: 'GAR',
            entrega: null,
            exportado: null,
            tipo_frete: null,
            status_pedido: 4,
            troca: null,
            status_descricao: 'Faturado Integral',
            transportadora: null,
            codigo_interno_transportadora: null,
            itens: [Array],
            valor_adicional_fabricante: 0,
            valor_desconto_fabricante: 0,
            tipoDocumento: 'NOTA DE VTA INTERNA'
        },
        {
            pedido: 49090833,
            data: '2024-04-29 13:16:38.825511-03',
            cnpj: '76279534-5    ',
            codigo: 'GAR',
            codigo_condicao: 'GAR',
            entrega: null,
            exportado: null,
            tipo_frete: null,
            status_pedido: 1,
            troca: null,
            status_descricao: 'Aguardando Exportação',
            transportadora: null,
            codigo_interno_transportadora: null,
            itens: [Array],
            valor_adicional_fabricante: 0,
            valor_desconto_fabricante: 0,
            tipoDocumento: 'NOTA DE VTA INTERNA'
        }
        ]
    },

    obtenerPedidosService:{
 
        data: [
            {
                "pedido": 48935877,
                "data": "2024-04-22 16:47:02.223256-03",
                "cnpj": "76279534-5    ",
                "codigo": "VEN",
                "codigo_condicao": "VEN",
                "entrega": null,
                "exportado": null,
                "tipo_frete": null,
                "status_pedido": 4,
                "troca": null,
                "status_descricao": "Faturado Integral",
                "transportadora": null,
                "codigo_interno_transportadora": null,
                "itens": [
                    {
                        "pedido_item": 106973043,
                        "referencia": "629937-8",
                        "qtde": "1",
                        "preco": "14462",
                        "ipi": "0",
                        "os": "66227517",
                        "qtde_cancelada": "0",
                        "qtde_faturada": "1"
                    }
                ],
                "valor_adicional_fabricante": 0,
                "valor_desconto_fabricante": 0
            },
            {
                "pedido": 48966439,
                "data": "2024-04-23 12:35:33.380326-03",
                "cnpj": "768900980     ",
                "codigo": "VEN",
                "codigo_condicao": "01",
                "entrega": null,
                "exportado": null,
                "tipo_frete": null,
                "status_pedido": 1,
                "troca": null,
                "status_descricao": "Aguardando Exportação",
                "transportadora": null,
                "codigo_interno_transportadora": null,
                "itens": [
                    {
                        "pedido_item": 107024192,
                        "referencia": "125310-5",
                        "qtde": "2",
                        "preco": "1001",
                        "ipi": "19",
                        "os": null,
                        "qtde_cancelada": "0",
                        "qtde_faturada": "1"
                    },
                    {
                        "pedido_item": 107024195,
                        "referencia": "187363-2",
                        "qtde": "1",
                        "preco": "11617",
                        "ipi": "19",
                        "os": null,
                        "qtde_cancelada": "0",
                        "qtde_faturada": "1"
                    },
                    {
                        "pedido_item": 107024193,
                        "referencia": "126289-3",
                        "qtde": "1",
                        "preco": "601",
                        "ipi": "19",
                        "os": null,
                        "qtde_cancelada": "0",
                        "qtde_faturada": "1"
                    },
                    {
                        "pedido_item": 107024194,
                        "referencia": "163455-1",
                        "qtde": "1",
                        "preco": "1111",
                        "ipi": "19",
                        "os": null,
                        "qtde_cancelada": "0",
                        "qtde_faturada": "1"
                    }
                ],
                "valor_adicional_fabricante": 0,
                "valor_desconto_fabricante": 0
            },
            {
                "pedido": 49090833,
                "data": "2024-04-29 13:16:38.825511-03",
                "cnpj": "76279534-5    ",
                "codigo": "GAR",
                "codigo_condicao": "GAR",
                "entrega": null,
                "exportado": null,
                "tipo_frete": null,
                "status_pedido": 1,
                "troca": null,
                "status_descricao": "Aguardando Exportação",
                "transportadora": null,
                "codigo_interno_transportadora": null,
                "itens": [
                    {
                        "pedido_item": 107248891,
                        "referencia": "158472-4",
                        "qtde": "1",
                        "preco": "6195",
                        "ipi": "0",
                        "os": "66283533",
                        "qtde_cancelada": "0",
                        "qtde_faturada": "0"
                    }
                ],
                "valor_adicional_fabricante": 0,
                "valor_desconto_fabricante": 0
            },
            
        ],
        status:200
    },
};