import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";
const PostItem = ({
   addLike,
   removeLike,
   deletePost,
   auth,
   showActions,
   post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
   return (
      <>
         <div class="post bg-white my-1 p-1">
            <div>
               <Link to={`/profile/${user}`}>
                  <img class="round-img" src={avatar} alt="" />
                  <h4>{name}</h4>
               </Link>
            </div>

            <div>
               <p class="my-1">{text}</p>
               <p class="post-date">
                  Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
               </p>

               {showActions && (
                  <>
                     <button onClick={(e) => addLike(_id)} class="btn">
                        <i class="fas fa-thumbs-up"></i> {likes.length > 0 && <span>{likes.length}</span>}
                     </button>
                     <button onClick={(e) => removeLike(_id)} class="btn">
                        <i class="fas fa-thumbs-down"></i>
                     </button>
                     <Link to={`/post/${_id}`} class="btn btn-primary">
                        Discussion {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
                     </Link>
                     {!auth.loading && user === auth.user._id && (
                        <button onClick={(e) => deletePost(_id)} type="button" className="btn btn-danger">
                           <i className="fas fa-times"></i>
                        </button>
                     )}
                  </>
               )}
            </div>
         </div>
      </>
   );
};

PostItem.defaultProps = {
   showActions: true,
};

const mapStateToProps = (state) => {
   return {
      auth: state.auth,
   };
};
export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
