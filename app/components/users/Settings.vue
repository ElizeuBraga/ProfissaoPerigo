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
      <Label class="action-bar-title" text="Settings"></Label>
    </ActionBar>

    <GridLayout colums="auto" rows="auto auto auto auto auto auto" class="gl">
      <Image
        class="nt-drawer__header-image fas t-36"
        v-if="$root.user.avatar == null"
        src.decode="font://&#xf2bd;"
        @tap="changeImageProfile"
        row="0"
      ></Image>

      <TextField
        :isEnabled="!processing"
        class="-rounded m-t-10"
        v-model="user.name"
        col="0"
        row="1"
      />
      <TextField
        :isEnabled="!processing"
        class="-rounded m-t-10"
        v-model="user.email"
        col="0"
        row="2"
      />
      <TextField :isEnabled="!processing" col="0" row="3" hint="******" class="-rounded m-t-10" />
      <TextField :isEnabled="!processing" col="0" row="4" hint="******" class="-rounded m-t-10" />

      <ActivityIndicator row="5" col="0" color="black" v-if="processing" busy="true"></ActivityIndicator>

      <Button
        class="-primary -rounded-lg"
        :isEnabled="!processing"
        backgroundColor="black"
        @tap="updateUser"
        text="Salvar"
        color="white"
        col="0"
        row="5"
      ></Button>
    </GridLayout>
  </Page>
</template>

<script>
import { AnimationCurve } from "tns-core-modules/ui/enums";
const appSettings = require("tns-core-modules/application-settings");
import * as httpModule from "tns-core-modules/http";
import ChangeProfileAvatar from "./ChangeProfile";
import * as utils from "~/shared/utils";
import SelectedPageService from "../../shared/selected-page-service";
import {
  CFAlertDialog,
  DialogOptions,
  CFAlertGravity,
  CFAlertActionAlignment,
  CFAlertActionStyle,
  CFAlertStyle
} from "nativescript-cfalert-dialog";

import { Color } from "tns-core-modules/color";

export default {
  data() {
    return {
      changeProfile: ChangeProfileAvatar,
      user: {},
      processing: false
    };
  },
  mounted() {
    this.user = this.$root.user;
    SelectedPageService.getInstance().updateSelectedPage("Settings");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    changeImageProfile() {
      console.log(this.user.name);
      this.$showModal(ChangeProfileAvatar);
    },

    onDrawerButtonTap() {
      utils.showDrawer();
    },

    updateUser() {
      this.processing = true;
      console.log("Atualizando");

      var formData = new FormData();
      formData.append("name", this.user.name);
      formData.append("email", this.user.email);

      let vm = this;
      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "users/update",
          method: "PUT",
          content: formData
        })
        .then(
          response => {
            this.processing = false;
            this.$root.user = response.content.toJSON();
            this.user = response.content.toJSON();
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
</style>
