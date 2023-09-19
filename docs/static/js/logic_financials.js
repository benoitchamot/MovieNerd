// Set up base URL for fetching data
const baseURL = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/financials';

// Initializing the page with a default look
function init() {

    // Fetch financial data 
    //fetchData(BudgetData);
    //fetchData(GrossData);
    fetchData(ROIData);
    
    // Fetch data and process it for the rating distribution chart
   // fetchData(processRatingDistribution);

    // Fetch the JSON data by using D3 library
    function fetchData(callback) {
        d3.json(baseURL).then(callback);
    }

    function BudgetData(data) {

        // Extract budget and ratings from data
        let budgetDataColl = [];
        for (let i = 0; i < data.length; i++) {
            let record = data[i];

            let budget = record["Budget"];
            let rating = record["Rating"];
            budgetDataColl.push({budget: budget, rating: rating});
        }
        
    
        // Prepare data for plotting
        let trace = {
            x: budgetDataColl.map(object => object.budget),
            y: budgetDataColl.map(object => object.rating),
            name: "Budget Data",
            mode:'markers',
            type: "Scatter",
            marker: {
                color: 'D0F70F'
            }};

        // Create the layout 
        let layout = {
            height: 700,
            Width:800,
            title: "Budget Data",
            xaxis: {
                title: 'Budget'
           },
            yaxis: {
                title: 'Rating'
            }
        };

        // Plot the Bar Chart
        Plotly.newPlot("RatingBudgetDiv", [trace], layout);
    }   

    function GrossData(data) {

        // Extract gross and ratings from data
        let grossDataColl = [];
        for (let i = 0; i < data.length; i++) {
            let record = data[i];

            let gross = record["Gross"];
            let rating = record["Rating"];
            grossDataColl.push({gross: gross, rating: rating});
        }
        
    
        // Prepare data for plotting
        let trace = {
            x: grossDataColl.map(object => object.gross),
            y: grossDataColl.map(object => object.rating),
            name: "Gross Data",
            mode:'markers',
            type: "Scatter",
            marker: {
                color: 'CFBE12',
            }};

        // Create the layout 
        let layout = {
            height: 700,
            Width:800,
            title: "Gross Data",
            xaxis: {
                title: 'Gross'
           },
            yaxis: {
                title: 'Rating'
            }
        };

        // Plot the Bar Chart
        Plotly.newPlot("RatingGrossDiv", [trace], layout);
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
            title: "ROI Data",
            xaxis: {
                title: 'ROI',
                type: 'log',
                autorange:true
           },
            yaxis: {
                title: 'Rating'
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

    // // Update chart based on dropdown selection
    // d3.select("#histogramDropdown").on("change", function() {

    //     // Get selected option from the dropdown
    //     let selectedOption = d3.select(this).property("value");
    
    //      // Update the bar chart based on the selected option
    //     if (selectedOption === "ratingDistribution") {
    //         fetchData(processRatingDistribution);
    //     } 
    //     else if (selectedOption === "netWorthDistribution") {
    //         fetchData(processNetWorthDistribution); 
    //     }
    // });

    // // Use d3 to select the button with id 'generatePlot'
    // let button = d3.select("#generatePlot");
    
    // // When the button is clicked, fetch data and generate the scatter plot
  
    // button.on("click", function() {
    //     fetchData(BudgetData);
    // });


}   
init();   