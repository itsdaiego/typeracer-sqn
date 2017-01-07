var express = require('express')
var app = express()
app.set('view engine', 'jade');


var router = express.Router()

//http interceptor
router.use(function(req, res, next) {
    next()
});


app.get('/', function (req, res) {
    res.render('index.jade')
})


router.get('/users', function(req, res){
    res.send('Hello users')
})

app.use('/api', router)


app.listen(3000)
