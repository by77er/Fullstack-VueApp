const express = require('express')
const postgres = require('pg')
const app = express()
app.use(express.json())

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const port = 3000

// connect to db
const { Client } = require('pg')
const client = new Client({ database: 'router_app' })
client.connect()

// not implementing access control as this is only a POC

// index redirect
app.get('/', (req, res) => { return res.redirect('/api/machines') })

// allow users to retrieve a list of all machines
app.get('/api/machines', async (req, res) => {
    const db_res = await client.query('SELECT * FROM public.machines')
    res.send(JSON.stringify({ machines: db_res.rows }))
})

// allow users to see the details of one machine based on its id
app.get('/api/machines/:machineID', async (req, res) => {
    let db_res = {}
    try {
        db_res = await client.query('SELECT * FROM public.machines WHERE id=$1', [req.params.machineID])
    } catch (err) {
        console.log(err)
        return res.status(500).send('DB error.')
    }
    if (db_res.rowCount == 0) {
        res.status(404).send('Machine not found.')
    } else {
        res.send(JSON.stringify(db_res.rows[0]))
    }
})

// allows users to create new machines
app.post('/api/machines/', async (req, res) => {
    let db_res = {}
    for (let key of [req.body.name, req.body.os, req.body.cores, req.body.ram, req.body.running]) {
        if (typeof key == 'undefined') {
            return res.status(400).send('Invalid input: missing key')
        }
    }
    try {
        db_res = await client.query(
            'INSERT INTO public.machines (name, os, cores, ram, running) VALUES($1, $2, $3, $4, $5) RETURNING id',
            [req.body.name, req.body.os, req.body.cores, req.body.ram, req.body.running]
        )
    } catch (err) {
        console.log(err)
        return res.status(500).send('DB error.')
    }
    res.status(201).send(JSON.stringify(db_res.rows[0]))
})

// allows users to modify an existing machine based on its id
app.post('/api/machines/:machineID', async (req, res) => {
    for (let key of [req.body.name, req.body.os, req.body.cores, req.body.ram, req.body.running]) {
        if (typeof key == 'undefined') {
            return res.status(400).send('Invalid input: missing keys')
        }
    }
    try {
        db_res = await client.query(
            'UPDATE public.machines SET name=$1, os=$2, cores=$3, ram=$4, running=$5 WHERE id=$6',
            [req.body.name, req.body.os, req.body.cores, req.body.ram, req.body.running, req.params.machineID]
        )
    } catch (err) {
        console.log(err)
        return res.status(500).send('DB error.')
    }
    res.send();
})

// allows users to delete an existing machine based on its id
app.delete('/api/machines/:machineID', async (req, res) => {
    let db_res = {}
    try {
        db_res = await client.query('DELETE FROM public.machines WHERE id=$1', [req.params.machineID])
    } catch (err) {
        console.log(err)
        return res.status(500).send('DB error.')
    }
    res.send();
})

// start server
const server = app.listen(port, () => console.log(`Backend API listening on http://localhost:${port}/api`))

// handle ^C
process.on('SIGINT', () => {
    console.info('SIGTERM received. Cleaning up...')
    server.close()
    client.end()
})
