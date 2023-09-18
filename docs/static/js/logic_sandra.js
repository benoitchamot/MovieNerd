// API URL
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/financials';

// Function to handle the data
function manipulateFinancialsData(data) {
    console.log(data);
}

// Retrieve the data
d3.json(api_url).then(manipulateFinancialsData);