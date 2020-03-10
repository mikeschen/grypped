import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import Constants from "../constants";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  actions: {
    loadUserInfo({ commit }, userId) {
      axios
        .get(Constants.USER_URL + userId, {
          crossdomain: true
        })
        .then(res => {
          commit("SET_USERINFO", res.data);
        });
    }
  },
  mutations: {
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo;
    }
  }
});
