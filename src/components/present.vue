<template>
  <div id="player"></div>
</template>
<script>
import { getToken } from "../utils/api";
import md5 from "js-md5";
import VConsole from 'vconsole';

export default {
  data() {
    return {
      vodPlayerJs: 'https://player.polyv.net/resp/vod-player/latest/player.js',
      vid: 'vid',
      ts:'',
      secretKey : "secretKey",
      userId : "userId"
    };
  },

  mounted() {
    this.ts=new Date().getTime();
    this.loadPlayerScript(this.loadPlayer);
    new VConsole();

  },

  methods: {
    loadPlayerScript(callback) {
      if (!window.polyvPlayer) {
        const myScript = document.createElement('script');
        myScript.setAttribute('src', this.vodPlayerJs);
        myScript.onload = callback;
        document.body.appendChild(myScript);
      } else {
        callback();
      }
    },

    loadPlayer() {
      const videoId = this.vid;
      const ts = this.ts;
      const secretKey = this.secretKey
      const sign = md5(`${secretKey}${videoId}${ts}`);
      const polyvPlayer = window.polyvPlayer;
      let _that = this;
      this.getPlaySafeToken().then(res => {
        _that.player = polyvPlayer({
          wrap: '#player',
          width: 800,
          height: 533,
          vid: this.vid,
          playsafe: res.data.token,
          ts:ts,
          sign:sign
        });
      });
    },

    getPlaySafeToken() {
      const videoId = this.vid;
      const userId = this.userId;
      const ts = this.ts;
      const secretKey = this.secretKey
      const sign = md5(`${secretKey}ts${ts}userId${userId}videoId${videoId}${secretKey}`).toUpperCase();
      return getToken({
        userId,
        videoId,
        ts,
        sign
      })
    }
  },
  destroyed() {
    if (this.player) {
      this.player.destroy();
    }
  }
};
</script>
