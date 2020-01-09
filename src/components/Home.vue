<template>
  <div class="ticks">
    <Search @searchName="getTicks" />
    <div class="graph-box">
      <b-container>
        <Graph
          v-bind:converts="this.convertBoulders"
          :quantityLabels="this.quantityBoulderLabels"
          :quantitySets="this.quantityBoulderSets"
        />
      </b-container>
      <b-container>
        <Graph
          v-bind:converts="this.convertRopes"
          :quantityLabels="this.quantityRopeLabels"
          :quantitySets="this.quantityRopeSets"
        />
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
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
      quantityBoulderLabels: {
        xLabels: ["loading...", "loading..."],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val)
      },
      quantityRopeLabels: {
        xLabels: ["loading...", "loading..."],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val)
      },
      quantityBoulderSets: [],
      quantityRopeSets: [],
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
    filteredLabels(labels) {
      let numberOfLabels = 2;
      if (labels.length > 20) {
        numberOfLabels = 4;
      }
      return labels.map((grade, i) => {
        return i % numberOfLabels === 0 ? this.grades[grade] : " ";
      });
    },
    buildGraph(routes) {
      const counts = {};
      routes.forEach(x => {
        counts[x] = counts[x] + 1 || 1;
      });
      return counts;
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
              const ratingIndex = this.grades.indexOf(
                route.rating.split(" ")[0]
              );
              if (ratingIndex !== 0 && ratingIndex !== 66) {
                if (
                  route.type === "Boulder" ||
                  route.type === "Boulder, Alpine"
                ) {
                  boulders.push(ratingIndex);
                } else {
                  ropes.push(ratingIndex);
                }
              }
            });
            const boulderCounts = this.buildGraph(boulders);
            this.convertBoulders = Object.keys(boulderCounts);
            this.quantityBoulderLabels.xLabels = this.filteredLabels(
              this.convertBoulders
            );
            this.quantityBoulderSets = [
              {
                data: Object.values(boulderCounts),
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-red"
              }
            ];
            const ropeCounts = this.buildGraph(ropes);
            this.convertRopes = Object.keys(ropeCounts);
            this.quantityRopeLabels.xLabels = this.filteredLabels(
              this.convertRopes
            );
            this.quantityRopeSets = [
              {
                data: Object.values(ropeCounts),
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-green"
              }
            ];
          });
        })
        .catch(err => {
          console.log("Error: Could Not Complete Request");
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

.curve-vue-green {
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

.curve-vue-red {
  .stroke {
    stroke: #d8002b;
  }
  .fill {
    fill: url(#grpFill);
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
