DB_PATH = 'movies_db.sqlite'
# Uncomment for web version:
# DB_PATH = '/home/spiderdwarf/mysite/movies_db.sqlite'

#########################################################
# Dependencies
#########################################################
from flask import Flask, jsonify
import numpy as np
import pandas as pd
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
from pathlib import Path

# CORS
from flask_cors import CORS

# Local modules
from actor_ratings import get_actor_rating
from country_networth_geojson import get_networth_by_country
from director_ratings_genre import get_director_rating
from genre_keywords import get_top50_keywords

#########################################################
# Functions
#########################################################

def str_to_date(in_string):
# Convert a date stored as a string from the database and convert it to a datetime object.
# Input string format: YYYY-MM-DD
	out_date = dt.datetime.strptime(in_string, '%Y-%m-%d')
	try:
		return dt.date(out_date.year, out_date.month, out_date.day)
	except:
		return 0
	
def create_movie_dict(movie):
# Create a dictionary from a row from the omdb_movies table in movies_db.sqlite
	return {'Id': movie.MovieID,
			   'Title': movie.Title,
			   'MPAA Rating': movie.Rated,
			   'Budget': movie.Budget,
			   'Revenue': movie.GrossRevenue,
			   'Release Date': movie.Released,
			   'Genre': movie.Genre,
			   'Actor': movie.Actors,
			   'Director': movie.Director,
			   'Runtime': movie.Runtime,
			   'Rating': movie.imdbRating,
			   'Rating Count': movie.imdbVotes,
			   'Country': movie.Country,
			   'Metascore': movie.Metascore,
			   'Summary': movie.Plot}

#########################################################
# Database Setup
#########################################################

# Create engine to movies_db.sqlite
print("Connecting to database...")
db_path = Path(DB_PATH)
engine = create_engine(f"sqlite:///{db_path}")
print("Connected.")

# Reflect the database into a new model
print("Reflecting database...")
Base = automap_base()
print("Done.")

# Reflect the tables
print("Reflecting tables...")
try:
	Base.prepare(engine, reflect=True)
	print("Done.")
except Exception as inst:
    print(f"\nError: {inst}")
    print("\n*** HINT: please run script from within Server directory ***\n")
    quit()

# Save references to each table
movies = Base.classes.omdb_movies
actors = Base.classes.actor
characters = Base.classes.character

#########################################################
# Flask Setup
#########################################################
app = Flask(__name__)
CORS(app)

#########################################################
# Flask Static Routes
#########################################################

# Default route
@app.route("/")
def home():
	print("Server received request for Home page")
	return (
		f"<h1>Movies Nerd API</h1>"
		f"<h2>Static routes</h2>"
		f"<p><a href='api/v1.0/movies'>/api/v1.0/movies</a></p>"
		f"<ul>"
		f"	<li>Returns data for all movies</li>"
		f"</ul>"
		f"<p><a href='api/v1.0/actors'>/api/v1.0/actors</a></p>"
		f"<ul>"
		f"	<li>Returns data for all actors</li>"
		f"</ul>"
		f"<p><a href='api/v1.0/characters'>/api/v1.0/characters</a></p>"
		f"<ul>"
		f"	<li>Returns data for all characters</li>"
		f"</ul>"
		f"<p><a href='api/v1.0/actors_ratings'>/api/v1.0/actors_ratings</a></p>"
		f"<ul>"
		f"	<li>Returns average IMDB rating for all actors</li>"
		f"</ul>"
		f"<p><a href='api/v1.0/director_ratings'>/api/v1.0/director_ratings</a></p>"
		f"<ul>"
		f"	<li>Returns average IMDB ratings for all directors</li>"
		f"</ul>"
		f"<p><a href='api/v1.0/country_actor_networth_geojson'>/api/v1.0/country_actor_networth_geojson</a></p>"
		f"<ul>"
		f"	<li>Returns geojson data for average networth of actors by country of origin</li>"
		f"</ul>"
		f"<h2>Dynamic routes</h2>"
		f"<p><a href='/api/v1.0/movies/g/Action'>/api/v1.0/movies/g/&#x003C;genre&#x003E;</a></p>"
		f"<ul>"
		f"	<li>Returns all movies for selected genre</li>"
		f"	<li>Example is given for genre = Action</li>"
		f"</ul>"
		f"<p><a href='/api/v1.0/movies/a/Tom%20Cruise'>/api/v1.0/movies/a/&#x003C;actor&#x003E;</a></p>"
		f"<ul>"
		f"	<li>Returns all movies for selected actor</li>"
		f"	<li>Example is given for actor = Tom Cruise</li>"
		f"</ul>"
		f"<p><a href='/api/v1.0/movies/a/Tom%20Cruise/g/Action'>/api/v1.0/movies/a/&#x003C;actor&#x003E;/g/&#x003C;genre&#x003E;</a></p>"
		f"<ul>"
		f"	<li>Returns all movies for selected actor and genre</li>"
		f"	<li>Example is given for genre = Action and actor = Tom Cruise</li>"
		f"</ul>"
		f"<p><a href='/api/v1.0/keywords/g/action'>/api/v1.0/keywords/g/&#x003C;genre&#x003E;</a></p>"
		f"<ul>"
		f"	<li>Returns top 50 keywords with count for selected genre</li>"
		f"	<li>Example is given for genre = Action</li>"
		f"</ul>"
	)

