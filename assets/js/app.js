function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth*0.8;
  var svgHeight = svgWidth*0.45;
  
  // circle and text size are changed based on window resizing
  var circleR = svgWidth*0.0028; 
  var textsize = parseInt(svgWidth*0.009);
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 80
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  var chosenXAxis = "Poverty_Count";
  var chosenYAxis ="Population";

  // function used for updating x-scale var upon click on axis label
  function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis])*.8])
    .range([0, width]);

  return xLinearScale;
  }

  // function used for updating y-scale var upon click on axis label
  function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * .6])
    .range([height, 0]);

  return yLinearScale;
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
  }
  
  // function used for updating circles group and text group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
  }

  function renderText(textGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

      textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
        
  return textGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      if (chosenXAxis === "Per_Capita_Income"){
        return (`${d.City}, ${d.State}<br>Income (Per Capita): $${d[chosenXAxis]} <br>${chosenYAxis}: ${d[chosenYAxis]}`); 
    
      } else if (chosenXAxis === "Median_Age"){
        return (`${d.City}, ${d.State}<br>Age (Median): ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 
      }    
      else {
        return (`${d.City}, ${d.State}<br>Poverty Count: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 
      }
      });
      
     
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(d, index) {
    toolTip.show(d,this);
    this.style.fill = "red";
    })
    .on("mouseout", function(d, index) {
      toolTip.hide(d);
      this.style.fill = "#9370DB";
    });
  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData) {
  // parse data
  censusData.forEach(function(data) {
    data.Poverty_Count = +data.Poverty_Count;
      
    data.Population = +data.Population;

    data.Median_Age = +data.Median_Age;

    data.Per_Capita_Income = +data.Per_Capita_Income;

    data.State = data.State;

    data.City = data.City;
  });
  
  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  
  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

// append initial circles and text
var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", circleR)
  .attr("fill", "#9370DB");

var textGroup = chartGroup.selectAll("text")
  .exit() //before enter(), to clear cache
  .data(censusData)
  .enter()
  .append("text")
  .text(d => "")
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("font-size", textsize+"px")
  .attr("text-anchor", "middle")
  .style("fill","black")
  .attr("class","cityText");
  
circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

// Create group for x-axis labels
var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("class","axis-text-x")
  .attr("value", "Poverty_Count") 
  .classed("active", true)
  .text("Poverty Count");

var ageLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("class","axis-text-x")
  .attr("value", "Median_Age") 
  .classed("inactive", true)
  .text("Age (Median)");

var incomeLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("class","axis-text-x")
  .attr("value", "Per_Capita_Income") 
  .classed("inactive", true)
  .text("Income (Per Capita)");

// Create group for y-axis labels

var ylabelsGroup = chartGroup.append("g");

var populationLabel = ylabelsGroup.append("text")
  .attr("transform", `translate(-83,${height / 2})rotate(-90)`)
  .attr("dy", "1em")
  .attr("class","axis-text-y")
  .classed("axis-text", true)
  .attr("value", "Population") 
  .classed("active", true)
  .text("Population");

// x axis labels event listener
labelsGroup.selectAll(".axis-text-x")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      console.log(chosenXAxis)

      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);
      // updates y scale for new data
      yLinearScale = yScale(censusData, chosenYAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

      textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "Median_Age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
          
      }
      else if (chosenXAxis === "Poverty_Count")
       {
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        
      }
      else {
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }

    }
  });


// y axis labels event listener
ylabelsGroup.selectAll(".axis-text-y")
  .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

   // replaces chosenYAxis with value
    chosenYAxis = value;

    console.log(chosenYAxis)

   // updates x scale for new data
   xLinearScale = xScale(censusData, chosenXAxis);
   // updates y scale for new data
   yLinearScale = yScale(censusData, chosenYAxis);
   // updates Y axis with transition
   yAxis = renderYAxes(yLinearScale, yAxis);

   // updates circles with new x values
   circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

   textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

   // updates tooltips with new info
   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

     
   if (chosenYAxis === "Population") {
    populationLabel
      .classed("active", false)
      .classed("inactive", true);
  
    }
    else if (chosenYAxis === "smokes")
   {
    populationLabel
      .classed("active", false)
      .classed("inactive", true);
    } 
    else {
      populationLabel
      .classed("active", false)
      .classed("inactive", true);   
     }
  }
});
});

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);