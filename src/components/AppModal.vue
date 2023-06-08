<template>
  <div id="myModal" class="modal">
    <div class="modal-background" @click="close" />
    <div class="modal-content">
      <div class="modal-content-header">Share you TABATA</div>
      <div class="modal-content-slot">
        <input class="modal-input" :value="href" ref="inputRef" />
        <button @click="copyToClipboard">Copy link</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppModal',
  data() {
    return {
      href: window.location.href
    }
  },
  emits: {
    closeModal: null
  },
  methods: {
    close() {
      this.$emit('closeModal')
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.href)
      this.close()
    }
  },
  mounted() {
    console.log(this.$refs.inputRef)
    this.$refs.inputRef.focus()
  }
}
</script>
<style scoped>
/* The Modal (background) */
.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  color: black;
}
.modal-background {
  position: absolute; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%;
}
.modal-content-header {
  background-color: rgb(25, 101, 120);
  text-align: center;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px 8px 0 0;
  font-size: 24px;
  font-weight: 600;
}
.modal-content-slot {
  padding: 40px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
/* Modal Content/Box */
.modal-content {
  border-radius: 8px;
  position: relative;
  background-color: #fefefe;
  transform: translateY(calc(50vh - 50%)) translateX(calc(50vw - 50%));
  width: 40%; /* Could be more or less, depending on screen size */
  z-index: 2;
}
.modal-input {
  width: 50%;
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.65em 1.2em;
  font-size: 1em;
  font-weight: 500;
}
</style>
