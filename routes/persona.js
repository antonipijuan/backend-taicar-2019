var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Persona = require('../models/persona');
var form_busquedas = require('./busqueda');





//Rutas

// ===================
//Obtener totes les PErsoness
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Persona.find({})
        .skip(desde)
        .limit(10)
        .exec(

            (err, persones) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando persona',
                        errors: err
                    });
                }

                Persona.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        persones: persones,
                        total: conteo
                    });
                });


            });

});

// ===================
//Obtener totes les PErsoness
// =========================

app.get('/search', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Persona.find({})
        .select("_id nombre")
        .skip(desde)
        // .limit()
        .exec(

            (err, personessearch) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando persona',
                        errors: err
                    });
                }

                Persona.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        personessearch: personessearch,
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

    Persona.findById(id, (err, persona) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!persona) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }

        persona.nombre = body.nombre;
        persona.dni = body.dni;
        persona.poblacio = body.poblacio;
        persona.data_naixement = body.data_naixement;
        persona.direccio = body.direccio;
        persona.observacions = body.observacions;
        persona.email = body.email;
        persona.telefon = body.telefon;


        persona.save((err, personaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar persona',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                persona: personaGuardada
            });
        });


    });



});

// ===================
// Actualizar Informe Ultimo
// =========================


app.put('/canvidatainforme/:idpersona', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.idpersona;
    var body = req.body;



    Persona.findById(id, (err, persona) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El persona no existe',
                errors: err
            });
        }
        if (!persona) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El persona con el id' + id + ' no existe',
                errors: { message: 'No existe persona con ese dni' }
            });
        }
        // console.log(req);
        // persona.data_ultim_informe = body.datainforme;
        // console.log(persona);
        // console.log(body);
        // console.log(body.datainforme);
        //hospital.usuario = req.usuario._id;
        persona.data_ultim_informe = body.data;

        persona.save((err, personaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar persona',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                persona: personaGuardada
            });
        });


    });



});


// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var persona = new Persona({
        nombre: body.nombre,
        dni: body.dni,
        poblacio: body.poblacio,
        direccio: body.direccio,
        data_naixement: body.data_naixement,
        observacions: body.observacions,
        email: body.email,
        telefon: body.telefon

    });
    persona.save((err, personaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear persona',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            persona: personaGuardada
        });

    });




});

// ===================
// Borrar usuario dni
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Persona.findByIdAndRemove(id, (err, personaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el persona',
                errors: err
            });
        }
        if (!personaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe persona con ese id',
                errors: { message: 'No existe persona con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            persona: personaBorrada
        });

    });
});

// ===================
// Obtener persona porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Persona.findById(id)
        .populate('persona', 'nombre, dni, actiu, comunitat, data_ultim_informe')
        .exec((err, persona) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar persona',
                    errors: err
                });
            }
            if (!persona) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El persona con el id ' + id + ' no existe',
                    errors: { message: 'No existe un persona con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                persona: persona
            });
        });
});

// ===================
// Obtener id de persona por dni
// =========================
app.get('/obteneridpordni/:dni', (req, res) => {

    var dni = req.params.dni;

    Persona.find({
            'dni': dni
        })
        .populate('persona', 'id')
        .exec((err, persona) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar persona',
                    errors: err
                });
            }
            if (!persona) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El persona con el dni ' + dni + ' no existe',
                    errors: { message: 'No existe un persona con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                persona: persona
            });
        });
});

module.exports = app;