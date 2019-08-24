<template>
  <v-container>
    <v-row>
      <v-col cols="7">
        <v-img :src="watchingPicUrl" aspect-ratio="1.5"></v-img>
        <v-row>
          <v-col cols="3" v-for="(url,index) in roomPictures" :key="index">
            <v-img
              :src="roomPictures[index]"
              aspect-ratio="1.5"
              @click="changeWatchingPic(roomPictures[index])"
            ></v-img>
          </v-col>
        </v-row>
        <v-card color="transparent" flat>
          <v-row dense>
            <v-col class="col-sm-6 col-12">
              <v-card color="transparent" flat class="font-weight-black">
                <v-card-text class="pt-0">Check-in time: {{checkInTime.from}}~{{checkInTime.to}}</v-card-text>
                <v-card-text class="pt-0">Check-out time: {{checkOutTime}}</v-card-text>
                <v-card-text class="pt-0">人數限制: {{guestAmount.min}}~{{guestAmount.max}}</v-card-text>
                <v-card-text class="pt-0">床型: {{bed.join(" & ")}}</v-card-text>
                <v-card-text class="pt-0">衛浴數量: {{privateBath}}</v-card-text>
                <v-card-text class="pt-0">房間大小: {{footage}} 平方米</v-card-text>
                <v-card-text class="pt-0">描述: {{description}}</v-card-text>
              </v-card>
            </v-col>
            <v-col class="col-sm-6 col-12">
              <v-alert
                v-for="(amenitie,key,index) in amenities"
                :key="index"
                :color="checkType(amenitie)"
                dense
                outlined
                class="mb-3 py-0"
              >
                <v-row justify="space-between">
                  <v-col class="py-0 px-1">{{key}}</v-col>
                  <v-col class="py-0 px-1 col-auto">{{amenitie?"有":"無"}}</v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      API: "https://challenge.thef2e.com/api/thef2e2019/stage6/room/",
      roomId: "",
      watchingPicUrl: "",
      roomPictures: [],
      checkInTime: {
        from: "",
        to: ""
      },
      checkOutTime: "",
      description: "",
      guestAmount: {
        min: 0,
        max: 0
      },
      bed: [],
      privateBath: 0,
      footage: 0,
      amenities: {}
    };
  },
  created() {
    this.roomId = this.$route.params.roomId;
    this.axios.get(this.API + this.roomId).then(response => {
      let roomData = response.data.room[0];
      this.roomPictures = roomData.imageUrl;
      this.watchingPicUrl = this.roomPictures[0];
      this.checkInTime = {
        from: roomData.checkInAndOut.checkInEarly,
        to: roomData.checkInAndOut.checkInLate
      };
      this.checkOutTime = roomData.checkInAndOut.checkOut;
      this.amenities = roomData.amenities;
      this.guestAmount = {
        max: roomData.descriptionShort.GuestMax,
        min: roomData.descriptionShort.GuestMin
      };
      this.bed = roomData.descriptionShort.Bed;
      this.privateBath = roomData.descriptionShort["Private-Bath"];
      this.footage = roomData.descriptionShort.Footage;
      this.description = roomData.description;
      console.log(response.data);
    });
  },
  methods: {
    changeWatchingPic(picUrl) {
      this.watchingPicUrl = picUrl;
    },
    checkType(value) {
      if (value === 0 || value == true) {
        return "success";
      } else {
        return "error";
      }
    }
  }
};
</script>