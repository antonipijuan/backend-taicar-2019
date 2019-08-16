var express = require('express');
var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Reserva = require('../models/reserva');

// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Reserva.find({
            $or: [{ "estat": 'vigent' }, { "estat": 'confirmada' }, { "estat": 'facturada' }, ]
                // 'estat': 'vigent'
        })
        .populate('vehicle')
        .populate('pressupost')
        .exec(
            (err, reserves) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reserves',
                        errors: err
                    });
                }

                Reserva.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        reserves: reserves,
                        total: conteo
                    });

                });

            });
});

// ==========================================
// Obtener reserva
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Reserva.findById(id)
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, reserva) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }

            if (!reserva) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El reserva con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                reserva: reserva
            });

        });


});

// ==========================================
// Crear una nova reserva
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var reserva = new Reserva({
        vehicle: body.vehicle,
        pressupost: body.pressupost,
        data_inicial: body.data_inicial,
        data_final: body.data_final,
        estat: 'vigent'

    });

    reserva.save((err, reservaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear reserva',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reserva: reservaGuardada
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Reserva.findByIdAndRemove(id, (err, reservaEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar reserva',
                errors: err
            });
        }

        if (!reservaEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veh con ese id',
                errors: { message: 'No existe un veh con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            reserva: reservaEsborrada
        });

    });

});

// ===================
// Obtener reservas por num_pressupost
// =========================
app.get('/perpressupost/:num', (req, res) => {

    var num = req.params.num;

    Reserva.find({
            'pressupost': num
        })
        .populate('pressupost')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }
            if (!reserves) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                reserves: reserves
            });
        });
});


// ==========================================
// Obtener booking entre dates
// ==========================================
app.get('/reservescoincidents/:idvehicle/:datainici/:datafi', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    Reserva.find({
        // $and: [{ data: { $lte: fecha2 } }, { data: { $gte: fecha1 } }, { "vehicle": idvehicle }, { "disponible": vdisponible }]
        $and: [{ data_final: { $lte: fecha2 } }, { data_inicial: { $gte: fecha1 } }, { "vehicle": idvehicle }]
    })

    .exec(
        (err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }
            Reserva.count({
                $and: [{ data_final: { $lte: fecha2 } }, { data_inicial: { $gte: fecha1 } }, { "vehicle": idvehicle }]

            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    reserves: reserves,
                    total: conteo
                });

            });

        });
});

// ===================
// Busqueda per num_vehicle
// =========================
app.get('/reservespervehicle/:idvehicle', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    // var data = req.params.data;
    // var datafi = req.params.datafi;





    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({

            'vehicle': idvehicle,

            $or: [{ "estat": 'vigent' }, { "estat": 'confirmada' }, { "estat": 'facturada' }]

        })
        .populate('vehicle')

    .exec((err, reserves) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar reserves',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            reserves: reserves,
            total: reserves.length
        });
    });


});

// ===================
// Obtener informe por fecha
// =========================
// ===================
// Busqueda per filtre
// =========================
app.get('/consultasireservaperdata/:idvehicle/:data', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var data = req.params.data;
    // var datafi = req.params.datafi;




    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({
        $and: [{ data_inicial: { $lte: data } }, { data_final: { $gte: data } }, { "vehicle": idvehicle }]

    })


    .populate('pressupost')
        .populate('vehicle')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserves',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves,
                total: reserves.length
            });
        });


});

app.get('/consultasireservaperdata2/:idvehicle/:data/:datafi', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var data = req.params.data;
    var datafi = req.params.datafi;

    let date_1 = moment(data);
    let date_2 = moment(datafi);
    var dates = [];

    for (let _i = date_1; _i <= date_2; _i.add(1, 'days')) {
        dates.push(_i.format('YYYY-MM-DD'));
    }

    console.log(dates);

    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({



        // "$or": [{
        data_inicial: { $lte: { $in: ['2018-09-24', '2018-09-24', '2018-09-24', '2018-09-24'] } },
        data_final: { $gte: { $in: ['2018-09-24', '2018-09-24', '2018-09-24', '2018-09-24'] } },
        "vehicle": idvehicle
            // }]
    })



    .populate('pressupost')
        .populate('vehicle')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserves',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves,
                total: reserves.length
            });
        });


});

app.get('/consultaperpressupost/:idpressupost', mdAutenticacion.verificaToken, (req, res) => {

    var idpressupost = req.params.idpressupost;

    Reserva.find({
        "pressupost": idpressupost
    })



    .populate('pressupost')
        .populate('vehicle')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserves',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves,
                total: reserves.length
            });
        });


});

// ==========================================
// Anular Reserva
// ==========================================
app.get('/anular/:idpressupost', mdAutenticacion.verificaToken, (req, res) => {

    var pressupost = req.params.idpressupost;

    Reserva.findOne({
            $and: [{ "pressupost": pressupost }]

        })
        .exec((err, reservaFind) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!reservaFind) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            reservaFind.estat = 'anulada';

            reservaFind.save((err, reservaGuardada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar booking',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reserva: reservaGuardada
                });

            });

        });


});

// ==========================================
// Confirmar Reserva
// ==========================================
app.get('/confirmar/:idpressupost', mdAutenticacion.verificaToken, (req, res) => {

    var pressupost = req.params.idpressupost;

    Reserva.findOne({
            $and: [{ "pressupost": pressupost }]

        })
        .exec((err, reservaFind) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!reservaFind) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            reservaFind.estat = 'confirmada';

            reservaFind.save((err, reservaGuardada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar booking',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reserva: reservaGuardada
                });

            });

        });


});

// ==========================================
// Facturar Reserva
// ==========================================
app.get('/facturar/:idpressupost', mdAutenticacion.verificaToken, (req, res) => {

    var pressupost = req.params.idpressupost;

    Reserva.findOne({
            $and: [{ "pressupost": pressupost }]

        })
        .exec((err, reservaFind) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!reservaFind) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            reservaFind.estat = 'facturada';

            reservaFind.save((err, reservaGuardada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar booking',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reserva: reservaGuardada
                });

            });

        });


});

// ==========================================
// Actualizar perpressupost
// ==========================================
app.get('/actualitzaperpressupost/:idpressupost/:estat', mdAutenticacion.verificaToken, (req, res) => {
    var pressupost = req.params.idpressupost;
    var vestat = req.params.estat;

    Reserva.updateMany({

            "pressupost": pressupost

        }, {
            $set: {
                estat: vestat

            }
        },
        (err, reserves) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!reserves) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves
            });

        });


});

module.exports = app;