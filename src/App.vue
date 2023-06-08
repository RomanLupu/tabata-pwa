<template>
  <div class="app">
    <div class="content">
      <div class="angry-grid">
        <div class="item itemGeneral-0 white">
          <h2>{{ formatNumber(cyclesLeft) }}</h2>
          <div class="itemControl">
            <button @click="cyclesLeft -= 1" v-if="!start"><MinusSVG /></button>
            <p>cycles</p>
            <button @click="cyclesLeft += 1" v-if="!start"><PlusSVG /></button>
          </div>
        </div>
        <div class="item itemGeneral-1 white">
          <h2>{{ formatNumber(tabatas) }}</h2>
          <div class="itemControl">
            <button @click="tabatas -= 1" v-if="!start"><MinusSVG /></button>
            <p>tabatas</p>
            <button @click="tabatas += 1" v-if="!start"><PlusSVG /></button>
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
            <button :disabled="prepareTime === 0" @click="prepareTime -= 10"><MinusSVG /></button>
            <p>prepare</p>
            <button @click="prepareTime += 10"><PlusSVG /></button>
          </div>
        </div>
        <div class="item itemSmall-2 work" v-if="!start">
          <h4>{{ getTime(workTime) }}</h4>
          <div class="itemControl">
            <button :disabled="workTime === 0" @click="workTime -= 10"><MinusSVG /></button>
            <p>work</p>
            <button @click="workTime += 10"><PlusSVG /></button>
          </div>
        </div>
        <div class="item itemSmall-3 rest" v-if="!start">
          <h4>{{ getTime(restTime) }}</h4>
          <div class="itemControl">
            <button :disabled="restTime === 0" @click="restTime -= 10"><MinusSVG /></button>
            <p>rest</p>
            <button @click="restTime += 10"><PlusSVG /></button>
          </div>
        </div>
        <div class="item itemInProgress white" v-if="start">
          <h4>{{ getTime(remainingTime) }}</h4>
          <p>time remaining</p>
        </div>
      </div>
      <div class="controlPanel">
        <div class="controlPanelLeft">
          <button @click="resetOptions">Reset</button>
          <button @click="mute = !mute">{{ mute ? 'Sounds OFF' : 'Sounds ON' }}</button>
          <button @click="isOpenModal = true">Share</button>
        </div>

        <div class="controlPanelRight">
          <button @click="onPause" v-if="start">{{ pause ? 'RESUME' : 'PAUSE' }}</button>
          <button @click="onHandle">{{ start ? 'STOP' : 'START' }}</button>
        </div>
      </div>
      <app-modal @closeModal="isOpenModal = false" v-if="isOpenModal" />
    </div>
  </div>
</template>

<script>
import AppModal from './components/AppModal.vue'
import PlusSVG from './assets/IcRoundPlus.vue'
import MinusSVG from './assets/IcRoundMinus.vue'
import stop from './audio/stop.wav'
import start from './audio/start.wav'
import work from './audio/work.wav'
import rest from './audio/rest.wav'

export default {
  name: 'App',
  components: { PlusSVG, MinusSVG, AppModal },
  defaultOptions: {
    tabatas: 1,
    cyclesLeft: 8,
    prepareTime: 5,
    workTime: 5,
    restTime: 5
  },
  data() {
    return {
      tabatas: 1,
      cycles: 8,
      cyclesLeft: 8,
      prepareTime: 20,
      workTime: 30,
      restTime: 10,
      start: false,
      pause: false,
      remainingTime: 0,
      intervalId: 0,
      hide: false,
      mute: false,
      isOpenModal: false,
      currentAction: {
        type: undefined, // prepare --> work --> rest,
        time: undefined
      }
    }
  },
  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

    const VALID_KEYS = ['tabatas', 'cyclesLeft', 'prepareTime', 'workTime', 'restTime']

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
      this.cyclesLeft = this.$options.defaultOptions.cyclesLeft
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
      this.playSound(start)
      this.start = true
      this.cycles = this.cyclesLeft
      this.remainingTime = this.totalTime
      this.setCurrentAction('prepare', this.prepareTime)
      this.intervalId = setInterval(this.timerHandler, 1000)
    },
    onStop() {
      this.playSound(stop)
      this.start = false
      this.remainingTime = 0
      this.setCurrentAction(undefined, undefined)
      clearInterval(this.intervalId)
    },
    onPause() {
      if (this.hide) {
        this.hide = !this.hide
      }
      this.pause = !this.pause
    },
    playSound(sound) {
      if (sound && !this.mute) {
        const audio = new Audio(sound)
        audio.play()
      }
    },
    setCurrentAction(type, duration) {
      this.currentAction.type = type
      this.currentAction.time = duration
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
      return (this.prepareTime + this.cycleTime * this.cyclesLeft) * this.tabatas
    },
    totalCycles() {
      return this.cyclesLeft + this.cycles * (this.tabatas - 1)
    },
    totalPrepareTime() {
      return this.prepareTime * (this.tabatas - 1)
    },
    totalRemainingTime() {
      return this.cycleTime * this.totalCycles + this.totalPrepareTime
    },
    pageStateOptions() {
      return {
        prepareTime: this.prepareTime,
        workTime: this.workTime,
        restTime: this.restTime,
        cyclesLeft: this.cyclesLeft,
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
      if (this.remainingTime === this.totalRemainingTime - this.cycleTime) {
        this.cyclesLeft -= 1

        if (this.cyclesLeft === 0) {
          this.tabatas -= 1
          this.cyclesLeft = this.cycles
          this.setCurrentAction('prepare', this.prepareTime)
        }
      }
      if (this.remainingTime === this.totalRemainingTime - this.workTime) {
        this.setCurrentAction('rest', this.restTime)
        this.playSound(rest)
      }
      if (this.remainingTime === this.totalRemainingTime) {
        this.setCurrentAction('work', this.workTime)
        this.playSound(work)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
}
.content {
  width: 1200px;
  margin: auto;
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
