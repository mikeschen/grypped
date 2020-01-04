<template>
  <div class="ticks">
    <Search @searchName="getTicks" />
    <div class="graph-box">
      <b-container>
        <Graph
          v-bind:maxBoulder="this.maxBoulder"
          :xlabelsBoulder="this.xlabelsBoulder"
          :quantitySets="this.quantityRouteSets"
        />
      </b-container>
    </div>
    <div class="graph-box">
      <b-container> </b-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import _ from "lodash";
import Search from "./Search.vue";
import Graph from "./Graph.vue";
import Constants from "../constants";

export default {
  components: {
    Search,
    Graph
  },
  data() {
    return {
      xlabelsBoulder: [
        "VO",
        "V1",
        "V2",
        "V3",
        "V4",
        "V5",
        "V6",
        "V7",
        "V8",
        "V9",
        "V10",
        "V11",
        "V12"
      ],
      sends: {},
      maxBoulder: "0",
      quantityBoulderSets: [],
      points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      yds: ["5.11a", "5.11b", "5.11c", "5.12a", "5.14a"]
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
                // console.log("bourlders 🧗🏽‍🔥", route.rating[2]);
                boulders.push(parseInt(route.rating[1]));
              } else {
                console.log("routz 🍆", route.rating);
                //remove string at space
                ropes.push(route.rating);
              }
            });
            ropes.sort();
            const counts = {};
            ropes.forEach(y => {
              counts[y] = counts[y] + 1 || 1;
            });
            console.log("countsObject 🧀", counts);
            this.sends = boulders.reduce((obj, item) => {
              obj[item] = (obj[item] || 0) + 1;
              return obj;
            }, {});
            Object.keys(this.sends).map(key => {
              this.points[key] = this.sends[key];
            });

            this.quantityBoulderSets = [
              {
                data: this.points,
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-boulder"
              }
            ];
            this.quantityRouteSets = [
              {
                data: [0, 2, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 10],
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-route"
              }
            ];
            this.maxBoulder = Object.keys(this.sends).pop();
            console.log("maxBoudler 🎟😁", this.sends);
          });
        })
        .catch(err => {
          alert("Could Not Find User.", err);
        });
    }
  },
  mounted() {
    this.getTicks("mikemikaels@yahoo.com");
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

.curve-boulder {
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
.curve-route {
  .stroke {
    stroke: red;
  }
  .fill {
    fill: url(#grpFill);
    fill-opacity: 0.5;
  }
  .point {
    stroke-width: 2;
    transition: stroke-width 0.2s;
    fill: red;
    stroke: red;
  }
  .point.is-active {
    stroke-width: 5;
  }
}
</style>
