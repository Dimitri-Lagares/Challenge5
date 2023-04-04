const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PUERTO = process.env.PORT || 3055;

const app = express();

let cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'schemacars',
})

connection.connect(error => {
    if (error) throw error;
    console.log('Base de datos corriendo')
})

app.get('/catalogo', (req, res) => {
    const sql = 'SELECT * FROM catalogocarros';

    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else{
            res.send('Not result');
        }
    });
});

app.get('/catalogo/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM catalogocarros WHERE id = ' + id;

    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else{
            res.send('Sin resultados');
        }
    });
});

app.post('/agregar', (request, response) => {
    connection.query('INSERT INTO catalogocarros SET ?', request.body, (error, result) => {
        if (error) throw error;
        response.send('Añadido exitosamente');
    });
});


app.put('/actualizar/:id', (request, response) => {
    const id = request.params.id;
    connection.query('UPDATE catalogocarros SET ? WHERE id = ?', [request.body, id], (error, result) => {
        if (error) throw error;
        response.send('Actualizado exitosamente');
    });
});

app.listen(PUERTO, ()=> console.log(`Servidor corriendo en el puerto '${PUERTO}'`));
