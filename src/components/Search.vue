<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
            <img class="logo" alt="logo" src="../assets/climber.png">
          </b-col>
          <b-col>
            <b-form-input class="input-email" v-model="text" placeholder="Enter your Mountain Project email"></b-form-input>
            <button class="btn btn-success btn-enter">Enter</button>
          </b-col>
          <b-col>
          </b-col>
        </b-row>
      </b-container>
      <div class="mt-2">Value: {{ text }}</div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        text: ''
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
  </style>
