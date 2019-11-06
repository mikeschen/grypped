<template>
    <div>
      <b-container>
        <b-row>
          <b-col class="col-logo">
            <img class="logo" alt="logo" src="../assets/climber.png">
          </b-col>
          <b-col cols="8">
            <b-input-group prepend="Mountain Project Email or User ID" class="mt-3">
              <b-form-input placeholder="mikemikaels@yahoo.com" v-model="text" @keydown.enter="searchName(text)"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click="searchName(text)">Submit</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
  export default {
    props: {
      method: { type: Function },
    },
    data() {
      return {
        text: ''
      }
    },
    methods: {
      searchName(text) {
        this.$emit('searchName', text)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logo {
    width: 120px;
  }
  .input-email {
    float: left;
    display: inline-block;
    width: 80%;
  }
  .btn-enter {
    float: left;
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
