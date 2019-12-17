// run loadData for the elecktriciteit dataset
loadData('src/data/data_elektriciteit.csv', {
  title: 'Elektriciteit in BPH in 2018 en 2019',
  unit: 'Elektriciteit in 1000 kWh',
  yAxisTitle: 'Gas',
  axisMargin: 1.1,
  factor: 1000,
  countLimit: 6,
  colors: {
    ValueOne: 'rgba(179,150,173,1)',
    ValueTwo: 'rgba(104,73,100,1)',
    Line: 'rgba(189,45,0,1)'
  },
  inputValues: {select: 182, range: 1}
});
