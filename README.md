# MONU_project3
Repository for Monash University Bootcamp Project 3 (Group 7)

## File structure


## Data engineering
### Data sources
We gathered data from two different sources:
- Movies and Actors database, by James Gaskin on data.world: https://data.world/jamesgaskin/movies
- OMDB API: http://www.omdbapi.com/?

The James Gaskin's dataset includes information about 636 movies as well as their characters and the actors who play them. 

### Data management
The James Gaskin's dataset was retrieved from data.world by writing an SQL query to get each table and download the result as a CSV file. The three files `actor.csv`, `character.csv` and `movies.csv` are saved in the `Datasets` directory.

Using the titles from the movies in the James Gaskin's dataset, queries were made to the OMDB API to retrieve additional information about the movies as well as data already present in the James Gaskin's dataset to cross-check the values. Because the call to the API to retrieve all 636 movies take some time, the data are added to a DataFrame and saved as a CSV file (`Datasets/omdb.csv`). The code used to perform these actions can be found in `data_management.ipynb`.


### Data cleaning and transformation

In the `data_management.ipynb` notebook, we performed several data cleaning and transformation tasks:
- Removed unnecessary columns from the James Gaskin's dataset.
- Standardized and cleaned the data in the James Gaskin's dataset, such as removing duplicates, handling missing values, and converting data types.
- Merged the James Gaskin's dataset with the OMDB dataset using the movie titles to obtain additional movie information.
  


### Data analysis
We conducted various analyses on the cleaned and transformed dataset, including:
- Calculated the average rating for each actor by aggregating the ratings of the movies they appeared in.
- Calculated the pay gap between male and female actors by comparing the average earnings of male actors to female actors.
- Compared ratings to budget, gross, and ROI to identify any trends or correlations.
- Identifying the best director based on the average IMDb rating of their movies.
- Analyzing the relationship between budget, gross, and ROI with movie ratings.


### Data visualization

These visualizations were created using Python libraries such as Matplotlib . They were designed to effectively convey the insights and findings gained from the data analysis process; In a clear and concise manner. Visualizations include bar charts, and pie charts to effectively communicate the findings and insights.
- Bar charts: We used bar charts to compare the average ratings of male and female actors. This visualization helped us understand the differences in ratings between the two groups.
- Pie charts: We used pie charts to showcase the distribution of actor among different contries. 
- GeoJson this type of visualization can provide insights into the global distribution of actors, and help identify any geographical patterns or trends. It can also be useful for making comparisons between regions and understanding the impact of location on the film industry.





## Conclusion
Through this project, we successfully gathered and integrated data from different sources, performed data cleaning and transformation tasks, conducted data analysis, and created visualizations to gain insights about the movies and actors dataset. The project highlights the importance of data engineering in organizing and analyzing large datasets to extract valuable information. The findings from this project can be used to make informed decisions in the film industry, such as casting choices, budget allocation, and identifying successful directors and actors.
