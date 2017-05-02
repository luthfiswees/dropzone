$(function () {
    var myLineChart = Highcharts.chart('line_container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Learning Phase Change Rate'
        },
        yAxis: {
            categories: [0, 'REG', 'MON', 'ACT', 'PLA']
        },
        xAxis: {
            title: {
                text: 'Learning Phase Change (minute)'
            }
        },
        series: [{
            name: 'Luthfi',
            data: [1, 2, 1, 2, 3, 4, 3, 1, 2, 4, 3, 1, 2, 4, 2, 1, 3, 4, 2, 4, 4, 3, 1, 4, 3, 3, 1, 3, 2, 1, 4, 2, 3, 1, 2]
        }]
    });
    var myLineChart = Highcharts.chart('pie_container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Dominant Learning Phase'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
          }
        },
        series: [{
            name: 'Learning Phase',
            colorByPoint: true,
            data: [{
              name: "Regulating Strategies",
              y: 9.0/35.0
            }, {
              name: "Monitoring Strategies",
              y: 8.0/35.0
            }, {
              name: "Cognitive Actions",
              y: 9.0/35.0
            }, {
              name: "Planning Strategies",
              y: 9.0/35.0
            }]
        }]
    });
});
