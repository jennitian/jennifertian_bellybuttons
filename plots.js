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
        //extract wash freq.
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var firstResult = resultArray[0];
        var wfreq = firstResult.wfreq
        //extract bacterial samples
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
        //creating graphs
        var traceBar = {
            x: topSampleValues,
            y: topOtuIDs,
            type: 'bar',
            orientation: 'h',
            text: topOtuIDs
        };

        var layoutBar = {
            title: 'Top Bacterial Species Found',
            xaxis: {title: 'Sample Value'},
            yaxis: {
                title: 'OTU ID',
                type: 'category',
                autorange: 'reversed'}
        };

        var traceBubble = {
            x: topOtuIDs,
            y: topSampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(31, 119, 180)', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)', 'rgb(148, 103, 189)', 'rgb(140, 86, 75)'],},
            text: topOtuIDs
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
                axis: {range: [0, 10]},
                text: ['0-2','2-4','4-6','6-8','8-10'],
                steps: [
                    { range: [0, 2], color: "rgba(255, 0, 0, 0.6)"},
                    { range: [2, 4], color: "rgba(255, 165, 0, 0.6)"},
                    { range: [4, 6], color: "rgba(255, 255, 0, 0.6)"},
                    { range: [6, 8], color: "rgba(144, 238, 144, 0.6)"},
                    { range: [8, 10], color: "rgba(154, 205, 50, 0.6)"},
                ]},
            mode: "gauge+number"
            }]
            /*type: "pie",
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: wfreq,
            text: ['0-2','2-4','4-6','6-8','8-10'],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
            colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"]
            },
            labels: ['0-2','2-4','4-6','6-8','8-10'],
            hoverinfo: "label"
            }]
        var degrees = 115, radius = .6;
        var radians = degrees * Math.PI / 180;
        var x = -1 * radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        var layoutGauge = {
        shapes:[{
            type: 'line',
            x0: 0,
            y0: 0,
            x1: x,
            y1: 0.5,
            line: {
                color: 'black',
                width: 8
            }
            }],
        title: 'Washing Frequency',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
        };*/


        Plotly.newPlot("bar", [traceBar], layoutBar);

        Plotly.newPlot("bubble", [traceBubble], layoutBubble)

        Plotly.newPlot("gauge", dataGauge)

    });
}