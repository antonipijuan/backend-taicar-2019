var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var numeracioFactSchema = new Schema({
    part_fixa: { type: String, required: [true, 'El part fixa es necesario'] },
    num_correlatiu: { type: Number, required: false },
    anualitat: { type: Number, required: false }
});


module.exports = mongoose.model('NumeracioFact', numeracioFactSchema);