<template lang="">
    <Page>
      <ActionBar class="action-bar">
      <Label class="action-bar-title" :text="actionTitle"></Label>
    </ActionBar>

    <StackLayout class="nt-form">
        <GridLayout rows="auto auto auto auto auto" columns="">
      <TextField v-if="objAddress != undefined " row="0" ref="searchBar" v-model="objAddress.name" hint="Endereço" class="-rounded m-t-10" />
      <TextField v-else row="0" ref="searchBar" v-model="name" hint="Endereço" class="-rounded m-t-10" />
      <TextField v-if="objAddress != undefined " row="1" ref="searchBar" v-model="objAddress.reference" hint="Referencia" class="-rounded m-t-10" />
      <TextField v-else row="1" ref="searchBar" v-model="reference" hint="Referencia" class="-rounded m-t-10" />
      <TextField v-if="objAddress != undefined " row="2" ref="searchBar" v-model="objAddress.obs" hint="Obs:(Ex: Não buzinar)" class="-rounded m-t-10" />
      <TextField v-else row="2" ref="searchBar" v-model="obs" hint="Obs:(Ex: Não buzinar)" class="-rounded m-t-10" />
          
    <ActivityIndicator row="3" color="black" v-if="processing" busy="true"></ActivityIndicator>
      <Button row="4"
        v-if="obsObjAddress != undefined"
        class="-primary -rounded-lg"
        text="Atualizar"
        color="white"
        backgroundColor="black"
        @tap="updateAdress"
      ></Button>
      <Button row="4"
      v-else
        :isEnabled="!fields"
        class="-primary -rounded-lg"
        text="Salvar"
        color="white"
        backgroundColor="black"
        @tap="saveAddress"
      ></Button>
        </GridLayout>

      <GridLayout
        v-for="a in adresses"
        :key="a._id"
        backgroundColor="white"
        androidElevation="2" 
        margin="10"
        rows="auto, auto, auto"
        columns="auto, auto, *"
      >
        <Label marginLeft="8"  col="0" row="0" text="Endereço:" fontSize="18" fontWeight="700" textWrap="true" />
        <Label marginLeft="8" col="1" row="0" :text="a.name" fontSize="18" textWrap="true" />
        <Label marginLeft="8" col="0" row="1" text="Referencia: " fontSize="18" fontWeight="700" textWrap="true" />
        <Label marginLeft="8" col="1" row="1" :text="a.reference" fontSize="18" textWrap="true" />
        <Label marginLeft="8" col="0" row="2" text="Obs: " fontSize="18" fontWeight="700" textWrap="true" />
        <Label marginLeft="8" col="1" row="2" :text="a.obs" fontSize="18" textWrap="true" />
      </GridLayout>
      <!-- <Button class="-primary -rounded-lg" text="Large rounded corners" @tap="login"></Button> -->
    </StackLayout>
    </Page>
</template>
<script>
import * as httpModule from "tns-core-modules/http";
import * as Toast from "nativescript-toast";
const appSettings = require("tns-core-modules/application-settings");

export default {
  props: ["objAddress"],
  data() {
    return {
      actionTitle: "Novo Endereço",
      processing: false,
      adresses: [],
      name: "",
      reference: "",
      obs: "",
      btnEnabled: false
    };
  },

  mounted() {
    if (this.obsObjAddress != undefined) {
      this.actionTitle = "Editando endereço";
    }
    console.log(this.obsObjAddress);
  },

  computed: {
    obsObjAddress() {
      return this.objAddress;
    },

    fields() {
      return this.name == "" || this.reference == "";
    }
  },

  methods: {
    saveAddress() {
      this.processing = true;
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("reference", this.reference);
      formData.append("obs", this.obs);

      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "adresses",
          method: "POST",
          content: formData
        })
        .then(
          response => {
            this.name = "";
            this.reference = "";
            this.obs = "";
            Toast.makeText("Novo endereço salvo!", "long").show();
            this.adresses.unshift(response.content.toJSON());
            this.processing = false;
            console.log(response.content.toJSON());
          },
          e => {
            console.log(e);
          }
        );
    },

    updateAdress() {
      this.processing = true;
      var formData = new FormData();
      formData.append("name", this.obsObjAddress.name);
      formData.append("reference", this.obsObjAddress.reference);
      formData.append("obs", this.obsObjAddress.obs);

      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "adresses/" + this.obsObjAddress._id,
          method: "PUT",
          content: formData
        })
        .then(
          response => {
            Toast.makeText("Endereço editado!", "long").show();
            this.adresses.unshift(response.content.toJSON());
            this.processing = false;
            console.log(response.content.toJSON());
          },
          e => {
            console.log(e);
          }
        );
    }
  }
};
</script>