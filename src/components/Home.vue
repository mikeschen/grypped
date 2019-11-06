<template>
    <div class="ticks">
    <Search @searchName="getTicks" />
      <div class="graph-box">
        <b-container>
          <b-row>
            <b-col>
              <div role="tooltip" ref="tooltip" :class="{'is-active': tooltipData}">
                <div class="tooltip-container" v-if="tooltipData">
                  <strong>Ticks: {{tooltipData.data[0]}}</strong>
                </div>
              </div>
              <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="btcFill" x1="1" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="#39af77"></stop>
                    <stop offset="100%" stop-color="#ffffff"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <TrendChart
                  :datasets="quantitySets"
                  :labels="quantityLabels"
                  :min="0"
                  :interactive=true
                  @mouseMove="onMouseMove" class="tick-chart"
                  :grid="{verticalLines: true, horizontalLines: true}"
              />

      <div class="mt-2">Hardest Send: V{{ Object.keys(sends).pop() }}</div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import { loadProgressBar } from 'axios-progress-bar'
  import Search from "./Search.vue";
  import TrendChart from "vue-trend-chart";
  import Constants from '../constants';
  import Popper from "popper.js";

  export default {
    components: {
      Search,
      TrendChart
    },
    data() {
      return {
        quantityLabels: {
          xLabels: ["VO", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"],
          yLabels: 4,
          yLabelsTextFormatter: val => Math.round(val)
        },
        sends: {},
        quantitySets:[],
        tooltipData: null,
        popper: null,
        popperIsActive: false
      }
    },
    methods: {
      userId(value) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(String(value).toLowerCase())) {
          return `email=${value}`
        } else {
          return `userId=${value}`
        }
      },
      getTicks(value) {
        loadProgressBar();
        const routes = [];
        const boulders = [];
        const points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        axios
          .get(Constants.ROOT_URL + this.userId(value), {crossdomain: true})
          .then((res) => {
            res.data.ticks.forEach((tick) => {
              routes.push(tick.routeId);
            });
            const routeList = routes.join();
            const routesUrl = `${Constants.ROUTES_URL}&routeIds=${routeList}`;
            axios.get(routesUrl, {crossdomain: true}).then((res) => {
              res.data.routes.forEach((route) => {
                if (route.type === "Boulder")
                {
                  boulders.push(parseInt(route.rating[1] + route.rating[2]))
                }
              });
              this.sends = boulders.reduce((obj, item) => {
                obj[item] = (obj[item] || 0) + 1;
                return obj;
              }, {});
              Object.keys(this.sends).map((key) => {
                points[key] = this.sends[key];
              });
              this.quantitySets = [{
                data: points,
                smooth: true,
                fill: true,
                className: 'curve-vue'
              }]
            })
          })
          .catch((err) => {
            console.log("Error: Could Not Complete Request");
            alert("Could Not Find User.", err);
          });
        },
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
      this.getTicks("mikemikaels@yahoo.com"),
      this.initPopper()
    }
  }
</script>

<style lang="scss">
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    * {
        box-sizing: border-box;
    }

    body {
        padding: 0;
        margin: 0;
        font-family: "Source Sans Pro", sans-serif;
        color: #2f4053;
    }

    #app {
        padding: 20px;
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
    .curve-vue {
      .stroke {
        stroke: #39af77;
      }
      .fill {
        fill: url(#btcFill);
        fill-opacity: 0.5;
      }
      .point {
        fill: #39af77;
        stroke: #39af77;
      }
    }
</style>
