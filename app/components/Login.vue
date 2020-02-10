<template lang="html">
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
      <Label class="action-bar-title" text="Login"></Label>
    </ActionBar>
        <StackLayout class="nt-form" marginTop="250">
          <GridLayout rows="auto auto auto" columns="">
            <TextField row="0" :isEnabled="!processing" v-model="email" hint="Email" class="-rounded m-t-10" />
            <!-- <Label v-if="messageEmail" color="red" marginLeft="248" marginTop="25" row="0" text="Preencha os campos" textWrap="true" /> -->
            <TextField row="1" :isEnabled="!processing" v-model="password" hint="Senha" class="-rounded m-t-10" />
            <!-- <Label v-if="messagePassword" color="red" marginLeft="248" marginTop="25" row="1" text="Preencha os campos" textWrap="true" /> -->
            <ActivityIndicator row="2" color="black" v-if="processing" busy="true"></ActivityIndicator>
            <Button row="2" :isEnabled="!processing" backgroundColor="black" color="white" class="-primary -rounded-lg" :text="LoginText" @tap="login"></Button>
          </GridLayout>
        <!-- <Button class="-primary -rounded-lg" text="Large rounded corners" @tap="login"></Button> -->
    </StackLayout>
    </Page>
</template>
<script>
import * as httpModule from "tns-core-modules/http";
import App from "./App";
import Home from "./posts/Home";
import DrawerContent from "./DrawerContent";

import * as utils from "~/shared/utils";
import SelectedPageService from "~/shared/selected-page-service";

const appSettings = require("tns-core-modules/application-settings");

export default {
  data() {
    return {
      DrawerContent: DrawerContent,
      Home: Home,
      email: "",
      password: "",
      LoginText: "Login",
      processing: false
    };
  },

  components: {
    App,
    Home,
    DrawerContent
  },

  computed: {
    message() {
      return "<!--Login -->";
    }
  },

  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      selectedPage => (this.selectedPage = selectedPage)
    );
  },

  methods: {
    login() {
      this.processing = true;
      this.LoginText = "";

      var formData = new FormData();
      formData.append("email", this.email);
      formData.append("password", this.password);

      httpModule
        .request({
          url: this.$root.host + "login",
          method: "POST",
          content: formData
        })
        .then(
          response => {
            this.processing = false;
            this.LoginText = "Login";

            if (response.statusCode == 200) {
              console.log(response.content.toJSON());
              appSettings.clear();
              appSettings.setString(
                "api_token",
                response.content.toJSON().api_token
              );
              appSettings.setString("name", response.content.toJSON().name);
              appSettings.setString("email", response.content.toJSON().email);
              appSettings.setString("user_id", response.content.toJSON()._id);
              this.$root.isLoged = true;
              this.$root.user = response.content.toJSON();
              this.onNavigationItemTap(Home);
            } else {
              console.log(response.content.toJSON());
              alert("Acesso negado");
            }
          },
          e => {
            console.log(e);
          }
        );
    },

    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: true
      });
      utils.closeDrawer();
    },

    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>