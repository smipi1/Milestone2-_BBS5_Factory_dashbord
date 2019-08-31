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
            if (knmiLookup.hasOwnProperty(item.key)) {
                joinedData.push({
                    day: item.key,
                    month: new Date(item.key.getFullYear(), item.key.getMonth(), 1),
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
        makeScSelector(ndx);
        dc.renderAll();
    }


    function correlation_graph(ndx) {

        var dim = ndx.dimension(function(d) {
            return [d.kWh, d.globalRadiationJcm2, d.day];
        });
        var group = dim.group();
        var nonEmpty = remove_empty_bins(group);

        dc.scatterPlot("#g_comparison")
            .width(800)
            .height(400)
            .margins({ top: 10, right: 50, bottom: 75, left: 75 })
            // .x(d3.scaleLinear())
            .x(d3.scaleLinear().domain([0, 20]))
            .y(d3.scaleLinear().domain([0, 20]))
            .brushOn(false)
            .symbolSize(8)
            .clipPadding(10)
            .xAxisLabel("kWh")
            .yAxisLabel("Radiation Jcm2")
            .renderHorizontalGridLines(true)
            .controlsUseVisibility(true)
            .mouseZoomable(true)
            .addFilterHandler(function(filters, filter) { return [filter]; })
            .elasticX(true)
            .elasticY(true)
            .title(function(d) {
                return "date: " + d3.timeFormat('%x')(d.key[2]) +
                    ", radiation: " + d.key[1] + " Jcm2" +
                    ", energy: " + d3.format(".1f")(d.key[0]) + " kWh";
            })
            .dimension(dim)
            .group(nonEmpty);
    }

    function makeScSelector(ndx) {
        var dim = ndx.dimension(dc.pluck("month"));
        var group = dim.group().reduceSum(dc.pluck('day'));

        var select = dc.selectMenu("#year-selector_scatter")
            .dimension(dim)
            .group(group);
        select.title(function(d) {
            return d.key;
        });
        return select;
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
        };
    }

});
