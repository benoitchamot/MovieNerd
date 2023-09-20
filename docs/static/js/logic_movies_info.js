// API base URL
let api_url = api_base_url;

// Global variables
let selected_genre

function displayWordCloud(keywords) {
    // Format the keywords object for the wordcloud function
    words = []
    for (let d = 0; d < keywords.word.length; d++) {
        words.push({"x": keywords.word[d], "value": keywords.count[d]});
    }

    // Display the wordcloud
    wordcloud(words, 'wordCloud2')
}

function updateDashboard(){
// Update the dashboard based on the selected filters
    let base_url = api_url + 'movies'
    if (selected_genre){base_url += '/g/' + selected_genre;}

    // Get the Top 50 keywords for the selected genre
    let keyword_url = api_url + 'keywords/g/'
    if (selected_genre) {
        keyword_url += selected_genre;
    }
    else {
        keyword_url += 'all';
    }

    // Get the keywords for the selected genre and run the displayWordCloud function
    d3.json(keyword_url).then(displayWordCloud);
}

function genreChangedGenre(value){
    // Callback function for genre dropdown menu
        selected_genre = value;
        d3.select("#genre").text(value);
        updateDashboard();
        updatePlot(value);
}

function removeDuplicates(arr) {
// Remove duplicates from an array
// Source: https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-javascript-array/
    return arr.filter((item,index) => arr.indexOf(item) === index);
}

function populateDropdown(data) {
    let list_genre = []

    // Select dropdown menus from HTML
    let dropDownMenuGenre = d3.select("#selGenre");

    // Loop through the data
    for (let i=0; i<data.length; i++){

        // Split the genre
        list_genre += data[i].Genre.split(", ");

        // Add a comma separator unless it is the last item in the list
        if (i!=data.length-1) {list_genre += ','};
    }

    // Remove duplicates from the list and sort alphabetically
    list_genre = removeDuplicates(list_genre.split(",")).sort();

    // Add the genres to the dropdown menu
    for (let g = 0; g<list_genre.length; g++) {
        dropDownMenuGenre.append("option").attr("value", list_genre[g]).text(list_genre[g]);
    }

    selected_genre = list_genre[0]
    
    // Initialise dashboard
    updateDashboard();
    updatePlot(selected_genre);
}

// Get all directors from the API
d3.json(api_url + 'director_ratings').then(callbackDirector);

// Get all movies from the API
let all_movies_url = api_url + 'movies'
d3.json(all_movies_url).then(populateDropdown)

