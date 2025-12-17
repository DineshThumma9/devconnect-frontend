


import { CommentType } from "@/entities/Comment";
interface CommentProps {
    comment:CommentType
}



const Comment = ({comment}:CommentProps) => {


    return (
        <div>
           <div>
             <img src={comment.userProfilePicUrl} alt={comment.username} />
             <em>{comment.createdAt.toString()}</em>
             <div>
               <p><strong>{comment.username}</strong></p>
               <p>{comment.comment}</p>
             </div>
           </div>
        </div>
    );
}
export default Comment;