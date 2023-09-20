// Set up base URL for fetching data
const baseURL = api_base_url + 'actors_ratings/0';

// Initializing the page with a default look
function init() {

    // Fetch data and process it for the top actors by rating chart
    fetchData(processTopActorsByRating);
    
    // Fetch data and process it for the rating distribution chart
    fetchData(processRatingDistribution);

    // Fetch the JSON data by using D3 library
    function fetchData(callback) {
        d3.json(baseURL).then(callback);
    }

    function processTopActorsByRating(data) {

        // Extract actors and their ratings from data
        let actorRatings = [];
        for (let i = 0; i < Object.keys(data.Actor).length; i++) {
        let actor = data.Actor[i];
        let imdbRating = data.imdbRating[i];
        actorRatings.push({actor: actor, imdbRating: imdbRating});
        }
        
        // Sort actors by ratings and pick top 10
        let actorRatingsSorted = actorRatings.sort((a, b) => b.imdbRating - a.imdbRating);
        let topActorRatings = actorRatingsSorted.slice(0, 10);
    
        // Prepare data for plotting
        let trace = {
            x: topActorRatings.map(object => object.actor),
            y: topActorRatings.map(object => object.imdbRating),
            name: "Top 10 Actors by Average Rating",
            type: "bar",
            marker: {
                color: '#A2D5F2'
            }};

        // Create the layout 
        let layout = {
            height: 700,
            title: "Top 10 Actors by Average Rating"
        };

        // Plot the Bar Chart
        Plotly.newPlot("barChart", [trace], layout);
    }   

    function processTopActorsByMovieCount(data) {
     
        // Extract actors and movie counts from data
        let actorMoviesCount = [];
        for (let i = 0; i < Object.keys(data.Actor).length; i++) {
            let actor = data.Actor[i];
            let moviesCount = data.count_of_movies[i];
            actorMoviesCount.push({actor: actor, moviesCount: moviesCount});
            }
      
        // Filter, sort actors by movie counts and pick top 10
        let actorMoviesCountSorted = actorMoviesCount
        .filter(entry => entry.actor && entry.moviesCount) 
        .sort((a, b) => b.moviesCount - a.moviesCount);
        let topMoviesCount = actorMoviesCountSorted.slice(0, 10);
    
        // Prepare data for plotting
        let trace = {
            x: topMoviesCount.map(object => object.actor),
            y: topMoviesCount.map(object => object.moviesCount),
            name: "Top 10 Actors by Movies Count",
            type: "bar",
            marker: {
                color: '#CEA2FD'
            }
        };

        // Create the layout 
        let layout = {
            height: 700,
            title: "Top 10 Actors by Movies Count"
        };

        // Plot the Bar Chart
        Plotly.newPlot("barChart", [trace], layout);
    }

    function processRatingDistribution(data) {

        // Extract IMDB ratings and convert to numbers
        let imdbRatingsArray = Object.values(data.imdbRating).map(Number); 
    
        // Define histogram 
        let hist = {
            x: imdbRatingsArray,
            type: 'histogram',
            histnorm: 'count',   
            autobinx: true,  
            marker: {
                color: '#ACE1AF'
            }    
      
        };
    
        // Define layout for the histogram
        let layout = {
            height: 700,
            title: 'IMDB Rating Distribution',
            xaxis: {
                title: 'IMDB Rating'
            },
            yaxis: {
                title: 'Number of Actors'
            }
        };
    
        // Plot the histogram
        Plotly.newPlot('histChart', [hist], layout);
  
    }
 
    function processNetWorthDistribution(data) {
    
        // Extract actors' net worth values and convert to numbers
        let netWorthArray = Object.values(data.networth).map(Number);
    
        // Define histogram 
        let hist = {
        x: netWorthArray, // Use the net worth array here
        type: 'histogram',
        histnorm: 'count',   
        autobinx: true, 
        marker: {
            color: '#B5EAD7'
        }       
    };
        // Define layout for the histogram
        let layout = {
            height: 700,
            title: "Distribution of Actors' Net Worth",
            xaxis: {
                title: 'Net Worth in USD', 
            },
            yaxis: {
                title: 'Number of Actors'
            }
    };

        // Plot the histogram
        Plotly.newPlot('histChart', [hist], layout);
    }

    // Update chart based on dropdown selection
    d3.select("#barChartDropdown").on("change", function() {

        // Get selected option from the dropdown
        let selectedOption = d3.select(this).property("value");

        // Update the bar chart based on the selected option
        if (selectedOption === "movieCount") {
            fetchData(processTopActorsByMovieCount);
        } 
        else if (selectedOption === "averageRating") {
            fetchData(processTopActorsByRating);
        }
    });

    // Update chart based on dropdown selection
    d3.select("#histogramDropdown").on("change", function() {

        // Get selected option from the dropdown
        let selectedOption = d3.select(this).property("value");
    
         // Update the bar chart based on the selected option
        if (selectedOption === "ratingDistribution") {
            fetchData(processRatingDistribution);
        } 
        else if (selectedOption === "netWorthDistribution") {
            fetchData(processNetWorthDistribution); 
        }
    });

    // Use d3 to select the button with id 'generatePlot'
    let button = d3.select("#generatePlot");
    


    // Create a function that generates a scatter plot for Net Worth vs IMDb Rating
    function generateScatterPlot(data) {

            
        // Extract net worth and IMDb rating values and convert them to numbers
        let netWorthArray = Object.values(data.networth).map(Number);
        let imdbRatingArray = Object.values(data.imdbRating).map(Number);
        let actorArray = Object.values(data.Actor);

        // Creating hover text with Actors' names, Net Worth and Ratings
        let hoverTexts = []

        for (let i = 0; i < netWorthArray.length; i++) {
            let roundedRating = parseFloat(imdbRatingArray[i]).toFixed(1);
            hoverTexts.push(`Actor: ${actorArray[i]}<br>Net Worth: $${netWorthArray[i]}<br>Rating: ${roundedRating}`);
        }

        // Define scatter plot
        let trace = {
            x: netWorthArray,
            y: imdbRatingArray,
            mode: 'markers',
            type: 'scatter',
            hoverinfo: 'text',
            hovertext: hoverTexts,
            marker: {
                color: '#FF9AA2'
            }  
        };

        

        // Define layout for the scatter plot
        let layout = {
            height: 800,
            title: 'Net Worth vs IMDb Rating',
            xaxis: {
                title: 'Net Worth'
            },
            yaxis: {
                title: 'IMDb Rating'
            }
        };

        // Plot the scatter plot
        Plotly.newPlot('scatterPlot', [trace], layout);
    }

    // When the button is clicked, fetch data and generate the scatter plot
    button.on("click", function() {
    fetchData(generateScatterPlot);
    });

}   
init();   