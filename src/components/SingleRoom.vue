<template>
  <v-container>
    <v-row>
      <v-col cols="7">
        <div class="headline mb-2">{{roomName}}</div>
        <v-img :src="watchingPicUrl" aspect-ratio="1.5"></v-img>
        <v-row>
          <v-col cols="3" v-for="(url,index) in roomPictures" :key="index">
            <v-hover v-slot:default="{ hover }">
              <v-card :elevation="hover ? 12 : 2" :loading="loading">
                <v-img
                  :src="roomPictures[index]"
                  aspect-ratio="1.5"
                  @click="changeWatchingPic(roomPictures[index])"
                ></v-img>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-card color="transparent" flat :loading="loading">
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
      <v-col>
        <div class="title bold">Select your date of stay</div>
        <v-menu v-model="startMenu" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on }">
            <v-form ref="startDateForm">
              <v-text-field
                v-model="startDate"
                label="start date"
                readonly
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="startDateRules"
              ></v-text-field>
            </v-form>
          </template>
          <v-date-picker v-model="startDate" no-title scrollable :allowed-dates="startAllowedDate">
            <div class="flex-grow-1"></div>
          </v-date-picker>
        </v-menu>
        <v-menu v-model="endMenu" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on }">
            <v-form ref="dateForm">
              <v-text-field
                v-model="endDate"
                label="end date"
                readonly
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="endDateRules"
              ></v-text-field>
            </v-form>
          </template>
          <v-date-picker v-model="endDate" no-title scrollable :allowed-dates="endAllowedDate">
            <div class="flex-grow-1"></div>
          </v-date-picker>
        </v-menu>
        <v-row justify="end">
          <v-col cols="auto">
            <div class="pa-3 pt-0">
              平日價格: NT
              <span class="red--text">{{normalDayPrice}}</span> 元/晚
            </div>
            <div class="pa-3 pb-4">假日價格: NT {{holidayPrice}} 元/晚</div>
            <v-btn block class="green lighten-3" @click="booking">預訂房間</v-btn>
            <v-dialog v-model="bookingDialog" max-width="400">
              <v-card>
                <v-img :src="watchingPicUrl" aspect-ratio="1.5"></v-img>
                <v-card v-if="!bookingResponseShow">
                  <v-card-title class="headline mb-2">{{roomName}}</v-card-title>
                  <v-card-text>入住日期:</v-card-text>
                  <v-card-text>
                    <u>{{durationDates.length>4?startDate+"~"+endDate:durationDates.join(", ")}}</u>
                  </v-card-text>
                  <v-form ref="inquireForm">
                    <v-card-actions>
                      <v-text-field label="姓名" :rules="inquireRules" v-model="name"></v-text-field>
                    </v-card-actions>
                    <v-card-actions>
                      <v-text-field label="電話" :rules="inquireRules" v-model="phone"></v-text-field>
                    </v-card-actions>
                    <v-card-actions>
                      <v-text-field label="email" :rules="inquireRules" v-model="email"></v-text-field>
                    </v-card-actions>
                  </v-form>
                  <v-card-actions>
                    <v-btn block class="green lighten-3" @click="bookingConfirm">確認預定</v-btn>
                  </v-card-actions>
                </v-card>
                <v-card v-else>
                  <v-card v-if="bookingResponse">
                    <v-card-title>訂單已完成</v-card-title>
                    <v-card-actions>
                      <v-btn @click="goToHomePage">返回首頁</v-btn>
                    </v-card-actions>
                  </v-card>
                  <v-card v-else>
                    <v-card-title>預定失敗</v-card-title>
                    <v-card-text>失敗原因可能為:</v-card-text>
                    <v-card-text>1.預定日期為 90 天後</v-card-text>
                    <v-card-text>2.預定時間已被人預定</v-card-text>
                    <v-card-actions>
                      <v-btn @click="goToHomePage">返回首頁</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-card class="pb-1" :loading="recommendLoading">
          <v-card-title class="title mt-3">其他推薦</v-card-title>
          <v-card @click="getNewRoomInfo(firstRecommend.id)" class="ma-3">
            <v-img :src="firstRecommend.imageUrl" aspect-ratio="1.5"></v-img>
          </v-card>
          <v-card @click="getNewRoomInfo(secondRecommend.id)" class="ma-3">
            <v-img :src="secondRecommend.imageUrl" aspect-ratio="1.5"></v-img>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { fips } from "crypto";
