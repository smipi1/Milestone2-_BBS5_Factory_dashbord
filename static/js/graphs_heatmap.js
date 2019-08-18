$(document).ready(function() {
    queue()
        .defer(d3.csv, "data/knmi/knmi_20190813.csv", parseKnmiRow)
        .await(makeGrGraphs)
});

function parseKnmiRow(d) {
    return {
        YYYYMMDD: d3.timeParse("%Y-%m-%d"),
        "LON(east)": parseFloat(d["LON(east)"]),
        "LAT(north)": parseFloat(d["LAT(north)"]),
        sunShineHour: parseFloat(d['SQ']),
        sunShineduration: parseFloat(d['SP']),
        globalRadiationJcm2: parseFloat(d['Q']),
    };
}

function makeGrGraphs(error, knmiData) {
    var ndx = crossfilter(knmiData);
    var allDim = ndx.dimension(function(d) { return d; });
    var radiationDim = ndx.dimension(dc.pluck("globalRadiationJcm2"));
    var maxRadiation = radiationDim.top(1)[0]["globalRadiationJcm2"] * 365;

    var map = L.map('heat_map');

    function drawMap() {
        map.setView([52.370216, 4.895168], 7);
        mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 15,
            }

        ).addTo(map);
        //HeatMap
        var geoData = [];
        _.each(allDim.top(Infinity), function(d) {
            geoData.push([d["LAT(north)"], d["LON(east)"], d["globalRadiationJcm2"]]);
        });
        var heat = L.heatLayer(geoData, {
            radius: 40,
            blur: 20,
            maxZoom: 1,
            max: maxRadiation,
        }).addTo(map);
    }

    drawMap();
}

// function parseGrRow(csv_row) {
//     var d = d3.timeParse("%Y-%m-%dT")(csv_row['YYYYMMDD']);
//     return {
//         date: d,
//         sunShineHour: parseFloat(csv_row['SQ']),
//         sunShineduration: parseFloat(csv_row['SP']),
//         globalRadiationJcm2: parseFloat(csv_row['Q']),
//         longitudeE: (csv_row['LON(east)']),
//         latitudeN: (csv_row['LAT(north)'])
//     };
// }