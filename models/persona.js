var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var personaSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    dni: { type: String, required: [true, 'El	dni	es	necesario'] },
    direccio: { type: String, required: false },
    poblacio: { type: String, required: false },
    data_naixement: { type: String, required: false },
    observacions: { type: String, required: false },
    email: { type: String, required: false },
    telefon: { type: String, required: false },

}, { collection: 'persones' });





module.exports = mongoose.model('Persona', personaSchema);