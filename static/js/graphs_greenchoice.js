$(document).ready(function() {
queue()
    .defer(d3.csv, "data/greenchoice/greenchoice_energy_usage.csv", parseRow)
    .await(makeGraphs);
    
function makeGraphs(error, greenchoiceData) {
    var ndx = crossfilter(greenchoiceData);
    console.log (greenchoiceData);
    
    show_montly_enery_consumption(ndx)

    dc.renderAll();
}
function parseRow(csv_row) {
  var d = d3.timeParse("%Y %b")(csv_row['year']+' '+ csv_row['month']);
  return {
    date: d,
    energy: parseFloat(csv_row['Total used']),
    tarif: parseFloat(csv_row['consumed Euro incl vat']),
  }
}
function show_montly_enery_consumption (ndx){
    var dim = ndx.dimension(function(d) { return d.date });
    var group = dim.group().reduceSum(dc.pluck('energy'));
    
    var chart = dc.barChart("#g_e_usaged")
        .width(400)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .colors(["orange"])
        .x(d3.scaleTime())
        .controlsUseVisibility(true)
        .xAxisLabel("Energy usaged")
    // chart.xAxis().tickFormat(d3.timeFormat('%_B'));
}
})