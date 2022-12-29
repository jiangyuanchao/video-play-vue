<template>
  <div id="player"></div>
</template>
<script>
import { getToken } from "../utils/api";
import md5 from "js-md5";

export default {
  data() {
    return {
      vodPlayerJs: 'https://player.polyv.net/resp/vod-player-drm/canary/player.js',
      vid: 'b6d4af75eedda92e637bb8760b0524dc_b'    
    };
  },

  mounted() {
    this.loadPlayerScript(this.loadPlayer);
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
      const polyvPlayer = window.polyvPlayer;
      let _that = this;
      this.getPlaySafeToken().then(res => {
        _that.player = polyvPlayer({
          wrap: '#player',
          width: 800,
          height: 533,
          vid: this.vid,
          playsafe: res.data.token
        });
      });

    },

    getPlaySafeToken() {
      const videoId = this.vid;
      const viewerId = "100002159814988794424115311";
      const secretKey = "kfwPIfszUx";
      const userId = "b6d4af75ee";
      const ts = new Date().getTime();
      const sign = md5(`${secretKey}ts${ts}userId${userId}videoId${videoId}viewerId${viewerId}${secretKey}`).toUpperCase();
      return getToken({
        userId,
        videoId,
        viewerId,
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
