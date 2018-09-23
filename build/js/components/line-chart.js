define(function (require) {
    var Vue = require('vue');
    var $ = require('jquery');
    var VueChart = require('vue-chart');

    var lineChartComponent = {
        extends: VueChart.Line,
        mixins: [VueChart.mixins.reactiveProp],
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        responsive: true,
                        maintainAspectRatio: false,
                        // scales: {
                        //     yAxes: [{
                        //         ticks: {
                        //             beginAtZero: true,
                        //             // suggestedMax: 100,
                        //             // suggestedMin: -100,
                        //             max: 5,
                        //             min: 0,
                        //             stepSize: 1,
                        //         }
                        //     }]
                        // }
                    };
                }
            }
        },
        mounted: function () {
            this.renderChart(this.chartData, this.options);
        },
    };

    return Vue.component('line-chart', {
        template: require('text!./line-chart.html'),
        components: {
            chart: lineChartComponent
        },
        data:function(){
            return {
                isFirst:true,
            }
        },
        props: {
            chartData: {
                type: Object,
                require: true
            }
        },
        watch:{
            chartData:function(nval){
                if(this.isFirst){
                    console.log("first")
                    this.$children[0].renderChart(this.chartData, this.chartData.options);
                    this.isFirst=false;
                }
            }
        }
    });
});