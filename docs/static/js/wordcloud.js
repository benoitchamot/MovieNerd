// Source: https://www.anychart.com/blog/2019/04/30/create-javascript-word-cloud-chart-tutorial/
// Customisation: https://docs.anychart.com/Basic_Charts/Tag_Cloud
// Options: https://api.anychart.com/anychart.charts.TagCloud#category-size-and-position

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