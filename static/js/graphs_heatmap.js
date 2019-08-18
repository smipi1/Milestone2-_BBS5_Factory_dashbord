$(document).ready(function() {
    queue()
        .defer(d3.csv, "data/knmi/knmi_20190813.csv", parseKnmiRow)
        .await(makeGrGraphs)
});

function parseKnmiRow(d) {
    return {
        date: d3.timeParse("%Y%m%d")(d["YYYYMMDD"]),
        "LON(east)": parseFloat(d["LON(east)"]),
        "LAT(north)": parseFloat(d["LAT(north)"]),
        sunShineHour: parseFloat(d['SQ']),
        sunShineduration: parseFloat(d['SP']),
        globalRadiationJcm2: parseFloat(d['Q']),
        weatherStation:(d['NAME']),
    };
}

function makeGrGraphs(error, knmiData) {
    var ndx = crossfilter(knmiData);
    var allDim = ndx.dimension(function(d) { return d; });
    var dateDim = ndx.dimension(dc.pluck('date'));
    var radiationDim = ndx.dimension(dc.pluck("globalRadiationJcm2"));
    var maxRadiation = radiationDim.top(1)[0]["globalRadiationJcm2"];
    
    var minDate = dateDim.bottom(1)[0]["date"];
    var maxDate = dateDim.top(1)[0]["date"];
    var timeInterval = d3.timeFormat("%Y-%m-%d")(minDate) + "/" + d3.timeFormat("%Y-%m-%d")(maxDate);

    var nextDate = new Date(minDate);
    makeWeatherStationSelector(ndx);


    var map = L.map('heat_map', {
        timeDimension: true,
        timeDimensionOptions: {
            timeInterval: timeInterval,
            period: "P1D"
        },
        timeDimensionControl: true,
    });
    
    map.timeDimension.on('timeload', function(data) {
        nextDate = new Date(data.time);
        nextDate.setHours(0);
        nextDate.setMinutes(0);
        nextDate.setSeconds(0);
        nextDate.setMilliseconds(0);
        dateDim.filter(nextDate);
        drawMap();
    });


    function drawMap() {
        map.setView([52.370216, 4.895168], 7);
        mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 14,

            }

        ).addTo(map);
        //HeatMap
        var geoData = [];
        _.each(allDim.top(Infinity), function(d) {
            geoData.push([d["LAT(north)"], d["LON(east)"], d["globalRadiationJcm2"]]);
        });

        var heat = L.heatLayer(geoData, {
            radius: 50,
            blur: 15, 
            maxZoom: 6,
            max: maxRadiation,

        }).addTo(map);
    }


    drawMap();
    dc.renderAll();
}

function makeWeatherStationSelector(ndx) {
  var dim = ndx.dimension(dc.pluck('weatherStation'));
  var group = dim.group().reduceSum(dc.pluck('globalRadiationJcm2'));

  var select = dc.selectMenu("#location-selector")
    .dimension(dim)
    .group(group);
  select.title(function(d){
    return d.key;
  });
  return select;
}