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
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
        icon="res://menu"
      ></ActionItem>
      <Label class="action-bar-title" text="Shopping"></Label>
    </ActionBar>

    <ScrollView>
      <StackLayout>
        <GridLayout rows="70" columns="* *">
          <AbsoluteLayout
            backgroundColor="white"
            androidElevation="10"
            @tap="loadItems(0)"
            borderRadius="5"
            margin="5"
            col="0"
          >
            <Label text="Motos" top="15" right bottom left="60" />
          </AbsoluteLayout>
          <AbsoluteLayout
            backgroundColor="white"
            androidElevation="10"
            @tap="loadItems(1)"
            borderRadius="5"
            margin="5"
            col="1"
          >
            <Label text="Acessorios" top="15" right bottom left="50" />
          </AbsoluteLayout>
        </GridLayout>
        <ActivityIndicator v-if="processing" color="green" busy="true"></ActivityIndicator>
        <GridLayout
          backgroundColor="white"
          androidElevation="10"
          v-for="i in items"
          rows="60 500 50"
          borderRadius="5"
          :key="i._id"
          columns="*"
          margin="5"
        >
          <Label row="0" :text="i.description" textWrap="true" />
          <GridLayout row="1" rows="* auto" columns>
            <Image row="0" :src="$root.s3 + i.photos[0]" stretch="aspectFill" />
            <ScrollView row="1">
              <AbsoluteLayout>
                <Image
                  :src="$root.s3 + i.photos[0]"
                  v-for="p in i.photos"
                  stretch="aspectFill"
                  :key="p"
                />
              </AbsoluteLayout>
            </ScrollView>
          </GridLayout>

          <GridLayout row="2" rows="*" columns="*, *">
            <Button fontFamily="Nunito-Bold" col="0" text="Comprar" @tap="byProduct(i._id)" />

            <Label
              :text="'R$ ' + i.price"
              textAlignment="right"
              paddingRight="8"
              textWrap="true"
              paddingTop="12"
              color="green"
              col="1"
            />
          </GridLayout>
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import * as httpModule from "tns-core-modules/http";
const appSettings = require("tns-core-modules/application-settings");

import SelectedPageService from "../../shared/selected-page-service";

export default {
  data() {
    return {
      processing: true,
      items: []
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Shopp");

    httpModule
      .request({
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + appSettings.getString("api_token")
        },
        url: this.$root.host + "products/0",
        method: "GET"
      })
      .then(
        response => {
          // Argument (response) is HttpResponse
          console.log(response.content.toJSON());
          this.items = response.content.toJSON();
          this.processing = false;
        },
        e => {}
      );
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    byProduct(id) {
      this.$navigateTo(ByProduct, {
        clearHistory: false,
        props: { id: id }
      });
    },

    loadItems(type) {
      this.processing = true;
      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "products/" + type,
          method: "GET"
        })
        .then(
          response => {
            // Argument (response) is HttpResponse
            console.log(response.content.toJSON());
            this.items = response.content.toJSON();
            this.processing = false;
          },
          e => {}
        );
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

label {
  font-family: "Nunito-Regular";
  font-size: 16;
}
</style>
