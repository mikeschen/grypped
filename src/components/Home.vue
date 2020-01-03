<template>
  <div class="ticks">
    <Search @searchName="getTicks" />
    <div class="graph-box">
      <b-container>
        <b-row>
          <b-col>
            <div role="tooltip" ref="tooltip1" :class="{ 'is-active': tooltipData }">
              <div class="tooltip-container" v-if="tooltipData">
                <strong>Ticks: {{ tooltipData.data[0] }}</strong>
              </div>
            </div>
            <svg
              style="width:0; height:0; position:absolute;"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="grpFill1" x1="1" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#39af77" />
                  <stop offset="100%" stop-color="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            <TrendChart
              :datasets="quantityBoulderSets"
              :labels="quantityBoulderLabels"
              :min="0"
              :interactive="true"
              @mouseMove="onMouseMove"
              class="tick-chart"
              :grid="{ verticalLines: true, horizontalLines: true }"
            />

            <div class="mt-2">
              <strong>Hardest Boulder: {{ grades[convertBoulders[convertBoulders.length - 1]] }}</strong>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div role="tooltip" ref="tooltip2" :class="{ 'is-active': tooltipData }">
              <div class="tooltip-container" v-if="tooltipData">
                <strong>Ticks: {{ tooltipData.data[0] }}</strong>
              </div>
            </div>
            <svg
              style="width:0; height:0; position:absolute;"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="grpFill2" x1="1" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#d8002b" />
                  <stop offset="100%" stop-color="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            <TrendChart
              :datasets="quantityRopeSets"
              :labels="quantityRopeLabels"
              :min="0"
              :interactive="true"
              @mouseMove="onMouseMove"
              class="tick-chart"
              :grid="{ verticalLines: true, horizontalLines: true }"
            />
            <div class="mt-2">
              <strong>Hardest Route: {{ grades[convertRopes[convertRopes.length - 1]] }}</strong>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import Search from "./Search.vue";
import TrendChart from "vue-trend-chart";
import Constants from "../constants";
import Popper from "popper.js";

export default {
  components: {
    Search,
    TrendChart
  },
  data() {
    return {
      quantityBoulderLabels: {
        xLabels: ["loading...", "loading..."],
        yLabels: 4,
        yLabelsTextFormatter: val => Math.round(val)
      },
      quantityBoulderSets: [],
      quantityRopeLabels: {
        xLabels: ["loading...", "loading..."],
        yLabels: 4,
        yLabelsTextFormatter: val => Math.round(val)
      },
      quantityRopeSets: [],
      boulderCounts: {},
      ropeCounts: {},
      tooltipData: null,
      popper: null,
      popperIsActive: false,
      grades: Constants.GRADES,
      convertBoulders: [],
      convertRopes: []
    };
  },
  methods: {
    userId(value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(value).toLowerCase())) {
        return `email=${value}`;
      } else {
        return `userId=${value}`;
      }
    },
    getTicks(value) {
      loadProgressBar();
      const routes = [];
      const boulders = [];
      const ropes = [];
      axios
        .get(Constants.ROOT_URL + this.userId(value), { crossdomain: true })
        .then(res => {
          res.data.ticks.forEach(tick => {
            routes.push(tick.routeId);
          });
          const routeList = routes.join();
          const routesUrl = `${Constants.ROUTES_URL}&routeIds=${routeList}`;
          axios.get(routesUrl, { crossdomain: true }).then(res => {
            res.data.routes.forEach(route => {
              if (
                route.type === "Boulder" ||
                route.type === "Boulder, Alpine"
              ) {
                boulders.push(this.grades.indexOf(route.rating.split(" ")[0]));
              } else {
                ropes.push(this.grades.indexOf(route.rating.split(" ")[0]));
              }
            });
            boulders.forEach(x => {
              this.boulderCounts[x] = this.boulderCounts[x] + 1 || 1;
            });
            ropes.forEach(y => {
              this.ropeCounts[y] = this.ropeCounts[y] + 1 || 1;
            });
            this.quantityRopeSets = [
              {
                data: Object.values(this.ropeCounts),
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-green"
              }
            ];
            this.convertRopes = Object.keys(this.ropeCounts);
            this.quantityRopeLabels.xLabels = this.convertRopes.map(grade => {
              return this.grades[grade];
            });
            this.quantityBoulderSets = [
              {
                data: Object.values(this.boulderCounts),
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-red"
              }
            ];
            this.convertBoulders = Object.keys(this.boulderCounts);
            this.quantityBoulderLabels.xLabels = this.convertBoulders.map(
              grade => {
                return this.grades[grade];
              }
            );
          });
        })
        .catch(err => {
          console.log("Error: Could Not Complete Request");
          alert("Could Not Find User.", err);
        });
    },
    initPopper() {
      const chart = document.querySelector(".tick-chart");
      const ref = chart.querySelector(".active-line");
      const tooltip1 = this.$refs.tooltip1;
      this.popper = new Popper(ref, tooltip1, {
        placement: "right",
        modifiers: {
          offset: { offset: "0,0" },
          preventOverflow: {
            boundariesElement: chart
          }
        }
      });
      const tooltip2 = this.$refs.tooltip2;
      this.popper = new Popper(ref, tooltip2, {
        placement: "right",
        modifiers: {
          offset: { offset: ",0" },
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
    this.getTicks("mikemikaels@yahoo.com"), this.initPopper();
  }
};
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  font-family: "Source Sans Pro", sans-serif;
}

#app {
  padding: 20px 0;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #cacaca !important;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #cacaca !important;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #cacaca !important;
}

.col {
  width: 120% !important;
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
.curve-vue-green {
  .stroke {
    stroke: #39af77;
  }
  .fill {
    fill: url(#grpFill1);
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
.curve-vue-red {
  .stroke {
    stroke: #d8002b;
  }
  .fill {
    fill: url(#grpFill2);
    fill-opacity: 0.5;
  }
  .point {
    stroke-width: 2;
    transition: stroke-width 0.2s;
    fill: #d8002b;
    stroke: #d8002b;
  }
  .point.is-active {
    stroke-width: 5;
  }
}
</style>
