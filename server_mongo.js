require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database_mongo.js");

const Movie = require("./model/Movie.js");
const Director = require("./model/Director.js");

connectDB();
const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

// ==================== ROUTES ===================

// ==================== Movies ======================
app.get("/status", (req, res) => {
    res.json({ ok: true, service: "film-api" });
});

// GET /movies - pake Mongoose find()
app.get("/movies", async (req, res, next) => {
    // tmbhkn next utk error handler
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (err) {
        next(err); // teruskan error ke error handler
    }
});

// GET /movies/:id - pake Mongoose findById()
app.get("/movies/:id", async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: "Film tidak ditemukan" });
        }
        res.json(movie);
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// POST /movies - pake Mongoose save()
app.post("/movies", async (req, res, next) => {
    try {
        const newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
        });
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(0).json({ error: err.message });
        }
        next(err);
    }
});

// PUT /movies/:id - pake Mongoose findByIdAndUpdate()
app.put("/movies/:id", async (req, res, next) => {
    try {
        // hanya ambil field yg diizinkan utk diupdate dari body
        const { title, director, year } = req.body;
        if (!title || !director || !year) {
            return res.status(400).json({ error: "title, director, year wajib diisi" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, director, year }, // hanya update field ini
            { new: true, runValidators: true }
        );
        if (!updatedMovie) {
            return res.status(404).json({ error: "Film tidak ditemukan" });
        }
        res.json(updatedMovie);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// DELETE /movies/:id - pake Mongoose findByIdAndDelete()
app.delete("/movies/:id", async (req, res, next) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ error: "Film tidak ditemukan" });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// ==================== Director ======================
// GET /directors - pake Mongoose find()
app.get("/directors", async (req, res, next) => {
    // tmbhkn next utk error handler
    try {
        const directors = await Director.find({});
        res.json(directors);
    } catch (err) {
        next(err); // teruskan error ke error handler
    }
});

// GET /directors/:id - pake Mongoose findById()
app.get("/directors/:id", async (req, res, next) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ error: "Director tidak ditemukan" });
        }
        res.json(director);
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// POST /directors - pake Mongoose save()
app.post("/directors", async (req, res, next) => {
    try {
        const newDirector = new Director({
            name: req.body.name,
            birthYear: req.body.birthYear,
        });
        const savedDirector = await newDirector.save();
        res.status(201).json(savedDirector);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(0).json({ error: err.message });
        }
        next(err);
    }
});

// PUT /directors/:id - pake Mongoose findByIdAndUpdate()
app.put("/directors/:id", async (req, res, next) => {
    try {
        // hanya ambil field yg diizinkan utk diupdate dari body
        const { name, birthYear } = req.body;
        if (!name || !birthYear) {
            return res.status(400).json({ error: "name, birthYear wajib diisi" });
        }

        const updatedDirector = await Director.findByIdAndUpdate(
            req.params.id,
            { name, birthYear }, // hanya update field ini
            { new: true, runValidators: true }
        );
        if (!updatedDirector) {
            return res.status(404).json({ error: "Director tidak ditemukan" });
        }
        res.json(updatedDirector);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// DELETE /directors/:id - pake Mongoose findByIdAndDelete()
app.delete("/directors/:id", async (req, res, next) => {
    try {
        const deletedDirector = await Director.findByIdAndDelete(req.params.id);
        if (!deletedDirector) {
            return res.status(404).json({ error: "Director tidak ditemukan" });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Format ID tidak valid" });
        }
        next(err);
    }
});

// fallback 404
app.use((req, res) => {
    res.status(404).json({ error: "Rute tidak ditemukan" });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan di server" });
});

app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost: ${PORT}`);
});
