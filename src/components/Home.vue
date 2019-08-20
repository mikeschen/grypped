<template>
    <div class="ticks">
    <Search @searchName="getTicks" />
      <div class="graph-box">
        <b-container>
          <b-row>
            <b-col>
        <TrendChart :datasets="quantitySets" :labels="quantityLabels" :min="0" :grid="{
     verticalLines: true,
     horizontalLines: true
  }" />
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

        routes: [],
        sends: {},
        boulders: [],
        points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        quantitySets:[]
      }
    },
    methods: {
      getTicks(value) {
        loadProgressBar();
        axios
          .get(Constants.ROOT_URL + value, {crossdomain: true})
          .then((res) => {
            res.data.ticks.forEach((tick) => {
              this.routes.push(tick.routeId);
            });
            const routeList = this.routes.join();
            const routesUrl = `${Constants.ROUTES_URL}&routeIds=${routeList}`;
            axios.get(routesUrl).then((res) => {
              res.data.routes.forEach((route) => {
                if (route.type === "Boulder")
                {
                  this.boulders.push(route.rating[1])
                }
              });
              this.sends = this.boulders.reduce((obj, item) => {
                obj[item] = (obj[item] || 0) + 1;
                return obj;
              }, {});
              Object.keys(this.sends).map((key) => {
                // this.points.splice(key, 0, this.sends[key]);
                this.points[key] = this.sends[key];
              });
              console.log('this.pointes 🥩', this.points)
              this.quantitySets = [{
                data: this.points,
                smooth: true,
                fill: true,
                className: 'curve'
              }]
            })
          })
          .catch((err) => {
            console.log("Error: Could Not Complete Request");
            alert("Could Not Find User.", err);
          });
        }
    },
    mounted() {
      this.getTicks("mikemikaels@yahoo.com")
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
        margin: 0 auto;
        padding: 20px;
        max-width: 600px;
    }

    .graph-box {

    }

    .ticks {
      .vtc {
          height: 250px;
          font-size: 12px;
      @media (min-width: 699px) {
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
      text {
          display: none;
      }
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
