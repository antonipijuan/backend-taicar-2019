var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Vehicle = require('../models/vehicle');

// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Vehicle.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, vehicles) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando vehiculo',
                        errors: err
                    });
                }

                Vehicle.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        vehicles: vehicles,
                        total: conteo
                    });

                });

            });
});

// ==========================================
// Obtener vehiculo
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Vehicle.findById(id)
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, vehicle) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar vehicle',
                    errors: err
                });
            }

            if (!vehicle) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                vehicle: vehicle
            });

        });


});

// ==========================================
// Actualizar Medico
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Vehicle.findById(id, (err, vehicle) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehicle',
                errors: err
            });
        }

        if (!vehicle) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El vehicle con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        vehicle.nom = body.nom;
        vehicle.marca = body.marca;
        vehicle.model = body.model;
        vehicle.data_adquisicio = body.data_adquisicio;
        vehicle.matricula = body.matricula;
        vehicle.places = body.places;
        vehicle.classificacio = body.classificacio;
        vehicle.observacions = body.observacions;
        vehicle.color = body.color;
        vehicle.temporada_extra = body.temporada_extra;
        vehicle.temporada_alta = body.temporada_alta;
        vehicle.temporada_mitja = body.temporada_mitja;
        vehicle.temporada_baixa = body.temporada_baixa;

        vehicle.save((err, vehicleGuardat) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar veh',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                vehicle: vehicleGuardat
            });

        });

    });

});



// ==========================================
// Crear un nuevo medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var vehicle = new Vehicle({
        nom: body.nom,
        marca: body.marca,
        model: body.model,
        data_adquisicio: body.data_adquisicio,
        matricula: body.matricula,
        places: body.places,
        classificacio: body.classificacio,
        observacions: body.observacions,
        color: body.color,
        temporada_extra: body.temporada_extra,
        temporada_alta: body.temporada_alta,
        temporada_mitja: body.temporada_mitja,
        temporada_baixa: body.temporada_baixa
    });

    vehicle.save((err, vehicleGuardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear veh',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            vehicle: vehicleGuardat
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Vehicle.findByIdAndRemove(id, (err, vehicleBorrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar veh',
                errors: err
            });
        }

        if (!vehicleBorrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veh con ese id',
                errors: { message: 'No existe un veh con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            vehicle: vehicleBorrat
        });

    });

});

// ==========================================
// Obtener vehiculo
// ==========================================
app.get('/getpreutemporada/:temporada/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var temporada = req.params.temporada;

    Vehicle.findById(id)
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, vehicle) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar vehicle',
                    errors: err
                });
            }

            if (!vehicle) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            switch (temporada) {

                case 'X':
                    preu = vehicle.temporada_extra;
                    break;

                case 'A':
                    preu = vehicle.temporada_alta;
                    break;

                case 'M':
                    preu = vehicle.temporada_mitja;
                    break;
                case 'B':
                    preu = vehicle.temporada_baixa;
                    break;



                default:
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                        error: { message: 'Tipo de tabla/coleccion no válido' }
                    });

            }

            res.status(200).json({
                ok: true,
                preu: preu
            });

        });


});


module.exports = app;