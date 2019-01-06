var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var vehicleSchema = new Schema({
    nom: { type: String, required: [true, 'El nombre es necesario'] },
    marca: { type: String, required: [true, 'El nombre es necesario'] },
    model: { type: String, required: [true, 'El nombre es necesario'] },
    matricula: { type: String, required: [true, 'El nombre es necesario'] },
    data_adquisicio: { type: String, required: [true, 'El nombre es necesario'] },
    places: { type: Number, required: [true, 'El nombre es necesario'] },
    classificacio: { type: String, required: [true, 'El nombre es necesario'] },
    observacions: { type: String, required: false },
    color: { type: String, required: false },
    img: { type: String, required: false },
    temporada_extra: { type: Number, required: false },
    temporada_alta: { type: Number, required: false },
    temporada_mitja: { type: Number, required: false },
    temporada_baixa: { type: Number, required: false }

}, { collection: 'vehicles' });



module.exports = mongoose.model('Vehicle', vehicleSchema);