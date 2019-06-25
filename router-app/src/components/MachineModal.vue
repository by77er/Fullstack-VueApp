<template>
  <div id="holder" v-observe-visibility="visibilityChanged">
    <div id="form">
      <h1>{{this.mode}} a Machine</h1>
      <ul id="form_list">
        <li class="data_row">Machine Name:</li>
        <input ref="mname" name="mname" type="text">
        <br>
        <li class="data_row">Operating System:</li>
        <input ref="os" name="os" type="text">
        <br>
        <li class="data_row">Number of CPU Cores:</li>
        <input ref="cpus" type="number" name="cpus" min="0">
        <br>
        <li class="data_row">Main Memory Size (GB):</li>
        <input ref="mem" name="ram" type="number" min="0">
        <br>
        <li class="data_row">Currently Running:</li>
        <input id="cb" ref="cb" name="running" type="checkbox">
        <br>
      </ul>
      <button class="bottom_button" v-on:click="save_click">Save</button>
      <button
        class="bottom_button"
        v-if="typeof machine.id != 'undefined'"
        v-on:click="delete_click"
      >Delete</button>
      <button class="bottom_button" v-on:click="close_click">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: String,
    machine: Object
  },
  name: "MachineModal",
  methods: {
    save_click() {
      let new_machine = {}; // build based on inputs
      new_machine.id = this.machine.id;
      new_machine.name = this.$refs.mname.value;
      new_machine.os = this.$refs.os.value;
      new_machine.cores = this.$refs.cpus.value;
      new_machine.ram = this.$refs.mem.value;
      new_machine.running = this.$refs.cb.checked;
      this.$parent.$emit("modal_save_click", {
        mode: this.mode,
        machine: new_machine
      });
    },
    close_click() {
      this.$parent.$emit("modal_cancel_click");
    },
    delete_click() {
      this.$parent.$emit("modal_delete_click", this.machine.id);
    },
    visibilityChanged(isVisible, entry) {
      if (!isVisible) return;
      this.$refs.mname.value = "";
      this.$refs["os"].value = "";
      this.$refs["cpus"].value = "";
      this.$refs["mem"].value = "";
      this.$refs["cb"].checked = false;
      if (this.mode == "Edit") {
        console.log("Editing machine ", this.machine);
        this.$refs.mname.value = this.machine.name;
        this.$refs["os"].value = this.machine.os;
        this.$refs["cpus"].value = this.machine.cores;
        this.$refs["mem"].value = this.machine.ram;
        this.$refs["cb"].checked = this.machine.running;
      }
    }
  }
};
</script>

<style scoped>
#cb {
  margin-right: 215px;
}
.bottom_button {
  transform: translate3d(0px, 0px, 0px);
  font-size: 1.2em;
  margin-top: 25px;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: auto;
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
}
.bottom_button:hover {
  transform: translate3d(0px, -2px, 0px);
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
  cursor: pointer;
  border-color: orangered;
}
h1 {
  margin-top: 0px;
  padding-top: 25px;
  padding-bottom: 25px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-image: linear-gradient(to bottom right, purple, red);  
  border-style: solid;
  border-color: #fff5ef;
  color: white;
}
#form_list {
  position: relative;
  right: 20px;
  text-align: center;
  font-size: 1.3em;
  padding-top: 30px;
}
.data_row {
  display: inline-block;
  text-align: right;
  min-width: 225px;
  margin-top: 10px;
}
input {
  display: inline-block;
  text-align: left;
  min-width: 200px;
  border-width: 0px;
  background-color: inherit;
  border-bottom-width: 2px;
  border-bottom-color: black;
  font-size: 1.1em;
}
#form {
  position: relative;
  top: 25%;
  max-width: 50%;
  max-height: 50%;
  margin: auto;
  background-color: #fff5ef;
  border-radius: 20px;
  overflow: scroll;
}
#holder {
  background-color: rgba(10, 0, 0, 0.2);
  position: fixed;
  color: black;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

@media only screen and (max-width: 1000px) {
  .bottom_button {
    margin-top: 0px;
  }
  #form_list {
    padding-top: 0px;
  }
  #holder {
    min-height: 90%;
    min-width: 90%;
    margin: 0px;
    padding: 0px;
  }
  #form {
    margin: 0px;
    left: 5%;
    top: 5%;
    max-height: 90%;
    min-width: 90%;
  }
  .data_row {
    text-align: center;
    min-width: 0px;
    display: block;
  }
  #cb {
    margin-right: 0px;
  }
  input {
    min-width: none;
  }
}
</style>
