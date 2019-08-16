var express = require('express');
var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Despesa = require('../models/despesa');
var Vehicle = require('../models/vehicle');

// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Despesa.find({
            // $or: [{ "estat": 'vigent' }, { "estat": 'confirmada' }]
            // 'estat': 'vigent'
        })
        .skip(desde)
        .limit(10)
        .populate('vehicle')


    .exec(
        (err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando reserves',
                    errors: err
                });
            }

            Despesa.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    despeses: despeses,
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

    Despesa.findById(id)
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, despesa) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despesa) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El reserva con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despesa: despesa
            });

        });


});

// ==========================================
// Crear una nova despesa
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var despesa = new Despesa({
        vehicle: body.vehicle,

        data: body.data,
        preu: body.preu,
        tipus: body.tipus,
        observacions: body.observacions

    });

    despesa.save((err, despesaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear despesa',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            despesa: despesaGuardada
        });


    });

});

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Despesa.findById(id, (err, despesa) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!despesa) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + id + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        despesa.vehicle = body.vehicle;
        despesa.data = body.data;
        despesa.tipus = body.tipus;
        despesa.observacions = body.observacions;

        despesa.save((err, despesaActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar despesa',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                despesa: despesaActualitzada
            });
        });


    });



});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Despesa.findByIdAndRemove(id, (err, despesaEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar reserva',
                errors: err
            });
        }

        if (!despesaEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veh con ese id',
                errors: { message: 'No existe un veh con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            despesa: despesaEsborrada
        });

    });

});

// ==========================================
// ODespeses per vehicle
// ==========================================
app.get('/pervehicle/:id_vehicle', (req, res) => {

    var id = req.params.id_vehicle;

    Despesa.find({

            "vehicle": id
        })
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });


});

// ==========================================
// ODespeses per vehicle
// ==========================================
app.get('/pertipologia/:id/:anualitat/:tipologia', (req, res) => {

    var vehicle = req.params.id;
    var anual = req.params.anualitat;
    var tipus = req.params.tipologia;

    var datafi = anual + '-12-32';
    var datainici = anual + '-01-01';



    Despesa.find({

            $and: [{ data: { $lte: datafi } }, { data: { $gte: datainici } }, { "vehicle": vehicle }, { "tipus": tipus }]
        })
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });


});

// ==========================================
// ODespeses per vehicle
// ==========================================
app.put('/pertipologiarray/:id/:anualitat', (req, res) => {

    var vehicle = req.params.id;
    var anual = req.params.anualitat;


    var datafi = anual + '-12-32';
    var datainici = anual + '-01-01';



    Despesa.find({

            $and: [{ data: { $lte: datafi } }, { data: { $gte: datainici } }, { "vehicle": vehicle }, { "tipus": tipus }]
        })
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });


});



// ==========================================
// ODespeses per vehicle
// ==========================================
app.get('/despesespermes/:mes/:id_vehicle', (req, res) => {

    var vvehicle = req.params.id_vehicle;
    var vehicleTemp = new Vehicle({
        nom: '',
        marca: '',
        model: '',
        data_adquisicio: null,
        matricula: '',
        places: 0,
        classificacio: '',
        observacions: '',
        color: '',
        temporada_extra: 0,
        temporada_alta: 0,
        temporada_mitja: 0,
        temporada_baixa: 0,
        _id: vvehicle
    });

    var mes = req.params.mes;

    if (mes === "gener") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-01-31' } }, { data: { $gte: '2018-01-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "febrer") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-02-31' } }, { data: { $gte: '2018-02-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "març") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-03-31' } }, { data: { $gte: '2018-03-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "abril") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-04-31' } }, { data: { $gte: '2018-04-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "maig") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-05-31' } }, { data: { $gte: '2018-05-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "juny") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-06-31' } }, { data: { $gte: '2018-06-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "juliol") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-07-31' } }, { data: { $gte: '2018-07-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "agost") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-08-31' } }, { data: { $gte: '2018-08-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "setembre") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-09-31' } }, { data: { $gte: '2018-09-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "octubre") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-10-31' } }, { data: { $gte: '2018-10-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }
    if (mes === "novembre") {
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-11-31' } }, { data: { $gte: '2018-11-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });
    }

    if (mes === "desembre") {
        // console.log(vvehicle);


        // vvehicle = Number(vvehicle);
        Despesa.aggregate([
            { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { "vehicle": vehicleTemp._id }] } },
            // { $match: { $and: [{ data: { $lte: '2018-12-31' } }, { data: { $gte: '2018-12-01' } }, { vehicle: "5c02012f36b65a03e46b46c8" }] } },
            { $group: { _id: null, totalDespeses: { $sum: "$preu" }, count: { $sum: 1 } } }
        ]).exec((err, despeses) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar despesa',
                    errors: err
                });
            }

            if (!despeses) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehicle con el id ' + id + ' no te despeses',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                despeses: despeses
            });

        });



    }
});

module.exports = app;