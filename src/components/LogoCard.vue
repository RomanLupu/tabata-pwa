<template>
  <div class="item logoCard">
    <img src="/assets/logo.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'LogoCard'
}
</script>

<style lang="scss" scoped>
.logoCard {
  height: 60%;
  grid-row-start: 3;
  grid-row-end: 4;
  grid-column-start: 1;
  grid-column-end: 2;
  background-color: rgb(25, 101, 120);

  img {
    width: 75%;
  }
}
</style>
