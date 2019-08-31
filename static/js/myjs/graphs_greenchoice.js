$(document).ready(function() {
  queue()
    .defer(d3.csv, "data/greenchoice/greenchoice_energy_usage.csv", parseGrRow)
    .await(makeGrGraphs);

  var consuption_graphs;

  function makeGrGraphs(error, greenchoiceData) {
    var ndx = crossfilter(greenchoiceData);
    consuption_graphs = {
      comparison: show_comparison_prdvscons(ndx),
      consumption: show_montly_enery_consumption(ndx),
    }

    makeYearSelector(ndx);
    dc.renderAll();
  }

  function parseGrRow(csv_row) {
    var d = d3.timeParse("%Y %b")(csv_row['year'] + ' ' + csv_row['month']);
    return {
      date: d,
      year_string: d3.timeFormat('%Y')(d),
      energy: parseFloat(csv_row['Total used']),
      produced: parseFloat(csv_row['sunny_produced']),
      tarif: parseFloat(csv_row['consumed Euro incl vat']),
    };
  }

  function show_montly_enery_consumption(ndx) {
    var dim = ndx.dimension(function(d) { return d.date });

    var group = dim.group().reduceSum(dc.pluck('energy'));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_e_usaged")
      .width(400)
      .height(400)
      .margins({ top: 10, right: 50, bottom: 30, left: 50 })
      .dimension(dim)
      .group(nonEmpty)
      .transitionDuration(500)
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .colors(["orange"])
      .x(d3.scaleTime())
      .renderHorizontalGridLines(true)
      .controlsUseVisibility(true)
      .addFilterHandler(function(filters, filter) { return [filter]; })
      .xAxisLabel("Energy used")
    chart.xAxis().tickFormat(d3.timeFormat('%_b'));
    return chart
  }


  function show_comparison_prdvscons(ndx) {
    var dim = ndx.dimension(function(d) { return d.date });
    var energy = dim.group().reduceSum(dc.pluck('energy'));
    var produced = dim.group().reduceSum(dc.pluck('produced'));

    var xScale = d3.scaleTime().domain([
      dim.bottom(1)[0].date,
      dim.top(1)[0].date
    ]);

    var composite = dc.compositeChart("#g_usagevproduction")
    composite
      .width(400)
      .height(400)
      .margins({ top: 10, right: 50, bottom: 30, left: 50 })
      .transitionDuration(500)
      .xUnits(dc.units.ordinal)
      .x(xScale)
      .controlsUseVisibility(true)
      .xAxisLabel("Month")
      .yAxisLabel("kWh")
      .xUnits(d3.timeMonths)
      .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
      .renderHorizontalGridLines(true)
      .compose([
        dc.barChart(composite)
        .dimension(dim)
        .group(energy, "Bars")
        .colors(["orange"])
        .centerBar(true)
        .addFilterHandler(function(filters, filter) { return [filter]; }),
        dc.lineChart(composite)
        .dimension(dim)
        .colors(['black'])
        .group(produced, "Energy Produced")
        .dashStyle([2, 2])
      ])
      .brushOn(true)
    composite.xAxis().tickFormat(d3.timeFormat('%_b'));
    return composite;
  }


  function makeYearSelector(ndx) {
    var dim = ndx.dimension(dc.pluck('year_string'));
    var group = dim.group().reduceSum(dc.pluck('date'));

    var select = dc.selectMenu("#year-selector_usage")
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
        }
    }
})