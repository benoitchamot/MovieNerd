// Source: https://www.anychart.com/blog/2019/04/30/create-javascript-word-cloud-chart-tutorial/
// Customisation: https://docs.anychart.com/Basic_Charts/Tag_Cloud
// Optiona: https://api.anychart.com/anychart.charts.TagCloud#category-size-and-position


// var words = [
//     {"x": "Mandarin chinese", "value": 10, category: "Sino-Tibetan"},
//     {"x": "English", "value": 9, category: "Indo-European"},
//     {"x": "Hindustani", "value": 5, category: "Indo-European"},
//     //{"x": "Spanish", "value": 5, category: "Indo-European"},
//     //{"x": "Arabic", "value": 4, category: "Afro-Asiatic"},
//     //{"x": "Malay", "value": 3, category: "Austronesian"},
//     //{"x": "Russian", "value": 2, category: "Indo-European"},
//     //{"x": "Bengali", "value": 2, category: "Indo-European"},
//     //{"x": "Portuguese", "value": 2, category: "Indo-European"},
//     //{"x": "French", "value": 2, category: "Indo-European"},
//     {"x": "Hausa", "value": 1, category: "Afro-Asiatic"},
//     {"x": "Punjabi", "value": 1, category: "Indo-European"},
//     {"x": "Japanese", "value": 1, category: "Japonic"},
//     {"x": "German", "value": 1, category: "Indo-European"},
//     {"x": "Persian", "value": 1, category: "Indo-European"}
//   ];

function deleteWordCloud(div_id) {
    // Delete everything currently present in the div_id section
    let section = d3.select('#'+ div_id)
    section.html("")
}

function wordcloud(words, div_id) {
    // Delete the current word cloud to make room for the new one
    deleteWordCloud(div_id)

    // create a tag (word) cloud chart
    let chart = anychart.tagCloud(words);

    // set an array of angles at which the words will be laid out
    chart.angles([0, -30, 30])
    // enable a color range
    let customColorScale = anychart.scales.linearColor();
    customColorScale.colors(["#89DBF5", "#cc3399"]);
    chart.colorScale(customColorScale);
    chart.colorRange(false);
    chart.tooltip(false);
    // set the color range length
    chart.colorRange().length('100%');
    chart.normal().fontWeight(800);
    chart.mode("spiral");
    // display the word cloud chart
    chart.container(div_id);
    chart.draw();
};