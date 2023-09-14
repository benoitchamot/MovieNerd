# Dependencies
import pandas

def get_actor_rating(omdb_df):
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

    return actor_avg_rating