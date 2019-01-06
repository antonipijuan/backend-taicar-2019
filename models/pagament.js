var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var pagamentSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'El id client esun campo obligatorio ']
    },
    factura: {
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        required: [true, 'El id factura esun campo obligatorio ']
    },
    import_pagat: { type: Number, required: [true, 'El	import	es	necesario'] },
    data_pagament: { type: String, required: [true, 'El	data	es	necesario'] },
    observacions: { type: String, required: false }
}, { collection: 'pagaments' });

module.exports = mongoose.model('Pagament', pagamentSchema);