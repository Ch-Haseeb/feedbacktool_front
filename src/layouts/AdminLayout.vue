<template>
  <v-app>
      <v-navigation-drawer app clipped over v-model="drawer">
        <v-list>
          <v-list-item
            :to="'/'"
            :class="{ 'success-color': $route.path === '/admin' }"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="'/feedback'"
            :class="{ 'success-color': $route.path === '/feedback' }"
          >
            <v-list-item-icon>
              <v-icon>mdi-comment</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Feedback</v-list-item-title>
          </v-list-item>
          <v-list-item
          :to="'/feedback-comment'"
          :class="{ 'success-color': $route.path === '/feedback-comment' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-note-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Comment</v-list-item-title>
        </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Admin Panel</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-avatar
              size="32"
              @click="showUserProfile = !showUserProfile"
              v-on="on"
            >
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="User Avatar"
              />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item @click="navigateToProfile">Profile</v-list-item>
            <v-list-item @click="logout">Logout</v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
  

    <v-main>
      <router-view></router-view>
    </v-main>
</v-app>
</template>
  
  <script>
export default {
  data() {
    return {
      drawer: true,
      showUserProfile: false,
    };
  },
  methods: {
    navigateToProfile() {
      this.$router.push('/user-profile')
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      this.$router.push("/login");
    },
  },
};
</script>
  
  <style>
.success-color {
  border-left: 4px solid #4caf50; 
}
</style>
  