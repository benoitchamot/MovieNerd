// API base URL
// Run Flask server first: python flash_server.py
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/';

// Global variables
let ACTORS = [];

function payGapAnalysis(actors) {
    // Get female and male actors
    female_actors = [];
    male_actors = [];

    // Loop through all actors
    for (let i = 0; i < actors.length; i++) {
        if (actors[i]['Net worth']) {
            if (actors[i].Gender == 'Male') {
                male_actors.push({
                    'Name':actors[i].Name,
                    'Networth':actors[i]['Net worth']
                });
            }
            else if (actors[i].Gender == 'Female') {
                female_actors.push({
                    'Name':actors[i].Name,
                    'Networth':actors[i]['Net worth']
                });
            }
        }
    }

    console.log(female_actors);
}

// Get all actors from the API
let all_movies_url = api_url + 'actors'
d3.json(all_movies_url).then(payGapAnalysis)