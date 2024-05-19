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

  app.get('/facturas', (req, res) => {

       const q = 'SELECT * FROM facturasregistradas';

    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data)
    });
  });

  app.put('/actualizarFactura/:id/:estadoAbonado', async (req, res) => {
    const { id, estadoAbonado } = req.params;
  
    const q = 'UPDATE facturasregistradas SET estadoAbonado =? WHERE id =?';
    db.query(q, [estadoAbonado, id], (err, results) => {
        if (err) throw err;
        res.send(results);
        console.log(results)
    });
});

  app.get('/facturasNoAbonadas', (req, res) => {
    const currentDate = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  
    const q = `
    SELECT *
    FROM facturasregistradas
    WHERE fechaVencimiento - CURDATE() < 10;
    
    
    `;
  
    db.query(q, [currentDate], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  app.get('/facturas/:ano', (req, res) => {

    const ano = req.params.ano;
    const q = `SELECT MONTH(fechaEmision) as mes, 
    SUM(costoTotal) as egresos,
    SUM(iva) as ivaTotal
FROM facturasregistradas 
WHERE YEAR(fechaEmision) = ${ano} 
GROUP BY MONTH(fechaEmision)`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.json(data)

    });
  });

  app.get('/items/:idFactura', (req, res) => {

    const idFactura = req.params.idFactura;
    const q = `SELECT *
FROM detallesfacturas 
WHERE id_factura = ${idFactura}`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.json(data)

    });
  });


  // app.get('/intervalos', (req, res) => {
  //   const intervalo = req.query.intervalo; // Obtener el intervalo seleccionado desde la query
  //   let q;
  //   if (intervalo === 'anual') {
  //     q = 'SELECT YEAR(fechaEmision) AS intervalo, SUM(costoTotal) AS egresos, SUM(ingresoTotal) AS ingresos FROM facturasRegistradas INNER JOIN ingresos ON YEAR(fechaEmision) = YEAR(semana) GROUP BY YEAR(fechaEmision)';
  //   } else if (intervalo === 'mensual') {
  //     q = 'SELECT CONCAT(MONTH(fechaEmision), "/", YEAR(fechaEmision)) AS intervalo, SUM(costoTotal) AS egresos, SUM(ingresoTotal) AS ingresos FROM facturasRegistradas INNER JOIN ingresos ON MONTH(fechaEmision) = MONTH(semana) AND YEAR(fechaEmision) = YEAR(semana) GROUP BY MONTH(fechaEmision), YEAR(fechaEmision)';
  //   } else if (intervalo === 'semanal') {
  //     q = 'SELECT CONCAT(WEEK(fechaEmision), "/", YEAR(fechaEmision)) AS intervalo, SUM(costoTotal) AS egresos, SUM(ingresoTotal) AS ingresos FROM facturasRegistradas INNER JOIN ingresos ON WEEK(fechaEmision) = WEEK(semana) AND YEAR(fechaEmision) = YEAR(semana) GROUP BY WEEK(fechaEmision), YEAR(fechaEmision)';
  //   } else {
  //     return res.status(400).json({ error: 'Intervalo no válido' });
  //   }
  //   db.query(q, (err, data) => {
  //     if (err) return res.status(500).json({ error: 'Error en la consulta' });
  //     return res.json(data);
  //   });
  // });

  app.get('/anos', (req, res) => {
    const q = 'SELECT DISTINCT YEAR(fechaEmision) as año FROM facturasregistradas';
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      const anos = data.map(item => item.año);
      return res.json(anos);
    });
  });
  
  // app.listen(3000, () => {
  //   console.log('Servidor escuchando en el puerto 3000');
  // });

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

app.post('/proveedor/creacion', (req, res) => {
    const { nombre, cuit, telefono, email, nota } = req.body;
  
    const q = 'INSERT INTO proveedor SET id = NULL, nombre = ?, cuit = ?, telefono = ?, email = ?, nota = ?';
    db.query(q, [nombre, cuit, telefono, email, nota], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
      } else {
        console.log(results);
        res.status(200).json({ message: 'Proveedor creado exitosamente', data: results });
      }
    });
  });

  app.delete('/proveedor/eliminar/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    const q = 'DELETE FROM `proveedor` WHERE `proveedor`.`id` = ?';
    db.query(q, [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
      } else {
        console.log(results);
        res.status(200).json({ message: 'Proveedor creado exitosamente', data: results });
      }
    });
  });
  
  

app.listen(8800, ()=>{
  console.log("Connected to backend!");
  })
