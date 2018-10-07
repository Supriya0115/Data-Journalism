// Define chart area
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 100,
  bottom: 60,
  left: 100
};


var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// SVG Wrapper
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

// Read data from data.csv
d3.csv('data.csv', function(err, phcdata) {
    if (err) throw err;

    for (var i = 0; i < phcdata.length; i++){
        console.log(phcdata[i])
    }
  
    phcdata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    })

     // Create scale functions
    var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);

    var xLinearScale = d3.scaleLinear().range([0, chartWidth]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([
      7,
      d3.max(phcdata, function(data) {
        return +data.poverty;
      }),
    ]);
    yLinearScale.domain([
      0,
      d3.max(phcdata, function(data) {
        return +data.healthcare * 1.1;
      }),
    ]);


    // Create tool tip
    var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var state = data.state;
      var poverty = +data.poverty;
      var healthcare = +data.healthcare;
      return (
        state + '<br> Poverty Percentage: ' + poverty + '<br> Lacks Healthcare Percentage: ' + healthcare
      );
    });

    chart.call(toolTip);
    
    // Generate Scatter Plot
    chart
    .selectAll('circle')
    .data(phcdata)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.poverty);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.healthcare);
    })
    .attr('r', '17')
    .attr('fill', 'lightblue')
    .on('click', function(data) {
      toolTip.show(data);
    })
    // Hide and Show on mouseout
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
    });

    chart
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chart.append('g').call(leftAxis);

    svg.selectAll(".dot")
    .data(phcdata)
    .enter()
    .append("text")
    .text(function(data) { return data.abbr; })
    .attr('x', function(data) {
      return xLinearScale(data.poverty);
    })
    .attr('y', function(data) {
      return yLinearScale(data.healthcare);
    })
    .attr("font-size", "9px")
    .attr("fill", "purple")
    .style("text-anchor", "middle");

    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 40)
      .attr('x', 0 - chartHeight / 2)
      .attr('dy', '1em')
      .attr('class', 'axisText')
      .text('Lacks Healthcare (%)');

    // x-axis labels
    chart
      .append('text')
      .attr(
        'transform',
        'translate(' + chartWidth / 2 + ' ,' + (chartHeight + margin.top + 30) + ')',
      )
      .attr('class', 'axisText')
      .text('In Poverty (%)');
})
