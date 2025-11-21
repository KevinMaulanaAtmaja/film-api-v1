const express = require("express");

const app = express();

app.use(express.json());

const port = 3000;

let movies = [
    { id: 1, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
    { id: 2, title: "The Dark Knight", director: "Christopher Nolan", year: 2008 },
    { id: 3, title: "Spirited Away", director: "Hayao Miyazaki", year: 2001 },
];

let directors = [
    { id: 1, name: "Christopher Nolan", birthYear: 1970 },
    { id: 2, name: "Joko Anwar", birthYear: 1976 },
    { id: 3, name: "Zhang Yimou", birthYear: 1950 },
];

// test root
app.get("/", (req, res) => {
    res.send("Server API manajemen film berjalan!");
});

// get all movies
app.get("/movies", (req, res) => {
    res.json(movies);
});

// get movie by id
app.get("/movies/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
        return res.status(404).json({ message: "Film tidak ditemukan" });
    }
    res.json(movie);
});

// post new movie by id
app.post("/movies", (req, res) => {
    const { title, director, year } = req.body;

    if (!title || !director || !year) {
        return res.status(400).json({ message: "Semua field (title, director, year) harus diisi" });
    }

    const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
    const newMovie = { id: newId, title, director, year };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// update movie by id
app.put("/movies/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex((m) => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Film tidak ditemukan" });
    }

    const { title, director, year } = req.body;

    if (!title || !director || !year) {
        return res.status(400).json({ message: "Semua field (title, director, year) harus diisi untuk pembaruan" });
    }

    const updatedMovie = { id: movieId, title, director, year };
    movies[movieIndex] = updatedMovie;
    res.status(200).json(updatedMovie);
});

// delete movie by id
app.delete("/movies/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex((m) => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Film tidak ditemukan" });
    }

    movies.splice(movieIndex, 1);
    res.status(204).send();
    // res.status(200).json({ message: "Film berhasil dihapus" });
});

// get all directors
app.get("/directors", (req, res) => {
    res.json(directors);
});

// get by id
app.get("/directors/:id", (req, res) => {
    const directorId = parseInt(req.params.id);
    const director = directors.find((d) => d.id === directorId);

    if (!director) {
        return res.status(404).json({ message: "Sutradara tidak ditemukan" });
    }
    res.json(director);
});

// post by id
app.post("/directors", (req, res) => {
    const { name, birthYear } = req.body;

    if (!name || !birthYear) {
        return res.status(400).json({ message: "Semua field (name, birthYear) harus diisi" });
    }

    const newId = directors.length > 0 ? directors[directors.length - 1].id + 1 : 1;
    const newDir = { id: newId, name, birthYear };

    directors.push(newDir);
    return res.status(201).json({ message: "Sutradara berhasil ditambahkan", data: newDir });
});

// update by id
app.put("/directors/:id", (req, res) => {
    const directorId = parseInt(req.params.id);
    const directorIndex = directors.findIndex((d) => d.id === directorId);

    if (directorIndex === -1) {
        return res.status(404).json({ message: "Sutradara tidak ditemukan" });
    }

    const { name, birthYear } = req.body;

    if (!name || !birthYear) {
        return res.status(400).json({ message: "Semua field (name, birthYear) harus diisi untuk pembaruan" });
    }

    const updatedDirector = { id: directorId, name, birthYear };
    directors[directorIndex] = updatedDirector;
    res.status(200).json({ message: "Sutradara berhasil diperbarui", data: updatedDirector });
});

// delete by id
app.delete("/directors/:id", (req, res) => {
    const directorId = parseInt(req.params.id);
    const directorIndex = directors.findIndex((d) => d.id === directorId);

    if (directorIndex === -1) {
        return res.status(404).json({ message: "Sutradara tidak ditemukan" });
    }

    directors.splice(directorIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server aktif di http://localhost:${port}`);
});
