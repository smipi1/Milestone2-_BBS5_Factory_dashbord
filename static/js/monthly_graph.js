// A $( document ).ready() block.
$(document).ready(function() {

    //Read the data
    d3.csv("data/sunny/Energie_en_vermogen_Alle_Dagen.csv",

        // When reading the csv, I must format variables:
        function(csv_row) {
            var d = d3.timeParse("%Y-%m-%dT%H:%M:%S")(csv_row['timestamp']);
            return {
                date: d,
                day: new Date(d.getFullYear(), d.getMonth(), d.getDay()),
                month: new Date(d.getFullYear(), d.getMonth()),
                year: new Date(d.getFullYear()),
                power: csv_row['power[kW]'],
            }
        },


        // Now I can use this dataset:
        function(data) {
            var filteredData = data.filter(function(d) {
                return  (d.date >= d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-01T00:00:00")) &&
                        (d.date < d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-30T00:00:00"));
            });
            console.log(filteredData);
            
            var ndx = crossfilter(data);
            
            var dim = ndx.dimension(dc.pluck('day'));
            var group = dim.group();

            var chart = dc.barChart("#g_monthly")
                .width(400)
                .height(300)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(dim)
                .group(group)
                .transitionDuration(500)
                .x(d3.scaleBand())
                .elasticX(true)
                .xUnits(dc.units.ordinal)
                // .xUnits(d3.time.days)
                .xAxisLabel("Month")
                .yAxis().ticks(20);
            dc.renderAll();
        }
    );

})