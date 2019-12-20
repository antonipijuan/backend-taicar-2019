var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

var moment = require('moment');


var Pressupost = require('../models/pressupost');
var PressupostDetall = require('../models/pressupostdetall');
var Reserva = require('../models/reserva');


//Rutas

// ===================
//Obtener totes les PErsoness
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Pressupost.find({})
        .populate('vehicle')
        .populate('client')
        .skip(desde)
        .limit(10)
        .exec(

            (err, pressupostos) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando pressupost',
                        errors: err
                    });
                }

                Pressupost.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        pressupostos: pressupostos,
                        total: conteo
                    });
                });
            });
});

// ===================
//Carregar pressupostos vigents
// =========================

app.get('/vigents', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Pressupost.find({
            $or: [{ "estat": 'vigent' }, { "estat": 'confirmat' }]
        })
        .populate('vehicle')
        .populate('client')
        .skip(desde)
        // .limit()
        .exec(

            (err, pressupostos) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando pressupost',
                        errors: err
                    });
                }

                Pressupost.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        pressupostos: pressupostos,
                        total: conteo
                    });
                });
            });
});

// ===================
//Obtener segons estat
// =========================

app.get('/segonsestat/:estat', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var estat = req.params.estat;

    Pressupost.find({
            'estat': estat
        })
        .populate('vehicle')
        .populate('client')
        .skip(desde)
        // .limit()
        .exec(

            (err, pressupostos) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando pressupost',
                        errors: err
                    });
                }

                Pressupost.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        pressupostos: pressupostos,
                        total: conteo
                    });
                });
            });
});


// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pressupost.findById(id, (err, pressupost) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!pressupost) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        pressupost.num = body.num;
        pressupost.data = body.data;
        pressupost.data_vigencia = body.data_vigencia;
        pressupost.client = body.client;
        pressupost.preu_brut = body.preu_brut;
        pressupost.descompte = body.descompte;
        pressupost.preu_net = body.preu_net;
        pressupost.observacions = body.observacions;
        pressupost.estat = body.estat;


        pressupost.save((err, pressupostGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pressupost: pressupostGuardat
            });
        });


    });



});

// ===================
// Anular
// =========================
app.get('/anular/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pressupost.findById(id, (err, pressupost) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!pressupost) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        // pressupost.num = body.num;
        // pressupost.data = body.data;
        // pressupost.data_vigencia = body.data_vigencia;
        // pressupost.client = body.client;
        // pressupost.preu_brut = body.preu_brut;
        // pressupost.preu_net = body.preu_net;
        // pressupost.observacions = body.observacions;
        // pressupost.estat = body.estat;
        pressupost.estat = 'anulat';


        pressupost.save((err, pressupostGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pressupost: pressupostGuardat
            });
        });


    });



});

// ===================
// Confirmar
// =========================
app.get('/confirmar/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pressupost.findById(id, (err, pressupost) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!pressupost) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        pressupost.estat = 'confirmat';
        pressupost.save((err, pressupostGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pressupost: pressupostGuardat
            });
        });


    });



});

// ===================
// Facturar
// =========================
app.get('/facturar/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pressupost.findById(id, (err, pressupost) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!pressupost) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        pressupost.estat = 'facturat';
        pressupost.save((err, pressupostGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pressupost: pressupostGuardat
            });
        });


    });



});


// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var pressupost = new Pressupost({
        num: body.num,
        data: body.data,
        data_vigencia: body.data_vigencia,
        // viatgers: body.viatgers
        // vehicle: body.vehicle,
        client: body.client,
        preu_brut: body.preu_brut,
        descompte: body.descompte,
        preu_net: body.preu_net,
        observacions: body.observacions,
        estat: 'vigent'
    });
    pressupost.save((err, pressupostGuardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear pressupost',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            pressupost: pressupostGuardat
        });

    });




});

// ===================
// Borrar pressupost
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Pressupost.findById(id, (err, pressupostEsborrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el pressupost',
                errors: err
            });
        }
        if (!pressupostEsborrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe pressupost con ese id',
                errors: { message: 'No existe pressupost con ese id' }
            });
        }

        // find and remove all submissions
        PressupostDetall.deleteMany({
            'id_pressupost': id
        })

        .exec(
            (err2, pressupostos_detall_borrats) => {

                if (err2) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar el pressupost',
                        errors: err
                    });
                }
                if (!pressupostos_detall_borrats) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe pressupost_detall con ese id de pressupost',
                        errors: { message: 'No existe pressupost_detall con ese id de pressupost' }
                    });
                }
                Reserva.deleteMany({
                    'pressupost': id
                })

                .exec(
                    (err3, reservesEsborrades) => {

                        if (err3) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al borrar la reserva',
                                errors: err
                            });
                        }
                        if (!reservesEsborrades) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'No existe pressupost_detall con ese id de pressupost',
                                errors: { message: 'No existe pressupost_detall con ese id de pressupost' }
                            });
                        }




                        pressupostEsborrat.remove();



                        res.status(200).json({
                            ok: true,
                            pressupost: pressupostEsborrat,
                            pressupostos_detall: pressupostos_detall_borrats,
                            reserves: reservesEsborrades
                        });
                    });
            });

    });
});

// ===================
// Obtener pressupost porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Pressupost.findById(id)
        .populate('client')
        .exec((err, pressupost) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!pressupost) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                pressupost: pressupost
            });
        });
});

// ==========================================
// Obtener pressupost vigents i data
// ==========================================
app.get('/obtenirnotificacionspressupost/:data', mdAutenticacion.verificaToken, (req, res) => {

    //var pressupost = req.params.idpressupost;
    var fecha = req.params.data;

    Pressupost.find({
        $and: [{ data_vigencia: { $lte: fecha } }, { "estat": 'vigent' }]

    })

    .exec(
        (err, pressupostos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                pressupostos: pressupostos
            });



        });


});

// ==========================================
// Obtener pressupostos entre dates
// ==========================================
app.get('/caduquensegonsvigencia/:datavigencia', mdAutenticacion.verificaToken, (req, res) => {

    var vigencia = req.params.datavigencia;
    var today = moment().format('YYYY-MM-DD');
    Pressupost.find({
        $and: [{ data_vigencia: { $lte: vigencia } }, { data_vigencia: { $gte: today } }, { estat: 'vigent' }]

    })

    .exec(
        (err, pressupostos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando pressupostos',
                    errors: err
                });
            }
            Pressupost.count({
                $and: [{ data_vigencia: { $lte: vigencia } }, { data_vigencia: { $gte: today } }, { estat: 'vigent' }]

            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    pressupostos: pressupostos,
                    total: conteo
                });

            });

        });
});

// ==========================================
// Obtener pressupostos entre dates
// ==========================================

app.get('/caducats/desdeavui', mdAutenticacion.verificaToken, (req, res, next) => {

    // var vigencia = req.params.datavigencia;
    var today = moment().format('YYYY-MM-DD');
    Pressupost.find({
        $and: [{ data_vigencia: { $lte: today } }, { estat: 'vigent' }]

    })

    .exec(
        (err, pressupostos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando pressupostos',
                    errors: err
                });
            }
            Pressupost.count({
                $and: [{ data_vigencia: { $lte: today } }, { estat: 'vigent' }]

            }, (err2, conteo) => {

                res.status(200).json({
                    ok: true,
                    pressupostos: pressupostos,
                    total: conteo
                });

            });

        });
});


module.exports = app;