<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" md="4">
        <v-card shaped elevation="2" style="margin-top: 20px;">
          <v-card-title>
            <v-row align="center">
              <v-col cols="auto" class="icon">
                <v-icon
                  style="font-size: 2.9em; opacity: 0.7; border-radius: 15px 60px 60px 15px; padding: 15px 25px 15px 15px; background-color:#68C17D; color:white;"
                >
                  mdi-chart-bell-curve-cumulative
                </v-icon>
              </v-col>
              <v-col>
                <div class="text-h6 font-weight-medium">
                  Total Users
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ userCount }}
                </div>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="4">
        <v-card shaped elevation="2" style="margin-top: 20px;">
          <v-card-title>
            <v-row align="center">
              <v-col cols="auto" class="icon">
                <v-icon
                  style="font-size: 2.9em; opacity: 0.7; border-radius: 15px 60px 60px 15px; padding: 15px 25px 15px 15px; background-color:#E6717D; color:white;"
                >
                  mdi-bookmark-outline
                </v-icon>
              </v-col>
              <v-col>
                <div class="text-h6 font-weight-medium">
                  Total Feedback
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ feedbackCount }}
                </div>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="4">
        <v-card shaped elevation="2" style="margin-top: 20px;">
          <v-card-title>
            <v-row align="center">
              <v-col cols="auto" class="icon">
                <v-icon
                  style="font-size: 2.9em; opacity: 0.7; border-radius: 15px 60px 60px 15px; padding: 15px 25px 15px 15px; background-color:#FDA45B; color:white;"
                >
                  mdi-list-box-outline
                </v-icon>
              </v-col>
              <v-col>
                <div class="text-h6 font-weight-medium">
                  Total Comment
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ commentCount }}
                </div>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { stats } from '../services/DashboardAPI.JS'

export default {
  name: 'DashboardView',

  data: () => ({
    userCount: 0,       
    feedbackCount: 0,   
    commentCount: 0  
  }),

  beforeMount() {
    this.totalcount()
  },

  methods: {
    totalcount() {
      stats().then((res) => {
        console.log(res.data)
        this.userCount = res.data.user_count;       // Assign user count
        this.feedbackCount = res.data.feedback_count; // Assign feedback count
        this.commentCount = res.data.comment_count;   // Assign comment count
      })
    },
  },
}
</script>
