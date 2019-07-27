// A $( document ).ready() block.
$( document ).ready(function() {

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/sunny/Energie_en_vermogen_Alle_Dagen.csv",

  // When reading the csv, I must format variables:
  function(d) {
    return { date: d3.timeParse("%Y-%m-%dT%H:%M:%S")(d['timestamp']), value: d['power[kW]'] }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([0, width]);

    x.domain([
      d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-07-18T00:00:00"),
      d3.timeParse("%Y-%m-%dT%H:%M:%S")("2019-07-19T00:00:00")
    ]);

    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([height, 0]);

    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Add the area
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)");

    line
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return x(d.date) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
      )

    $(function() {
      $('#datetimepicker1').datepicker();
      $('#datetimepicker1').on('changeDate', function() {
        let min = $('#datetimepicker1').datepicker('getDate');
        let max = new Date(min.getTime() + 24 * 60 * 60 * 1000);
        console.log(min);
        console.log(max);

        // Update axis and line position
        x.domain([
          min,
          max
        ]);
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        line.select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.area()
            .x(function(d) { return x(d.date) })
            .y0(y(0))
            .y1(function(d) { return y(d.value) })
          );
      });
    });
  })
});