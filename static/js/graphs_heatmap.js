$(document).ready(function() {
    queue()
        .defer(d3.csv, "data/knmi/knmi_20190813.csv", parseKnmiRow)
        .await(makeGrGraphs);
});

function parseKnmiRow(d) {
    var date = d3.timeParse("%Y%m%d")(d["YYYYMMDD"]);
    return {
        date: date,
        sunMonth: new Date(date.getFullYear(), date.getMonth(), 1),
        "LON(east)": parseFloat(d["LON(east)"]),
        "LAT(north)": parseFloat(d["LAT(north)"]),
        sunShineHour: parseFloat(d['SQ']),
        sunShineduration: parseFloat(d['SP']),
        globalRadiationJcm2: parseFloat(d['Q']),
        weatherStation: d['NAME'],
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
    makeSunMonthyGraph(ndx);

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

function makeSunMonthyGraph(ndx) {


  var dim = ndx.dimension(dc.pluck('sunMonth'));
  var group = dim.group().reduceSum(dc.pluck('globalRadiationJcm2'));
  var nonEmpty = remove_empty_bins(group);
  var chart = dc.barChart("#sunpower_month")
    .width(550)
    .height(410)
    .margins({ top: 10, right: 50, bottom: 30, left: 50 })
    .dimension(dim)
    .group(nonEmpty)
    .transitionDuration(500)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .elasticX(true)
    .elasticY(true)
    .xAxisLabel("Month")
    .yAxisLabel("Sun power")
    .colors(["orange"])
    .x(d3.scaleTime())
    .renderHorizontalGridLines(true)
    .controlsUseVisibility(true)
    .addFilterHandler(function(filters, filter) { return [filter]; });
  chart.xAxis().tickFormat(d3.timeFormat('%b'));
  chart.filterPrinter(function(filters) {
    return filters.map(function(f) { return d3.timeFormat('%b')(f) }); //http://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#filterPrinter__anchor
  });
  return chart;
}

function remove_empty_bins(source_group) {
  return {
    all: function() {
      return source_group.all().filter(function(d) {
        // Filter out zero values
        // float is never exactly 0, so we filter out small values
        return Math.abs(d.value) > 0.0001;
      });
    }
  }
}
