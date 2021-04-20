'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
// Utilize ExpressJS functionality to parse the body of the request

// Specify a directory for static resources


// define our method-override reference

// Set the view engine for server-side templating

// Use app cors


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', renderTen);
app.post('/savetodata', saveToDataBase);
app.get('/favorite-quotes', renderDataFromDB);
app.put('/update/:id', updateData);
app.delete('/update/:id', deleteData);



// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function saveToDataBase(req, res)
{
    const {character, image, quote }=req.body;
    const SQL= 'INSERT INTO charac (character, image, quote) VALUES($1, $2, $3);'
    let val=[character, image, quote];
    client.query(SQL, val).then(()=>{
        res.redirect('/favorite-quotes');
    })
}
function renderDataFromDB(req, res)
{
    const SQL="SELECT * FROM charac;"
    client.query(SQL).then(data=>{

        const alval=data.rows;
        res.render('secondPage', {alval:alval});
    });
}

function updateData(req, res)
{
    const {character,image, quote, characterDirection}=req.body;
    const id=req.params.id;
    const SQL ="UPDATE charac SET character=$1, image=$2, quote=$3, characterDirection=$4 WHERE id= $5;"
    const val=[character,image, quote, characterDirection, id];
    client.query(SQL, val).then(()=>{
        res.redirect('/favorite-quotes');
    })
}
function deleteData(req, res)
{
    
    const SQL=`DELETE FROM charac WHERE id=${req.params.id} `
    client.query(SQL).then(()=>{
        res.redirect('/favorite-quotes');
})}
function Sin(data)
{
    this.character=data.character;
    this.image=data.image;
    this.quote=data.quote;
    this.characterDirection=data.characterDirection;
}

function renderTen(req, res)
{
    const url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
        superagent.get(url).set('User-Agent', '1.0').then(data=>{
            const returneddata= data.body.map(element=> new Sin(element));
            res.render('index', {returneddata:returneddata});
        })

}
// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
