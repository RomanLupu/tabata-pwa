<template>
  <div class="item sideCard white">
    <h2>{{ formatNumber(value) }}</h2>
    <div class="sideCardControl">
      <button :disabled="value === 1" @click="remove" v-if="!start"><MinusSVG /></button>
      <p>{{ title }}</p>
      <button @click="add" v-if="!start"><PlusSVG /></button>
    </div>
  </div>
</template>

<script>
import PlusSVG from '../assets/IcRoundPlus.vue'
import MinusSVG from '../assets/IcRoundMinus.vue'
import { formatNumber, getTime } from '../helpers/time.js'

export default {
  name: 'SideCard',
  components: { MinusSVG, PlusSVG },
  props: {
    title: {
      type: String,
      required: true
    },
    dataType: {
      type: String,
      required: true
    },
    start: {
      type: Boolean,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  emits: {
    'on-add': (value) => typeof value === 'string',
    'on-remove': (value) => typeof value === 'string'
  },
  methods: {
    formatNumber,
    getTime,
    add() {
      this.$emit('on-add', this.dataType)
    },
    remove() {
      this.$emit('on-remove', this.dataType)
    }
  }
}
</script>

<style lang="scss" scoped>
.sideCard {
  grid-column-start: 1;
  grid-column-end: 2;

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
