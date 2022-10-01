/*********************************************************************************** 
* WEB422 – Assignment 1 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students.
*
* Name: Chanwoong Park     Student ID: 166686188      Date: Sep 16, 2022 
* Cyclic Link: 
* ********************************************************************************/
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const HTTP_PORT = process.env.PORT || 8080;
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const app = express()
app.use(cors())
app.use(express.json())
app.get('/', (req, res)=>{
    res.json({ message: "API Listening" })
})
app.post('/api/movies', async (req, res) => {
    try{ const new_Movie = await db.addNewMovie(req.body)
        res.status(201).json(new_Movie)
    }catch(err){ res.status.json({ message: err.message }) }
})
app.get('/api/movies', async (req, res) => {
    try{ const movies = await db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        res.status(200).json({ movies })
    }catch(err){ res.status.json({ message: err.message })}
})
app.get('/api/movies/:id', async (req, res) => {
    try { const movieByID = await db.getMovieById(req.params.id)
        if (movieByID) res.json(movieByID)
        else res.status(404).json({ error: 'Not found' })
    } catch (err) { res.status.json({ message: err.message })}
})
app.put('/api/movies/:id', async (req, res) => {
    try{
        const updatedMovie = await db.updateMovieById(req.body, req.params.id)
        if (!updatedMovie.modifiedCount) res.status(404).json({ message: 'No movie to update was found' })
        else res.status(204).json({ message: "Updated!" })
    }catch(err){ res.status.json({ message: err })}
})
app.delete('/api/movies/:id', async (req, res) => {
    try{
        const deletedMovie = await db.deleteMovieById(req.params.id)
        if (!deletedMovie.deletedCount) res.status(404).json({ message: 'No movie to delete was found' })
        else res.status(204).json({ message: "Deleted!" })
    }catch(err){ res.status.json({ message: err }) }
})
db.initialize(process.env.MONGODB_CONN_STRING)
.then(() => { app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`)})})
.catch((err) => { console.log(err) })