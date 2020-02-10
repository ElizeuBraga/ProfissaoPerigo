import Vue from "nativescript-vue";
import App from "./components/App";
import Login from "./components/Login";
import Home from "./components/posts/Home";
import DrawerContent from "./components/DrawerContent";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
const appSettings = require('tns-core-modules/application-settings');
Vue.use(RadSideDrawer);

import { Gif } from "nativescript-gif";

Vue.registerElement("Gif", () => Gif);

Vue.registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);

Vue.config.silent = (TNS_ENV === 'production');

// appSettings.clear();

new Vue({
  data() {
    return {
      user: {

      },
      // s3: 'https://profissaoperigo.s3.us-east-1.amazonaws.com',
      s3: 'https://profissaoperigo.s3.amazonaws.com/',
      // s3: 'http://192.168.1.4:8000',
      // host: 'http://192.168.1.4:8000/api/',
      host: 'https://profissaoperigo.herokuapp.com/api/',
      isLoged: false,
    }
  },

  comments: {
    Login
  },

  created() {
    if (appSettings.getString('api_token') != undefined) {
      this.isLoged = true
    } else {
      appSettings.clear()
      this.$root.isLoged = false
    }
  },

  methods: {
    teste() {
      alert('Oi')
    }
  },

  render(h) {
    return h(
      App,
      [
        h(DrawerContent, { slot: 'drawerContent' }),
        h(Home, { slot: 'mainContent' }),
        // h(Login, { slot: 'loginContent' }),
      ])
  }
}).$start();
