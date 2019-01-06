var express = require('express');

var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Booking = require('../models/booking');

// ==========================================
// Obtener todos los bookings
// ==========================================
app.get('/', (req, res, next) => {

    // var desde = req.query.desde || 0;
    // desde = Number(desde);

    Booking.find({})

    .exec(
        (err, bookings) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }

            Booking.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    bookings: bookings,
                    total: conteo
                });

            });

        });
});

// ==========================================
// Obtener médico
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Booking.findById(id)

    .populate('vehicle')
        .exec((err, booking) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!booking) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El booking con el id ' + id + ' no existe',
                    errors: { message: 'No existe un booking con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                booking: booking
            });

        });


});


// ==========================================
// Obtener booking por fecha i idvehicle
// ==========================================
app.get('/obtenirbooking/:idvehicle/:data', mdAutenticacion.verificaToken, (req, res) => {

    var vehicle = req.params.idvehicle;
    var fecha = req.params.data;

    Booking.find({
        $and: [{ data: { $lte: fecha } }, { data: { $gte: fecha } }, { "vehicle": vehicle }]

    })

    .exec(
        (err, bookings) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                bookings: bookings
            });



        });


});

// ==========================================
// Obtener booking entre dates
// ==========================================
app.get('/obtenirbookingperiode/:idvehicle/:datainici/:datafi/:disponible', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    Booking.find({
        $and: [{ data: { $lte: fecha2 } }, { data: { $gte: fecha1 } }, { "vehicle": idvehicle }, { "disponible": vdisponible }]

    })

    .exec(
        (err, bookings) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }
            Booking.count({
                $and: [{ data: { $lte: fecha2 } }, { data: { $gte: fecha1 } }, { "vehicle": idvehicle }, { "disponible": vdisponible }]

            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    bookings: bookings,
                    total: conteo
                });

            });

        });
});

// ==========================================
// Obtener booking entre dates sense especificar el coche
// ==========================================
app.get('/obtenirbookingperiodesensecoche/:datainici/:datafi/:disponible', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    Booking.find({
        $and: [{ data: { $lte: fecha2 } }, { data: { $gte: fecha1 } }, { "disponible": vdisponible }]

    })

    .exec(
        (err, bookings) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando bookings',
                    errors: err
                });
            }
            Booking.count({
                $and: [{ data: { $lte: fecha2 } }, { data: { $gte: fecha1 } }, { "disponible": vdisponible }]

            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    bookings: bookings,
                    total: conteo
                });

            });

        });
});

// ==========================================
// Actualizar Booking
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Booking.findById(id, (err, booking) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar booking',
                errors: err
            });
        }

        if (!booking) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El booking con el id ' + id + ' no existe',
                errors: { message: 'No existe un booking con ese ID' }
            });
        }


        booking.vehicle = body.vehicle;
        booking.data = body.data;
        booking.disponible = body.disponible;

        booking.save((err, bookingGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar booking',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                booking: bookingGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo booking
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var booking = new Booking({
        vehicle: body.vehicle,
        data: body.data,
        disponible: body.disponible
    });

    booking.save((err, bookingGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear booking',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            booking: bookingGuardado
        });


    });

});


// ============================================
//   Borrar un bookng por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Booking.findByIdAndRemove(id, (err, bookingBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!bookingBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un booking con ese id',
                errors: { message: 'No existe un booking con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            booking: bookingBorrado
        });

    });

});


// ==========================================
// Crear un nuevo periodo bookings
// ==========================================
app.post('/creacioperiode/:idvehicle/:datainicial/:datafinal', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var vehicle = req.params.idvehicle;
    var datainici = req.params.datainicial;
    var datafi = req.params.datafinal;
    var disponible = req.params.disponible;

    let date_1 = moment(datainici);
    let date_2 = moment(datafi);
    var dates = [];

    for (let _i = date_1; _i <= date_2; _i.add(1, 'days')) {
        // dates.push(_i.format('YYYY-MM-DD'));
        var booking = new Booking({
            vehicle: vehicle,
            data: _i.format('YYYY-MM-DD'),
            disponible: true,
            pressupost: ''
        });

        booking.save((err, bookingGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear booking',
                    errors: err
                });
            }
        });

    }
    res.status(201).json({
        ok: true,
        booking: 'Bookings guardats correctament'
    });

});

