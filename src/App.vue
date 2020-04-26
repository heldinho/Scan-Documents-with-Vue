<template>
  <div id="app">
    <div class="dynamsoft-dwt-dlg-button-2" @click="toggleScanModule">
      Scan a Document
    </div>
    <dwt v-if="this.showScanModule" />
    <dwt-thumbnail />
  </div>
</template>
<script>
import dwt from './components/dwt.vue'
import DwtThumbnail from './components/dwt-thumbnail/dwt-thumbnail'

export default {
  name: 'app',
  components: {
    dwt,
    'dwt-thumbnail': DwtThumbnail
  },
  data() {
    return {
      showScanModule: false
    }
  },
  methods: {
    toggleScanModule: function() {
      this.showScanModule = !this.showScanModule
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
.dynamsoft-dwt-dlg-button-2 {
  float: left;
  margin: 10px;
  padding: 6px 0;
  cursor: pointer;
  text-align: center;
  width: 150px;
  background: rgb(80, 168, 225);
  border-radius: 3px;
  font-size: 14px;
  font-family: 'OpenSans-Semibold', 'Open Sans', 'Helvetica Neue',
    sans-serif 'Courier New', Courier, monospace;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
}
</style>