export default {
  data() {
    return {
      API: "https://challenge.thef2e.com/api/thef2e2019/stage6/room/",
      roomId: "",
      roomName: "",
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
      amenities: {},
      currentDate: new Date().toISOString().substr(0, 10),
      startDate: "",
      startMenu: false,
      startDateRules: [value => value.length > 0 || "please input start date"],
      endDate: "",
      endMenu: false,
      endDateRules: [
        value => value > this.startDate || "end date should after start date."
      ],
      durationDates: [],
      normalDayPrice: 0,
      holidayPrice: 0,
      recommendAPI: "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms",
      firstRecommend: {},
      secondRecommend: {},
      loading: false,
      recommendLoading: false,
      bookingDialog: false,
      inquireRules: [value => value.length > 0 || "please input your name"],
      name: "",
      phone: "",
      email: "",
      bookingResponseShow: false,
      bookingResponse: false
    };
  },

  created() {
    this.getRoomData();
  },
  methods: {
    goToHomePage() {
      this.$router.push("/");
    },
    bookingConfirm() {
      if (this.$refs.inquireForm.validate()) {
        console.log(this.durationDates);
        this.axios
          .post(this.API + this.roomId, {
            name: this.name,
            tel: this.phone,
            date: this.durationDates
          })
          .then(response => {
            console.log(response);
            this.bookingResponseShow = true;
            this.bookingResponse = true;
          })
          .catch(error => {
            console.log(error);
            this.bookingResponseShow = true;
            this.bookingResponse = false;
          });
      }
    },
    booking() {
      if (
        this.$refs.startDateForm.validate() &&
        this.$refs.dateForm.validate()
      ) {
        this.durationDates = [];
        this.getDuration(this.startDate, this.endDate, day => {
          let str =
            day.getFullYear() +
            "-" +
            (day.getMonth() < 9
              ? "0" + (day.getMonth() + 1)
              : day.getMonth() + 1) +
            "-" +
            (day.getDate() < 10 ? "0" + day.getDate() : day.getDate());
          this.durationDates.push(str);
        });
        this.bookingDialog = true;
      }
    },
    getDuration(startDate, endDate, callback) {
      // should understand about callback
      let startTime = new Date(startDate);
      let endTime = new Date(endDate);

      let startUnix = startTime.getTime();
      let endUnix = endTime.getTime();
      let dayStep = 86400000;
      for (; startUnix < endUnix; startUnix += dayStep) {
        callback(new Date(startUnix));
      }
    },
    getNewRoomInfo(roomUrl) {
      this.loading = true;
      this.recommendLoading = true;
      this.$router.push(`/room/${roomUrl}`);
      this.getRoomData();
    },
    changeWatchingPic(picUrl) {
      this.watchingPicUrl = picUrl;
    },
    checkType(value) {
      if (value === 0 || value == true) {
        return "success";
      } else {
        return "error";
      }
    },
    startAllowedDate(val) {
      return val > this.currentDate;
    },
    endAllowedDate(val) {
      return val > this.currentDate && val > this.startDate;
    },
    getRoomData() {
      // single room data
      this.roomId = this.$route.params.roomId;
      this.axios.get(this.API + this.roomId).then(response => {
        let roomData = response.data.room[0];
        this.roomName = roomData.name;
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
        this.normalDayPrice = roomData.normalDayPrice;
        this.holidayPrice = roomData.holidayPrice;
        this.loading = false;

        console.log(response.data);
      });
      // recommendation
      this.axios.get(this.recommendAPI).then(response => {
        let rooms = response.data.items;
        for (let room = 0; room < rooms.length; room++) {
          if (rooms[room].id == this.roomId) {
            this.firstRecommend.imageUrl = rooms[(room + 1) % 6].imageUrl;
            this.firstRecommend.id = rooms[(room + 1) % 6].id;
            this.secondRecommend.imageUrl = rooms[(room + 2) % 6].imageUrl;
            this.secondRecommend.id = rooms[(room + 2) % 6].id;
            this.recommendLoading = false;
            this.$forceUpdate();
            return;
          }
        }
      });
    }
  }
};
</script>