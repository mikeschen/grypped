<template>
  <div>
    <b-container>
      <b-row>
        <div class="col-logo">
          <img class="logo" alt="gripped" src="../assets/climber.png" />
        </div>
        <b-col>
          <div class="md-layout">
            <div class="md-title">Mountain Project Email or User ID</div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label for="email">name@email.com</label>
                  <md-input
                    name="email"
                    id="email"
                    v-model="text"
                    @keydown.enter="searchName(text)"
                  />
                </md-field>
                <v-alert dense type="error" v-if="errors.length">
                  <p>{{ errors[0] }}</p>
                </v-alert>
              </div>
              <md-button
                class="md-accent md-raised btn-center"
                @click="searchName(text)"
                >search</md-button
              >
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  props: {
    method: { type: Function },
    errors: Array
  },
  data() {
    return {
      text: ""
    };
  },
  methods: {
    searchName(text) {
      this.$emit("searchName", text);
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 100px;
}
.input-email {
  display: inline-block;
  width: 80%;
}
.md-title {
  margin-right: 20px;
}
.btn-center {
  margin-top: 15px;
}
.errors-red {
  display: inline-block;
  color: #d8002b;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .col-logo {
    display: none;
  }
  .input-group-append {
    width: 100%;
  }
}
</style>
