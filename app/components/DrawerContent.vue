<template lang="html">
<GridLayout rows="auto, *" class="nt-drawer__content">
            <StackLayout v-if="$root.isLoged" row="0" class="nt-drawer__header">
                <Image v-if="avatar == null" Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;"></Image>
                <Image v-else class="nt-drawer__header-image fas t-36" :src="$root.host + avatar"></Image>
                <Label class="nt-drawer__header-brand" :text="$root.user.name"></Label>
                <Label class="nt-drawer__header-footnote" :text="$root.user.email"></Label>
            </StackLayout>
            <StackLayout v-if="!$root.isLoged" row="0" class="nt-drawer__header">
                <Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;"></Image>
                <Label class="nt-drawer__header-brand" text="Faça login"></Label>
                <!-- <Label class="nt-drawer__header-footnote" text="username@mail.com"></Label> -->
                <Button text="Fazer Login" @tap="logout" />
                
            </StackLayout>
        
            <ScrollView row="1" class="nt-drawer__body">
                <StackLayout>
                    <GridLayout v-if="$root.isLoged" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Home' ? ' -selected': '')" @tap="onNavigationItemTap(Home)">
                        <Label col="0" text.decode="&#xf015;" class="nt-icon fas"></Label>
                        <Label col="1" text="Feeds" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout v-if="$root.isLoged" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Search' ? ' -selected': '')" @tap="onNavigationItemTap(Search)">
                        <Label col="0" text.decode="&#xf002;" class="nt-icon fas"></Label>
                        <Label col="1" text="Endereços" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout v-if="$root.isLoged" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Shopp' ? ' -selected': '')" @tap="onNavigationItemTap(Shopp)">
                        <Label col="0" text.decode="&#xf005;" class="nt-icon fas"></Label>
                        <Label col="1" text="Shopping" class="p-r-10"></Label>
                    </GridLayout>
        
                    <StackLayout class="hr"></StackLayout>

                    <GridLayout v-if="$root.isLoged" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Settings' ? ' -selected': '')" @tap="onNavigationItemTap(Settings)">
                        <Label col="0" text.decode="&#xf013;" class="nt-icon fas"></Label>
                        <Label col="1" text="Settings" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout v-if="$root.isLoged" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Login' ? ' -selected': '')" @tap="logout">
                        <Label col="0" text.decode="&#xf013;" class="nt-icon fas"></Label>
                        <Label col="1" color="red" text="Logout" class="p-r-10"></Label>
                    </GridLayout>
                    <!-- <Button class="noyhiing" text="Fazer Login" @tap="logout" /> -->


                </StackLayout>
            </ScrollView>
        </GridLayout>
</template>

<script>
import Home from "./posts/Home";
import Login from "./Login";
import Search from "./adresses/Search";
import Shopp from "./shopping/Shopp";
import Settings from "./users/Settings";
import * as utils from "~/shared/utils";
import SelectedPageService from "~/shared/selected-page-service";
const appSettings = require("tns-core-modules/application-settings");

export default {
  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      selectedPage => (this.selectedPage = selectedPage)
    );
  },
  data() {
    return {
      name: appSettings.getString("name"),
      email: appSettings.getString("email"),
      appSettings: appSettings.getString("api_token"),
      avatar: appSettings.getString("avatar"),
      Home: Home,
      Login: Login,
      Search: Search,
      Shopp: Shopp,
      Settings: Settings,
      selectedPage: "",
      url: " http://192.168.43.37:8000/"
    };
  },
  components: {
    Login,
    Home,
    Search,
    Settings,
    Shopp
  },

  methods: {
    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: true
      });
      utils.closeDrawer();
    },

    logout() {
      this.$navigateTo(Login, {
        clearHistory: true
      });
      utils.closeDrawer();
      appSettings.clear();
      this.$root.isLoged = false;
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