# Static Movies route
@app.route("/api/v1.0/movies")
def api_movies():
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the measurements
	for row in all_movies:    
    	# Add the data to a dictionary
		mov_dict = create_movie_dict(row)

		# Append the data to the list of dictionary
		movies_dicts.append(mov_dict)

	# Close session
	session.close()

	if len(movies_dicts) > 0:
		# Return jsonified dictionary
		return jsonify(movies_dicts)
	else:
		return jsonify({'Error': 'No movie found.'})

# Static Actor Ratings route
@app.route("/api/v1.0/actors_ratings")
def api_actors_ratings():
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)

	# Create empty lists
	movies_dicts = []
	
	for row in all_movies:
		# Add the data to a dictionary
		mov_dict = {'Title': row.Title,
			  'Genre': row.Genre,
			  'Director': row.Director,
			  'Actors': row.Actors,
			  'imdbRating': row.imdbRating,
			  'imdbVotes': row.imdbVotes}

		# Append the data to the list of dictionary
		movies_dicts.append(mov_dict)

	movies_df = pd.DataFrame(movies_dicts)

	# Get a DataFrame of all the actors and their average rating
	ratings = get_actor_rating(movies_df)
	ratings = ratings.to_dict()

	# Close session
	session.close()

	return jsonify(ratings)


# Static Actors route
@app.route("/api/v1.0/actors")
def api_actors():
	# Open session to the database
	session = Session(bind=engine)
	all_actors = session.query(actors)
	
	# Create empty lists
	actors_dicts = []

	# Loop through the data points
	for row in all_actors:    
    	# Add the data to a dictionary
		act_dict = {'Id': row.actorid,
			  'Name': row.name,
			  'DOB': row.date_of_birth,
			  'City': row.birth_city,
			  'Country': row.birth_country,
			  'Height inches': row.height_inches,
			  'Gender': row.gender,
			  'Ethnicity': row.ethnicity,
			  'Net worth': row.networth
			  }
		
		# Append the data to the list of dictionary
		actors_dicts.append(act_dict)

	# Close session
	session.close()

	# Return jsonified dictionary
	return jsonify(actors_dicts)

# Static Characters route
@app.route("/api/v1.0/characters")
def api_characters():
	# Open session to the database
	session = Session(bind=engine)
	all_characters = session.query(characters)
	
	# Create empty lists
	characters_dicts = []

	# Loop through the data points
	for row in all_characters:    
    	# Add the data to a dictionary
		char_dict = {'Movie': row.movieid,
			  'Actor': row.actorid,
			  'Name': row.character_name
			  }
		
		# Append the data to the list of dictionary
		characters_dicts.append(char_dict)

	# Close session
	session.close()

	# Return jsonified dictionary
	return jsonify(characters_dicts)

# Static Director Ratings route
@app.route("/api/v1.0/director_ratings")
def api_director_ratings():

	# Calling local function for data preperation of this section
	genre_director_rating = get_director_rating()
	genre_director_rating = genre_director_rating.to_dict()

	# Close session
	return jsonify(genre_director_rating)

