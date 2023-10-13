<template>
  <div>
    <v-container class="mt-4">
      <v-row>
        <v-col cols="12">
          <v-btn @click="addFeedback" color="primary">Add Feedback</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Search Feedback"></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="filteredFeedback"
        :items-per-page="10"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.title }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.votes.length }}</td>
            <td>{{ item.user.name }}</td>
            <td>
              <v-icon @click="editFeedback(item)" color="primary"
                >mdi-pencil</v-icon
              >
              <v-icon @click="deleteFeedback(item)" color="error"
                >mdi-delete</v-icon
              >
              <v-icon
                @click="voteFeedback(item, 1)"
                :color="checkVoteStatus(item) == '1' ? 'blue' : 'grey'"
                >mdi-thumb-up</v-icon
              >
              <v-icon
                @click="voteFeedback(item, 0)"
                :color="checkVoteStatus(item) == '0' ? 'red' : 'grey'"
                >mdi-thumb-down</v-icon
              >
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="addFeedbackDialog" max-width="600px">
      <v-form ref="form">
        <v-card>
          <v-card-title>{{
            feedbackToEdit ? "Edit Feedback" : "Add Feedback"
          }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newFeedback.title"
              label="Title"
              :rules="[(v) => !!v || 'Title is required']"
            ></v-text-field>
            <v-textarea
              v-model="newFeedback.description"
              label="Description"
              :rules="[(v) => !!v || 'Description is required']"
            ></v-textarea>
            <v-select
              v-model="newFeedback.category"
              :items="categories"
              label="Category"
              :rules="[(v) => !!v || 'Category is required']"
            ></v-select>
            <v-file-input
              v-model="newFeedback.attachment"
              label="Attachment"
              name="attachment"
              show-size
              @change="handleFileChange"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="feedbackToEdit ? updateFeedback() : addNewFeedback()"
              color="primary"
            >
              {{ feedbackToEdit ? "Update" : "Submit" }}
            </v-btn>
            <v-btn @click="cancelFeedbackDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar v-model="snackbar" color="error" top :timeout="3000">
      {{ snackbarText }}
      <v-btn @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
  
  <script>
import {
  get_feedback,
  addFeedback,
  deleteFeedback,
  update_feedback,
  voteFeedback,
} from "../services/FeedbackAPI.JS";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      headers: [
        { text: "Title", value: "title" },
        { text: "Category", value: "category" },
        { text: "Vote Count", value: "votes.length" },
        { text: "User", value: "user.name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      feedback: [],
      search: "",
      addFeedbackDialog: false,
      newFeedback: {
        title: "",
        description: "",
        category: null,
        attachment: "",
      },

      categories: ["Bug Report", "Feature Request", "Improvement"],
      feedbackToEdit: null,
      snackbar: false,
      snackbarText: "",
    };
  },

  computed: {
    filteredFeedback() {
      return this.feedback.filter((item) => {
        return item.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },

  methods: {
    fetchFeedback() {
      get_feedback().then((res) => {
        this.feedback = res.data.feedback.data;
      });
    },

    checkVoteStatus(feedbackItem) {
      const userId = localStorage.getItem("user_id");
      console.log("user_id: " + userId);
      if (userId) {
        const userVote = feedbackItem.votes.find(
          (vote) => vote.user_id === parseInt(userId)
        );
        if (userVote) {
          console.log("user_vote: " + userVote.vote);
          return userVote.vote;
        }
      }
      return -1;
    },

    voteFeedback(feedbackItem, votevalue) {
      console.log(feedbackItem.id);
      console.log(votevalue);

      const voteData = {
        vote: Number(votevalue),
      };
      console.log(voteData);

      voteFeedback(feedbackItem.id, voteData)
        .then(() => {
          this.fetchFeedback();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.showErrorToast("You have already voted on this feedback");
          } else {
            console.error("Error giving vote:", error);
          }
        });
    },

    showErrorToast(message) {
      this.snackbarText = message;
      this.snackbar = true;
    },

    editFeedback(feedbackItem) {
      this.feedbackToEdit = feedbackItem;
      this.newFeedback = {
        title: feedbackItem.title,
        description: feedbackItem.description,
        category: feedbackItem.category,
        attachment: "",
      };
      this.addFeedbackDialog = true;
    },

    cancelFeedbackDialog() {
      this.addFeedbackDialog = false;
      this.feedbackToEdit = null;
    },

    deleteFeedback(feedbackItem) {
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${feedbackItem.title}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteFeedback(feedbackItem.id)
            .then(() => {
              console.log("Product deleted:", feedbackItem.title);
              this.fetchFeedback();
            })
            .catch((error) => {
              console.error("Error deleting product:", error);
            });
        }
      });
    },

    addFeedback() {
      this.addFeedbackDialog = true;
    },

    async addNewFeedback() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        const formData = new FormData();
        formData.append("title", this.newFeedback.title);
        formData.append("description", this.newFeedback.description);
        formData.append("category", this.newFeedback.category);
        formData.append("attachment", this.newFeedback.attachment);

        addFeedback(formData).then(() => {
          this.fetchFeedback();

          this.addFeedbackDialog = false;
        });
      }
    },

    async updateFeedback() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        const formData = new FormData();
        formData.append("title", this.newFeedback.title);
        formData.append("description", this.newFeedback.description);
        formData.append("category", this.newFeedback.category);
        formData.append("attachment", this.newFeedback.attachment);
        formData.append("_method", "PUT");

        update_feedback(this.feedbackToEdit.id, formData)
          .then(() => {
            this.fetchFeedback();
            this.addFeedbackDialog = false;
            this.feedbackToEdit = null;
          })
          .catch((error) => {
            console.error("Error updating feedback:", error);
          });
      }
    },

    handleFileChange(file) {
      this.newFeedback.attachment = file;
    },
  },
  created() {
    const isAuthenticated = true;

    if (isAuthenticated) {
      this.fetchFeedback();
    } else {
      this.$router.push("/login");
    }
  },
};
</script>
  