define(function(require) {
    var Vue = require('vue');
    require('components/status-panel');

    return Vue.extend({
        template: require('text!./th-sensor.html'),
        props: {
            sensor: {
                type: Object,
                require: true,
                validator: function(sensor) {
                    if (sensor.installed === undefined)
                    // if (sensor.status === undefined)
                        return false;
                    if (sensor.status) {
                        return sensor.name !== undefined && sensor.minValue !== undefined && sensor.maxValue !== undefined && sensor.value !== undefined;
                    }

                    return true;
                }
            },
            unit: {
                type: String
            },
            color: {
                type: String
            },
            showEditorTool: {
                type: Boolean,
                default: true
            },
        },
        data: function() {
            return {
                myStatus: {
                    unit: '',
                    enable: 0,
                    color: 'green',
                }
            };
        },
        beforeMount: function() {
            if (this.sensor.unit)
                this.myStatus.unit = this.sensor.unit;

            if (this.sensor.ranges) {
                var ranges = this.sensor.ranges;
                for (var i = 0; i < ranges.length; i++) {
                    if (this.sensor.status == ranges[i].value) {
                        this.myStatus.color = ranges[i].color;
                    }
                }
            }
        },       
        computed: {
            status: function() {
                if (!this.sensor.installed) {
                    this.myStatus.enable = 0;
                    this.myStatus.current = '--.-';
                    //this.myStatus.color = null;
                    // console.log("this status", this.myStatus);
                } else {
                    this.myStatus.enable = 1;
                    this.myStatus.min = this.sensor.minValue;
                    this.myStatus.max = this.sensor.maxValue;
                    this.myStatus.current = this.sensor.value;

                    if(this.sensor.ranges) {
                        var ranges = this.sensor.ranges;
                        for (var i = 0; i < ranges.length; i++) {
                            if (this.sensor.status == ranges[i].value) {
                                this.myStatus.color = ranges[i].color;
                            }
                        }
                    }
                }

                if(this.sensor.unit)
                    this.myStatus.unit = this.sensor.unit;

                return this.myStatus;
            },
            name: function() {
                return (this.sensor.installed) ? this.sensor.name : '--';
            },
            position: function() {
                return (this.sensor.installed) ? this.sensor.position : '--';
            },
            min: function() {
                return (this.sensor.installed) ? this.sensor.minValue : '--';
            },
            max: function() {
                return (this.sensor.installed) ? this.sensor.maxValue : '--';
            }
        },
        methods: {
            onEditClick: function(item) {
                this.$emit('editClick', item);
            }
        }
    });
});