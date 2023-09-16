# Dependencies
import pandas as pd
import warnings
warnings.simplefilter(action='ignore')

def get_actor_rating(omdb_df, actor_df):
# Get a DataFrame of all the actors and their average rating

    # Reduce the number of columns
    omdb_df = omdb_df[['Title','Genre','Director','Actors', 'imdbRating', 'imdbVotes' ]]

    # Splitting the Actors column into separate actors
    omdb_df[["Actor_1","Actor_2", "Actor_3"]] = omdb_df["Actors"].str.split(', ', n=2, expand=True)

    # Stacking columns 'Actor_1', 'Actor_2', 'Actor_3' into one column
    actors_stacked_df = omdb_df.set_index(['Title', 'Genre', 'Director', 'Actors', 'imdbRating', 'imdbVotes'])[['Actor_1', 'Actor_2', 'Actor_3']].stack().reset_index()

    # Renaming the column as "Actor"
    actors_stacked_df = actors_stacked_df.rename(columns={0: 'Actor'})

    # Dropping column 'level_6'
    actors_stacked_df= actors_stacked_df.drop('level_6', axis=1)

    # Calculating the average rating per actor (using groupby method)
    actor_avg_rating = actors_stacked_df[['Actor','imdbRating']]
    actor_avg_rating = actor_avg_rating.groupby('Actor')
    actor_avg_rating = actor_avg_rating.mean().reset_index()

    # Calculating the number of movies an actor played in and selecting top 10 actors who played in the biggest amount of movies
    actor_count_movies = actors_stacked_df['Actor'].value_counts()
    actor_count_movies = pd.DataFrame(actor_count_movies)
    actor_count_movies  = actor_count_movies.rename(columns={"Actor": "Count of movies"})
    actor_count_movies  = actor_count_movies.rename_axis('Actor')
    actors_movies_ratings = pd.merge(actor_avg_rating, actor_count_movies , on="Actor")

    print(actor_df.columns)

    actors_movies_ratings = pd.merge(actors_movies_ratings, actor_df, left_on=['Actor'], right_on=['Name'])
    actors_movies_ratings = actors_movies_ratings[['Actor', 'Count of movies', 'Net worth', 'imdbRating']]

    actors_movies_ratings = actors_movies_ratings.rename(columns={'Count of movies': 'count_of_movies', 'Net worth': 'networth'})

    # Drop richest male actor (Alan Howard is an outlier)
    outlier_name = 'Alan Howard'
    actors_movies_ratings.drop(actors_movies_ratings[actors_movies_ratings['Actor'] == outlier_name].index, inplace = True)

    return actors_movies_ratings