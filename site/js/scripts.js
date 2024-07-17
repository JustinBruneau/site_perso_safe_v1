document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movie = urlParams.get('movie');

    if (movie) {
        // Charger les informations du film
        const movieData = {
            movie1: {
                title: "Titre du Film 1",
                trailer: "https://www.youtube.com/watch?v=Quf4qIkD3KY&ab_channel=20thCenturyStudiosFR", // Remplacez 'XXXXX' par l'ID de la vidéo YouTube
                actors: "Acteur 1, Acteur 2, Acteur 3",
                synopsis: "Ceci est le synopsis du Film 1.",
                fullMovie: "assets/movies/movie1.mp4"
            },
            // Ajoutez plus de films ici
        };

        const movieInfo = movieData[movie];
        if (movieInfo) {
            document.getElementById('movie-title').textContent = movieInfo.title;
            document.getElementById('movie-trailer').src = movieInfo.trailer;
            document.getElementById('movie-actors').textContent = movieInfo.actors;
            document.getElementById('movie-synopsis').textContent = movieInfo.synopsis;
            document.getElementById('full-movie').src = movieInfo.fullMovie;
        }
    }
});
