
const chartBarsApps = {
  day: {
    axisText: ['252529', .5],
    mask: ['FFFFFF', .5],
    'Apples': {
      item: '3497ED',
      btn: '3497ED',
      tooltipText: '108BE3'
    },
    'Oranges': {
      item: '2373DB',
      btn: '3381E8',
      tooltipText: '2373DB'
    },
    'Lemons': {
      item: '9ED448',
      btn: '9ED448',
      tooltipText: '89C32E'
    },
    'Apricots': {
      item: '5FB641',
      btn: '5FB641',
      tooltipText: '4BAB29'
    },
    'Kiwi': {
      item: 'F5BD25',
      btn: 'F5BD25',
      tooltipText: 'EAAF10'
    },
    'Mango': {
      item: 'F79E39',
      btn: 'F79E39',
      tooltipText: 'F58608'
    },
    'Pears': {
      item: 'E65850',
      btn: 'E65850',
      tooltipText: 'F34C44'
    },
    '55BFE6': {
      item: '55BFE6',
      btn: '35AADC',
      tooltipText: '269ED4'
    },
  },

  night: {
    axisTextY: ['ECF2F8', .5],
    axisTextX: ['A3B1C2', .6],
    mask: ['242F3E', .5],
    'Apples': {
      item: '4681BB',
      btn: '4681BB',
      tooltipText: '5199DF'
    },
    'Oranges': {
      item: '345B9C',
      btn: '466FB3',
      tooltipText: '3E65CF'
    },
    'Lemons': {
      item: '88BA52',
      btn: '88BA52',
      tooltipText: '99CF60'
    },
    'Apricots': {
      item: '3DA05A',
      btn: '3DA05A',
      tooltipText: '3CB560'
    },
    'Kiwi': {
      item: 'D9B856',
      btn: 'F5BD25',
      tooltipText: 'DBB630'
    },
    'Mango': {
      item: 'D49548',
      btn: 'D49548',
      tooltipText: 'EE9D39'
    },
    'Pears': {
      item: 'CF5D57',
      btn: 'CF5D57',
      tooltipText: 'F7655E'
    },
    '55BFE6': {
      item: '479FC4',
      btn: '479FC4',
      tooltipText: '43ADDE'
    },
  }
}

const chartOnlines = {
  day: {
    'Views': {
      item: '64ADED',
      btn: '3896E8',
      tooltipText: '3896E8'
    },
    '558DED': {
      item: '558DED',
      btn: '558DED',
      tooltipText: '558DED'
    },
    '5CBCDF': {
      item: '5CBCDF',
      btn: '5CBCDF',
      tooltipText: '5CBCDF'
    },
  },
  night: {
    'Views': {
      item: '4082CE',
      btn: '4082CE',
      tooltipText: '4082CE'
    },
    '558DED': {
      item: '4461AB',
      btn: '4461AB',
      tooltipText: '4461AB'
    },
    '5CBCDF': {
      item: '4697B3',
      btn: '4697B3',
      tooltipText: '4697B3'
    },
  }
}

const chartColorsLines = {
  day: {
    axisText: "8E8E93",
    "Joined": {
      item: 'FE3C30',
      btn: 'E65850',
      tooltipText: 'F34C44'
    },
    'Left': {
      item: '4BD964',
      btn: '5FB641',
      tooltipText: '3CC23F'
    },

    'Views': {
      item: '108BE3',
      btn: '3497ED',
      tooltipText: '108BE3'
    },
    'Shares': {
      item: 'E8AF14',
      btn: 'F5BD25',
      tooltipText: 'E4AE1B'
    },
  },
  night: {
    axisText: ['A3B1C2', .6],
    "Joined": {
      item: 'E6574F',
      btn: 'CF5D57',
      tooltipText: 'F7655E'
    },
    'Left': {
      item: 'E6574F',
      btn: 'CF5D57',
      tooltipText: 'F7655E'
    },
    'Views': {
      item: '108BE3',
      btn: '4681BB',
      tooltipText: '108BE3'
    },
    'Shares': {
      item: 'DEB93F',
      btn: 'C9AF4F',
      tooltipText: 'DEB93F'
    },
  }
}

export const colorTheme = {
  day: {
    scrollBg: 'E2EEF9',
    scrollSelector: 'C0D1E1',
    gridLines: ['182D3B', .1],
    zoomOutText: '108BE3',
    tooltipArrow: 'D2D5D7',
    lines: chartColorsLines.day,
    onlines: chartOnlines.day,
    bars: chartBarsApps.day
  },
  night: {
    scrollBg: '304259',
    scrollSelector: '56626D',
    gridLines: ['FFFFFF', .1],
    zoomOutText: '48AAF0',
    tooltipArrow: 'D2D5D7',
    lines: chartColorsLines.night,
    onlines: chartOnlines.night,
    bars: chartBarsApps.night
  }
}
