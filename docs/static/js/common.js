// Common code that can be shared between scripts

//const api_base_url = 'http://127.0.0.1:5000/api/v1.0/'; // Use this for locally-run API (Flask Server must be running)
const api_base_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/'; // Use this for web-hosted API

function com_convertStringToYear(date_string) {
// Convert "18 Oct 1990" (example) to Year (YYYY = 1990 in example)
    
    let timestamp = Date.parse(date_string);
    let date = new Date(timestamp)
    let year = date.getYear();
    
    return 1900 + year;
}