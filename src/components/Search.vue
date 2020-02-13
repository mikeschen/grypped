<template>
  <div>
    <b-container>
      <b-row>
        <div class="col-logo">
          <img class="logo" alt="logo" src="../assets/climber.png" />
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
              </div>
              <md-button class="md-accent md-raised btn-center" @click="searchName(text)">search</md-button>
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
    method: { type: Function }
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
  width: 120px;
}
.input-email {
  display: inline-block;
  width: 80%;
}
.btn-center {
  margin-top: 15px;
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
