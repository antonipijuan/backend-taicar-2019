var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var bookingSchema = new Schema({
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'El id vehicle esun campo obligatorio ']
    },
    data: { type: Date, required: [true, 'La data es necessaria'] },
    disponible: { type: Boolean, required: [true, 'El disponible es necesario'] },
    pressupost: { type: String, required: [false, 'El disponible es necesario'] },
    // pressupost: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Pressupost',
    //     required: [false]
    // }
}, { collection: 'bookings' });



module.exports = mongoose.model('Booking', bookingSchema);