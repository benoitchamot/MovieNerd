// Declare global variables
let genre = {}
let list_genre = [];
let keys = Object.keys(genre);
let directors

// Function for updating plots
//----------------------------
function updatePlot(inputValue) {
    // Filtering the dataset based on selected genre
    
    list_select = [];
    keys.forEach((key,index) => {
        if(genre[key] == inputValue){
            list_select.push({'Director': directors.Director[key], 'imdbRating': directors.imdbRating[key], 
            'GrossRevenue': directors.GrossRevenue[key]});
        };   
    });
        
    // Sort directors by ratings to pick top 15 omdb ratings
    let director_sorted = list_select.sort((a, b) => b.imdbRating - a.imdbRating);
    let top_directors = director_sorted.slice(0, 15);
  
    // Reverse sort for horizontal bar graph
    top_directors = top_directors.reverse();

    // Sort directors by ratings to pick top 15 gross revenue ratings
    let director_sorted2 = list_select.sort((a, b) => b.GrossRevenue - a.GrossRevenue);
    let top_directors2 = director_sorted2.slice(0, 15);
  
    // Reverse sort for horizontal bar graph
    top_directors2 = top_directors2.reverse();

    // Bar chart 1
    //---------------
    // Defining data and layout for plot
    var trace1 = {
        x: top_directors.map(object => object.imdbRating),
        y: top_directors.map(object => object.Director),
        name: " Top Directors by average OMDB Ratings",
        type: "bar",
        orientation: "h",
        marker: {
            color: '#cc3399'
        },

    };

    var layout = {
		xaxis: { title: "Average OMDB Rating", showgrid : false, zeroline : false},
        yaxis: {showgrid : false, tickfont: {
            size: 15,
            family: 'Arial, sans-serif',
            color: 'black',
            weight: 'bold'
        }},
        bargroupgap: 0.4,
        title: `<b>Top Directors by Average OMDB Ratings<b>`,
        width: 600,
        height: 800  
	};

    // Plotting Bar graph using Plotly
    var data = [trace1];
    
    Plotly.newPlot("omdbRating", data, layout);
    
    // Adding Tick labels above bar
    // https://medium.com/@tbarrasso/plotly-tip-6-positioning-axis-titles-in-horizontal-bar-chart-56b0713f9745
    document.getElementById('omdbRating').on('plotly_afterplot', function() {
        var yAxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .ytick text, [class*=" yaxislayer"] .ytick text'))
        var bar = document.querySelector('.plot .barlayer .bars path')
        var barHeight = bar.getBBox().height
        var offset = 12
            
        for (var i = 0; i < yAxisLabels.length; i++) {
            var yAxisLabel = yAxisLabels[i];
            yAxisLabel.setAttribute('text-anchor', 'start')
            yAxisLabel.setAttribute('y', yAxisLabel.getAttribute('y') - (barHeight / 2) - offset)
        }
    })
              
    // // Bar chart 2
    // //-----------....

    // Defining data and layout for plot
    var trace1 = {
        x: top_directors2.map(object => object.GrossRevenue),
        y: top_directors2.map(object => object.Director),
        name: " Top Directors by average Gross Revenue",
        type: "bar",
        orientation: "h",
        marker: {
            color: '#89DBF5'
        }
    };

    var layout = {
		xaxis: { title: "Average Gross Revenue ", showgrid : false, zeroline : false},
        yaxis: {showgrid : false, tickfont: {
            size: 15,
            family: 'Arial, sans-serif',
            color: 'black',
            weight: 'bold'
        }},
        bargroupgap: 0.4,
        title: `<b>Top Directors by Average Gross Revenue<b>`,
        width: 600,
        height: 800
	};

    // Plotting Bar graph using Plotly
    var data = [trace1];
    Plotly.newPlot("grossRev", data, layout);
    };

function callbackDirector(datain) {

    // Save data to global variable
    directors = datain

    // Extracting genre and save to global variables
    genre = datain.Genre;
    keys = Object.keys(genre);

    // Looping through all values of genre and adding to genre_list
    keys.forEach((key, index) => {
        if(genre[key]!= 0){
            list_genre.push(genre[key])
        };
    });
}
