const svg = d3.select("svg");
const width =  960;
const height = 500;

const factor = 1000;

const render = data => {
  const xValue = d => d.time;
  const yValue = d => d.value1;
  const yValueTwo = d => d.value2;

  const margin = { top: 50, right: 20, bottom: 70, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const title = 'Gasverbruik in BPH in 2018 en 2019';
  const yAxisTitle = "Gas";
  const unit = "Gasverbruik in 1000 m³";

  const axisMargin = 1.1;

  const legendSize = 25;
  const colorValueOne = 'lightblue';
  const colorValueTwo = 'steelblue';
  const colorLine = 'red'

  const inputValues = [{select: 1.470, range: 1}]

  // update the range of the slider based on max data and selection
  const updateRange = () => {
    document.querySelector('input[type=range]').setAttribute(
      'max',
      Math.floor(
        highestYValue() * axisMargin
        / inputValues[0].select
      )
    )
  }

  // helper function that calcs the highest value of both data sets
  const highestYValue = () => {
    a = d3.max(data, d => yValue(d))
    b = d3.max(data, d => yValueTwo(d))
    if (a > b) { return a}
    else { return b}
  }

  // handling all changes through input
  const handleInputChange = () => {
      document.querySelectorAll("select, input").forEach(a => {
        a.addEventListener('input', (e) => {
          let selectIndex = document.querySelector('select').value;
          let rangeValue = document.querySelector('#rangeSlider').value;
          checkMultiple = (string, additive) => {
            if(rangeValue <= 1){
              return string}
              else{
                return string + additive;
              };
            };
          let types = [
              {index: 0, name: checkMultiple('gemiddeld', 'e')+ ' ' + checkMultiple('huishouden','s') + ' (1440 m³ op jaarverbruik)', value: 1440},
              {index: 2, name: 'flat ' + checkMultiple('huishouden','s') + ' (900 m³ op jaarverbruik)', value: 900},
              {index: 3, name: 'tussenwoning ' + checkMultiple('huishouden','s') + ' (1350 m³ op jaarverbruik)', value: 2350},
              {index: 4, name: 'hoekwoning ' + checkMultiple('huishouden','s') + ' (1590 m³ op jaarverbruik)', value: 1590},
              {index: 5, name: 'twee onder één kap	' + checkMultiple('huishouden','s') + ' (1670 m³ op jaarverbruik)', value: 1670},
              {index: 6, name: checkMultiple('vrijstaand', 'e') + ' ' + checkMultiple('huishouden','s') + ' (2220 m³ op jaarverbruik)', value: 2220},
            ];
          let selectValue = types.filter(obj => {return obj.index == selectIndex})[0]
          inputValues[0].select = selectValue.value / factor;
          inputValues[0].range = rangeValue;

          measureLine
            .attr('y', yScale(inputValues[0].select * inputValues[0].range));

          let resultText = document.querySelector('.result p')
          resultText.innerText = rangeValue + ' ' + selectValue.name
          updateRange();
        })
    })
  }

  // creating scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.time))
    .range([0, innerWidth])
    .padding(0.1);  

  // Looking if there are negative values
  const yScale = d3.scaleLinear()
    .domain([
      d3.max(data, d => yValue(d)) * axisMargin,
      d3.min(data, d => yValue(d)) > 0 ?
        0 : d3.min(data, d => yValue(d)) * axisMargin
      ])
    .range([0, innerHeight])
    .nice();

  // appending group that is bound to a margin
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // creating Title
  g.append('text')
    .attr('class', 'title')
    .text(title)
    .attr('x', 20)
    .attr('y', -15)
    .attr('font-weight', '600');

  // creating y-axis
  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth);

  const yAxisG = g.append('g').call(yAxis);

  yAxisG.selectAll('.tick line')
    .attr('opacity', 0.3);

  yAxisG.selectAll('.tick text')
    .attr('font-size', '1.5em')
    .attr('x', -10);

  yAxis.tickFormat('.4n');

  // appending text to y-axis
  yAxisG.append('text')
   .text(unit)
   .attr('transform', 'rotate(-90)')
   .attr('x', 0 - innerHeight/5)
   .attr('font-size', 18)
   .attr('fill', 'black')
   .attr('y', -50);

  // creating Bars with data
  const barsG = g.append('g')
    .attr('class', 'bars')

  const bars = barsG.selectAll('rect').data(data)
    .enter();

  bars.append('rect')
      .attr('class', d => yValue(d) > 0 ? 'bar--postive' : 'bar--negative')
      .attr('y', d => yValue(d) > 0 ? yScale(yValue(d)) : yScale(0))
      .attr('x', d => xScale(xValue(d)))
      .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.bandwidth()/2)
      .attr('fill', colorValueOne);

  bars.append('rect').data(data)
      .attr('class', d => yValueTwo(d) > 0 ? 'bar--postive' : 'bar--negative')
      .attr('y', d => yValueTwo(d) > 0 ? yScale(yValueTwo(d)) : yScale(0))
      .attr('x', d => xScale(xValue(d)) + xScale.bandwidth() /2)
      .attr('height', d => Math.abs(yScale(yValueTwo(d)) - yScale(0)))
      .attr('width', xScale.bandwidth()/2)
      .attr('fill', colorValueTwo);

  g.selectAll('rect')
    .append('text')
      .text( d => yValue(d))
      .attr('x', 100)
      .attr('y', 100)
      .attr('font-size', '1em');

  const lineG = g.append('g')
    .attr('class', 'lineG')

  const measureLine = lineG.selectAll('rect').data(inputValues)
    .enter().append('rect')
      .attr('width', innerWidth)
      .attr('height', 2)
      .attr('x', xScale(0))
      .attr('y', yScale(1.470))
      .attr('fill', colorLine)
      .attr('opacity', 0.8)


  // Placing X-Axis on top of chart
  const xAxis = d3.axisBottom(xScale);
  const xAxisG  = g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${yScale(0)})`)
      .attr('font-size', '1.2em')
      .attr('font-weight', '600');

  xAxisG.selectAll('.domain')
    .attr('stroke-width', '1.2');

  xAxisG.selectAll('.tick line')
    .remove();

  xAxisG.selectAll('text')
    .attr('opacity', 0.8);

  // Creating the legend
  const legend = g.append('g')
    .attr('class','legend')
    .attr('transform', `translate(${innerWidth - 200}, ${innerHeight + 35})`);

  const legendOne = legend.append('g')
  legendOne.append('rect')
    .attr('height', legendSize)
    .attr('width', legendSize)
    .attr('fill', colorValueOne);

  legendOne.append('text')
    .text('2018')
    .attr('y', legendSize / 1.5)
    .attr('x', legendSize * 1.5);

  const legendTwo = legend.append('g')
    .attr('transform', 'translate(100,0)');

  legendTwo.append('rect')
    .attr('height', legendSize)
    .attr('width', legendSize)
    .attr('fill', colorValueTwo);

  legendTwo.append('text')
    .text('2019')
    .attr('y', legendSize / 1.5)
    .attr('x', legendSize * 1.5);

  handleInputChange()
};

d3.csv("src/data/short-data.csv").then(data => {

  const formatTime = d3.timeFormat('%-d/%-m/%Y');
  const createMonth = function (monthNumber) {
    let monthList = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
    return monthList[monthNumber]
  }

  data.forEach(d => {
    Object.keys(d).forEach((a, i ) => {
      if(a != "Tijdstip vanaf" || "time"){
        d["value" + i]= +d[a] / factor
      } else{
        return;
      };
    });

    if (d["Tijdstip vanaf"]) {
      d.time = d["Tijdstip vanaf"]
    } else {
      d.time = d.time
    }
    let time = formatTime(new Date(d.time));
    d.time = createMonth(new Date(time).getMonth());
    d.percentage = +d.percentage;
    d.jaar2018 = d.jaar2018 / factor;
    d.jaar2019 = d.jaar2019 / factor;
  });
  render(data);
});
