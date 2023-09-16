################################################
### Function for directors average networth  ###
################################################

def get_director_rating(db_path):

    # Dependencies and Setup
    import pandas as pd
    import sqlite3

    # Creating db connection
    cnx = sqlite3.connect(db_path)

    # Reading data from sqlite database table
    movie_df = pd.read_sql_query("SELECT * FROM omdb_movies", cnx)

    # Keeping only required fields
    movie_director_df = movie_df[['MovieID', 'Title','Genre',
       'Director', 'Budget', 'GrossRevenue','Metascore',
       'imdbRating', 'imdbVotes']]
    
    # Removing rows with no director data
    movie_director_df = movie_director_df.loc[pd.notnull(movie_director_df['Director'])]

    # Split director and genre to seperate rows
    #https://stackoverflow.com/questions/12680754/split-explode-pandas-dataframe-string-entry-to-separate-rows

    movie_director_df = movie_director_df.assign(Genre=movie_director_df['Genre'].str.split(', ')).explode('Genre')
    movie_director_df = movie_director_df.assign(Director=movie_director_df['Director'].str.split(', ')).explode('Director')
    movie_director_df = movie_director_df.drop_duplicates()
    movie_director_df = movie_director_df.reset_index(drop=True)

    # Group data by avaiable Genres to find each directors average rating in the genre
    group_cols = ['Genre','Director']
    genre_director_mean = movie_director_df.groupby(group_cols)["imdbRating"].mean()

    # Adding average rating to Genre - Director combination
    genre_director_rating = movie_director_df[['Genre','Director']]
    genre_director_rating = genre_director_rating.drop_duplicates()
    genre_director_rating = genre_director_rating.merge(right=genre_director_mean, right_index=True, left_on=group_cols, how='right')

    # Group data by avaiable Genres to find each directors average gross revenue in the genre
    group_cols = ['Genre','Director']
    genre_director_rev_mean = movie_director_df.groupby(group_cols)["GrossRevenue"].mean()

    # Adding average gross revenue to Genre - Director combination

    genre_director_rating = genre_director_rating.merge(right=genre_director_rev_mean, right_index=True, left_on=group_cols, how='right')

    return genre_director_rating