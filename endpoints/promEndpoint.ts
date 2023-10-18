import { createProxyMiddleware } from 'http-proxy-middleware';
import express, { Express } from 'express';

const applyPromEndpoint = (app: Express, promUrl: string) => {
    // if (promUrl) {
    //   app.use(
    //     '/api/prom',
    //     createProxyMiddleware({
    //       target: promUrl,
    //       changeOrigin: true,
    //       timeout: 120000,
    //       proxyTimeout: 120000,
    //       pathRewrite: {
    //         '^/api/prom': '/api/v1',
    //       },
    //     })
    //   );
    // }
    app.use(express.json());

    app.get('/api/prom/query_range', async (req, res) => {
        const promQuery = req.query.query as string

        if(promQuery.startsWith('sum')){
            res.end(JSON.stringify({
                "status": "success",
                "data": {
                    "resultType": "matrix",
                    "result": [
                        {
                            "metric": {
                                "device_uri": "urn:ngsi-ld:IotDevice:5345ANT661ADJ1"
                            },
                            "values": [
                                [
                                    1697055465.546,
                                    "41218"
                                ],
                                [
                                    1697141865.546,
                                    "40030"
                                ],
                                [
                                    1697228265.546,
                                    "37145"
                                ],
                                [
                                    1697314665.546,
                                    "45098"
                                ],
                                [
                                    1697401065.546,
                                    "32867"
                                ],
                                [
                                    1697487465.546,
                                    "20972"
                                ],
                                [
                                    1697573865.546,
                                    "29272"
                                ]
                            ]
                        }
                    ]
                }
            }));
        }

        if(promQuery.startsWith('avg')){
            res.end(JSON.stringify({
                "status": "success",
                    "data": {
                    "resultType": "matrix",
                        "result": [
                        {
                            "metric": {
                                "image_type": "anpr"
                            },
                            "values": [
                                [
                                    1697057168.478,
                                    "199551.39999999997"
                                ],
                                [
                                    1697143568.478,
                                    "111001.33333333333"
                                ],
                                [
                                    1697229968.478,
                                    "210388.33333333334"
                                ],
                                [
                                    1697316368.478,
                                    "136390.1666666667"
                                ],
                                [
                                    1697402768.478,
                                    "121846.75"
                                ],
                                [
                                    1697489168.478,
                                    "147211.6"
                                ],
                                [
                                    1697575568.478,
                                    "140634.25"
                                ]
                            ]
                        },
                        {
                            "metric": {
                                "image_type": "overview"
                            },
                            "values": [
                                [
                                    1697057168.478,
                                    "497054.2"
                                ],
                                [
                                    1697143568.478,
                                    "90928.88888888889"
                                ],
                                [
                                    1697229968.478,
                                    "97735.5"
                                ],
                                [
                                    1697316368.478,
                                    "88993"
                                ],
                                [
                                    1697402768.478,
                                    "89767.25"
                                ],
                                [
                                    1697489168.478,
                                    "88678.2"
                                ],
                                [
                                    1697575568.478,
                                    "86994.4"
                                ]
                            ]
                        }
                    ]
                }
            }));
        }
            if(promQuery.startsWith('((sum')){
                res.end(JSON.stringify({
                    "status": "success",
                    "data": {
                        "resultType": "matrix",
                        "result": [
                            {
                                "metric": {},
                                "values": [
                                    [
                                        1697057166.95,
                                        "0"
                                    ],
                                    [
                                        1697143566.95,
                                        "0"
                                    ],
                                    [
                                        1697229966.95,
                                        "0"
                                    ],
                                    [
                                        1697316366.95,
                                        "0"
                                    ],
                                    [
                                        1697402766.95,
                                        "0"
                                    ]
                                ]
                            },
                            {
                                "metric": {
                                    "device_uri": "urn:ngsi-ld:IotDevice:5345ANT661ADJ1"
                                },
                                "values": [
                                    [
                                        1697489166.95,
                                        "0"
                                    ],
                                    [
                                        1697575566.95,
                                        "0"
                                    ]
                                ]
                            }
                        ]
                    }
                }));
            }

        });


    };

    export default applyPromEndpoint;