// ==========================================
// Crear un nuevo periodo bookings rebent variables per POST
// ==========================================
app.post('/creacioperiode_post', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var vehicle = body.vehicle;
    var datainici = body.datainici;
    var datafi = body.datafi;
    // var disponible = req.params.disponible;

    let date_1 = moment(datainici);
    let date_2 = moment(datafi);
    var v_bookings = [];

    for (let _i = date_1; _i <= date_2; _i.add(1, 'days')) {
        // dates.push(_i.format('YYYY-MM-DD'));
        var booking = new Booking({
            vehicle: vehicle,
            data: _i.format('YYYY-MM-DD'),
            disponible: true,
            pressupost: ''
        });
        console.log(booking);

        booking.save((err, bookingGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear booking',
                    errors: err
                });
            }
            v_bookings.push(bookingGuardado);






        });

    }
    res.status(201).json({
        ok: true,
        booking: 'Bookings guardats correctament'
    });


    // var booking = new Booking({
    //     vehicle: body.vehicle,
    //     data: body.data,
    //     disponible: body.disponible
    // });



});

// ==========================================
// Actualizar una data bookings
// ==========================================
app.put('/actualitzarbooking/:idvehicle/:data/:disponible', mdAutenticacion.verificaToken, (req, res) => {
    var idvehicle = req.params.idvehicle;
    var fecha = req.params.data;
    var vdisponible = req.params.disponible;

    Booking.findOne({
            $and: [{ data: { $lte: fecha } }, { data: { $gte: fecha } }, { "vehicle": idvehicle }]

        })
        .exec((err, bookingFind) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!bookingFind) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            bookingFind.disponible = vdisponible;

            bookingFind.save((err, bookingGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar booking',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    booking: bookingGuardado
                });

            });

        });


});

// ==========================================
// Actualizar una data bookings
// ==========================================
app.put('/put_actualitzarperiodebooking/:idvehicle/:datainici/:datafi/:disponible', mdAutenticacion.verificaToken, (req, res) => {
    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    var body = req.body;

    var pressupost = body._id;
    console.log('419' + body);
    console.log('420' + pressupost);


    Booking.updateMany({

            data: { $lte: fecha2, $gte: fecha1 },
            "vehicle": idvehicle


        }, {
            $set: {
                disponible: vdisponible,
                "pressupost": pressupost
            }
        },
        (err, bookings) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!bookings) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                booking: bookings
            });

        });


});

// ==========================================
// Actualizar una data bookings
// ==========================================
app.get('/actualitzarperiodebooking/:idvehicle/:datainici/:datafi/:disponible', mdAutenticacion.verificaToken, (req, res) => {
    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    var body = req.body;

    var pressupost = body._id;
    console.log('419' + body);
    console.log('420' + pressupost);


    Booking.updateMany({

            data: { $lte: fecha2, $gte: fecha1 },
            "vehicle": idvehicle


        }, {
            $set: {
                disponible: vdisponible,
                "pressupost": pressupost
            }
        },
        (err, bookings) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!bookings) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                booking: bookings
            });

        });


});

// ==========================================
// Actualizar perpressupost
// ==========================================
app.get('/actualitzarperpressupost/:idpressupost/:disponible', mdAutenticacion.verificaToken, (req, res) => {
    var pressupost = req.params.idpressupost;
    // var fecha1 = req.params.datainici;
    // var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;

    // var body = req.body;

    // var pressupost = body._id;
    // console.log(body);
    // console.log(pressupost);


    Booking.updateMany({

            "pressupost": pressupost
                // data: { $lte: fecha2, $gte: fecha1 },
                // "vehicle": idvehicle


        }, {
            $set: {
                disponible: vdisponible,
                "pressupost": ''

            }
        },
        (err, bookings) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!bookings) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                booking: bookings
            });

        });


});

app.delete('/esborrarperperiode/:idvehicle/:datainici/:datafi', mdAutenticacion.verificaToken, (req, res) => {
    var idvehicle = req.params.idvehicle;
    var fecha1 = req.params.datainici;
    var fecha2 = req.params.datafi;
    var vdisponible = req.params.disponible;


    Booking.deleteMany({

            data: { $lte: fecha2, $gte: fecha1 },
            "vehicle": idvehicle

        },
        (err, bookings) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!bookings) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                booking: bookings
            });

        });


});



module.exports = app;