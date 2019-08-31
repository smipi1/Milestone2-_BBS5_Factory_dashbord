// A $( document ).ready() block.
$(document).ready(function() {

  //Read the dataget 
  d3.csv(
    "data/sunny/Energie_en_vermogen_Alle_Dagen.csv",
    // When reading the csv, I must format variables:
    parseRow,
    // Now I can use this dataset:
    makeGraphs
  );

  const sampleTime = 0.25; // h
  const normalTarif = 0.05250; // EUR / kWh
  const co2_per_kWh = 0.7;
  var graphs;

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



  function makeGraphs(data) {
    var ndx = crossfilter(data);

    updateGraphs(ndx, "kWh");
    graphs.yearSelector.replaceFilter([
      ["2019"]
    ]).redrawGroup(); //  set as default when loading fist time

    $("#value_type").change(function() {
      // User changed how to display values: kWh vs Euro

      updateGraphs(ndx, this.value);
      if (this.value === "Euro") {
        // Display graphs for Euro
        $('#g_hour').hide();
      }
      else {
        // Display graphs for kWh
        $('#g_hour').show();
      }
    });
  }


  function updateGraphs(ndx, value_type) {

    graphs = {
      hourly: makeHourlyGraph(ndx),
      daily: makeDailyGraph(ndx, value_type),
      monthly: makeMonthyGraph(ndx, value_type),
      yearly: makeYearGraph(ndx, value_type),
      yearSelector: makeYearSelector(ndx, value_type),
      co2display: makeCo2Total(ndx),
      eurodisplay: makeEuro2Total(ndx),
    };
    dc.renderAll();
  }

  function makeCo2Total(ndx) {
    var dim = ndx.dimension(dc.pluck('day'));
    var sumAll = dim.groupAll().reduceSum(dc.pluck('co2'));
    var number = dc.numberDisplay("#co2Avoided")
      .group(sumAll)
      .valueAccessor(function(d) { return d; })
      .formatNumber(function(n) { return d3.format("d")(n) + " kg" });
    return number;
  }

  function makeEuro2Total(ndx) {
    var dim = ndx.dimension(dc.pluck('day'));
    var sumAll = dim.groupAll().reduceSum(dc.pluck('Euro'));
    var number = dc.numberDisplay("#euroearned")
      .group(sumAll)
      .valueAccessor(function(d) { return d; })
      .formatNumber(function(n) { return d3.format("d")(n) + " Euro" });
    return number;
  }



  function makeHourlyGraph(ndx) {
    var dim = ndx.dimension(function(d) { return d.date });
    var group = dim.group().reduceSum(dc.pluck('power'));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.lineChart("#g_hour")
      .width(400)
      .height(400)
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
    // .xUnits(dc.units.ordinal);
    // .xAxisLabel(day[0].date)
    // chart.yAxis().ticks(20);
    // chart.xAxis().ticks(d3.timeHour.every(1));
    chart.xAxis().ticks(6);
    // chart.xAxis().tickFormat(d3.timeFormat('%H'));
    return chart;
  }

  function makeDailyGraph(ndx, value_type) {

    // var title = d3.timeFormat('%B, %Y kWh produced')(data[0].date);
    var dim = ndx.dimension(dc.pluck('day'));
    var group = dim.group().reduceSum(dc.pluck('kWh'));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_day")
      .width(400)
      .height(400)
      .margins({ top: 10, right: 50, bottom: 30, left: 50 })
      .dimension(dim)
      .group(nonEmpty)
      .transitionDuration(500)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .xAxisLabel("Day")
      .yAxisLabel(value_type)
      .colors(["orange"])
      .x(d3.scaleTime())
      .renderHorizontalGridLines(true)
      .controlsUseVisibility(true)
      .addFilterHandler(function(filters, filter) { return [filter]; });
    chart.xAxis().tickFormat(d3.timeFormat('%_d')); // https://github.com/d3/d3-time-format

    return chart;
  }

  function makeMonthyGraph(ndx, value_type) {

    // var title = d3.timeFormat('%B, %Y kWh produced')(data[0].date);
    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group().reduceSum(dc.pluck(value_type));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_month")
      .width(400)
      .height(400)
      .margins({ top: 10, right: 50, bottom: 30, left: 50 })
      .dimension(dim)
      .group(nonEmpty)
      .transitionDuration(500)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .xAxisLabel("Month")
      .yAxisLabel(value_type)
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

  function makeYearGraph(ndx, value_type) {

    // var title = d3.timeFormat('%B, %Y kWh produced')(data[0].date);
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group().reduceSum(dc.pluck(value_type));
    var nonEmpty = remove_empty_bins(group);
    var chart = dc.barChart("#g_year")
      .width(400)
      .height(400)
      .margins({ top: 10, right: 50, bottom: 30, left: 50 })
      .dimension(dim)
      .group(nonEmpty)
      .transitionDuration(500)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .xAxisLabel("Year")
      .yAxisLabel(value_type)
      .colors(["orange"])
      .x(d3.scaleTime())
      .renderHorizontalGridLines(true)
      .controlsUseVisibility(true)
      .addFilterHandler(function(filters, filter) { return [filter]; });
    // .xAxisLabel(title)
    chart.xAxis().tickFormat(d3.timeFormat('%Y'));
    return chart;
  }

  function makeYearSelector(ndx, value_type) {
    var dim = ndx.dimension(dc.pluck('year_string'));
    var group = dim.group().reduceSum(dc.pluck(value_type));

    var select = dc.selectMenu("#year-selector")
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
