var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var FacturaDetall = require('../models/facturadetall');


//Rutas

// ===================
//Obtener totes les PErsoness
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    FacturaDetall.find({})
        .populate('vehicle')
        .skip(desde)
        // .limit()
        .exec(

            (err, facturesdetall) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando pressupost',
                        errors: err
                    });
                }

                FacturaDetall.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        facturesdetall: facturesdetall,
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

    FacturaDetall.findById(id, (err, facturadetall) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!facturadetall) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        facturadetall.id_factura = body.id_factura;
        facturadetall.data_inicial = body.data_inicial;
        facturadetall.data_final = body.data_final;
        facturadetall.viatgers = body.viatgers;
        facturadetall.vehicle = body.vehicle;
        facturadetall.temporada = body.temporada;
        facturadetall.dies = body.dies;
        facturadetall.preu = body.preu;



        facturadetall.save((err, facturadetallguardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                factura_detall: facturadetallguardada
            });
        });


    });



});

// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    console.log(req.body);

    var facturadetall = new FacturaDetall({
        id_factura: body.id_factura,
        data_inicial: body.data_inicial,
        data_final: body.data_final,
        viatgers: body.viatgers,
        vehicle: body.vehicle,
        temporada: body.temporada,
        dies: body.dies,
        preu: body.preu,

    });
    facturadetall.save((err, facturadetallgurardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear pressupost',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            facturadetall: facturadetallgurardada
        });

    });




});

// ===================
// Borrar pressupost
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    FacturaDetall.findByIdAndRemove(id, (err, facturadetallEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el pressupost',
                errors: err
            });
        }
        if (!facturadetallEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe pressupost con ese id',
                errors: { message: 'No existe pressupost con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            factura_detall: facturadetallEsborrada
        });

    });
});

// ===================
// Borrar pressupost
// =========================
app.delete('/perpressupost/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    FacturaDetall.deleteMany({
        'id_pressupost': id
    })

    .exec(
        (err2, factures_detall_esborrades) => {

            if (err2) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar el pressupost',
                    errors: err
                });
            }
            if (!factures_detall_esborrades) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe pressupost_detall con ese id de pressupost',
                    errors: { message: 'No existe pressupost_detall con ese id de pressupost' }
                });
            }

            res.status(200).json({
                ok: true,
                factures_detall_esborrades: factures_detall_esborrades
            });

        });
});

// ===================
// Obtener pressupost porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    FacturaDetall.findById(id)
        .populate('vehicle')
        .exec((err, facturadetall) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!facturadetall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                facturadetall: facturadetall
            });
        });
});

// ===================
// Obtener pressupostosdetall por num_pressupost
// =========================
app.get('/perpressupost/:num', (req, res) => {

    var num = req.params.num;

    FacturaDetall.find({
            'id_pressupost': num
        })
        .populate('vehicle')
        .exec((err, facturadetall) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!facturadetall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                facturadetall: facturadetall
            });
        });
});

// ===================
// Actualitza factura pressupostosdetall por num_pressupost
// =========================
app.get('/actualitzafactura_perpressupost/:num/:idfactura', (req, res) => {

    var num = req.params.num;
    var factura = req.params.idfactura;

    FacturaDetall.updateMany({


            "id_pressupost": num


        }, {
            $set: {

                "id_factura": factura
            }
        },
        (err, factures_detall) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!factures_detall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                factures_detall: factures_detall
            });

        });
});

// ===================
// Obtener pressupostosdetall por num_pressupost
// =========================
app.get('/perfactura/:num', (req, res) => {

    var num = req.params.num;

    FacturaDetall.find({
            'id_factura': num
        })
        .populate('vehicle')
        .exec((err, facturesdetall) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!facturesdetall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                factures_detall: facturesdetall
            });
        });
});




module.exports = app;