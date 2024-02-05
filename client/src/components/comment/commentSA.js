
import {useContext, useEffect, useRef } from "react";
import React, {useState} from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types';
import { format } from 'timeago.js';
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import { AuthContext } from "../../context/AuthContext";
import {styles} from './commentStyle';
import { useMediaQuery } from 'react-responsive';
import Linkify from 'react-linkify';
import { COLORS } from "../values/colors";

function CommentSA ({post, comment, isDetail, classes }) {
  const desc = useRef();
  const [like, setLike] = useState(comment.likes.length);
  const [dislike, setDislike] = useState(comment.dislikes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikedByOne, setIsLikedByOne] = useState(false);
  const [isDislikedByOne, setIsDislikedByOne] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)"});
  const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)"});

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(comment.likes.includes(currentUser._id));
    setIsLikedByOne(comment.likes.length == 1)
    setIsDisliked(comment.dislikes.includes(currentUser._id));
    setIsDislikedByOne(comment.dislikes.length == 1)

  }, [currentUser._id, comment.likes, comment.dislikes]);

  useEffect(() => {
    //const fetchUser = async () => {
    //  const res = await axios.get(`/users?userId=${post.userId}`)
    //  setUser(res.data);
    //};
    //console.log(post.comments.length)
    //fetchUser();

  }, [post.userId])


  const commentLikeHandler = () => {
    console.log(comment._id);
    console.log("comments testing");
    try {
      axios.put("/comments/" + comment._id + "/like", { userId: currentUser._id });
    } catch (err) { 

      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    if (comment.likes.length == 1){
      setIsLikedByOne(false);
    }
  };

  const commentDislikeHandler = () => {
    try {
      axios.put("/comments/" + comment._id + "/dislike", { userId: currentUser._id });
    } catch (err) {console.log(err);}
    setDislike(isDisliked ? dislike - 1 : dislike + 1);
    setIsDisliked(!isDisliked);
    
    if (comment.dislikes.length == 1){
      setIsDislikedByOne(false);
    }
  };


  const commentBody = item => {
    return (
      <p className={classes.commentText}>
        <div className={classes.comment}>
        <Link  style={{textDecoration: 'none', color: COLORS.textColor, fontWeight: 'bold'}} to={isDetail? `/postdetail/profile/${item.username}`: `/profile/${item.username}`}>{"@"+item.username}</Link>
        <br />
        {item.body}{'   '}
        
        <div className={classes.postBottom}>
          <div className={classes.postBottomLeft}>
        <img src={`${PF}clike.png`} alt="" className={classes.commentLikeIcon} onClick={commentLikeHandler} />
        <span className={classes.commentLikeCounter}>{like}</span>
                  
        <img src={`${PF}cdislike.png`} alt="" className={classes.commentLikeIcon} onClick={commentDislikeHandler} />
        <span className={classes.commentLikeCounter}>{dislike}</span>
        </div>
        <span className={classes.postDate}></span>
          {format(item.createdAt)}
         {
            //<button className={classes.sendButton} type="submit" >Delete</button>
            //<Icon className={classes.dltButton}>Delete</Icon>
            //<LinkPreview url={urls[0]} />
            //{true && <LinkPreview url='https://www.express.pk/story/2598089/1/' width='20px' height='20px'/>}
            //<img onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} src={`${PF}like.png`} alt="" className={classes.likeIcon} onClick={likeHandler} />
            //{isHovered && !isMobileDevice && !isTabletDevice ? (isLiked ? <span className={classes.postLikeCounter}>{isLikedByOne ? "you only " : "you and " + (like - 1).toString() + " others"} liked it</span>  :  <span className={classes.postLikeCounter}>{like} liked it</span>): <span className={classes.postLikeCounter}>{like}</span>}    
            //<img onMouseOver={handleDisMouseEnter} onMouseLeave={handleDisMouseLeave} src={`${PF}dislike.png`} alt="" className={classes.likeIcon} onClick={dislikeHandler} />
            //{isDisHovered  && !isMobileDevice && !isTabletDevice? (isLiked ? <span className={classes.postDislikeCounter}>{isDislikedByOne ? "you only " : "you and " + (dislike - 1).toString() + " others"} disliked it</span>  :  <span className={classes.postDislikeCounter}>{dislike} disliked it</span>): <span className={classes.postDislikeCounter}>{dislike}</span>}
          }
        </div>
        </div>
      </p>
    )
  }

    return (<div >
        { 
        <Linkify>
        <CardHeader
        avatar={<Link style={{textDecoration: 'none', color: COLORS.textColor}} to={isDetail? `/postdetail/profile/${comment.userId.username}`: `/profile/${comment.userId.username}`}><Avatar className={classes.smallAvatar} src={comment.userId.profilePicture? PF + comment.userId.profilePicture: PF + "person/noAvatar.png"} /></Link>}
        title={commentBody(comment)}
        className={classes.cardHeader2}/>
        </Linkify>
        }
    </div>)
}

CommentSA.propTypes = {
  comments: PropTypes.array.isRequired
}

export default withStyles(styles)(CommentSA);