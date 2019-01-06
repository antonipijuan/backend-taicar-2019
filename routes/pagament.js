var express = require('express');
var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Pagament = require('../models/pagament');
// var Despesa = require('../models/despesa');
// var Vehicle = require('../models/vehicle');

// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Pagament.find({
            // $or: [{ "estat": 'vigent' }, { "estat": 'confirmada' }]
            // 'estat': 'vigent'
        })
        .skip(desde)
        .limit(10)
        .populate('factura')
        .populate('client')


    .exec(
        (err, pagaments) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando pagaments',
                    errors: err
                });
            }

            Pagament.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    pagaments: pagaments,
                    total: conteo
                });

            });

        });
});


// ==========================================
// Paginar
// ==========================================
app.get('/paginar/:pagina', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var pag = req.params.pagina || 0;




    Despesa.count({}, (err, conteo) => {

        console.log('conteo:', conteo);
        console.log('pag:', pag);


        totalPagines = Math.ceil((conteo / 5));
        console.log('totalPagines:', totalPagines);

        if (pag > totalPagines) {
            pag = totalPagines;
        }
        pag = pag - 1;
        desde = pag * 5;

        if (pag >= totalPagines - 1) {
            pag_siguiente = 1;
        } else {
            pag_siguiente = pag + 2;
        }
        if (pag < 1) {
            pag_anterior = totalPagines;
        } else {
            pag_anterior = pag;
        }
        Despesa.find({
                // $or: [{ "estat": 'vigent' }, { "estat": 'confirmada' }]
                // 'estat': 'vigent'
            })
            .skip(desde)
            .limit(5)
            .populate('vehicle')
            .exec((err, despeses) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reserves',
                        errors: err
                    });
                }



                res.status(200).json({
                    ok: true,
                    total: conteo,
                    totalPagines: totalPagines,
                    pag_actual: pag + 1,
                    pag_siguiente: pag_siguiente,
                    pag_anterior: pag_anterior,
                    despeses: despeses
                });

            });

    });
});

// ==========================================
// Obtener despesa per ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Pagament.findById(id)
        .populate('client')
        // .populate('hospital')
        .exec((err, pagament) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pagament',
                    errors: err
                });
            }

            if (!pagament) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pagament con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                pagament: pagament
            });

        });


});

// ==========================================
// Crear una nova despesa
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var pagament = new Pagament({
        client: body.client,
        factura: body.factura,
        data_pagament: body.data_pagament,
        import_pagat: body.import_pagat,
        observacions: body.observacions

    });

    pagament.save((err, pagamentGuardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear despesa',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            pagament: pagamentGuardat
        });


    });

});

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pagament.findById(id, (err, pagament) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!pagament) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + id + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        pagament.client = body.client;
        pagament.factura = body.factura;
        pagament.import_pagat = body.import_pagat;
        pagament.data_pagament = body.data_pagament;
        pagament.observacions = body.observacions;

        pagament.save((err, pagamentActualitzat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar despesa',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pagament: pagamentActualitzat
            });
        });


    });



});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Pagament.findByIdAndRemove(id, (err, pagamentEsborrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar reserva',
                errors: err
            });
        }

        if (!pagamentEsborrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veh con ese id',
                errors: { message: 'No existe un veh con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            pagament: pagamentEsborrat
        });

    });

});

// ==========================================
// ODespeses per client
// ==========================================
app.get('/perclient/:id_client', (req, res) => {

    var id = req.params.id_client;

    Pagament.find({

            "client": id
        })
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, pagaments) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!pagaments) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                pagaments: pagaments
            });

        });


});

/// ==========================================
// ODespeses per client
// ==========================================
app.get('/perfactura/:id_factura', (req, res) => {

    var id = req.params.id_factura;

    Pagament.find({

            "factura": id
        })
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, pagaments) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!pagaments) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                pagaments: pagaments
            });

        });

});

module.exports = app;