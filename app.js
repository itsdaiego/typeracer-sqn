var express = require('express')
var app = express()
app.set('view engine', 'jade');


var router = express.Router()

router.use(function(req, res, next) {
    next()
});


app.get('/', function (req, res) {
    res.render('index')
})

app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    }
    res.render('room', room)
})

app.listen(3000)
