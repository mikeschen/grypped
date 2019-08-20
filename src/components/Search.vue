<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
            <img class="logo" alt="logo" src="../assets/climber.png">
          </b-col>
          <b-col>
            <b-input-group prepend="Mountain Project Email" class="mt-3">
              <b-form-input value="mikemikaels@yahoo.com" v-model="text"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click=searchName(text)>Submit</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        text: ''
      }
    },
    methods: {
      searchName(text) {
        console.log('text here ', text)
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
