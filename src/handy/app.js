/**
 * Created by jeffersonvivanco on 10/9/16.
 */
//handy

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use('/public',express.static(path.join(__dirname,'/public')));
app.set('view engine','hbs');


app.get('/hand', function (req, res) {
    var values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    var suits  = ['&hearts;','&diams;','&clubs;','&spades;'];
    var card = function (value, suit) {
        this.value = value;
        this.suit = suit;
    };
    var cards = [];
    for(var i=0; i<suits.length; i++){
        var suit = suits[i];
        function make(suit, value) {
            var c = new card(value, suit);
            cards.push(c);
        }
        values.forEach(make.bind(this, suit))
    }
    function shuffle(cards) {
        var m = cards.length, t, i;
        while(m){
            i = Math.floor(Math.random() * m--);
            t = cards[m];
            cards[m] = cards[i];
            cards[i] = t;
        }
        return cards;
    }
    cards= shuffle(cards);
    var cardnumber = 5;
    if(req.query.cards != undefined){

        cardnumber = req.query.cards;
    }
    var usercards = [];
    for(var x=0; x<cardnumber; x++){
        usercards.push(cards[x]);
    }

    res.render('card-template', {'usercards' : usercards});



});



app.listen(3000);
console.log("started on port 3000\n");
