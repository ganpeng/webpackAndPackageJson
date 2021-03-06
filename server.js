var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(express.static(path.join(__dirname, '/build')))
//use in webpack development mode
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    hot : true
}));
app.use(require('webpack-hot-middleware')(compiler));

//use in webpack production mode
//app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3000, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});
