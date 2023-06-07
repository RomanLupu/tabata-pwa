<template>
  <div class="app">
    <div class="angry-grid">
      <div class="item" id="item-0">
        <h2>{{ formatNumber(cycles) }}</h2>
        <div class="itemControl">
          <button v-on:click="cycles -= 1"><MinusSVG /></button>
          <p>cycles</p>
          <button v-on:click="cycles += 1"><PlusSVG /></button>
        </div>
      </div>
      <div class="item" id="item-1">
        <h2>{{ formatNumber(tabatas) }}</h2>
        <div class="itemControl">
          <button v-on:click="tabatas -= 1"><MinusSVG /></button>
          <p>tabatas</p>
          <button v-on:click="tabatas += 1"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmaller" id="item-2">
        <img src="/assets/logo.png" alt="" />
      </div>
      <div class="item" id="item-3">
        <h4>total time</h4>
        <h1>{{ totalTime }}</h1>
      </div>
      <div class="item itemSmaller" id="item-4">
        <h4>{{ getTime(prepareTime) }}</h4>
        <div class="itemControl">
          <button :disabled="prepareTime === 0" v-on:click="prepareTime -= 10"><MinusSVG /></button>
          <p>prepare</p>
          <button v-on:click="prepareTime += 10"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmaller" id="item-5">
        <h4>{{ getTime(workTime) }}</h4>
        <div class="itemControl">
          <button :disabled="workTime === 0" v-on:click="workTime -= 10"><MinusSVG /></button>
          <p>work</p>
          <button v-on:click="workTime += 10"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmaller" id="item-6">
        <h4>{{ getTime(restTime) }}</h4>
        <div class="itemControl">
          <button :disabled="restTime === 0" v-on:click="restTime -= 10"><MinusSVG /></button>
          <p>rest</p>
          <button v-on:click="restTime += 10"><PlusSVG /></button>
        </div>
      </div>
    </div>
    <div class="controlPanel">
      <div>
        <button v-on:click="resetOptions">Reset</button>
        <button>Sounds On</button>
        <button>Share</button>
      </div>
      <button>START</button>
    </div>
  </div>
</template>

<script>
import PlusSVG from './assets/IcRoundPlus.vue'
import MinusSVG from './assets/IcRoundMinus.vue'
export default {
  name: 'App',
  components: { PlusSVG, MinusSVG },
  defaultOptions: {
    tabatas: 1,
    cycles: 8,
    prepareTime: 10,
    workTime: 30,
    restTime: 10
  },
  data() {
    return {
      tabatas: this.$options.defaultOptions.tabatas,
      cycles: this.$options.defaultOptions.cycles,
      prepareTime: this.$options.defaultOptions.prepareTime,
      workTime: this.$options.defaultOptions.workTime,
      restTime: this.$options.defaultOptions.restTime
    }
  },
  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

    const VALID_KEYS = ['tabatas', 'cycles', 'prepareTime', 'workTime', 'restTime']

    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = +windowData[key]
      }
    })
  },
  methods: {
    formatNumber(num) {
      return num > 9 ? num : '0' + num
    },
    getTime(seconds) {
      return new Date(1000 * seconds).toISOString().substring(14, 19)
    },
    resetOptions() {
      this.tabatas = this.$options.defaultOptions.tabatas
      this.cycles = this.$options.defaultOptions.cycles
      this.prepareTime = this.$options.defaultOptions.prepareTime
      this.workTime = this.$options.defaultOptions.workTime
      this.restTime = this.$options.defaultOptions.restTime
    }
  },
  computed: {
    totalTime() {
      const time = (this.workTime + this.restTime) * this.cycles * this.tabatas + this.prepareTime
      return this.getTime(time)
    },
    pageStateOptions() {
      return {
        prepareTime: this.prepareTime,
        workTime: this.workTime,
        restTime: this.restTime,
        cycles: this.cycles,
        tabatas: this.tabatas
      }
    }
  },
  watch: {
    pageStateOptions(value) {
      const params = Object.keys(value).reduce((acc, rec, idx) => {
        return acc + `${rec}=${value[rec]}${idx === Object.keys(value).length - 1 ? '' : '&'}`
      }, '')

      window.history.pushState(null, document.title, `${window.location.pathname}?${params}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  width: 1200px;
}
.angry-grid {
  display: grid;

  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  gap: 8px;
  height: 600px;

  color: black;
}
.controlPanel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -50px;
}
.item {
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5px;

  &Control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    button {
      padding: 3px 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  h1 {
    margin: 0;
    font-size: 186px;
    font-weight: bold;
  }
  h2 {
    margin: 0;
    font-size: 64px;
    font-weight: bold;
  }
  h4 {
    margin: 0;
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
  }

  p {
    font-size: 14px;
    margin: 0;
    text-transform: uppercase;
  }
  img {
    width: 75%;
  }

  &Smaller {
    height: 60%;
  }
}

#item-0 {
  background-color: white;
  grid-row-start: 1;
  grid-column-start: 1;

  grid-row-end: 2;
  grid-column-end: 2;
}
#item-1 {
  background-color: white;
  grid-row-start: 2;
  grid-column-start: 1;

  grid-row-end: 3;
  grid-column-end: 2;
}
#item-2 {
  background-color: rgb(25, 101, 120);
  grid-row-start: 3;
  grid-column-start: 1;

  grid-row-end: 4;
  grid-column-end: 2;
}
#item-3 {
  background-color: white;
  grid-row-start: 1;
  grid-column-start: 2;

  grid-row-end: 3;
  grid-column-end: 5;
}
#item-4 {
  background-color: darkorange;
  grid-row-start: 3;
  grid-column-start: 2;

  grid-row-end: 4;
  grid-column-end: 3;
}
#item-5 {
  background-color: green;
  grid-row-start: 3;
  grid-column-start: 3;

  grid-row-end: 4;
  grid-column-end: 4;
}
#item-6 {
  background-color: red;
  grid-row-start: 3;
  grid-column-start: 4;

  grid-row-end: 4;
  grid-column-end: 5;
}
</style>
