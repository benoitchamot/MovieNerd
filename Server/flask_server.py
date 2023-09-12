#########################################################
# Dependencies
#########################################################
from flask import Flask, jsonify
import numpy as np
import pandas as pd
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import desc
from pathlib import Path

# CORS
from flask_cors import CORS

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

#########################################################
# Database Setup
#########################################################

# Create engine to hawaii.sqlite
print("Connecting to database...")
db_path = Path('movies_db.sqlite')
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
movies = Base.classes.movies
actors = Base.classes.actor
characters = Base.classes.character

#########################################################
# Flask Setup
#########################################################
app = Flask(__name__)
CORS(app)

#########################################################
# Flask Routes
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
		# f"<h2>Dynamic routes</h2>"
		# f"<p><a href='http://127.0.0.1:5000/api/v1.0/u/1503960366'>/api/v1.0/u/&#x003C;user_name&#x003E;</a></p>"
		# f"<ul>"
		# f"	<li>Returns all data for selected user</li>"
		# f"	<li>Example is given for user_name = 1503960366</li>"
		# f"</ul>"
	)

# Static Movies route
@app.route("/api/v1.0/movies")
def api_activities():
	# Open session to the database
	session = Session(bind=engine)
	all_movies = session.query(movies)
	
	# Create empty lists
	movies_dicts = []

	# Loop through the measurements
	for row in all_movies:    
    	# Add the data to a dictionary
		mov_dict = {'Id': row.movieid,
			  'Title': row.title,
			  'MPAA Rating': row.mpaa_rating,
			  'Budget': row.budget,
			  'Revenue': row.gross,
			  'Release Date': row.release_date,
			  'Genre': row.genre,
			  'Runtime': row.runtime,
			  'Rating': row.rating,
			  'Rating Count': row.rating_count,
			  'Summary': row.summary}

		# Append the data to the list of dictionary
		movies_dicts.append(mov_dict)

	# Close session
	session.close()

	# Return jsonified dictionary
	return jsonify(movies_dicts)

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

#########################################################
# Run App
#########################################################
if __name__ == "__main__":
	app.run(debug=True)