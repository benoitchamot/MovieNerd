// API base URL
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/';

// Global variables
let MOVIES = [];
let ACTORS = [];
let CHARACTERS = [];

// Create table of movies
function movieTable(movies){

    // Loop through all the movies
    for (let i = 0; i < movies.length; i++){
        let movie = movies[i];

        // Append one table row `tr` to the table body
        let new_tr = d3.select("#tableMovies>tbody").append("tr");

        // Append one cell for the movie title
        new_tr.append("td").text(movie.Title);
        new_tr.append("td").text(movie.Genre);
    }
}

// Display movies
function getMovies(data){
    MOVIES = data;
    console.log("Movies data imported.");
    console.log(MOVIES);
    movieTable(MOVIES);
}

// Display actors
function getActors(data){
    ACTORS = data;
    console.log("Actors data imported.");
    console.log(ACTORS);
}

// Display characters
function getCharacters(data){
    CHARACTERS = data;
    console.log("Characters data imported.");
    console.log(CHARACTERS);
}

// Call API to get all movies
let all_movies_url = api_url + 'movies';
d3.json(all_movies_url).then(getMovies);

// Call API to get all actors
let all_actors_url = api_url + 'actors';
d3.json(all_actors_url).then(getActors);

// Call API to get all characters
let all_characters_url = api_url + 'characters';
d3.json(all_characters_url).then(getCharacters);

console.log('Ready to rumble...')