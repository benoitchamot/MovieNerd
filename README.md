# MONU_project3
Repository for Monash University Bootcamp Project 3 (Group 7)

## File structure
TBW...

## Data engineering
### Data sources
We gathered data from two different sources:
- Movies and Actors database, by James Gaskin on data.world: https://data.world/jamesgaskin/movies
- OMDB API: http://www.omdbapi.com/?

The James Gaskin's dataset includes information about 636 movies as well as their characters and the actors who play them. 

### Data management
The James Gaskin's dataset was retrieved from data.world by writing an SQL query to get each table and download the result as a CSV file. The three files `actor.csv`, `character.csv` and `movies.csv` are saved in the `Datasets` directory.

Using the titles from the movies in the James Gaskin's dataset, queries were made to the OMDB API to retrieve additional information about the movies as well as data already present in the James Gaskin's dataset to cross-check the values. Because the call to the API to retrieve all 636 movies take some time, the data are added to a DataFrame and saved as a CSV file (`Datasets/omdb.csv`). The code used to perform these actions can be found in `data_management.ipynb`.
