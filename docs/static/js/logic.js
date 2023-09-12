// API base URL
let api_url = 'http://127.0.0.1:5000/api/v1.0/'

// Create table of movies
function movieTable(movies){

    // Loop through all the movies
    for (let i = 0; i < movies.length; i++){
        let movie = movies[i];

        // Append one table row `tr` to the table body
        let new_tr = d3.select("#tableMovies>tbody").append("tr")

        // Append one cell for the movie title
        new_tr.append("td").text(movie.Title)
        new_tr.append("td").text(movie.Genre)
    }
}

// Display movies
function getMovies(data){
    console.log(data);

    movieTable(data);
}

// Call API to get all movies
let all_movies_url = api_url + 'movies';
d3.json(all_movies_url).then(getMovies);