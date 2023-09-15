# Dependencies
import pandas as pd
from collections import Counter

# Source: https://www.geeksforgeeks.org/text-analysis-in-python-3/
def count_words(text):     
    text = text.lower() 
    skips = [".", ",", ":", ";", "'", '"'] 
    for ch in skips: 
        text = text.replace(ch, "") 
    word_counts = Counter(text.split(" ")) 
    return word_counts

def get_top50_keywords(movies_df):
    plot_by_genre = ""

    # Get plot from all movies that include the selected genre
    for index, row in movies_df.iterrows():
        plot_by_genre += movies_df.loc[index,'Summary'] + ' '
        word_count = count_words(plot_by_genre)

    # Save word count in a DataFrame
    word_count_df = pd.DataFrame.from_dict(word_count, orient='index').reset_index()

    # Rename columns
    word_count_df = word_count_df.rename(columns={'index':'word', 0:'count'})

    # Order by most common words
    word_count_df = word_count_df.sort_values('count', ascending=False).reset_index()
    word_count_df = word_count_df[['word', 'count']]

    # Drop common words
    ignore_words = ['the', 'a', 'to', 'and', 'of', 'by', 'his', 'in', 'is', 'are', 'a', 'an', 'with', 'from', 'when', 'as', 'on', 'for', ' ', '', 'who', 'at']

    clean_word_count_df = word_count_df[:]

    for index, row in word_count_df.iterrows():
        if word_count_df.loc[index,'word'] in ignore_words:
            clean_word_count_df = clean_word_count_df.drop(index)

    # Keep only Top 50 words that appear more than once
    return clean_word_count_df.head(50)
