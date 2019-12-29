function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        PANEL.append("h6").text('ID: ' + result.id);
        PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
        PANEL.append("h6").text('GENDER: ' + result.gender);
        PANEL.append("h6").text('AGE: ' + result.age);
        PANEL.append("h6").text('LOCATION: ' + result.location);
        PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
        PANEL.append("h6").text('WFREQ: ' + result.wfreq);
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var bactSamples = data.samples;
        console.log(bactSamples);
        var bactArray = bactSamples.filter(sampleObj => sampleObj.id == sample);
        var result = bactArray[0];
        var otuID = result.otu_ids;
        var sampleValues = result.sample_values;
        var topOtuIDs = otuID.slice(0,10);
        var topSampleValues = sampleValues.slice(0,10);
        console.log(topSampleValues);
        /*otuIDlabels = topOtuIDs.forEach(label => 
            label = ('OTU: ' + label));
        console.log(otuIDlabels)*/
        // test otuid labels using console log?
        var trace1 = {
            x: topSampleValues,
            y: topOtuIDs,
            type: 'bar',
            orientation: 'h'
        };
        var layout1 = {
            title: 'Top Bacterial Species Found',
            xaxis: {title: 'Sample Value'},
            yaxis: {
                title: 'OTU ID',
                type: 'category',
                autorange: 'reversed'}
        };
        var trace2 = {
            x: topOtuIDs,
            y: topSampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)', 'rgb(255, 65, 54)'],},
            text: topOtuIDs
        }
        var layout2 = {
            title: 'Bubble Chart of Top Colonies',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Value'}
        }

        Plotly.newPlot("bar", [trace1], layout1);

        Plotly.newPlot("bubble", [trace2], layout2)

    });
}