<template>
  <div class="item bottomCard" :class="`${dataType}`">
    <h4>{{ getTime(value) }}</h4>
    <div class="bottomCardControl">
      <button :disabled="value === 0" @click="decrease"><MinusSVG /></button>
      <p>{{ dataType }}</p>
      <button @click="increase"><PlusSVG /></button>
    </div>
  </div>
</template>

<script>
import PlusSVG from '../assets/IcRoundPlus.vue'
import MinusSVG from '../assets/IcRoundMinus.vue'
import { getTime } from '../helpers/time.js'

export default {
  name: 'BottomCard',
  components: { MinusSVG, PlusSVG },
  props: {
    dataType: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  emits: {
    'on-increase': (value) => typeof value === 'string',
    'on-decrease': (value) => typeof value === 'string'
  },
  methods: {
    getTime,
    increase() {
      this.$emit('on-increase', this.dataType)
    },
    decrease() {
      this.$emit('on-decrease', this.dataType)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottomCard {
  height: 60%;
  grid-row-start: 3;
  grid-row-end: 4;

  &Control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 24px;

    button {
      padding: 3px 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
