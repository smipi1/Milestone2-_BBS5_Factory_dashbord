function makeGraphs(data) {
    var minDate = $('#datetimepicker2').datepicker('getDate');
    var maxDate = new Date(minDate.getTime() + 24 * 60 * 60 * 1000);
    var day = data.filter(function(d) {
        return (d.date >= minDate) && (d.date < maxDate);
    });
    var ndx = crossfilter(day);
    var dim = ndx.dimension(dc.pluck('date'));
    var group = dim.group().reduceSum(dc.pluck('power'));

    var chart = dc.lineChart("#exp_z")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .elasticX(true)
        .x(d3.scaleLinear().domain([minDate, maxDate]))
        // .x(d3.scaleTime().domain([minDate,maxDate]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel(day[0].date)
        .yAxis().ticks(20)
    dc.renderAll();
}

// A $( document ).ready() block.
$(document).ready(function() {
    var minDate = $('#datetimepicker2').datepicker('setDate', 
        d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-01T00:00:00")
    )
    
     //Read the data
    d3.csv(
        "data/sunny/Energie_en_vermogen_Alle_Dagen.csv",
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
        function(data) {
            $('#datetimepicker2').on('changeDate', function() {
                makeGraphs(data);
            });
            makeGraphs(data);
        }
     );
})
        
    //     // Now I can use this dataset:
    //     function(data) {
    //         var daygroup = DateDim.group().reduceSum(function(d){return d.Close;});
    //         var minDate = DateDim.bottom(1)[0].date;
    //         var maxDate = DateDim.top(1)[0].date;
    //         console.log("min date is " + minDate + " and max date is " + maxDate);
    //         // var minDate = d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-01T00:00:00");
    //         // var maxDate = d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-02T00:00:00");
    //         var day = data.filter(function(d) {
    //             return  (d.date >= minDate) &&
    //                     (d.date < maxDate);
    //         });
    //         var ndx = crossfilter(data);

    //         var dim = ndx.dimension(dc.pluck('date'));
    //         var group = dim.group().reduceSum(dc.pluck('energy'));

    //         var chart = dc.lineChart("#exp_z")
    //             .width(400)
    //             .height(300)
    //             .margins({ top: 10, right: 50, bottom: 30, left: 50 })
    //             .dimension(dim)
    //             .group(group)
    //             .transitionDuration(500)
    //             .elasticX(true)
    //             .x(d3.scaleLinear().domain([minDate,maxDate]))
    //             // .x(d3.scaleTime().domain([minDate,maxDate]))
    //             .xUnits(dc.units.ordinal)
    //             .xAxisLabel("Day per Month")
    //             .yAxis().ticks(20)

    //         dc.renderAll();
    //         $(function() {
    //             $('#datetimepicker2').datepicker();
    //             $('#datetimepicker2').on('changeDate', function() {
    //                 let min = $('#datetimepicker2').datepicker('getDate');
    //                 let max = new Date(min.getTime() + 24 * 60 * 60 * 1000);
    //                 console.log(min);
    //                 console.log(max);

    //                 // Update axis and line position
    //                 x.domain([
    //                     min,
    //                     max
    //                 ]);
    //                 xAxis.transition().duration(1000).call(d3.axisBottom(x));
    //                 line.select('.line')
    //                     .transition()
    //                     .duration(1000)
    //                     .attr("d", d3.area()
    //                         .x(function(d) { return x(d.date) })
    //                         .y0(y(0))
    //                         .y1(function(d) { return y(d.value) })
    //                     );
    //             });
    //         });
    //     });
            
