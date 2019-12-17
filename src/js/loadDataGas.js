// run loadData for the gas dataset
loadData('src/data/data_BPH_Gas_2018-2019.csv', {
  title: 'Gasverbruik in BPH in 2018 en 2019',
  unit: 'Gasverbruik in 1000 m³',
  yAxisTitle: 'Gas',
  axisMargin: 1.1,
  factor: 1000,
  countLimit: 6,
  removeIncompleteData: true,
  colors: {
    ValueOne: 'rgba(66,165,179,1)',
    ValueTwo: 'rgba(0,93,110,1)',
    Line: 'rgba(189,45,0,1)'
  },
  inputValues: {select: 1.470, range: 1}
});
