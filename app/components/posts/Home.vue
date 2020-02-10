<template>
  <Page class="page" xmlns:VideoPlayer="nativescript-videoplayer">
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
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>
    <GridLayout>
      <ScrollView>
        <StackLayout>
          <ActivityIndicator v-if="processing" row="1" col="0" color="green" busy="true"></ActivityIndicator>
          <GridLayout
            androidElevation="0"
            borderWidth="0 0 2 0"
            v-for="p in posts"
            rows="* auto 50"
            :key="p._id"
          >
            <GridLayout row="0">
              <Label class="title" :text="p.title" textWrap="true" />
            </GridLayout>

            <Image row="1" :src="$root.s3 + p.file_path" stretch="aspectFit" margin="0"></Image>
            <GridLayout marginBottom="5" row="2" rows="auto" columns="* * *">
              <Button
                text.decode="&#xf062;"
                androidElevation="0"
                class="nt-icon fas"
                @tap="votes(p,1)"
                color="green"
                col="0"
              />

              <Label
                class="nt-icon fas"
                marginLeft="70"
                textWrap="true"
                :text="p.like"
                marginTop="8"
                col="0"
              />

              <Button
                androidElevation="0"
                text.decode="&#xf063;"
                class="nt-icon fas"
                @tap="votes(p,0)"
                col="1"
                color="red"
              />

              <Label
                class="nt-icon fas"
                :text="p.unlike"
                textWrap="true"
                marginLeft="70"
                marginTop="8"
                col="1"
              />

              <Button
                text.decode="&#xf4ad;"
                @tap="onTapComent(p)"
                class="nt-icon fas"
                androidElevation="0"
                color="blue"
                col="2"
              />

              <Label
                class="nt-icon fas"
                :text="p.countComent"
                textWrap="true"
                marginLeft="70"
                marginTop="8"
                col="2"
              />
            </GridLayout>
          </GridLayout>
        </StackLayout>
      </ScrollView>

      <AbsoluteLayout marginLeft="300" marginTop="600">
        <Button
          backgroundColor="gray"
          @tap="selectPicture"
          v-if="btnPosActive"
          paddingBottom="8"
          borderRadius="50"
          fontSize="30"
          color="white"
          height="70"
          text="+"
          width="70"
        ></Button>
      </AbsoluteLayout>
    </GridLayout>
  </Page>
</template>

<script>
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import Image from "tns-core-modules/ui/image";
var bghttp = require("nativescript-background-http");
var session = bghttp.session("image-upload");
import * as httpModule from "tns-core-modules/http";
import * as utils from "~/shared/utils";
import SelectedPageService from "../../shared/selected-page-service";
import DrawerContent from "../DrawerContent";
import NewPost from "./NewPost";
import Login from "./../Login";
import * as Toast from "nativescript-toast";
const appSettings = require("tns-core-modules/application-settings");
import VideoPlayer from "nativescript-videoplayer";
import Comments from "./Comments";
var noiceimagePicker = require("nativescript-noice-image-picker");
const SwipeDirection = require("tns-core-modules/ui/gestures").SwipeDirection;

export default {
  props: ["data"],
  data() {
    return {
      imgPosition: 0,
      file: null,
      liked: true,
      comentsModal: Comments,
      DrawerContent: DrawerContent,
      posts: [],
      likeLoad: true,
      log: [],
      btnPosActive: true,
      isLoading: true,
      processing: true
    };
  },

  components: {
    Login,
    Comments,
    NewPost,
    DrawerContent
  },

  mounted() {
    console.log(this.data);
    SelectedPageService.getInstance().updateSelectedPage("Home");

    let vm = this;

    httpModule
      .request({
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + appSettings.getString("api_token")
        },
        url: this.$root.host + "posts",
        method: "GET"
      })
      .then(
        response => {
          if (response.statusCode == 401) {
            this.onNavigationItemTap(Login);
            Toast.makeText("Autentique-se", "long").show();
          }
          this.posts = response.content.toJSON();
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

  watch: {
    isLoading(teste) {
      console.log("Parei de carregas" + teste);
    }
  },

  methods: {
    showImage(i) {
      this.imgPosition = i;
    },

    selectPicture() {
      let vm = this;

      let context = imagepicker.create({
        // mode: 'multiple'
        mode: "single"
      });

      context
        .authorize()
        .then(function() {
          return context.present();
        })
        .then(function(selection) {
          selection.forEach(function(selected) {
            vm.file = selected;
          });

          vm.$navigateTo(NewPost, {
            clearHistory: false,
            props: { file: vm.file }
          });
        })
        .catch(function(e) {
          // process error
        });
    },

    votes(p, vote) {
      if (vote == 1) {
        p.like += 1;
      } else {
        p.unlike += 1;
      }
      var formData = new FormData();
      formData.append("vote", vote);

      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "posts/" + p._id,
          method: "PUT",
          content: formData
        })
        .then(
          response => {},
          e => {
            console.log(e);
          }
        );
    },

    onScroll: function(event) {
      event.nativeElement;
    },

    onDrawerButtonTap() {
      utils.showDrawer();
    },

    iconFromCode(code) {
      return String.fromCharCode(code);
    },

    onTapFile() {
      alert("Voce clicou no post");
    },

    onTapName() {
      alert("Voce clicou no no nome");
    },

    onTapComent(p) {
      console.log(p);
      this.$navigateTo(Comments, {
        clearHistory: false,
        props: { post: p }
      });
    },

    newPost() {
      this.$navigateTo(NewPost, {
        clearHistory: false
      });
    },

    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: true
      });
      utils.closeDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
GridLayout {
  border-radius: 2;
  width: 100%;
}

.title {
  font-family: "Nunito-Bold";
  font-size: 17;
}

.post-date {
  color: blue;
}

.like {
  margin-top: 5;
  text-align: center;
  color: green;
}

.unlike {
  margin-top: 5;
  text-align: center;
  color: red;
}

.coment {
  margin-top: 5;
  text-align: center;
  color: blue;
}
</style>
