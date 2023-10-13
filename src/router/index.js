import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import Login from "../views/LoginView.vue";
import Register from "../views/RegisterView.vue";
import Home from "../views/DashboardView.vue";
import Feedback from "../views/FeedbackView.vue";
import UserProfile from "../views/UserProfile.vue";
import FeedbackComment from "../views/FeedbackComment.vue";

const routes = [
  {
    path: "/login",
    meta: { layout: "default" },
    component: Login,
  },
  {
    path: "/register",
    component: Register,
    meta: { layout: "deafult" },
  },
  {
    path: "/",
    meta: { layout: "admin" },
    component: Home,
  },
  {
    path: "/feedback",
    component: Feedback,
    meta: { layout: "admin" },
  },
  {
    path: "/user-profile",
    component: UserProfile,
    meta: { layout: "admin" },
  },
  {
    path: "/feedback-comment",
    component: FeedbackComment,
    meta: { layout: "admin" },
  },
  { path: "/", redirect: "/login" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.layout === "admin")) {
    if (!token) {
      next({ path: "login" });
    } else {
      next();
    }
  } else {
    if (token && (to.name === "register" || to.name === "login")) {
      next({ path: "/" });
    } else {
      next();
    }
  }
});
router.beforeEach((to, from, next) => {
  // Check if the user is trying to access a protected route
  if (to.matched.some(record => record.meta.layout === "admin")) {
    // Wait for the token to be available in local storage
    const tokenPromise = new Promise((resolve) => {
      const checkToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
          resolve(token);
        } else {
          setTimeout(checkToken, 100); // Check again after a short delay
        }
      };
      checkToken();
    });

    // Once the token is available, continue navigation
    tokenPromise.then(token => {
      if (token) {
        next();
      } else {
        next("/login"); // Redirect to the login path if no token is available
      }
    });
  } else {
    // For routes that do not require admin layout, check for the token and redirect accordingly
    const token = localStorage.getItem("token");
    if (token && (to.path === "/register" || to.path === "/login")) {
      next("/"); // Replace "/" with the path of your dashboard route
    } else {
      next();
    }
  }
});


export default router;
