// Bellybutton Biodiversity

// Url link to JSON File
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Starting the function
function init(){
    let dropDownMenu = d3.select("#selDataset")

    //Calling the data from the json Url
    d3.json(url).then(data => {
        console.log(data)
        let dataNames = data.names;
        dataNames.forEach(name => dropDownMenu.append('option').text(name).property('value', name))    
    buildPlot(dataNames[0]);
    demographic(dataNames[0]);
    });
};

// Creating a function to create a new graph with each id name
function optionChanged(id){
    buildPlot(id);
    demographic(id);
}

function buildPlot(id) {
   //Calling the data from the json Url
    d3.json(url).then(function(data){
        console.log(data)
        //Storing the data
        let dataSample = data.samples;
        let filterSample = dataSample.filter(d => d.id == id)[0];
        
        let x_value = filterSample.sample_values.slice(0, 10).reverse();
        let y_value = filterSample.otu_ids.slice(0,10).map(OTUID => 'OTU' + OTUID).reverse();
        let label = filterSample.otu_labels.slice(0,10).reverse();

        // Create layout for the bubble chart
        let Bubble = {
            x: filterSample.otu_ids,
            y: filterSample.sample_values,
            mode: 'markers',
            marker: {
                size: filterSample.sample_values,
                color: filterSample.otu_ids
            },
            text: label
        };

        let dataBubble = [Bubble];

        let bubbleTitle = {
            title: "Bacteria Found in Sample by Frequency",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Frequency'},
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)"
        };

        Plotly.newPlot("bubble", dataBubble, bubbleTitle);

        // Creating layout for the bar graph
        let BarChar = {
            x: x_value,
            y: y_value,
            type: "bar",
            text: label,
            // Horizontal bar graph
            orientation: 'h'
        };

        let barData = [BarChar];
        let barTitle = {
            title: "Top 10 OTUs Found in individual"
        };

        Plotly.newPlot("bar", barData, barTitle);
    });
};

init();

// Creating the dropdown demographic menu
function demographic(UID) {
    let panel = d3.select("#sample-metadata");
    panel.html("")
    d3.json(url).then(data => {
        let demoInfo = data.metadata
        demoInfo = demoInfo.filter(patientRow => patientRow.id == UID)[0]
        Object.entries(demoInfo).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
    
}