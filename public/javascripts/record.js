$(function () {
    $.ajax({
      type: 'POST',
      url: '/api/behaviour_chart_data',
      success: function(data){
        console.dir(data);
        var myLineChart = Highcharts.chart('line_container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Overall Learning Phase Change Rate'
            },
            yAxis: {
                categories: ['UND', 'REG', 'MON', 'ACT', 'PLA']
            },
            xAxis: {
                title: {
                    text: 'Action Data'
                }
            },
            series: [{
                name: 'Luthfi',
                data: data
            }]
          });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('error ' + textStatus + " " + errorThrown);
      }
    });
    $.ajax({
      type: 'POST',
      url: '/api/latest_game_behaviour_chart_data',
      success: function(data){
        console.dir(data);
        var myLineChart = Highcharts.chart('latest_game_line_container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Latest Game Learning Phase Change Rate'
            },
            yAxis: {
                categories: ['UND', 'REG', 'MON', 'ACT', 'PLA']
            },
            xAxis: {
                title: {
                    text: 'Action Data'
                }
            },
            series: [{
                name: 'Luthfi',
                data: data
            }]
          });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('error ' + textStatus + " " + errorThrown);
      }
    });
    $.ajax({
      type: 'POST',
      url: '/api/dominant_behaviour_chart_data',
      success: function(data){
        console.dir(data);
        var myPieChart = Highcharts.chart('pie_container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Overall Dominant Learning Phase'
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
                  name: "Undefined Actions",
                  y: data['0']
                }, {
                  name: "Regulating Strategies",
                  y: data['1']
                }, {
                  name: "Monitoring Strategies",
                  y: data['2']
                }, {
                  name: "Cognitive Actions",
                  y: data['3']
                }, {
                  name: "Planning Strategies",
                  y: data['4']
                }]
            }]
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('error ' + textStatus + " " + errorThrown);
      }
    });
    $.ajax({
      type: 'POST',
      url: '/api/latest_game_dominant_behaviour_chart_data',
      success: function(data){
        console.dir(data);
        var myPieChart = Highcharts.chart('latest_game_pie_container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Latest Game Dominant Learning Phase'
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
                  name: "Undefined Actions",
                  y: data['0']
                }, {
                  name: "Regulating Strategies",
                  y: data['1']
                }, {
                  name: "Monitoring Strategies",
                  y: data['2']
                }, {
                  name: "Cognitive Actions",
                  y: data['3']
                }, {
                  name: "Planning Strategies",
                  y: data['4']
                }]
            }]
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('error ' + textStatus + " " + errorThrown);
      }
    });
});
