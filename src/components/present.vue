<template>
  <div id="player"></div>
</template>
<script>
import { getToken } from "../utils/api";
import md5 from "js-md5";
import VConsole from "vconsole";

export default {
  data() {
    return {
      vodPlayerJs:
        "https://player.polyv.net/resp/vod-player-drm/canary/player.js",
      vid: "b6d4af75ee39b19f36bd21ce74eb14fc_b",
      ts: "",
      secretKey: "kfwPIfszUx",
      userId: "b6d4af75ee",
    };
  },

  mounted() {
    this.ts = new Date().getTime();
    new VConsole();
    this.loadPlayerScript(this.loadPlayer);
    // this.player.on("s2j_onPlayOver", function (e) {
    //   console.log("bofanl");
    //   // this.player.j2s_seekVideo(100);
    // });
  },

  methods: {
    loadPlayerScript(callback) {
      if (!window.polyvPlayer) {
        const myScript = document.createElement("script");
        myScript.setAttribute("src", this.vodPlayerJs);
        myScript.onload = callback;
        document.body.appendChild(myScript);
      } else {
        callback();
      }
    },
    //  reloadVideo () {
    //  this.player.j2s_seekVideo(0);
    //  this.player.j2s_resumeVideo()
    // },

    async loadPlayer() {
      const videoId = this.vid;
      const ts = this.ts;
      const secretKey = this.secretKey;
      const sign = md5(`${secretKey}${videoId}${ts}`);
      await this.getPlaySafeToken().then((res) => {
        this.player = polyvPlayer({
          wrap: "#player",
          width: 800,
          height: 533,
          vid: this.vid,
          playsafe: res.data.token,
          ts: ts,
          sign: sign,
          // preview:true
          // loop:true
        });
      });
      console.log(this.player);
    },

    getPlaySafeToken() {
      const videoId = this.vid;
      const userId = this.userId;
      const ts = this.ts;
      const secretKey = this.secretKey;
      const viewerId = "testviewerid";
      const sign = md5(
        `${secretKey}ts${ts}userId${userId}videoId${videoId}viewerId${viewerId}${secretKey}`
      ).toUpperCase();
      return getToken({
        userId,
        videoId,
        viewerId,
        ts,
        sign,
      });
    },
  },
  destroyed() {
    if (this.player) {
      this.player.destroy();
    }
  },
};
</script>
