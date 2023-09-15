// Common functions shared between scripts
function com_convertStringToYear(date_string) {
// Convert "18 Oct 1990" (example) to Year (YYYY = 1990 in example)
    
    let timestamp = Date.parse(date_string);
    let date = new Date(timestamp)
    let year = date.getYear();
    
    return 1900 + year;
}