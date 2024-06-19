document.addEventListener("DOMContentLoaded", function() {
    const jokeContainer = document.getElementById('joke');

    function fetchJoke() {
        fetch('https://v2.jokeapi.dev/joke/Any')
            .then(response => response.json())
            .then(data => {
                if (data.type === 'single') {
                    jokeContainer.textContent = data.joke;
                } else {
                    jokeContainer.textContent = `${data.setup} ... ${data.delivery}`;
                }
            })
            .catch(error => {
                jokeContainer.textContent = 'Erreur lors du chargement de la blague :(';
                console.error('Erreur:', error);
            });
    }

    fetchJoke();
});