#########################################################
# Flask Dynamic Routes
#########################################################

# Dynamic Movies by Genre route
@app.route("/api/v1.0/movies/g/<genre>")
def api_movies_by_genre(genre):
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the measurements
	for row in all_movies:   
		# Check whether the selected genre is in the movie's genre
		if genre.lower() in row.Genre.lower():
    		# Add the data to a dictionary
			mov_dict = create_movie_dict(row)
			
			# Append the data to the list of dictionary
			movies_dicts.append(mov_dict)

	# Close session
	session.close()

	if len(movies_dicts) > 0:
		# Return jsonified dictionary
		return jsonify(movies_dicts)
	else:
		return jsonify({'Error': 'No movie found.'})
	
# Dynamic Words by Genre route
@app.route("/api/v1.0/keywords/g/<genre>")
def api_keywords_by_genre(genre):
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the movies
	for row in all_movies:   
		# Check whether the selected genre is in the movie's genre (or if the genre is specified as 'all')
		if (genre.lower() == 'all') or (genre.lower() in row.Genre.lower()):
    		# Add the data to a dictionary
			mov_dict = create_movie_dict(row)
			
			# Append the data to the list of dictionary
			movies_dicts.append(mov_dict)

	movies_df = pd.DataFrame(movies_dicts)
	keywords = get_top50_keywords(movies_df).to_dict('list')

	# Close session
	session.close()

	return jsonify(keywords)
	
# Dynamic Movies by Actor route
@app.route("/api/v1.0/movies/a/<actor>")
def api_movies_by_actor(actor):
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the measurements
	for row in all_movies:   
		# Check whether the selected actor is in the movie's actor list
		if actor.replace(" ","").lower() in row.Actors.replace(" ","").lower():
    		# Add the data to a dictionary
			mov_dict = create_movie_dict(row)
			
			# Append the data to the list of dictionary
			movies_dicts.append(mov_dict)

	# Close session
	session.close()

	if len(movies_dicts) > 0:
		# Return jsonified dictionary
		return jsonify(movies_dicts)
	else:
		return jsonify({'Error': 'No movie found.'})
	
# Dynamic Movies by Actor and Genre route
@app.route("/api/v1.0/movies/a/<actor>/g/<genre>")
def api_movies_by_actor_and_genre(actor, genre):
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the measurements
	for row in all_movies:   
		# Check whether the selected actor is in the movie's actor list
		if (actor.replace(" ","").lower() in row.Actors.replace(" ","").lower()) and (genre.lower() in row.Genre.lower()):
    		# Add the data to a dictionary
			mov_dict = create_movie_dict(row)
			
			# Append the data to the list of dictionary
			movies_dicts.append(mov_dict)

	# Close session
	session.close()

	if len(movies_dicts) > 0:
		# Return jsonified dictionary
		return jsonify(movies_dicts)
	else:
		return jsonify({'Error': 'No movie found.'})
	
#########################################################
# GEOjson Route
#########################################################
@app.route("/api/v1.0/country_actor_networth_geojson")
def api_geojson():

	# Calling local function for data preperation of this section
	actor_master = get_networth_by_country(db_path)

	# Defining function to convert df to geojson
	def df_to_geojson(df, properties, lat='Lat', lon='Lon'):
		geojson = {'type':'FeatureCollection', 'features':[]}
		for _, row in df.iterrows():
			feature = {'type':'Feature',
					'properties':{},
					'geometry':{'type':'Point',
								'coordinates':[]}}
			feature['geometry']['coordinates'] = [row[lon],row[lat]]
			for prop in properties:
				feature['properties'][prop] = row[prop]
			geojson['features'].append(feature)
		return geojson

	# Passing the function a DataFrame, a list of columns to convert to GeoJSON feature properties
	# and which columns contain the latitude and longitude data. 

	cols = ['Country', 'Average_networth', 'Total_actors',
		'Min_networth', 'Max_networth', 'Median_networth',
		'Top_actors', 'Top_actors_networth', 'city']
	geojson = df_to_geojson(actor_master, cols)

	# Return jsonified dictionary
	return (geojson)

#########################################################
# Run App
#########################################################
if __name__ == "__main__":
	app.run(debug=True)