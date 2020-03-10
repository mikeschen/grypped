<template>
  <div class="ticks">
    <Search :errors="errors" @searchName="getUser" />
    <b-container>
      <b-row>
        <b-col md="4">
          <md-radio v-model="isRoutes" :value="true">Routes</md-radio>
          <md-radio v-model="isRoutes" :value="false">Boulders</md-radio>
        </b-col>
        <User
          :avatar="
            userInfo.avatar
              ? userInfo.avatar
              : 'https://www.mountainproject.com/photos/avatars/106635196.jpg?1522108024'
          "
          >{{ userInfo.name ? userInfo.name : "Joe Blow" }}</User
        >
      </b-row>
    </b-container>
    <Graph
      :converts="isRoutes ? convertRopes : convertBoulders"
      :quantityLabels="isRoutes ? quantityRopeLabels : quantityBoulderLabels"
      :quantitySets="isRoutes ? quantityRopeSets : quantityBoulderSets"
    />
  </div>
</template>

<script>
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import { mapState } from "vuex";
import Search from "./Search.vue";
import User from "./User.vue";
import Graph from "./Graph.vue";
import Constants from "../constants";

export default {
  components: {
    Search,
    User,
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
      grades: Constants.GRADES,
      quantityBoulderSets: [],
      quantityRopeSets: [],
      convertBoulders: [],
      convertRopes: [],
      errors: [],
      isRoutes: true
    };
  },
  methods: {
    checkUser(value) {
      this.errors = [];
      const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const id = /^\d+$/.test(value);
      if (email.test(String(value).toLowerCase())) {
        return `email=${value}`;
      } else if (id) {
        return `userId=${value}`;
      } else {
        this.errors.push("Please Enter a Valid Email or Id.");
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
      //Test User ID: 108295877
      loadProgressBar();
      const routes = [];
      const boulders = [];
      const ropes = [];
      axios
        .get(Constants.TICK_URL + value, { crossdomain: true })
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
                if (route.type.includes("Boulder")) {
                  boulders.push(ratingIndex);
                } else {
                  ropes.push(ratingIndex);
                }
              }
            });
            const boulderCounts = this.buildGraph(boulders);
            this.convertBoulders =
              boulders.length > 1 ? Object.keys(boulderCounts) : [0, 0];
            this.quantityBoulderLabels.xLabels = this.filteredLabels(
              this.convertBoulders
            );
            this.quantityBoulderSets = [
              {
                data:
                  boulders.length > 1 ? Object.values(boulderCounts) : [0, 0],
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-green"
              }
            ];
            const ropeCounts = this.buildGraph(ropes);
            this.convertRopes =
              ropes.length > 1 ? Object.keys(ropeCounts) : [0, 0];
            this.quantityRopeLabels.xLabels = this.filteredLabels(
              this.convertRopes
            );
            this.quantityRopeSets = [
              {
                data: ropes.length > 1 ? Object.values(ropeCounts) : [0, 0],
                smooth: true,
                fill: true,
                showPoints: true,
                className: "curve-vue-red"
              }
            ];
          });
        })
        .catch(err => {
          console.log("Error: Could Not Complete Request", err);
          this.errors = [];
          this.errors.push("Could Not Find User.");
        });
    },
    getUser(value) {
      const userId = this.checkUser(value);
      if (!userId) {
        return;
      }
      this.$store.dispatch("loadUserInfo", userId);
      this.getTicks(userId);
    }
  },
  mounted() {
    this.getTicks("email=mikemikaels@yahoo.com");
  },
  computed: mapState(["userInfo"])
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

.btn-main {
  margin: 10px 0;
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

.user-icon {
  max-width: 50px;
  border-radius: 50%;
}

.user-name {
  padding-left: 20px;
  display: inline;
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
