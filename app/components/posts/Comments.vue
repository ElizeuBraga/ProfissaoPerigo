<template>
  <Page>
    <ActionBar title="Comments" />
    <ScrollView>
      <StackLayout>
        <GridLayout rows="* *" columns="*">
          <GridLayout row="0" rows="*" columns="*" margin="2">
            <Image col="0" row="0" :src="$root.s3 + post.file_path" stretch="aspectFit" />
          </GridLayout>
          <GridLayout row="1" rows="auto" columns="* auto" margin="2">
            <TextField
              hint="Seja o primeiro a comentar"
              v-if="comments.length == 0"
              class="-rounded m-t-10"
              ref="fieldComment"
              v-model="body"
              width="100%"
              row="0"
              col="0"
            />
            <TextField
              hint="Faça um comentario"
              class="-rounded m-t-10"
              ref="fieldComment"
              v-model="body"
              width="100%"
              row="0"
              col="0"
              v-else
            />
            <Button :isEnabled="!btnEnable" row="0" col="1" text="Enviar" @tap="sendComent" />
          </GridLayout>
        </GridLayout>
        <ActivityIndicator row="2" color="black" v-if="processing" busy="true"></ActivityIndicator>

        <Label v-if="comments.length == 0" text="Nenhum comentario" textWrap="true" />

        <GridLayout v-else v-for="c in comments" :key="c._id" rows="auto * auto" margin="2">
          <GridLayout row="0" rows="*" columns="*">
            <Label
              fontFamily="Nunito-ExtraBold"
              v-if="eu == c.user_id"
              textWrap="true"
              text="Eu"
              col="0"
              row="0"
            />
            <Label
              fontFamily="Nunito-ExtraBold"
              v-if="eu != c.user_id"
              :text="c.user_name"
              textWrap="true"
              col="0"
              row="0"
            />
          </GridLayout>

          <GridLayout row="1" rows="*">
            <Label
              fontFamily="Nunito-Regular"
              textWrap="true"
              :text="c.body"
              fontSize="14"
              col="0"
              row="0"
            />
          </GridLayout>
          <StackLayout row="2" class="hr"></StackLayout>
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script>
const appSettings = require("tns-core-modules/application-settings");
import * as httpModule from "tns-core-modules/http";

export default {
  props: ["post"],
  data() {
    return {
      eu: appSettings.getString("user_id"),
      body: "",
      processing: true,
      comments: []
    };
  },

  mounted() {
    httpModule
      .request({
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + appSettings.getString("api_token")
        },
        url: this.$root.host + "comments/" + this.post._id,
        method: "GET"
      })
      .then(
        response => {
          this.comments = response.content.toJSON();
          this.processing = false;
        },
        e => {
          console.log(e);
        }
      );
  },

  computed: {
    btnEnable() {
      return this.body == "";
    }
  },

  methods: {
    sendComent() {
      var formData = new FormData();
      formData.append("body", this.body);
      formData.append("post_id", this.post._id);

      httpModule
        .request({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + appSettings.getString("api_token")
          },
          url: this.$root.host + "comments/",
          method: "POST",
          content: formData
        })
        .then(
          response => {
            this.body = "";
            this.comments.unshift(response.content.toJSON());
            this.$refs.fieldComment.nativeView.dismissSoftInput();
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
label {
  font-family: "Nunito-Rregular";
}
</style>