<template>
  <div class="app">
    <div class="content">
      <div class="angry-grid">
        <SideCard
          title="cycles"
          :value="cyclesLeft"
          :start="start"
          dataType="cyclesLeft"
          @on-add="onAdd"
          @on-remove="onRemove"
        />
        <SideCard
          title="tabatas"
          :value="tabatasLeft"
          :start="start"
          dataType="tabatasLeft"
          @on-add="onAdd"
          @on-remove="onRemove"
        />
        <LogoCard />
        <div
          class="item mainCard"
          :class="{ [currentAction.type]: currentAction.type, white: !currentAction.type }"
        >
          <h4>{{ currentAction.type ?? 'total time' }}</h4>
          <h1 :class="{ hidden: hide }">
            {{ getTime(currentAction.time ?? totalTime) }}
          </h1>
        </div>
        <BottomCard
          data-type="prepare"
          :value="prepare"
          class="bottomPrepare"
          @on-increase="onIncrease"
          @on-decrease="onDecrease"
          v-if="!start"
        />
        <BottomCard
          data-type="work"
          :value="work"
          class="bottomWork"
          @on-increase="onIncrease"
          @on-decrease="onDecrease"
          v-if="!start"
        />
        <BottomCard
          data-type="rest"
          :value="rest"
          class="bottomRest"
          @on-increase="onIncrease"
          @on-decrease="onDecrease"
          v-if="!start"
        />
        <RemainingCard :value="remainingTime" v-if="start" />
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
import { formatNumber, getTime } from './helpers/time.js'
import BottomCard from './components/BottomCard.vue'
import LogoCard from './components/LogoCard.vue'
import RemainingCard from './components/RemainingCard.vue'
import SideCard from './components/SideCard.vue'

export default {
  name: 'App',
  components: { SideCard, RemainingCard, LogoCard, PlusSVG, MinusSVG, AppModal, BottomCard },
  defaultOptions: {
    tabatasLeft: 1,
    tabatas: 1,
    cyclesLeft: 8,
    cycles: 8,
    prepare: 5,
    work: 5,
    rest: 5
  },
  data() {
    return {
      tabatas: 1,
      tabatasLeft: 1,
      cycles: 8,
      cyclesLeft: 8,
      prepare: 20,
      work: 30,
      rest: 10,
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

    const VALID_KEYS = ['tabatasLeft', 'cyclesLeft', 'prepare', 'work', 'rest']

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
    formatNumber,
    getTime,
    onAdd(type) {
      this[type] += 1
    },
    onRemove(type) {
      this[type] -= 1
    },
    onIncrease(type) {
      this[type] += 10
    },
    onDecrease(type) {
      this[type] -= 10
    },
    resetOptions() {
      window.location.search = ''
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
      this.tabatas = this.tabatasLeft
      this.remainingTime = this.totalTime
      this.setCurrentAction('prepare', this.prepare)
      this.intervalId = setInterval(this.timerHandler, 1000)
    },
    onStop() {
      this.playSound(stop)
      this.start = false
      this.remainingTime = 0
      this.cyclesLeft = this.cycles
      this.tabatasLeft = this.tabatas
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
      return this.work + this.rest
    },
    totalTime() {
      return (this.prepare + this.cycleTime * this.cyclesLeft) * this.tabatasLeft
    },
    totalCycles() {
      return this.cyclesLeft + this.cycles * (this.tabatasLeft - 1)
    },
    totalPrepareTime() {
      return this.prepare * (this.tabatasLeft - 1)
    },
    totalRemainingTime() {
      return this.cycleTime * this.totalCycles + this.totalPrepareTime
    },
    pageStateOptions() {
      return {
        prepare: this.prepare,
        work: this.work,
        rest: this.rest,
        cyclesLeft: this.cyclesLeft,
        tabatasLeft: this.tabatasLeft
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
          this.tabatasLeft -= 1
          this.cyclesLeft = this.cycles
          this.setCurrentAction('prepare', this.prepare)
        }
      }
      if (this.remainingTime === this.totalRemainingTime - this.work) {
        this.setCurrentAction('rest', this.rest)
        this.playSound(rest)
      }
      if (this.remainingTime === this.totalRemainingTime) {
        this.setCurrentAction('work', this.work)
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
.hidden {
  opacity: 0;
}

.cyclesCard {
  grid-row-start: 1;
  grid-row-end: 2;
}
.tabatasCard {
  grid-row-start: 2;
  grid-row-end: 3;
}
.mainCard {
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 5;
}
.bottomPrepare {
  grid-column-start: 2;
  grid-column-end: 3;
}
.bottomWork {
  grid-column-start: 3;
  grid-column-end: 4;
}
.bottomRest {
  grid-column-start: 4;
  grid-column-end: 5;
}
</style>
