var express = require('express')
var app = express()
app.set('view engine', 'jade');


var router = express.Router()

//http interceptor
router.use(function(req, res, next) {
    next()
});


//pages
app.get('/', function (req, res) {
    res.render('index')
})

app.get('/rooms', function (req, res) {
    var rooms = ['supimpa', 'soso', 'nope'];
    res.render('rooms', {rooms: rooms})
})


//apis
app.get('/room/:roomname', function(req, res){
    res.render('room', {name: req.params.roomname})
})

app.listen(3000)
