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

app.get('/room', function (req, res) {
    res.render('room')
})


//apis
router.get('/rooms', function(req, res){
    console.log('...')
})

app.use('/api', router)


app.listen(3000)
