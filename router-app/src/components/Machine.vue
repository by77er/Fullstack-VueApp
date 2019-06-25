<template>
  <fieldset>
    <legend>
      <img id="icon" src="../assets/server_icon.png">
      {{machine.name}}
    </legend>
    <div id="info_settings">
      <button class="cbutton" v-on:click="info_click">
        <img class="button_icon" src="../assets/info_icon.png">
      </button>
      <button class="cbutton" v-on:click="settings_click">
        <img class="button_icon" src="../assets/settings_icon.svg">
      </button>
    </div>
    <ul id="bottom_data">
      <li class="data_row">OS:</li>
      <strong>{{machine.os}}</strong>
      <br>
      <li class="data_row">#Cores:</li>
      <strong>{{machine.cores}}</strong>
      <br>
      <li class="data_row">Memory:</li>
      <strong>{{machine.ram}} GB</strong>
      <br>
      <li class="data_row">Running:</li>
      <strong>{{machine.running ? "Yes" : "No"}}</strong>
      <br>
    </ul>
  </fieldset>
</template>

<script>
export default {
  name: "Machine",
  props: {
    machine: { type: Object }
  },
  data() {
    return this.machine;
  },
  methods: {
    settings_click() {
      this.$parent.$emit("settings_click", this.machine.id);
    },
    info_click() {
      this.$parent.$emit("info_click", this.machine.id);
    }
  }
};
</script>

<style scoped>
strong {
  text-align: left;
}
ul {
  padding: 0;
  list-style-type: none;
}
.data_row {
  margin-top: 1px;
  display: inline-block;
  text-align: right;
  color: grey;
  min-width: 70px;
}
.button_icon {
  height: 20px;
  vertical-align: middle;
}
.cbutton {
  display: static;
  background-color: white;
  border-radius: 30px;
  min-height: 30px;
  min-width: 30px;
}
.cbutton:hover {
  cursor: pointer;
}
#info_settings:hover {
  cursor: pointer;
}
#info_settings {
  position: absolute;
  left: 180px;
  top: 23px;
  width: 80px;
  height: 35px;
}
#bottom_data {
  color: black;
  background-color: white;
  margin-top: 30px;
  height: 85px;
  border-radius: 4px;
  font-size: 0.9em;
  text-align: left;
}
#icon {
  position: relative;
  height: 20px;
  bottom: 2px;
  vertical-align: middle;
}
legend {
  position: relative;
  margin-top: 5px;
  right: 22px;
  top: 24px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #f5f5f5;
  text-emphasis: bold;
  font-size: 1.2em;
  text-align: left;
  border: 1px solid;
  border-radius: 5px;
  border-color: white;
}
fieldset {
  transform: translate3d(0px, 0px, 0px);
  min-width: 250px;
  height: 150px;
  border: 1px solid;
  border-color: white;
  border-radius: 20px;
  background-image: linear-gradient(to bottom right, purple, red);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.4);
  margin: 10px;
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
}
fieldset:hover {
  transform: translate3d(0px, -5px, 0px);
  bottom: 5px;
  -webkit-transition: transform 0.25s;
  transition: transform 0.25s;
}
</style>
