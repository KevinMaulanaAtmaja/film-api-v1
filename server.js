const express = require("express");

const app = express();

app.use(express.json());

const port = 3000;

let movies = [
    { id: 1, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
    { id: 2, title: "The Dark Knight", director: "Christopher Nolan", year: 2008 },
    { id: 3, title: "Spirited Away", director: "Hayao Miyazaki", year: 2001 },
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

app.listen(port, () => {
    console.log(`Server aktif di http://localhost:${port}`);
});
