<template>
  <div>
    <v-container class="mt-4">
      <v-btn @click="openCommentDialog" color="primary">Add Comment</v-btn>

      <v-data-table :headers="commentHeaders" :items="comments">
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:item.content="{ item }">
            <div v-html="item.content"></div>
          </template>
      </v-data-table>


      <v-dialog v-model="commentDialog" max-width="600px">
        <v-card>
          <v-card-title>Add Comment</v-card-title>
          <v-card-text>
            <vue-editor v-model="newComment.content"></vue-editor>
            <v-select
              v-model="newComment.feedback_id"
              :items="feedbackOptions"
              label="Select Feedback"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addComment" color="primary">Submit Comment</v-btn>
            <v-btn @click="closeCommentDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
  
  <script>
import { VueEditor } from "vue2-editor";
import { getComments, addComment } from "../services/CommentAPI.JS";
import { get_feedback } from "../services/FeedbackAPI.JS";

export default {
  data() {
    return {
      comments: [],
      commentDialog: false,
      newComment: {
        content: "",
        feedback_id: null,
      },
      commentHeaders: [
        { text: "Content", value: "content" },
        { text: "User", value: "user.name" },
        { text: "Feedback Title", value: "feedback.title" },
        { text: "Date", value: "created_at" },
      ],
      feedbackOptions: [], 
    };
  },
  components: {
    VueEditor,
  },

  methods: {
    async openCommentDialog() {
  this.fetchFeedback();
  this.commentDialog = true;
},
    async addComment() {
        console.log(this.newComment.feedback_id);
      const response = await addComment(this.newComment.feedback_id,this.newComment);
      if(response){
        this.closeCommentDialog();
        this.fetchComments();
      }
      
    },
    closeCommentDialog() {
      this.commentDialog = false;
    },
    async fetchComments() {
      const commentsData = await getComments();
      this.comments = commentsData.data.comment;
    },
    fetchFeedback() {
      get_feedback().then((res) => {
        if (res.data.feedback && Array.isArray(res.data.feedback.data)) {
          this.feedbackOptions = res.data.feedback.data.map((item) => ({
            value: item.id,
            text: item.title,
          }));
        }
      });
    },
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      const formattedDate = date.toISOString().split("T")[0];

      return formattedDate;
    },
  },
  created() {
    this.fetchComments();
    this.fetchFeedback();
  },
};
</script>
  