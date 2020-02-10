<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton ios:visibility="collapsed" icon="res://menu" @tap="onDrawerButtonTap"></NavigationButton>
      <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <ActionItem
        icon="res://menu"
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>

      <Label class="action-bar-title" text="Search"></Label>
    </ActionBar>

    <ScrollView>
      <StackLayout class="nt-form">
        <TextField
          ref="searchBar"
          v-model="name"
          hint="Buscar um endereço"
          class="-rounded m-t-10"
        />
        <Button
          :isEnabled="btnEnable"
          class="-primary -rounded-lg"
          :text="btnText"
          :color="btnTextColor"
          backgroundColor="black"
          @tap="searchAddress"
        ></Button>

        <Button
          class="-primary -rounded-lg"
          text="Novo endereço"
          color="white"
          backgroundColor="black"
          @tap="goTOnewAdress"
        ></Button>

        <GridLayout
          bordercolor="red"
          v-for="a in adresses"
          :key="a._id"
          backgroundColor="white"
          androidElevation="2"
          margin="10"
          rows="*, *, *"
          columns="auto, *, auto"
        >
          <Label
            marginLeft="8"
            col="0"
            row="0"
            text="Endereço:"
            fontSize="18"
            fontWeight="700"
            textWrap="true"
          />

          <Label marginLeft="2" col="1" row="0" :text="a.name" fontSize="16" textWrap="true" />

          <Label
            text="Referencia: "
            fontWeight="700"
            textWrap="true"
            marginLeft="8"
            fontSize="18"
            col="0"
            row="1"
          />

          <Label marginLeft="2" col="1" row="1" :text="a.reference" fontSize="16" textWrap="true" />
          <Label
            fontWeight="700"
            textWrap="true"
            marginLeft="8"
            fontSize="18"
            text="Obs: "
            col="0"
            row="2"
          />
          <Label
            v-if="a.obs == undefined"
            textWrap="true"
            marginLeft="2"
            fontSize="18"
            text="---"
            col="1"
            row="2"
          />

          <Label v-else marginLeft="8" col="1" row="2" :text="a.obs" fontSize="16" textWrap="true" />

          <Button col="2" row="2" height="40" width="40" text="Edit" @tap="updateAddress(a)" />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as httpModule from "tns-core-modules/http";
const appSettings = require("tns-core-modules/application-settings");

import * as utils from "~/shared/utils";
import * as Toast from "nativescript-toast";
import SelectedPageService from "../../shared/selected-page-service";
import NewAddress from "../adresses/NewAdress";

export default {
  data() {
    return {
      name: "",
      adresses: [],
      btnEnable: false,
      btnTextColor: "red",
      btnText: "Digite um endereço"
    };
  },
  comments: {
    NewAddress
  },

  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Search");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },

  watch: {
    name(newName) {
      if (this.name == "") {
        this.btnEnable = false;
        this.btnTextColor = "red";
        this.btnText = "Digite um endereço";
      } else {
        this.btnEnable = true;
        this.btnTextColor = "white";
        this.btnText = "Buscar";
      }
    }
  },

  methods: {
    updateAddress(a) {
      this.$navigateTo(NewAddress, {
        clearHistory: false,
        transition: {
          name: "slide"
        },

        props: { objAddress: a }
      });
    },

    goTOnewAdress() {
      this.$navigateTo(NewAddress, {
        clearHistory: false,
        transition: {
          name: "slide"
        }
      });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },

    doneTap(args) {
      var myTextField = args.object;
      myTextField.dismissSoftkeyboard();
    },

    searchAddress() {
      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "getAddress/" + this.name,
          method: "GET"
        })
        .then(
          response => {
            this.adresses = response.content.toJSON();
            if (response.content.toJSON()[0] == undefined) {
              Toast.makeText("Nenhum endereço encontrado", "long").show();
            } else {
              Toast.makeText(
                response.content.toJSON().length + " endereços encontrados",
                "long"
              ).show();
              this.$refs.searchBar.nativeView.dismissSoftInput();
            }
          },
          e => {
            console.log(e);
          }
        );
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
.nt-form {
  font-family: "Nunito-Regular";
}
</style>
