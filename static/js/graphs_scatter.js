$(document).ready(function() {

    queue()
        .defer(d3.csv, "data/sunny/Energie_en_vermogen_Alle_Dagen.csv", parseRow)
        .defer(d3.csv, "data/knmi/knmi_20190813.csv", parseKnmiRow)
        .await(makeScGraphs);

    const sampleTime = 0.25; // h
    const normalTarif = 0.05250; // EUR / kWh
    const co2_per_kWh = 0.7;

    function parseRow(csv_row) {
        var d = d3.timeParse("%Y-%m-%dT%H:%M:%S")(csv_row['timestamp']);
        return {
            date: d,
            day: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            month: new Date(d.getFullYear(), d.getMonth(), 1),
            year: new Date(d.getFullYear(), 0, 1),
            year_string: d3.timeFormat('%Y')(d), // Workaround for dc.selectMenu bug:
            // See https://stackoverflow.com/questions/38591613/how-to-create-interaction-with-selectmenu-in-dc-js
            power: csv_row['power[kW]'],
            kWh: csv_row['power[kW]'] * sampleTime,
            Euro: csv_row['power[kW]'] * sampleTime * normalTarif,
            co2: csv_row['power[kW]'] * sampleTime * co2_per_kWh,
        }
    }

    function parseKnmiRow(d) {
        var date = d3.timeParse("%Y%m%d")(d["YYYYMMDD"]);
        return {
            date: date,
            sunMonth: new Date(date.getFullYear(), date.getMonth(), 1),
            // sunDay: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            "LON(east)": parseFloat(d["LON(east)"]),
            "LAT(north)": parseFloat(d["LAT(north)"]),
            sunShineHour: parseFloat(d['SQ']),
            sunShineduration: parseFloat(d['SP']),
            globalRadiationJcm2: parseFloat(d['Q']),
            weatherStation: d['NAME'],
        };
    }

    function makeScGraphs(error, energyData, knmiData) {
        console.log(error);
        console.log(energyData);
        console.log(knmiData);
        var ndx = crossfilter(energyData);
        correlation_graph(ndx);
        dc.renderAll();
    }

    function correlation_graph(ndx) {

        var dim = ndx.dimension(dc.pluck('globalRadiationJcm2'));
        var group = dim.group(dc.pluck('kWh'));
        var nonEmpty = remove_empty_bins(group);
        var chart = dc.scatterPlot("#g_comparison")
            .width(800)
            .height(400)
            .brushOn(false)
            .symbolSize(8)
            .clipPadding(10)
            .margins({ top: 10, right: 50, bottom: 30, left: 50 })
            .dimension(dim)
            .group(nonEmpty)
            .transitionDuration(500)
            .elasticX(true)
            .elasticY(true)
            .yAxisLabel("kWh")
            .addFilterHandler(function(filters, filter) { return [filter]; })
            .x(d3.scaleTime())
            .controlsUseVisibility(true)
            .renderHorizontalGridLines(true)
            .colors(["orange"])
            .xAxisLabel(function(d) {
                console.log(d);
            });
    }
})