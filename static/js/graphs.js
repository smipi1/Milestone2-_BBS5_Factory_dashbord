// A $( document ).ready() block.
$(document).ready(function() {
  var minDate = $('#datetimepicker2').datepicker('setDate',
    d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-05-01T00:00:00")
  )

  //Read the data
  d3.csv(
    "data/sunny/Energie_en_vermogen_Alle_Dagen.csv",
    // When reading the csv, I must format variables:
    formatVariables,
    // Now I can use this dataset:
    makeGraphs
  );
})

function formatVariables(csv_row) {
  var d = d3.timeParse("%Y-%m-%dT%H:%M:%S")(csv_row['timestamp']);
  return {
    date: d,
    day: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    month: new Date(d.getFullYear(), d.getMonth(), 1),
    year: new Date(d.getFullYear(), 0, 1),
    power: csv_row['power[kW]'],
    energy: csv_row['power[kW]'] * 0.25,
  }
}

function makeGraphs(data) {
  var ndx = crossfilter(data);
  
  makeHourlyGraph(ndx);
  makeDailyGraph(ndx);
  makeMonthyGraph(ndx)
  dc.renderAll();
}
function makeHourlyGraph(ndx) {
  var dim = ndx.dimension(function(d){return d.date});
  var group = dim.group().reduceSum(dc.pluck('power'));
  var nonEmpty = remove_empty_bins(group);
  var chart = dc.lineChart("#g_hour")
    .width(460)
    .height(400)
    .margins({ top: 10, right: 50, bottom: 30, left: 50 })
    .dimension(dim)
    .group(nonEmpty)
    .transitionDuration(500)
    .elasticX(true)
    .elasticY(true)
    .x(d3.scaleLinear())
    // .x(d3.scaleTime().domain([minDate,maxDate]))
    .xUnits(dc.units.ordinal)
    // .xAxisLabel(day[0].date)
    .yAxis().ticks(20)
}

function makeDailyGraph(ndx){
  
    // var title = d3.timeFormat('%B, %Y kWh produced')(data[0].date);
    var dim = ndx.dimension(dc.pluck('day'));
    var group = dim.group().reduceSum(dc.pluck('energy'));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_day")
                .width(460)
                .height(400)
                // .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(dim)
                .group(nonEmpty)
                // .transitionDuration(500)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .elasticX(true)
                .elasticY(true);
                // .x(d3.scaleTime().domain([minDate,maxDate]))
                // .xAxisLabel(title)
    chart.xAxis().tickFormat(d3.timeFormat('%e'));
}

function makeMonthyGraph(ndx){
  
    // var title = d3.timeFormat('%B, %Y kWh produced')(data[0].date);
    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group().reduceSum(dc.pluck('energy'));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_month")
                .width(460)
                .height(400)
                // .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(dim)
                .group(nonEmpty)
                // .transitionDuration(500)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .elasticX(true)
                .elasticY(true);
                // .x(d3.scaleTime().domain([minDate,maxDate]))
                // .xAxisLabel(title)
    chart.xAxis().tickFormat(d3.timeFormat('%e'));
}

  function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value != 0;
            });
        }
    };
}