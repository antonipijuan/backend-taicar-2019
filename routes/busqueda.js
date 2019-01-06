var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Vehicle = require('../models/vehicle');
var Persona = require('../models/persona');
var Pressupost = require('../models/pressupost');
var Reserva = require('../models/reserva');
var Despesa = require('../models/despesa');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'vehicles':
            promesa = buscarVehicles(busqueda, regex);
            break;

        case 'persones':
            promesa = buscarClients(busqueda, regex);
            break;

        case 'pressupostos':
            promesa = buscarPressupostos(busqueda, regex);
            break;

        case 'reserves':
            promesa = buscarReserves(busqueda, regex);
            break;
        case 'factures':
            promesa = buscarFactures(busqueda, regex);
            break;
        case 'despeses':
            promesa = buscarDespeses(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        console.log(data);

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarClients(busqueda, regex),
            buscarVehicles(busqueda, regex),
            buscarPressupostos(busqueda, regex),
            buscarReserves(busqueda, regex),
            buscarFactres(busqueda, regex),
            buscarDespeses(busqueda, regex)
        ])
        .then(respuestas => {

            console.log(respuestas);

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
                persones: respuestas[3],
                vehicles: respuestas[4],
                pressupostos: respuestas[5],
                reserves: respuestas[6],
                despeses: respuestas[7]
            });
        });


});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            });


    });
}

function buscarVehicles(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Vehicle.find({})
            .or([{ 'marca': regex }, { 'model': regex }, { 'matricula': regex }])
            .exec((err, vehicles) => {

                if (err) {
                    reject('Erro al cargar vehicles', err);
                } else {
                    resolve(vehicles);
                }
            });


    });
}

function buscarClients(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Persona.find({})
            .or([{ 'nombre': regex }, { 'dni': regex }])
            .exec((err, persones) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(persones);
                }


            });


    });
}

function buscarPressupostos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Pressupost.find({

            })
            .or([{ 'data': regex }])
            .populate('client')
            .exec((err, pressupostos) => {

                if (err) {
                    reject('Error al cargar pressupostos', err);
                } else {
                    resolve(pressupostos);
                }
            });


    });
}

function buscarFactures(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Factura.find({

            })
            .or([{ 'data': regex }])
            .populate('client')
            .exec((err, factures) => {

                if (err) {
                    reject('Error al cargar factures', err);
                } else {
                    resolve(factures);
                }
            });


    });
}


function buscarReserves(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Reserva.find({ vehicle: busqueda })
            // populate({ path: 'fans', select: 'name' }).
            // .or([{ 'data_inicial': regex }, { 'data_final': regex }])
            .populate('vehicle')
            // .populate('pressupost')
            .exec((err, reserves) => {

                if (err) {
                    reject('Error al cargar reserves', err);
                } else {
                    resolve(reserves);
                }
            });


    });
}

function buscarDespeses(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Despesa.find({ "vehicle": busqueda })
            // populate({ path: 'fans', select: 'name' }).
            // .or([{ 'data_inicial': regex }, { 'data_final': regex }])


        .exec((err, despeses) => {

            if (err) {
                reject('Error al cargar reserves', err);
            } else {
                resolve(despeses);
            }
        });


    });
}





module.exports = app;