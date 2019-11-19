const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.time;
  const yValue = d => d.jaar2018;
  const yValueTwo = d => d.jaar2019;

  const margin = { top: 50, right: 20, bottom: 70, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const title = 'Energieverbruik in BPH in 2019 ten opzicht van 2018'

  const axisMargin = 1

  const legendSize = 25
  const colorValueOne = 'lightblue'
  const colorValueTwo = 'steelBlue'

  // creating scales

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.time))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([d3.max(data, d => yValue(d)) * axisMargin, d3.min(data, d => yValue(d)) > 0 ? 0 : d3.min(data, d => yValue(d)) * axisMargin])
    .range([0, innerHeight])
    .nice();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // creating Title

  g.append('text')
    .attr('class', 'title')
    .text(title)
    .attr('x', 20)
    .attr('y', -15)
    .attr('font-weight', '600')

  // creating y-axis

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)

  const yAxisG = g.append('g').call(yAxis)

  yAxisG.selectAll('.tick line')
    .attr('opacity', 0.3)

  yAxisG.selectAll('.tick text')
    .attr('font-size', '1.5em')
    .attr('x', -10)

  yAxis.tickFormat('.4n')

  yAxisG.append('text')
   .text('Elektriciteit in 1000 kWh')
   .attr('transform', 'rotate(-90)')
   .attr('x', 0 - innerHeight/5)
   .attr('font-size', 18)
   .attr('fill', 'black')
   .attr('y', -50)

  // creating Bars

  const bars = g.selectAll('rect').data(data)
    .enter()

  bars.append('rect')
      .attr('class', d => yValue(d) > 0 ? 'bar--negative': 'bar--postive')
      .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('y', d => yValue(d) > 0 ? yScale(yValue(d)) : yScale(0))
      .attr('width', xScale.bandwidth() /2)
      .attr('x', d => xScale(xValue(d)))
      .attr('fill', colorValueOne)

  bars.append('rect').data(data)
      .attr('class', d => yValueTwo(d) > 0 ? 'bar--negative': 'bar--postive')
      .attr('height', d => Math.abs(yScale(yValueTwo(d)) - yScale(0)))
      .attr('y', d => yValueTwo(d) > 0 ? yScale(yValueTwo(d)) : yScale(0))
      .attr('width', xScale.bandwidth()/2)
      .attr('x', d => xScale(xValue(d)) + xScale.bandwidth() /2)
      .attr('fill', colorValueTwo)

  g.selectAll('rect')
    .append('text')
      .text( d => yValue(d))
      .attr('x', 100)
      .attr('y', 100)
      .attr('font-size', '1em');

  // Placing X-Axis on top of chart

  const xAxis = d3.axisBottom(xScale);
  const xAxisG  = g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${yScale(0)})`)
      .attr('font-size', '1.2em')
      .attr('font-weight', '600')

  xAxisG.selectAll('.domain')
    .attr('stroke-width', '1.2')
  xAxisG.selectAll('.tick line')
    .remove()
  xAxisG.selectAll('text')
    .attr('opacity', 0.8)

  // Creating a Legend

  const legend = g.append('g')
    .attr('class','legend')
    .attr('transform', `translate(${innerWidth - 200}, ${innerHeight + 35})`)

  const legendOne = legend.append('g')
  legendOne.append('rect')
    .attr('height', legendSize)
    .attr('width', legendSize)
    .attr('fill', colorValueOne)

  legendOne.append('text')
    .text('2018')
    .attr('y', legendSize / 1.5)
    .attr('x', legendSize * 1.5)

  const legendTwo = legend.append('g')
    .attr('transform', 'translate(100,0)')

  legendTwo.append('rect')
    .attr('height', legendSize)
    .attr('width', legendSize)
    .attr('fill', colorValueTwo)

  legendTwo.append('text')
    .text('2019')
    .attr('y', legendSize / 1.5)
    .attr('x', legendSize * 1.5)
};

d3.csv("src/data/data.csv").then(data => {
  data.forEach(d => {
    d.time = createMonth(new Date(d.time).getMonth());
    d.percentage = +d.percentage;
    d.jaar2018 = d.jaar2018 / 1000;
    d.jaar2019 = d.jaar2019 / 1000;
  });
  render(data);
});


const createMonth = function (monthNumber) {
  let monthList = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
  return monthList[monthNumber]
}
