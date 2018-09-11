define(function(require) {
  return {
      props: {
          rowData: {
              type: Object,
              required: true
          },
          rowIndex: {
              type: Number,
              require: true,
          },
          rowField: {
              type: Object,
              require: true
          },
          rowTrack: {
              require: true
          }
      },
      data: function() {
          return {
              field: '',
              value: '',
              original: '',
              isModified: false,
              eventPrefix: 'inlineBoxToggle:'
          };
      },
      mounted: function() {
          var field = this.rowField.sortField;

          field = (field === undefined) ? this.rowField.name.split(':')[2] : field;

          this.field = field;

          this.contextReset();
      },
      watch: {
          rowTrack: function(nVal, oVal) {
              this.contextReset();
          }
      },
      methods: {
          fireEvent: function(event) {
            console.log(this);
              this.$parent.$emit(this.eventPrefix + 'toggle', this.rowIndex, this.field, this.value);
          },
          contextReset: function() {
              this.isModified = false;
              this.value = this.original = this.rowData[this.field];
          },
          discardChange: function(event) {
              this.isModified = false;
              this.value = this.original;
              this.fireEvent();
          }
      }
  };
});