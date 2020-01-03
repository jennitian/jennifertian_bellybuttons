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
    })
    //display 940 chart to start
    buildMetadata(940);
    buildCharts(940);
}

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
        //extract wash freq from metadata
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var firstResult = resultArray[0];
        var wfreq = firstResult.wfreq
        //extract otuid and samplevalues from bacterial samples
        var bactSamples = data.samples;
        console.log(bactSamples);
        var bactArray = bactSamples.filter(sampleObj => sampleObj.id == sample);
        var result = bactArray[0];
        var otuID = result.otu_ids;
        var sampleValues = result.sample_values;
        var topOtuIDs = otuID.slice(0,10);
        var topSampleValues = sampleValues.slice(0,10);
        console.log(topSampleValues);
        var otuLabels = otuID.map(ID=> 'OTU: ' + ID)
        topOtuLabels = otuLabels.slice(0,10)
        console.log(otuLabels)

        //creating graphs
        var traceBar = {
            x: topSampleValues,
            y: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            text: topOtuLabels
        };

        var layoutBar = {
            title: 'Top Bacterial Species Found',
            xaxis: {title: 'Sample Value'},
            yaxis: {
                type: 'category',
                autorange: 'reversed'}
        };

        var traceBubble = {
            x: otuID,
            y: sampleValues,
            mode: 'markers',
            colorscale: 'RdBu',
            marker: {
                size: sampleValues,
                color: otuID
            },
            text: otuLabels
        }

        var layoutBubble = {
            title: 'Bubble Chart of Top Colonies',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Value'}
        }

        var dataGauge = [{
            domain: { x: [0, 10], y: [0, 10] },
            value: wfreq,
            title: { text: "Belly Button Wash Frequency" },
            type: 'indicator',
            gauge: {
                axis: {
                    range: [0, 10]
                },
                    
                bar: {thickness: 0},
                steps: [
                    { name: '0-2', range: [0, 2], color: "rgba(255, 0, 0, 0.6)"},
                    { name: '2-4', range: [2, 4], color: "rgba(255, 165, 0, 0.6)"},
                    { name: '4-6', range: [4, 6], color: "rgba(255, 255, 0, 0.6)"},
                    { name: '6-8', range: [6, 8], color: "rgba(144, 238, 144, 0.6)"},
                    { name: '8-10', range: [8, 10], color: "rgba(154, 205, 50, 0.6)"},
                ]},
            mode: "gauge+number"
            }]

        Plotly.newPlot("bar", [traceBar], layoutBar);

        Plotly.newPlot("bubble", [traceBubble], layoutBubble)

        Plotly.newPlot("gauge", dataGauge)

    });
}