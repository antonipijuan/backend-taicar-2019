// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var personaRoutes = require('./routes/persona');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

var vehiclesRoutes = require('./routes/vehicle');
var pressupostosRoutes = require('./routes/pressupost');
var pressupostosdetallRoutes = require('./routes/pressupostdetall');
var reservesRoutes = require('./routes/reserva');
var bookingRoutes = require('./routes/booking');
var facturaRoutes = require('./routes/factura');
var despesaRoutes = require('./routes/despesa');
var facturadetallRoutes = require('./routes/facturadetall');
var pagamentRoutes = require('./routes/pagament');
var numeracioFactRoutes = require('./routes/numeraciofact');


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/TaicarDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/persona', personaRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/vehicle', vehiclesRoutes);
app.use('/pressupost', pressupostosRoutes);
app.use('/pressupostdetall', pressupostosdetallRoutes);
app.use('/reserva', reservesRoutes);
app.use('/booking', bookingRoutes);
app.use('/factura', facturaRoutes);
app.use('/despesa', despesaRoutes);
app.use('/facturadetall', facturadetallRoutes);
app.use('/pagament', pagamentRoutes);
app.use('/numeraciofact', numeracioFactRoutes);


app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});