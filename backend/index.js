// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql');

// const app = express();
// app.use(bodyParser.json());

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'proveedores'
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to the database');
// });

// app.get('/api/proveedores', (req, res) => {
//   connection.query('SELECT * FROM proveedor', (err, results) => {
//     if (err) throw err;
//     res.send(results);
//   });
// });

// app.put('/api/proveedores/:id', (req, res) => {
//   const { id } = req.params;
//   const { nota } = req.body;

//   connection.query('UPDATE proveedor SET nota =? WHERE id =?', [nota, id], (err, results) => {
//     if (err) throw err;
//     res.send(results);
//   });
// });

// app.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });



import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database: "pyramid"
  })
  
app.get('/proveedor', (req, res) => {
    const q = 'SELECT * FROM proveedor';
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data)
    });
  });
  


  app.put('/proveedor/:id', (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const cuit = req.body.cuit;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const nota = req.body.nota;
    const q = 'UPDATE proveedor SET nombre =?, cuit =?, telefono =?, email =?, nota =? WHERE id =?';
    db.query(q, [nombre, cuit, telefono, email, nota, id], (err, results) => {
        if (err) throw err;
        res.send(results);
        console.log(results)
    });
});

app.listen(8800, ()=>{
  console.log("Connected to backend!");
  })
