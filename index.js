import * as d3 from "d3";
import { curveBasis } from "d3";
import "./styles.css";

const svg = d3.select("svg");

// setting svg size
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 128, right: 40, bottom: 88, left: 150 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// renders the data into the svg
const render = (data) => {
  const title = "Average Viewers vs. Followers";

  const xValue = (d) => d.averageViewers;
  const xAxisLabel = "Average Viewers (Thousand)";

  const yValue = (d) => d.followers;
  const circleRadius = 10;
  const yAxisLabel = "Followers (Thousand)";

  const xScale = d3
    .scaleLog()
    .base(2)
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLog()
    .base(2)
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(10)
    .tickFormat((d) => Math.round(d / 1000));

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10)
    .tickFormat((d) => Math.round(d / 1000));

  const yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -90)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel)
    .style("font-size", 20);

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 64)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel)
    .style("font-size", 20);

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("r", circleRadius)
    .attr("fill", "#8C44F7")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  g.append("text")
    .attr("class", "title")
    .attr("y", -45)
    .attr("x", 90)
    .text(title)
    .style("font-size", 32);

  const lineGen = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(curveBasis);

  // Add the valueline path.
  svg.append("path").data([data]).attr("class", "line").attr("d", lineGen);
};

// fetching the data from the data.json file
d3.json("data.json").then((data) => {
  // only channel followers and average viewers is needed so we map it to a smaller new arrary
  const parsedData = data.map((d) => ({
    channel: d.Channel,
    followers: d["Followers"],
    averageViewers: d["Average viewers"]
  }));

  render(parsedData);
});

// creating a tooltip and appending it to the dom
const tooltip = d3
  .select("#app")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");

// mouseover fn sets the html in the tooltip with the correct data
const mouseover = (event, d) => {
  tooltip
    .html(
      `Channel: <strong>${d.channel}</strong>
      <br>Followers: <strong>${d.followers}</strong>
      <br>Averag Viewers: <strong>${d.averageViewers}</strong>`
    )
    .transition()
    .duration(150)
    .style("opacity", 1);
};

// tooltip will follow the mouse movement
const mousemove = (event, d) => {
  tooltip
    .style("transform", "translateY(-55%)")
    .style("left", `${event.x + 10}px`)
    .style("top", `${event.y - 30}px`);
};

// mouseleave hides the tooltip.
const mouseleave = (event, d) => {
  tooltip.transition().duration(150).style("opacity", 0);
};
