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
      <Label class="action-bar-title" text="NewPost"></Label>
    </ActionBar>

    <StackLayout>
      <GridLayout rows="auto auto auto auto" columns>
        <Label row="0" :text="title" textWrap="true" />
        <Image row="1" :src="file.android" stretch="aspectFit" />
        <TextField row="2" hint="Titulo da imagem" class="-rounded m-t-10" v-model="title" />
        <Button row="3" text="Postar" @tap="sendPicture" />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../../shared/selected-page-service";
import * as httpModule from "tns-core-modules/http";
import Home from "./Home";
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import Image from "tns-core-modules/ui/image";
var bghttp = require("nativescript-background-http");
var session = bghttp.session("image-upload");
const appSettings = require("tns-core-modules/application-settings");

import noiceimagePicker from "nativescript-noice-image-picker";

export default {
  props: ["file"],
  data() {
    return {
      title: "",
      request: {
        url: this.$root.host + "posts",
        method: "POST",
        headers: {
          Authorization: "Bearer " + appSettings.getString("api_token")
          // "Content-Type": "application/octet-stream"
        },
        // androidAutoClearNotification: true,
        description: "Uploading "
      }
    };
  },

  components: {
    Home
  },

  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("NewPost");
  },
  computed: {
    message() {
      return "<!-- New Post-->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },

    sendPicture() {
      console.log(this.images);
      var params = [
        { name: "title", value: this.title },
        { name: "file", filename: this.file.android }
      ];
      var task = session.multipartUpload(params, this.request);
      var data = null;

      task.on("responded", res => {
        data = res.data;

        console.log(data);
      });
      this.$navigateTo(Home, {
        clearHistory: true,

        props: { data: data }
      });
    },

    takePicture() {
      camera
        .requestPermissions()
        .then(() => {
          camera
            .takePicture({
              width: 300,
              height: 300,
              keepAspectRatio: true,
              saveToGallery: true
            })
            .then(imageAsset => {
              this.file = imageAsset;

              // console.log(imageAsset);
            })
            .catch(e => {
              console.log("error:", e);
            });
        })
        .catch(e => {
          console.log("Error requesting permission");
        });
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
