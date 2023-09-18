# Dependencies
import pandas as pd
from pathlib import Path
import numpy as np
import warnings
warnings.simplefilter(action='ignore')

def get_financials(movies_df):
    print(movies_df.columns)
    # Reduce the number of columns
    firstM_df = movies_df[['Title','Rated','Genre','Budget','GrossRevenue','imdbRating','Country']]

    # Splitting the Country column 
    firstM_df[["Country_1","Country_2", "Country_3", "Country_4","Country_5"]] = firstM_df["Country"].str.split(', ', n=4, expand=True)

    # columns 'Country_1', 'Country_2', 'Country_3' into one column
    firstM_df= firstM_df.set_index(['Title', 'mpaa_rating', 'genre', 'budget', 'gross', 'rating', 'Genre',
       'Country'])[['Country_1', 'Country_2', 'Country_3', 'Country_4', 'Country_5']].stack().reset_index()
    
    # Renaming  "Countries"
    firstM_df = firstM_df.rename(columns={0: 'Countries'})

    financials_df = firstM_df[['Countries','gross', 'budget']]
    financials_df = financials_df .groupby('Countries')
    financials_df = financials_df .mean().reset_index()

    financials_df['gross'] = financials_df['gross'].astype(int)
    financials_df ['budget'] = financials_df['budget'].astype(int)

    # Calculate ROI
    financials_df["ROI"] = (financials_df ["gross"] - financials_df ["budget"]) / financials_df ["budget"]

    return financials_df