<template>
  <div id="fct">
    <MachineModal v-if="modal_open" :mode="active_mode" :machine="active_machine"/>
    <h1>Your Machines</h1>
    <button v-on:click="add_machine" class="top_button">Add a Machine</button>
    <button v-on:click="reload" class="top_button">Reload</button>
    <div id="container">
      <Machine v-for="item of machines" v-bind:key="item.id" :machine="item"/>
    </div>
  </div>
</template>

<script>
import Machine from "./Machine.vue";
import MachineModal from "./MachineModal";
import axios from "axios";
export default {
  name: "MachineContainer",
  data() {
    return {
      modal_open: false, // will ensure only one opens at a time
      active_mode: "Add",
      active_machine: { type: Object },
      machines: [
        /** now populated by database grab
        { id: 0, name: "Production Server", os: "Ubuntu Server 18.10", cores: 32, ram: 128, running: true },
        { id: 1, name: "Personal Laptop", os: "Ubuntu 18.04", cores: 12, ram: 16, running: false  },
        { id: 2, name: "Shared Desktop", os: "Windows 10", cores: 12, ram: 32, running: false  },
        { id: 3, name: "Dev Server", os: "Linux Mint", cores: 24, ram: 48, running: false  },
        { id: 4, name: "Homelab NAS", os: "Ubuntu Server 18.04", cores: 6, ram: 4, running: true  }
        */
      ]
    };
  },
  components: {
    Machine,
    MachineModal
  },
  mounted() {
    this.reload();
    this.$on("info_click", id => {
      this.view_machine_info(id);
    });
    this.$on("settings_click", id => {
      this.machine_settings(id);
    });
    this.$on("modal_save_click", data => {
      this.mod_machine(data);
      this.close_modal(data.mode, data.machine);
    });
    this.$on("modal_cancel_click", data => {
      this.close_modal();
    });
    this.$on("modal_delete_click", data => {
      this.delete_machine(data);
    });
  },
  methods: {
    add_machine() {
      console.log("Opening add-machine modal");
      this.open_modal("Add", {});
    },
    reload() {
      axios
        .get("http://localhost:3000/api/machines")
        .then(rsp => {
          console.log("Getting machine data...");
          this.machines = rsp.data.machines;
          this.machines.sort((a, b) => {
            if (a.id == b.id) {
              return 0;
            } else if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          });
        })
        .catch(err => console.log(err))
        .finally(() => console.log("Done."));
    },
    view_machine_info(machineID) {
      console.log("Opening machine info modal for ID ", machineID);
    },
    machine_settings(machineID) {
      console.log("Opening edit-machine modal for ID ", machineID);
      for (let box of this.machines) {
        if (box.id == machineID) {
          this.open_modal("Edit", box);
          break;
        }
      }
    },
    open_modal(mode, machine) {
      // modal is opened for either adding or editing a machine
      this.active_mode = mode;
      this.active_machine = machine;
      this.modal_open = true;
    },
    close_modal() {
      this.modal_open = false;
    },
    mod_machine(data) {
      // mode and machine data object are passed back
      if (data.mode == "Add") {
        axios
          .post("http://localhost:3000/api/machines/", data.machine)
          .then(res => {
            data.machine.id = res.data.id;
            this.machines.push(data.machine);
            this.machines.sort((a, b) => {
              if (a.id == b.id) {
                return 0;
              } else if (a.id > b.id) {
                return 1;
              } else {
                return -1;
              }
            });
          })
          .catch(err => console.log(err));
      } else {
        axios
          .post(
            `http://localhost:3000/api/machines/${this.active_machine.id}`,
            data.machine
          )
          .then(res => {
            this.machines = this.machines.filter(
              box => box.id != data.machine.id
            );
            this.machines.push(data.machine);
            this.machines.sort((a, b) => {
              if (a.id == b.id) {
                return 0;
              } else if (a.id > b.id) {
                return 1;
              } else {
                return -1;
              }
            });
          })
          .catch(err => console.log(err));
      }
    },
    delete_machine(machineID) {
      axios
        .delete(`http://localhost:3000/api/machines/${machineID}`)
        .then(res => {
          this.close_modal();
          this.machines = this.machines.filter(
            box => box.id != machineID
          );
          this.machines.sort((a, b) => {
            if (a.id == b.id) {
              return 0;
            } else if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          });
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
.top_button {
  transform: translate3d(0px, 0px, 0px);
  display: static;
  font-size: 1.5em;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: auto;
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
}
.top_button:hover {
  transform: translate3d(0px, -2px, 0px);
  transition: transform 0.25s;
  -webkit-transition: transform 0.25s;
  border-color: orangered;
}
#container {
  max-width: 90%;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: center;
}
h1 {
  text-decoration: underline;
  font-size: 100px;
  text-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
  background: linear-gradient(to bottom right, purple, red);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
  margin-top: 100px;
}
@media only screen and (max-width: 500px) {
  h1 {
    font-size: 50px;
    margin-bottom: 20px;
    margin-top: 30px;
  }
}
</style>
