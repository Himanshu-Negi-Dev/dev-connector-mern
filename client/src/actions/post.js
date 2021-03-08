import axios from "axios";
import { setAlert } from "./alert";
import {
   GET_POSTS,
   POST_ERROR,
   UPDATE_LIKES,
   DELETE_POST,
   ADD_POST,
   GET_POST,
   ADD_COMMENT,
   REMOVE_COMMENT,
} from "./types";

//Get Post

export const getPost = (id) => {
   return async (dispatch) => {
      try {
         const res = await axios.get(`/api/posts/${id}`);
         dispatch({
            type: GET_POST,
            payload: res.data,
         });
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};
//Get Posts

export const getPosts = () => {
   return async (dispatch) => {
      try {
         const res = await axios.get("/api/posts");
         dispatch({
            type: GET_POSTS,
            payload: res.data,
         });
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//Add like

export const addLike = (id) => {
   return async (dispatch) => {
      try {
         const res = await axios.put(`/api/posts/like/${id}`);
         dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
         });
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//Remove like

export const removeLike = (id) => {
   return async (dispatch) => {
      try {
         const res = await axios.put(`/api/posts/unlike/${id}`);
         dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
         });
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//delete post

export const deletePost = (id) => {
   return async (dispatch) => {
      try {
         await axios.delete(`/api/posts/${id}`);
         dispatch({
            type: DELETE_POST,
            payload: id,
         });
         dispatch(setAlert("Post Removed", "success"));
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//add post

export const addPost = (formData) => {
   return async (dispatch) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      try {
         const res = await axios.post(`/api/posts`, formData, config);
         dispatch({
            type: ADD_POST,
            payload: res.data,
         });
         dispatch(setAlert("Post Created", "success"));
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//add comment
export const addComment = (postId, formData) => {
   return async (dispatch) => {
      try {
         const res = await axios.post(`/api/posts/comments/${postId}`, formData);
         dispatch({
            type: ADD_COMMENT,
            payload: res.data,
         });
         dispatch(setAlert("Comment Added", "success"));
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};

//delete comment
export const deleteComment = (postId, commentId) => {
   return async (dispatch) => {
      try {
         await axios.put(`/api/posts/comments/${postId}/${commentId}`);
         dispatch({
            type: REMOVE_COMMENT,
            payload: commentId,
         });
         dispatch(setAlert("Comment Removed", "success"));
      } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
         });
      }
   };
};
