<template>
  <div class="app">
    <div class="angry-grid">
      <div class="item itemGeneral-0 white">
        <h2>{{ formatNumber(cycles) }}</h2>
        <div class="itemControl">
          <button v-on:click="cycles -= 1" v-if="!start"><MinusSVG /></button>
          <p>cycles</p>
          <button v-on:click="cycles += 1" v-if="!start"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemGeneral-1 white">
        <h2>{{ formatNumber(tabatas) }}</h2>
        <div class="itemControl">
          <button v-on:click="tabatas -= 1" v-if="!start"><MinusSVG /></button>
          <p>tabatas</p>
          <button v-on:click="tabatas += 1" v-if="!start"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmall-0">
        <img src="/assets/logo.png" alt="" />
      </div>
      <div
        class="item itemMain"
        :class="{
          prepare: currentAction.type === 'prepare',
          work: currentAction.type === 'work',
          rest: currentAction.type === 'rest',
          white: !currentAction.type
        }"
      >
        <h4>{{ currentAction.type ?? 'total time' }}</h4>
        <h1
          :class="{
            hidden: hide
          }"
        >
          {{ getTime(currentAction.time ?? totalTime) }}
        </h1>
      </div>
      <div class="prepare item itemSmall-1" v-if="!start">
        <h4>{{ getTime(prepareTime) }}</h4>
        <div class="itemControl">
          <button :disabled="prepareTime === 0" v-on:click="prepareTime -= 10"><MinusSVG /></button>
          <p>prepare</p>
          <button v-on:click="prepareTime += 10"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmall-2 work" v-if="!start">
        <h4>{{ getTime(workTime) }}</h4>
        <div class="itemControl">
          <button :disabled="workTime === 0" v-on:click="workTime -= 10"><MinusSVG /></button>
          <p>work</p>
          <button v-on:click="workTime += 10"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemSmall-3 rest" v-if="!start">
        <h4>{{ getTime(restTime) }}</h4>
        <div class="itemControl">
          <button :disabled="restTime === 0" v-on:click="restTime -= 10"><MinusSVG /></button>
          <p>rest</p>
          <button v-on:click="restTime += 10"><PlusSVG /></button>
        </div>
      </div>
      <div class="item itemInProgress white" v-if="start">
        <h4>{{ getTime(remainingTime) }}</h4>
        <p>time remaining</p>
      </div>
    </div>
    <div class="controlPanel">
      <div class="controlPanelLeft">
        <button v-on:click="resetOptions">Reset</button>
        <button>Sounds On</button>
        <button>Share</button>
      </div>

      <div class="controlPanelRight">
        <button @click="onPause" v-if="start">{{ pause ? 'RESUME' : 'PAUSE' }}</button>
        <button @click="onHandle">{{ start ? 'STOP' : 'START' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import PlusSVG from './assets/IcRoundPlus.vue'
import MinusSVG from './assets/IcRoundMinus.vue'
import stop from './audio/stop.wav'
import start from './audio/start.wav'
import work from './audio/work.wav'
import rest from './audio/rest.wav'
export default {
  name: 'App',
  components: { PlusSVG, MinusSVG },
  defaultOptions: {
    tabatas: 1,
    cycles: 8,
    prepareTime: 5,
    workTime: 5,
    restTime: 5
  },
  data() {
    return {
      tabatas: this.$options.defaultOptions.tabatas,
      cycles: this.$options.defaultOptions.cycles,
      prepareTime: this.$options.defaultOptions.prepareTime,
      workTime: this.$options.defaultOptions.workTime,
      restTime: this.$options.defaultOptions.restTime,
      start: false,
      pause: false,
      remainingTime: 0,
      intervalId: 0,
      hide: false,
      currentAction: {
        type: undefined, // prepare --> work --> rest,
        time: undefined
      }
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
  beforeUnmount() {
    clearInterval(this.intervalId)
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
    },
    timerHandler() {
      if (this.pause) {
        this.hide = !this.hide
        return
      }
      this.remainingTime -= 1
      this.currentAction.time -= 1
    },
    onStart() {
      console.log('ON_START')
      this.playSound(start)
      this.remainingTime = this.totalTime
      this.currentAction.type = 'prepare'
      this.currentAction.time = this.prepareTime
      this.start = true
      this.intervalId = setInterval(this.timerHandler, 1000)
    },
    onStop() {
      console.log('ON_STOP')
      this.playSound(stop)
      this.remainingTime = 0
      this.start = false
      this.currentAction.type = undefined
      this.currentAction.time = undefined
      clearInterval(this.intervalId)
    },
    onPause() {
      if (this.hide) {
        this.hide = !this.hide
      }
      this.pause = !this.pause
    },
    playSound(sound) {
      if (sound) {
        const audio = new Audio(sound)
        audio.play()
      }
    }
  },
  computed: {
    onHandle() {
      return this.start ? this.onStop : this.onStart
    },
    cycleTime() {
      return this.workTime + this.restTime
    },
    totalTime() {
      return this.prepareTime + this.cycleTime * this.cycles * this.tabatas
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
    },
    remainingTime() {
      if (this.remainingTime === 0) {
        this.onStop()
        return
      }
      if (this.remainingTime === this.cycleTime * (this.cycles - 1)) {
        this.cycles -= 1
      }
      if (this.remainingTime === this.cycleTime * this.cycles - this.workTime) {
        this.currentAction.type = 'rest'
        this.currentAction.time = this.restTime
        this.playSound(rest)
      }
      if (this.remainingTime === this.cycleTime * this.cycles) {
        this.currentAction.type = 'work'
        this.currentAction.time = this.workTime
        this.playSound(work)
      }
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

  &Left,
  &Right {
    display: flex;
    gap: 10px;

    button {
      min-width: 125px;
    }
  }
}
.prepare {
  background-color: darkorange;
}

.work {
  background-color: darkgreen;
}

.rest {
  background-color: darkred;
}

.white {
  background-color: white;
}
.hidden {
  opacity: 0;
}

.item {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5px;

  &Main {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 5;
  }

  &General-0 {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-end: 2;
  }

  &General-1 {
    grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 2;
  }
  &Small-0 {
    height: 60%;
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-start: 1;
    grid-column-end: 2;
    background-color: rgb(25, 101, 120);
  }
  &Small-1 {
    height: 60%;
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-end: 3;
    grid-column-start: 2;
  }
  &Small-2 {
    height: 60%;
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-end: 4;
    grid-column-start: 3;
  }
  &Small-3 {
    height: 60%;

    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-start: 4;
    grid-column-end: 5;
  }
  &InProgress {
    height: 60%;
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-start: 2;
    grid-column-end: 5;
  }

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
}
</style>
