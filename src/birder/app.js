/**
 * Created by jeffersonvivanco on 10/9/16.
 */
//birder
var express = require('express');
var app = express();

//adding requires and middleware to enable static file serving
var path  = require('path');
app.use('/public',express.static(path.join(__dirname,'/public')));
//-------------------------------------//
//set up to use handlebars
app.set('view engine', 'hbs');
//------------------------------------//
//Setting up middleware to allow access to the content of the request body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use('/birds', function (req, res, next) {
    console.log(req.method + ' ' + req.originalUrl);
    console.log('=====');
    // console.log('body: '+res.body.name);
    next();
});
//Global array of birds, with some additions to birds, and also constructor for creating bird object
var birds = [];
var bird = function (name, quantity) {
    this.name = name;
    if(quantity != null){
        this.quantity = quantity;
    }
    else{
        this.quantity = 0;
    }
};

birds.push(new bird('Bald Eagle', 3));
birds.push(new bird('Yellow Billed Duck',7));
birds.push(new bird('Great Cormorant',4));

app.get('/',function (req, res) {
    res.render('bird-template');
});
app.get('/settings', function (req, res) {
   res.render('settings');
});
app.get('/birds', function (req, res) {
    var timesSeen = undefined;

    if(req.query.times != undefined){
        var newList = [];
        timesSeen = req.query.times;
        function filterByTimesSeen(bird) {
            return bird.quantity >= timesSeen;
        }
        newList = birds.filter(filterByTimesSeen);
        res.render('list',{'birds' : newList} );
    }
    else{
        res.render('list', {'birds' : birds});
    }

});
app.post('/birds', function (req, res) {
    var birdname = req.body.bird;
    function findBird(array, element) {
        var index = -1;
        for(var i=0; i<array.length; i++){
            if(array[i].name === birdname){
                index = i;
            }
        }
        return index;
    }
    var indexOfBird = findBird(birds, birdname)
    if(indexOfBird>=0){
        birds[indexOfBird].quantity++;
    }
    else{
        birds.push(new bird(birdname, 1))
    }
    res.redirect('/birds');
});
app.listen(3000);
console.log('server started on port 3000\n');
