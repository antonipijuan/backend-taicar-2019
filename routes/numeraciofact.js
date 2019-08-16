var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var NumeracioFact = require('../models/numeraciofact');

// ==========================================
// Obtener todos los medicos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    NumeracioFact.find({})

    .exec(
        (err, numeracio) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                numeracio: numeracio
            });


        });
});

// ==========================================
// Obtener ultim numero
// ==========================================
app.get('/ultim/:anualitat', (req, res, next) => {

    var anual = req.params.anualitat;

    NumeracioFact.find({
        'anualitat': anual
    })

    .exec(
        (err, numeracio) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                numeracio: numeracio
            });


        });
});

// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var numeracio = new NumeracioFact({
        part_fixa: body.part_fixa,
        num_correlatiu: body.num_correlatiu,
        anualitat: body.anualitat

    });
    numeracio.save((err, numeracioGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear numreacio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            numeracio: numeracioGuardada
        });

    });




});

// ===================
// actualitza PAgaments
// =========================
app.put('/actualitzaNumeracio/:num/:anualitat', mdAutenticacion.verificaToken, (req, res) => {

    var nounum = req.params.num;
    // var vimport = req.params.import;
    var anual = req.params.anualitat;
    // var vfactura = req.body.fact;
    // vimport = Number(vimport);

    NumeracioFact.find({
        'anualitat': anual
    })

    .exec((err, numeracio) => {
        // NumeracioFact.find({ "anualitat": anual }, (err, numeracio) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!numeracio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + vid + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        numeracio.num_correlatiu = nounum;


        numeracio.save((err, numeracioActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                numeracio: numeracioActualitzada
            });
        });


    });



});

// ===================
// actualitza PAgaments
// =========================
app.get('/augmentaNumeracio/:anualitat', mdAutenticacion.verificaToken, (req, res) => {

    // var vimport = req.params.import;
    // var anual = new Number();
    // Number anual = req.params.anualitat;
    // var vfactura = req.body.fact;
    // vimport = Number(vimport);

    var anual = req.params.anualitat;
    anual = Number(anual);


    NumeracioFact.findOne({ "anualitat": anual }, (err, numeracio) => {

        console.log(numeracio);


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!numeracio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + vid + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        numeracio.num_correlatiu++;


        numeracio.save((err, numeracioActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                numeracio: numeracioActualitzada
            });
        });


    });



});

module.exports = app;