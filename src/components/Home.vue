<template>
    <div class="ticks">
    <Search />
    <ul class="home">
        <li v-for="tick in ticks" :key="tick.tickId">{{ tick }}</li>
        </ul>
        <TrendChart :datasets="[    {
      data: [10, 50, 20, 100, 40, 60, 80],
      smooth: true,
      fill: true
    }]" :labels="labels" :min="0" :grid="{
     verticalLines: true,
     horizontalLines: true
  }" />
      <div class="mt-2">Routes: {{ routes }}</div>

    </div>
</template>

<script>
  import axios from 'axios';
  import { loadProgressBar } from 'axios-progress-bar'
  import Search from "./Search.vue";
  import TrendChart from "vue-trend-chart";

  export default {
    components: {
      Search,
      TrendChart
    },
    data() {
      return {
        labels: {
          xLabels: ["hello", "world", "hot", "damn"],
          yLabels: 5,
        },
        ticks: null,
        routes: []
      }
    },
    methods: {
      getTicks () {
        axios
          .get('https://www.mountainproject.com/data/get-ticks?email=mikemikaels@yahoo.com&key=106635196-7386eb17c9b59aaa02314e6588deb35d')
          .then((res) => {
            res.data.ticks.forEach((tick) => {
              this.routes.push(tick.routeId);
            });
            const routeList = this.routes.join();
            const routesUrl = `${ROUTES_URL}&routeIds=${routeList}`
            return axios.get(routesUrl)
          })
          .catch((err) => {
            console.log("Error: Could Not Complete Request");
            alert("Could Not Find User.", err);
          });
      // getRoutes() {
      //     console.log('routes 🐏!!!', this.routes)
      //   axios
      //   .get('https://www.mountainproject.com/data/get-routes?routeIds=106059141,106326084,106617251, 105799647&key=106635196-7386eb17c9b59aaa02314e6588deb35d')
      //   .then(res => {
      //     console.log('the routes 🐲 ', res.data)
      //   })
      // }
    },
    mounted () {
      loadProgressBar();
      this.getTicks()
      this.getRoutes()
    }
        // .get('https://www.mountainproject.com/data/get-routes?routeIds=105748391,105750454,105749956&key=106635196-7386eb17c9b59aaa02314e6588deb35d')
        // .then(res => {
        //   console.log('the routes 🐲 ', res.data)

          // this.dataset.push("hellow")
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
    .curve-btc {
    .stroke {
        stroke: #f69119;
        stroke-width: 2;
    }
    .fill {
        fill: url(#btcFill);
        fill-opacity: 0.5;
    }
    }
    }
</style>
