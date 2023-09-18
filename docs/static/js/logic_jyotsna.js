// API base URL
// Run Flask server first: python flash_server.py
// let api_url = 'http://127.0.0.1:5000/api/v1.0/director_ratings';
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/director_ratings';

// Using the D3 library to read in the URL 
//-----------------------------------------------------------

d3.json(api_url).then(function(datain) {

    // Extracting genre
    genre = datain.Genre;
    // Defining empty lists
    let list_genre = [];
    const keys = Object.keys(genre);

    // Looping through all values of genre and adding to genre_list
    keys.forEach((key, index) => {
        if(genre[key]!= 0){
            list_genre.push(genre[key])
        };
    });
    
    // Removing duplicate values and sorting the list
    list_genre = removeDuplicates(list_genre).sort();

    https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-array-in-javascript/
    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }
    // Preparing dropdown by appending Genre
    // Add an option to select genre
    d3.select("#selGenre").append("option").attr("value", '0').text('Select...');

    for (let d = 0; d < list_genre.length; d++) {
        d3.select("#selGenre").append("option").attr("value",list_genre[d]).text(list_genre[d]);
    }

    // Function for updating plots
    //----------------------------
    function updatePlot() {

        // Using D3 to select the option from dropdown menu
		var inputElement = d3.select(this);
        // Assigning the value of the dropdown menu option to a variable
        var inputValue = inputElement.property("value");

        // Filtering the dataset based on selected genre
        list_select = [];
        keys.forEach((key,index) => {
            if(genre[key] == inputValue){
                list_select.push({'Director': datain.Director[key], 'imdbRating': datain.imdbRating[key], 
                'GrossRevenue': datain.GrossRevenue[key]});
            };   
        });
        
        // Sort directors by ratings to pick top 15 omdb ratings
        let director_sorted = list_select.sort((a, b) => b.imdbRating - a.imdbRating);
        let top_directors = director_sorted.slice(0, 15);
  
        // Reverse sort for horizontal bar graph
        top_directors = top_directors.reverse();
       
        // Logging to console and checking
        // console.log(top_directors);

        // Sort directors by ratings to pick top 15 gross revenue ratings
        let director_sorted2 = list_select.sort((a, b) => b.GrossRevenue - a.GrossRevenue);
        let top_directors2 = director_sorted2.slice(0, 15);
  
        // Reverse sort for horizontal bar graph
        top_directors2 = top_directors2.reverse();
       
        // // Logging to console and checking
        // console.log(top_directors2);

        
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

//     // Calling updatePlot() function when a change takes place to the DOM
    d3.select("#selGenre").on("change",updatePlot);

});
