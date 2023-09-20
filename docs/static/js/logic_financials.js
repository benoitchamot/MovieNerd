// Set up base URL for fetching data
const baseURL = api_base_url + 'financials';

// Initializing the page with a default look
function init() {

    // Fetch financial data 
    fetchData(ROIData);

    // Fetch the JSON data by using D3 library
    function fetchData(callback) {
        d3.json(baseURL).then(callback);
    }

    function ROIData(data) {

        // Extract budget and ratings from data
        let ROIDataColl = [];
        for (let i = 0; i < data.length; i++) {
            let record = data[i];
            let title=record["Title"]
            let roi = record["ROI"];
            let gross = record["Gross"];
            let budget = record["Budget"];
            let rating = record["Rating"];
            ROIDataColl.push({roi: roi, rating: rating, title: title, gross:gross, budget:budget});
        }
        
        // Creating hover text with Actors' names, Net Worth and Ratings
        let hoverTexts = []

        for (let i = 0; i < ROIDataColl.length; i++) {
            //let roundedRating = parseFloat(imdbRatingArray[i]).toFixed(1);
            hoverTexts.push(`Title: ${ROIDataColl[i].title}<br>Budget: $${ROIDataColl[i].budget}<br>Revenue: $${ROIDataColl[i].gross}<br>Rating: ${ROIDataColl[i].rating}`);
        }

        // Prepare data for plotting
        let trace = {
            x: ROIDataColl.map(object => object.roi),
            y: ROIDataColl.map(object => object.rating),
            name: "Budget Data",
            hoverinfo: 'text',
            hovertext: hoverTexts,
            mode:'markers',
            type: "Scatter",
            marker: {
                color: 'cc3399'
            }};

        // Create the layout 
        let layout = {
            height: 700,
            Width:800,
            xaxis: {
                title: 'Return on investment',
                type: 'log',
                autorange:true
           },
            yaxis: {
                title: 'IMDB Rating'
            }
        };

        // Plot the Bar Chart
        Plotly.newPlot("RatingROIDiv", [trace], layout);
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
}   

// Run init function
init();   