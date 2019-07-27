// A $( document ).ready() block.
$(document).ready(function() {

    //Read the data
    d3.csv("data/sunny/Energie_en_vermogen_Alle_Dagen.csv",

        // When reading the csv, I must format variables:
        function(csv_row) {
            var d = d3.timeParse("%Y-%m-%dT%H:%M:%S")(csv_row['timestamp']);
            return {
                date: d,
                day: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
                month: new Date(d.getFullYear(), d.getMonth(), 1),
                year: new Date(d.getFullYear(), 0, 1),
                power: csv_row['power[kW]'],
                energy: csv_row['power[kW]'] * 0.25,
            }
        },
        
        // Now I can use this dataset:
        function(data) {
            var minDate = d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-01T00:00:00");
            var maxDate = d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-06-01T00:00:00");
            var month = data.filter(function(d) {
                return  (d.date >= minDate) &&
                        (d.date < maxDate);
            });
            var ndx = crossfilter(month);

            var dim = ndx.dimension(dc.pluck('day'));
            var group = dim.group().reduceSum(dc.pluck('energy'));

            var chart = dc.barChart("#g_monthly")
                .width(460)
                .height(400)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(dim)
                .group(group)
                .transitionDuration(500)
                .elasticX(true)
                .x(d3.scaleBand())
                // .x(d3.scaleTime().domain([minDate,maxDate]))
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Day per Month")
                .xAxis().tickFormat(d3.timeFormat('%e'));
            dc.renderAll();
        }
    );

})