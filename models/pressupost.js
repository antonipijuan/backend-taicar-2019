var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var pressupostSchema = new Schema({
    num: { type: Number, required: [true, 'El	nombre	es	necesario'] },
    data: { type: String, required: [true, 'El	data	es	necesario'] },
    data_vigencia: { type: String, required: [true, 'El	data	es	necesario'] },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'El id client esun campo obligatorio ']
    },
    preu_brut: { type: Number, required: false },
    preu_net: { type: Number, required: false },
    observacions: { type: String, required: false },
    estat: { type: String, required: true }

});





module.exports = mongoose.model('Pressupost', pressupostSchema);