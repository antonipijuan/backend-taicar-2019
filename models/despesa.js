var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var despesaSchema = new Schema({
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'El id vehicle esun campo obligatorio ']
    },
    data: { type: String, required: [true, 'La data es necessaria'] },
    preu: { type: Number, required: [true, 'El preu es necesario'] },
    tipus: { type: String, required: true },
    observacions: { type: String, required: false }

}, { collection: 'despeses' });



module.exports = mongoose.model('Despesa', despesaSchema);