const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.time;
  const yValue = d => d.percentage;

  const margin = { top: 10, right: 10, bottom: 50, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.time))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([d3.max(data, d => d.percentage), d3.min(data, d => d.percentage)])
    .range([0, innerHeight]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale);
  const xAxisG  = g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  const yAxis = d3.axisLeft(yScale);
  const yAxisG = g.append('g').call(yAxis)

  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('height', d => innerHeight - yScale(yValue(d)))
      .attr('width', xScale.bandwidth())
      .attr('x', d => xScale(xValue(d)))
      .attr('y', d => yScale(yValue(d)))
      .attr('fill', 'steelblue')

};

d3.csv("src/data/data.csv").then(data => {
  data.forEach(d => {
    d.time = new Date(d.time).getMonth() + 1;
    d.percentage = +d.percentage;
    d.jaar2018 = +d.jaar2018;
    d.jaar2019 = +d.jaar2019;
  });
  render(data);
});
