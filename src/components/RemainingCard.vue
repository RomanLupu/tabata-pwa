<template>
  <div class="item white remainingCard">
    <h4>{{ getTime(value) }}</h4>
    <p>time remaining</p>
  </div>
</template>

<script>
import { getTime } from '../helpers/time.js'

export default {
  name: 'RemainingCard',
  methods: { getTime },
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.remainingCard {
  height: 60%;
  grid-row-start: 3;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 5;
}
</style>
