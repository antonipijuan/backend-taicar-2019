var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Factura = require('../models/factura');
// var PressupostDetall = require('../models/pressupostdetall');
// var Reserva = require('../models/reserva');


//Rutas


// ===================
//Obtener totes les Factures
// =========================

app.get('/', (req, res, next) => {

    /*   var desde = req.query.desde || 0;
      var vpagades = req.params.pagades;



      desde = Number(desde); */

    Factura.find({})
        .populate('client')
        .exec(

            (err, factures) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando factura',
                        errors: err
                    });
                }

                Factura.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        factures: factures,
                        total: conteo
                    });
                });
            });
});


// ===================
//Obtener totes les Factures
// =========================

app.get('/:pagades', (req, res, next) => {

    var desde = req.query.desde || 0;
    var vpagades = req.params.pagades;



    desde = Number(desde);

    if (vpagades == "true") {
        console.log('primer if', vpagades);
        Factura.find({

        })

        .populate('client')
            .skip(desde)
            // .limit()
            .exec(

                (err, factures) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'ERror cargando factura',
                            errors: err
                        });
                    }

                    Factura.count({}, (err, conteo) => {

                        res.status(200).json({
                            ok: true,
                            factures: factures,
                            total: conteo
                        });
                    });
                });
    } else {
        console.log('segon if', vpagades);
        Factura.find({
            'estat': { $ne: 'pagada' }
        })

        .populate('client')
            .skip(desde)
            // .limit()
            .exec(

                (err, factures) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'ERror cargando factura',
                            errors: err
                        });
                    }

                    Factura.count({}, (err, conteo) => {

                        res.status(200).json({
                            ok: true,
                            factures: factures,
                            total: conteo
                        });
                    });
                });
    }

});

// ===================
// Obtener factura porid
// =========================
app.get('/consultaId/:id', (req, res) => {

    var id = req.params.id;

    Factura.findById(id)
        .populate('client')
        .exec((err, factura) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!factura) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El factura con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                factures: factura
            });
        });
});

// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Factura.findById(id, (err, factura) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + id + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        factura.num = body.num;
        factura.data = body.data;
        factura.data_vigencia = body.data_vigencia;
        factura.data_pagament = body.data_pagament;
        factura.client = body.client;
        factura.preu_brut = body.preu_brut;
        factura.preu_net = body.preu_net;
        factura.observacions = body.observacions;
        factura.estat = body.estat;
        factura.pendent_pagament = body.pendent_pagament;
        factura.pendent_pagat = body.pendent_pagat;


        factura.save((err, facturaActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                factura: facturaActualitzada
            });
        });


    });



});

// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var factura = new Factura({
        num: body.num,
        data: body.data,
        data_vigencia: body.data_vigencia,
        data_pagament: body.data_pagament,
        // viatgers: body.viatgers
        // vehicle: body.vehicle,
        client: body.client,
        preu_brut: body.preu_brut,
        preu_net: body.preu_net,
        observacions: body.observacions,
        estat: 'emesa',
        pendent_pagament: body.preu_net,
        pendent_pagat: 0
    });
    factura.save((err, facturaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear factura',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            factura: facturaGuardada
        });

    });




});

// ===================
// actualitza PAgaments
// =========================
app.put('/actualitzaPagaments/:id', mdAutenticacion.verificaToken, (req, res) => {

    var vid = req.params.id;
    // var vimport = req.params.import;
    var vimport = req.body.varimport;
    var vfactura = req.body.fact;
    vimport = Number(vimport);


    Factura.findById(vid, (err, factura) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + vid + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        factura.num = vfactura.num;
        factura.data = vfactura.data;
        factura.data_pagament = vfactura.data_pagament;
        factura.client = vfactura.client;
        factura.preu_brut = vfactura.preu_brut;
        factura.preu_net = vfactura.preu_net;
        factura.observacions = vfactura.observacions;
        factura.estat = vfactura.estat;

        factura.pendent_pagament = factura.pendent_pagament - vimport;
        factura.pendent_pagat = factura.pendent_pagat + vimport;


        factura.save((err, facturaActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                factura: facturaActualitzada
            });
        });


    });



});


// ===================
// actualitza PAgaments
// =========================
app.put('/actualitzaEstat/:id/:estat', mdAutenticacion.verificaToken, (req, res) => {

    var vid = req.params.id;
    var vestat = req.params.estat;
    // var vimport = req.params.import;
    // var vimport = req.body.varimport;
    // var vfactura = req.body.fact;
    // vimport = Number(vimport);


    Factura.findById(vid, (err, factura) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + vid + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        factura.estat = vestat;

        factura.save((err, facturaActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                factura: facturaActualitzada
            });
        });


    });



});
module.exports = app;