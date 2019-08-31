$(document).ready(function() {

    queue()
        .defer(d3.csv, "data/sunny/Energie_en_vermogen_Alle_Dagen.csv", parseRow)
        .defer(d3.csv, "data/knmi/knmi_20190813.csv", parseKnmiRow)
        .await(joinData);

    const sampleTime = 0.25; // h

    function parseRow(csv_row) {
        var d = d3.timeParse("%Y-%m-%dT%H:%M:%S")(csv_row['timestamp']);
        return {
            day: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            kWh: csv_row['power[kW]'] * sampleTime,
        }
    }

    function parseKnmiRow(d) {
        return {
            day: d3.timeParse("%Y%m%d")(d["YYYYMMDD"]),
            globalRadiationJcm2: parseFloat(d['Q']),
            weatherStation: d['NAME'],
        };
    }

    function joinData(error, sunnyData, knmiData) {
        var sunnyNdx = crossfilter(sunnyData);
        var sunnyDim = sunnyNdx.dimension(dc.pluck('day'));
        var sunnyGroup = sunnyDim.group().reduceSum(dc.pluck('kWh'));

        var knmiLookup = {};
        knmiData.forEach(function(row) {
            if (row.weatherStation !== 'EINDHOVEN') {
                knmiLookup[row.day] = row.globalRadiationJcm2;
            }
        });

        var joinedData = [];
        sunnyGroup.all().forEach(function(item) {
            if(knmiLookup.hasOwnProperty(item.key) ) {
                joinedData.push({
                    day: item.key,
                    globalRadiationJcm2: knmiLookup[item.key],
                    kWh: item.value
                });
            }
        });

        makeScGraphs(joinedData);
    }

    function makeScGraphs(data) {
        var ndx = crossfilter(data);
        correlation_graph(ndx);
        dc.renderAll();
    }

    // function correlation_graph(ndx) {

    //     var dim = ndx.dimension(dc.pluck('globalRadiationJcm2'));
    //     var group = dim.group(dc.pluck('kWh'));
    //     var nonEmpty = remove_empty_bins(group);
    //     var chart = dc.scatterPlot("#g_comparison")
    //         .width(800)
    //         .height(400)
    //         .brushOn(false)
    //         .symbolSize(8)
    //         .clipPadding(10)
    //         .margins({ top: 10, right: 50, bottom: 30, left: 50 })
    //         .dimension(dim)
    //         .group(nonEmpty)
    //         .transitionDuration(500)
    //         .elasticX(true)
    //         .elasticY(true)
    //         .yAxisLabel("kWh")
    //         .addFilterHandler(function(filters, filter) { return [filter]; })
    //         .x(d3.scaleTime())
    //         .controlsUseVisibility(true)
    //         .renderHorizontalGridLines(true)
    //         .colors(["orange"])
    //         .xAxisLabel(function(d) {
    //             console.log(d);
    //         });
    // }

    function correlation_graph(ndx) {

        var powerColors = d3.scaleOrdinal()
            .domain(["kWh", "globalRadiationJcm2"])
            .range(["red", "blue"]);

        var dim = ndx.dimension(function(d) {
            return [ d.kWh, d.globalRadiationJcm2 ];
        });
        var group = dim.group();

        dc.scatterPlot("#g_comparison")
            .width(800)
            .height(400)
            .margins({ top: 10, right: 50, bottom: 75, left: 75 })
            .x(d3.scaleLinear())
            .brushOn(false)
            // .symbolSize(8)
            // .clipPadding(10)
            .xAxisLabel("Month")
            // .title(function(d) {
            //     return d.key[2] + " earned " + d.key[1];
            // })
            // .colorAccessor(function(d) {
            //     return d.key[3];
            // })
            // .colors(powerColors)
            .dimension(dim)
            .group(group);
    }

})
