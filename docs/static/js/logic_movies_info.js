// API base URL
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/';
//let api_url = 'http://127.0.0.1:5000/api/v1.0/'

// Global variables
let MOVIES = [];
let selected_genre = "0"
let selected_actor = "0"

function displayWOrdCloud(keywords) {

    // Trace for the movie revenue per year
    let trace = {
        x: keywords.word.slice(0,40),
        y: keywords.count.slice(0,40),
        type: 'bar',
        marker: {
            color: '#9B2915'
        }
    };
    
    // Data array
    let data = [trace]
    
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("wordCloud", data)
}

function displayBubbleChart(movies) {
    // Display bubble chart

    // Get data in arrays
    let titles = []
    let release = []
    let revenue = []

    for (let i = 0; i<movies.length; i++){
        titles.push(movies[i]['Title'])
        release.push(com_convertStringToYear(movies[i]['Release Date']));
        revenue.push(movies[i]['Revenue']);
    }

    function scaleSize(value) {
        return Math.sqrt(value)/1000;
    }
    
    // Trace for the movie revenue per year
    let trace = {
        x: release,
        y: revenue,
        mode: 'markers',
        marker: {
            size: revenue.map(index => scaleSize(index)),
            color: '#9B2915'
        },
        text: titles
    };
    
    let layout = {
        xaxis: {title: {text: 'Release Year'}},

        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 20,
            pad: 0
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    };
    
    // Data array
    let data = [trace];
    
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubbleChart", data, layout);
}

function updateDashboard(){
// Update the dashboard based on the selected filters
    let base_url = api_url + 'movies'
    if (selected_actor != '0'){base_url += '/a/' + selected_actor;}
    if (selected_genre != '0'){base_url += '/g/' + selected_genre;}

    // Print the URL for debug purposes
    console.log(base_url);
    
    d3.json(base_url).then(function(data){
        displayBubbleChart(data);
    })

    // Get the Top 50 keywords for the selected genre
    let keyword_url = api_url + 'keywords/g/'
    if (selected_genre == '0') {
        keyword_url += 'all';
    }
    else {
        keyword_url += selected_genre;
    }

    // Print the URL for debug purposes
    console.log(keyword_url);

    d3.json(keyword_url).then(function(data){
        displayWOrdCloud(data);
    })
}

function genreChangedGenre(value){
    // Callback function for genre dropdown menu
        selected_genre = value;
        d3.select("#genre").text(value);
        updateDashboard();
    }
    
    function genreChangedActor(value){
    // Callback function for actor dropdown menu
        selected_actor = value;
        d3.select("#actor").text(value);
        updateDashboard();
    }

function removeDuplicates(arr) {
// Remove duplicates from an array
// Source: https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-javascript-array/
    return arr.filter((item,index) => arr.indexOf(item) === index);
}

function populateDropdown(data) {
    let list_genre = []
    let list_actor = []

    // Select dropdown menus from HTML
    let dropDownMenuGenre = d3.select("#selGenre");
    let dropDownMenuActor = d3.select("#selActor");

    // Add an option to select any genre and any actor
    dropDownMenuGenre.append("option").attr("value", '0').text('-- Any genre');
    dropDownMenuActor.append("option").attr("value", '0').text('-- Any actor');

    // Loop through the data
    for (let i=0; i<data.length; i++){

        // Split the genre
        list_genre += data[i].Genre.split(", ");
        list_actor += data[i].Actor.split(", ");

        // Add a comma separator unless it is the last item in the list
        if (i!=data.length-1) {list_genre += ','};
        if (i!=data.length-1) {list_actor += ','};
    }

    // Remove duplicates from the list and sort alphabetically
    list_genre = removeDuplicates(list_genre.split(",")).sort();
    list_actor = removeDuplicates(list_actor.split(",")).sort();

    // Add the genres to the dropdown menu
    for (let g = 0; g<list_genre.length; g++) {
        dropDownMenuGenre.append("option").attr("value", list_genre[g]).text(list_genre[g]);
    }

    // Add the actors to the dropdown menu
    for (let a = 0; a<list_actor.length; a++) {
        dropDownMenuActor.append("option").attr("value", list_actor[a]).text(list_actor[a]);
    }
    
    // Initialise dashboard
    updateDashboard();

    
}

// Get all movies from the API
let all_movies_url = api_url + 'movies'
d3.json(all_movies_url).then(populateDropdown)