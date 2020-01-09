<template>
  <b-row>
    <b-col>
      <div class="mt-2">
        <strong>Hardest Grade: {{ grades[converts[converts.length - 1]] }}</strong>
      </div>
      <div role="tooltip" ref="tooltip" :class="{ 'is-active': tooltipData }">
        <div class="tooltip-container" v-if="tooltipData">
          <strong class="header">Ticks: {{ tooltipData.data[0] }}</strong>
        </div>
      </div>
      <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="grpFill" x1="1" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#39af77" />
            <stop offset="100%" stop-color="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
      <TrendChart
        :datasets="quantitySets"
        :labels="quantityLabels"
        :min="0"
        :interactive="true"
        @mouseMove="onMouseMove"
        class="tick-chart"
        :grid="{ verticalLines: true, horizontalLines: true }"
      />
    </b-col>
  </b-row>
</template>

<script>
import TrendChart from "vue-trend-chart";
import Popper from "popper.js";
import Constants from "../constants";

export default {
  components: {
    TrendChart
  },
  props: {
    quantitySets: Array,
    quantityLabels: Object,
    converts: Array
  },
  data() {
    return {
      grades: Constants.GRADES,
      tooltipData: null,
      popper: null,
      popperIsActive: false
    };
  },
  methods: {
    initPopper() {
      const chart = document.querySelector(".tick-chart");
      const ref = chart.querySelector(".active-line");
      const tooltip = this.$refs.tooltip;
      this.popper = new Popper(ref, tooltip, {
        placement: "right",
        modifiers: {
          offset: { offset: "0,10" },
          preventOverflow: {
            boundariesElement: chart
          }
        }
      });
    },
    onMouseMove(params) {
      this.popperIsActive = !!params;
      this.popper.scheduleUpdate();
      this.tooltipData = params || null;
    }
  },
  mounted() {
    this.initPopper();
  }
};
</script>

<style lang="scss">
.header {
  color: #000000;
}
.ticks {
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 768px) {
      height: 350px;
    }
  }
  .grid,
  .labels {
    line {
      stroke: rgba(#f69119, 0.5);
    }
  }
  .x-labels {
    .label {
      line {
        opacity: 0.3;
      }
      &:nth-child(6n + 1),
      &:first-child {
        text {
          display: block;
        }
        line {
          opacity: 1;
        }
      }
    }
  }
}
</style>
