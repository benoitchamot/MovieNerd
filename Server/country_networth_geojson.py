########################################################
### Function for actors average networth per country ###
########################################################

def get_networth_by_country():

    # Dependencies and Setup
    import pandas as pd
    from pathlib import Path
    import sqlite3

    # Creating db connection
    cnx = sqlite3.connect('movies_db.sqlite')

    # Reading data from sqlite database table
    actor_df = pd.read_sql_query("SELECT * FROM actor", cnx)

    ######################################################################################################################################
    # Reading table with coordinates data from an output file of 'dataExplorationJJyotsna - Q1&Geojson' Jupyter notebook                 # 
    # The logic to determine cities for plotting and fetching coordinates required API calls to geoapify.                                # 
    # In order to speed up response time when flask API is called from visualization module the output from Jupyter notebook was used here
    ######################################################################################################################################
    
    # Reading data from sqlite database table
    country_city_cleand_df = pd.read_sql_query("SELECT * FROM city", cnx)

    #########################
    ###  Data Preperation ###
    #########################

    # Cleaning country names from dataset

    actor_cleaned_df = actor_df.replace({'birth_country': {
        'Wales':'UK',
        'West Germany':'Germany',
        'Federal Republic of Germany':'Germany',
        'British Guiana':'Guyana',
        'Maharashtra': 'India',
        'British West Indies': 'Trinidad and Tobago',
        'Dolnoslaskie': 'Poland',
        'USSR': 'Russia',
        'French Protectorate of Morocco [now Morocco]': 'Morocco',
        'U.S. Virgin Islands':'Virgin Islands of the United States',
        'California':'USA',
        'British Malaya': 'Malaysia',
        'United Kingdom': 'UK',
        'England': 'UK',
        'Union of South Africa':'South Africa'    
    }})

    # Keeping only rows which have networth data

    actor_cleaned_df = actor_cleaned_df.loc[pd.notnull(actor_cleaned_df['networth'])]

    # Finding rows with missing country data but birth city data available. Inseting country data

    actor_cleaned_df.loc[(pd.isnull(actor_cleaned_df['birth_country'])) & (pd.notnull(actor_cleaned_df['birth_city'])), 'birth_country' ] = actor_cleaned_df['birth_city']

    # Removing any remaining rows with no country information

    actor_cleaned_df = actor_cleaned_df.loc[(pd.notnull(actor_cleaned_df['birth_country']))]

    #######################################################################
    ### Calculating statistics for each country and adding to dataframe ###
    #######################################################################

    # Finding averge networth per country and adding all information to master actor file

    country_city_cleand_df = country_city_cleand_df.rename(columns={"birth_city":"plot_city" })
    act_df = actor_cleaned_df.set_index('birth_country')

    act_grouped_mean = act_df.groupby(["birth_country"])["networth"].mean()
    act_grouped_median = act_df.groupby(["birth_country"])["networth"].median()
    act_grouped_std = act_df.groupby(["birth_country"])["networth"].std()
    act_grouped_min = act_df.groupby(["birth_country"])["networth"].min()
    act_grouped_max = act_df.groupby(["birth_country"])["networth"].max()
    act_grouped_numact = act_df.groupby(["birth_country"])["actorid"].count()

    actor_master_df = pd.DataFrame([])
    actor_master_df = act_df
    actor_master_df['average_networth_country'] = act_grouped_mean
    actor_master_df['number_of_actors_country'] = act_grouped_numact
    actor_master_df['min_networth'] = act_grouped_min
    actor_master_df['max_networth'] = act_grouped_max
    actor_master_df['median_networth'] = act_grouped_median
    actor_master_df['std_networth'] = act_grouped_std

    actor_master_df = actor_master_df.reset_index(drop = False)
    actor_master_df = pd.merge(actor_master_df, country_city_cleand_df, on='birth_country')

    #########################################################################
    ### Adding top 3 actor networth details for each country to dataframe ###
    #########################################################################

    # Retaining the top 3 actors per country by networth
    actor_master_df = actor_master_df.groupby("birth_country", group_keys=False).apply(lambda g: g.nlargest(3, "networth"))

    # Retaining only relevant data columns after joining top 3 actors into 1
    actor_master_df['networth'] = actor_master_df['networth'].astype(str)

    top_3_actors_df = actor_master_df.groupby('birth_country')['name'].apply(', '.join).reset_index()
    top_3_actors_networth_df = actor_master_df.groupby('birth_country')['networth'].apply(', '.join).reset_index()

    actor_master_df2 = pd.merge(top_3_actors_df, actor_master_df, on='birth_country')
    actor_master_df3 = pd.merge(top_3_actors_networth_df, actor_master_df2, on='birth_country')

    actor_master = actor_master_df3[['birth_country', 'average_networth_country', 'number_of_actors_country',
        'min_networth', 'max_networth', 'median_networth','std_networth', 'name_x', 'networth_x','plot_city', 'Lat', 'Lon']]

    actor_master = actor_master.drop_duplicates()

    actor_master.reset_index(drop = True, inplace = True)
    actor_master= actor_master.rename(columns={"birth_country":"Country",
                                            "name_x":"Top_actors",
                                            "networth_x":"Top_actors_networth",
                                            "plot_city":"city",
                                            "average_networth_country": "Average_networth",
                                            "number_of_actors_country": "Total_actors",
                                            'min_networth': "Min_networth",
                                            'max_networth': "Max_networth",
                                            'median_networth':"Median_networth",
                                            'std_networth':"Networth_standard_dev"
                                            })

    return(actor_master)