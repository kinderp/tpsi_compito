const express = require('express');
const app = express();

const port = 8888;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("compito.db");

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/biglietti', (req, res) => {
    db.all(`SELECT * FROM biglietto`, (error, rows) => {
        if(error) {
            console.error(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(error.response);
        }
        response = {
            "code": 1,
            "data": rows
        }
        res.status(200).send(response);
    });
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.post('/biglietto', (req, res) => {
    const id = Math.random().toString().replace("0.", "");
    const entrata = new Date().getTime(); //milliseconds
    console.log(id);
    db.run(`INSERT INTO biglietto (id, entrata) VALUES (?, ?)`, id, entrata, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": {
                "id": id,
                "entrata": Date(entrata)
            }
        }
        res.status(201).send(response);
    });
});


app.put('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    const uscita = new Date().getTime(); //milliseconds
    db.run(`UPDATE biglietto SET uscita = ?  WHERE id = ?`, uscita, id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": {
                "id": id,
                "uscita": Date(uscita),
            }
        }
        res.status(201).send(response);
    });
});

app.get('/pagamento/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM biglietto WHERE id = ?`, id, (error, row) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        const entrata = row.entrata;
        const uscita = row.uscita;
        const elapsed_seconds = (uscita - entrata)/1000;
        const minutes = elapsed_seconds/60;
        const fees = minutes*0.01;

        response = {
            "code": 1,
            "data": {
                "id": id,
                "costo": fees
            }
        }
        res.status(200).send(response);
    });
});

app.get('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM biglietto WHERE id = ?`, id, (error, row) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": {
                "id": id,
                "row": row
            }
        }
        res.status(200).send(response);
    });
});

app.delete('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM biglietto WHERE id = ?`, id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": result
        }
        res.status(200).send(response);
    });
});
