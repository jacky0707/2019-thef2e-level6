<template>
  <v-container>
    <v-row>
      <v-col cols="7" ref="card" class="pb-0">
        <v-card>
          <v-img class="white--text" src="../assets/desktop_img.png"></v-img>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card class="overflow" flat :height="cardHeight">
          <v-col v-for="(item, index) in roomPictures" :key="index" class="pt-0">
            <v-hover v-slot:default="{ hover }">
              <v-card :elevation="hover ? 10 : 0" class="cursor">
                <v-img
                  class="white--text"
                  :src="item"
                  @click="getRoomInfo(index)"
                  aspect-ratio="1.5"
                ></v-img>
              </v-card>
            </v-hover>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      API: "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms",
      roomPictures: [],
      roomId: [],
      token: process.env.VUE_APP_MY_TOKEN,
      cardHeight: 0
    };
  },
  created() {
    this.axios.get(this.API).then(response => {
      response.data.items.map(room => {
        this.roomPictures.push(room.imageUrl);
        this.roomId.push(room.id);
      });
      console.log(response.data);
      this.cardHeight = this.$refs.card.clientHeight;
    });
  },
  methods: {
    getRoomInfo(roomIdIndex) {
      let roomId = this.roomId[roomIdIndex];
      this.$router.push(`/room/${roomId}`);
    }
  }
};
</script>
<style scoped>
.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}
.cursor {
  cursor: pointer;
}
</style>