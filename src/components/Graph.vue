<template>
  <b-row>
    <b-col>
      <div role="tooltip" ref="tooltip" :class="{'is-active': tooltipData}">
        <div class="tooltip-container" v-if="tooltipData">
          <strong>Ticks: {{tooltipData.data[0]}}</strong>
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
        :grid="{verticalLines: true, horizontalLines: true}"
      />
      <div class="mt-2">
        <strong>
          Hardest 📸: V{{ maxBoulder
          }}
        </strong>
        <h1>TEST: {{xlabelsBoulder}}</h1>
        <h2>Sets: {{quantitySets}}</h2>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import TrendChart from "vue-trend-chart";
import Popper from "popper.js";

export default {
  components: {
    TrendChart
  },
  props: {
    maxBoulder: String,
    test: Number,
    xlabelsBoulder: Array,
    points: Array,
    quantitySets: Array
  },
  data() {
    return {
      sends: {},
      tooltipData: null,
      popper: null,
      popperIsActive: false,
      quantityLabels: {
        xLabels: this.xlabelsBoulder,
        yLabels: 4,
        yLabelsTextFormatter: val => Math.round(val)
      }
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
.curve-vue {
  .stroke {
    stroke: #39af77;
  }
  .fill {
    fill: url(#grpFill);
    fill-opacity: 0.5;
  }
  .point {
    stroke-width: 2;
    transition: stroke-width 0.2s;
    fill: #39af77;
    stroke: #39af77;
  }
  .point.is-active {
    stroke-width: 5;
  }
}
</style>