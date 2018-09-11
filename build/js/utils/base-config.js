/*
 当前项目的基础配置，方便修改
 * @Author: 刘沙
 * @Date: 2018-06-15
 */
define(function (require) {
  return {
    chartLineMaxValue: {
      activePower: {
        beginAtZero: true,
        max: 100,
        min: 0,
        stepSize: 10,
      },
      apparentPower: {
        beginAtZero: true,
        max: 150,
        min: 0,
        stepSize: 10,
      },
      current: {
        beginAtZero: true,
        max: 100,
        min: 0,
        stepSize: 10,
      },
      voltage: {
        beginAtZero: true,
        max: 480,
        min: 0,
        stepSize: 50,
      },
    }
  }
});