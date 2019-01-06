var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var facturadetallSchema = new Schema({
    id_factura: {
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        required: [true, 'El id vehicle esun campo obligatorio ']
    },
    data_inicial: { type: String, required: [true, 'El	data	es	necesario'] },
    data_final: { type: String, required: [true, 'El	data	es	necesario'] },
    viatgers: { type: Number, required: false },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'El id vehicle esun campo obligatorio ']
    },
    temporada: { type: String, required: [true, 'El	data	es	necesario'] },
    dies: { type: Number, required: [true, 'El	data	es	necesario'] },
    preu: { type: Number, required: [true, 'El	data	es	necesario'] }
});

module.exports = mongoose.model('FacturaDetall', facturadetallSchema);