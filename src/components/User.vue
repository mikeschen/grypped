<template>
  <b-col md="8">
    <img class="user-icon" :src="avatar" />
    <h6 class="user-name">
      <slot></slot>
    </h6>
  </b-col>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String
    }
  }
};
</script>