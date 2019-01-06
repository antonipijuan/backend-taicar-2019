var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var PressupostDetall = require('../models/pressupostdetall');


//Rutas

// ===================
//Obtener totes les PErsoness
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    PressupostDetall.find({})
        .populate('vehicle')
        .skip(desde)
        // .limit()
        .exec(

            (err, pressupostosdetall) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando pressupost',
                        errors: err
                    });
                }

                PressupostDetall.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        pressupostos_detall: pressupostosdetall,
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

    PressupostDetall.findById(id, (err, pressupostdetall) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!pressupostdetall) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        pressupostdetall.id_pressupost = body.id_pressupost;
        pressupostdetall.data_inicial = body.data_inicial;
        pressupostdetall.data_final = body.data_final;
        pressupostdetall.viatgers = body.viatgers;
        pressupostdetall.vehicle = body.vehicle;
        pressupostdetall.temporada = body.temporada;
        pressupostdetall.dies = body.dies;
        pressupostdetall.preu = body.preu;



        pressupostdetall.save((err, pressupostdetallGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar pressupost',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pressupost_detall: pressupostdetallGuardat
            });
        });


    });



});

// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var pressupostdetall = new PressupostDetall({
        id_pressupost: body.id_pressupost,
        data_inicial: body.data_inicial,
        data_final: body.data_final,
        viatgers: body.viatgers,
        vehicle: body.vehicle,
        temporada: body.temporada,
        dies: body.dies,
        preu: body.preu,
        id_factura: body.id_factura

    });
    pressupostdetall.save((err, pressupostdetallGuardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear pressupost',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            pressupost_detall: pressupostdetallGuardat
        });

    });




});

// ===================
// Borrar pressupost
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PressupostDetall.findByIdAndRemove(id, (err, pressupostdetallEsborrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el pressupost',
                errors: err
            });
        }
        if (!pressupostdetallEsborrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe pressupost con ese id',
                errors: { message: 'No existe pressupost con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            pressupost_detall: pressupostdetallEsborrat
        });

    });
});

// ===================
// Borrar pressupost
// =========================
app.delete('/perpressupost/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

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

            res.status(200).json({
                ok: true,
                pressupostos_detall_borrats: pressupostos_detall_borrats
            });

        });
});

// ===================
// Obtener pressupost porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    PressupostDetall.findById(id)
        .populate('vehicle')
        .exec((err, pressupostdetall) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!pressupostdetall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                pressupost_detall: pressupostdetall
            });
        });
});

// ===================
// Obtener pressupostosdetall por num_pressupost
// =========================
app.get('/perpressupost/:num', (req, res) => {

    var num = req.params.num;

    PressupostDetall.find({
            'id_pressupost': num
        })
        .populate('vehicle')
        .exec((err, pressupostosdetall) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!pressupostosdetall) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                pressupostos_detall: pressupostosdetall
            });
        });
});

// ===================
// Actualitza factura pressupostosdetall por num_pressupost
// =========================
app.get('/actualitzafactura_perpressupost/:num/:idfactura', (req, res) => {

    var num = req.params.num;
    var factura = req.params.idfactura;

    PressupostDetall.updateMany({


            "id_pressupost": num


        }, {
            $set: {

                "id_factura": factura
            }
        },
        (err, pressupostos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }

            if (!pressupostos) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un booking con ese id',
                    errors: { message: 'No existe un booking con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                pressupostos: pressupostos
            });

        });
});



module.exports = app;