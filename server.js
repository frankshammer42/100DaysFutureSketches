const  express = require('express');
const path = require('path');
let sensorDataCollection;
let app = express();
app.use(express.static(__dirname + '/public')); app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('trust proxy', true);

let port = process.env.port || 8080;

app.get('/', function(req, res) {
	res.render('index.html');
});

let server = app.listen(process.env.PORT || 3000, function() {
	console.log('Future Sketch Server is Running on', server.address().port);
});

