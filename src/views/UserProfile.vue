<template>
  <div>
    <v-container class="mt-4">
      <div>
        <v-form>
          <v-text-field v-model="name" label="Name"></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
          ></v-text-field>
          <v-text-field v-model="email" label="Email" readonly></v-text-field>
          <v-btn color="primary" @click="updateProfile">Update Profile</v-btn>
        </v-form>

        <v-data-table
          :headers="feedbackHeaders"
          :items="feedbackItems"
        ></v-data-table>

        <v-snackbar v-model="showToast" color="success" top :timeout="3000">
            Profile Updated
          </v-snackbar>

      </div>
    </v-container>
  </div>
</template>
  
  <script>
import { getUserFeedback, userUpdate } from "../services/UserAPI.JS";

export default {
  data() {
    return {
      name: "",
      password: "",
      email: "", 

      feedbackHeaders: [
        { text: "Title", value: "title" },
        { text: "Category", value: "category" },
        { text: "Description", value: "description" },
      ],
      feedbackItems: [], 
      showToast: false,
    };
  },
  methods: {
    async updateProfile() {
      const userData = {
        name: this.name,
        password: this.password,
        email: this.email
      };

      await userUpdate(userData);
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      
    },
  },
  async created() {
    const userData = await getUserFeedback();
    console.log(userData);

    this.name = userData.data.user.name;
    this.email = userData.data.user.email;

    this.feedbackItems = userData.data.feedback_items.data; 
  },
};
</script>
  