const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log("currentUser", currentUser);

const currentUserProfile = document.querySelector(".currentUserProfile");
currentUserProfile.src = currentUser.profilePic
  ? `./upload/${currentUser.profilePic}`
  : `./defaultPic/defaultUser.jpg`;

//Comments
let commentDesc = "";
let comments = [];
//get comments & showing comments
const gettingComments = async (postId, showCommentBox) => {
  showCommentBox.innerHTML = "";
  try {
    const res = await fetch(
      `http://localhost:3000/comment/getComments?postId=${postId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const commentData = await res.json();
    comments = [...commentData];
    console.log("commentData", commentData);
    comments.forEach((comment) => {
      const boxForEachComment = document.createElement("div");
      boxForEachComment.className = "boxForEachComment";
      boxForEachComment.innerHTML = `
       <div class="info2">
          <img class="userProfile" src=${
            comment.profilePic
              ? `./upload/${comment.profilePic}`
              : `"./defaultPic/defaultUser.jpg"`
          }/>
          <span class="userName">${comment.name}</span>
        </div>
         <span class="descComment">${comment.desc}</span>
       `;
      showCommentBox.append(boxForEachComment);
    });
  } catch (err) {
    console.log("commentError", err);
  }
};

//add comment
//click sent button
const handleComment = async (postId, box, inputTag) => {
  try {
    const res = await fetch("http://localhost:3000/comment/addComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ desc: commentDesc, postId }),
    });
    const data = await res.json();
    console.log("Comment submitted:", data);
    inputTag.value = "";
    gettingComments(postId, box);
  } catch (err) {
    console.log(err);
  }
};

//Likes
//get likes
const gettingLikeOfPost = async (postId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/like/getLikes?postId=${postId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const likeData = await res.json();
    console.log("commentData", likeData);
    return likeData;
  } catch (err) {
    console.log("commentError", err);
  }
};
//give Like
const handleLike = async (postId, likes, likeBox) => {
  console.log(likes.includes(currentUser.id));
  const fetching = likes.includes(currentUser.id)
    ? "http://localhost:3000/like/deleteLike"
    : "http://localhost:3000/like/addLike";
  try {
    const res = await fetch(fetching, {
      method: likes.includes(currentUser.id) ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ postId }),
    });
    const data = await res.json();
    console.log("Like submitted:", data);

    const updatedLikes = await gettingLikeOfPost(postId);
    // Update icon
    const updatedIcon = updatedLikes.includes(currentUser.id)
      ? `<i class="bx bxs-heart icon2 like"></i>`
      : `<i class="bx bx-heart icons like"></i>`;
    // Update likeBox innerHTML
    likeBox.innerHTML = `
      ${updatedIcon}
      <span class="text likeText">${updatedLikes.length} ${
      updatedLikes.length <= 1 ? "like" : "likes"
    }</span>
    `;
    const newIcon = likeBox.querySelector("i");
    newIcon.addEventListener("click", () => {
      handleLike(postId, updatedLikes, likeBox);
    });
  } catch (err) {
    console.log(err);
  }
};

//Posts
//get Post & showing posts
let posts = [];
const postsBoxs = document.querySelector(".posts");
const gettingPosts = async () => {
  postsBoxs.innerHTML = "";
  try {
    const res = await fetch("http://localhost:3000/post/getPost", {
      method: "GET",
      credentials: "include",
    });
    const postData = await res.json();
    posts = [...postData];
    console.log("postData", postData);
    for (const post of posts) {
      const likes = await gettingLikeOfPost(post.id);
      const likeIcon = likes.includes(currentUser.id)
        ? `<i class="bx bxs-heart icon2 like"></i>`
        : `<i class="bx bx-heart icons like"></i>`;
      const profilePicUrl = post.profilePic
        ? `./upload/${post.profilePic}`
        : `"./defaultPic/defaultUser.jpg"`;
      console.log("Url", profilePicUrl);
      const box = document.createElement("div");
      box.className = "postBox";
      box.id = post.id;
      box.innerHTML = `
        <div class="info">
          <div class="info2">
            <img class="userProfile postProfile" id=${
              post.userId
            } src=${profilePicUrl}/>
            <span class="userName">${post.name}</span>
          </div> 
          <i class='bx bx-trash' id=${post.id}></i>
        </div>
        <p class="desc">${post.desc}</p>
        <img class="postImg" src="./upload/${post.img}"/>
        <div class="activities">
          <div class="activity_type likeBox">
            ${likeIcon}<span class="text likeText">${likes.length} ${
        likes.length <= 1 ? "like" : "likes"
      }</span>
          </div>
          <div class="activity_type comment">
              <i class='bx bx-comment-dots icons' ></i><span class="text">Comments</span>
          </div>
          <div class="activity_type share">
              <i class='bx bx-share-alt icons' ></i><span class="text">Share</span>
          </div>            
        </div>

        <div class="commentContainer">
          <div class="commentBox">
            <div class="giveComment">
                <img class="userProfile" src=${
                  currentUser.profilePic
                    ? `./upload/${currentUser.profilePic}`
                    : `"./defaultPic/defaultUser.jpg"`
                }/>
                <input type="text" class="writeComment" placeholder="Write a comment"/>
            </div>              
              <button type="button" class="postBtn sendbtn">Send</button>
          </div>
          <div class="comments"></div>
        </div>
        `;
      postsBoxs.append(box);
    }
    //click comment box
    const commentBoxs = document.querySelectorAll(".comment");
    commentBoxs.forEach((commentBox) => {
      commentBox.addEventListener("click", (e) => {
        const postBox = e.target.closest(".postBox");
        console.log("postId", postBox.id);
        const commentContainer = postBox.querySelector(".commentContainer");
        const showCommentTag = postBox.querySelector(".comments");
        const value = commentBox.classList.contains("open");
        // Show the comment container for this post
        if (value) {
          commentBox.classList.remove("open");
          commentContainer.style.display = "none";
        } else {
          commentBox.classList.add("open");
          commentContainer.style.display = "block";
        }

        //fetch comments
        gettingComments(postBox.id, showCommentTag);

        //create new comment
        const writeCommentInput = postBox.querySelector(".writeComment");
        const sendbtnTag = postBox.querySelector(".sendbtn");
        writeCommentInput.value = "";
        // Listen for typing in the comment input
        writeCommentInput.addEventListener("keyup", (e) => {
          commentDesc = e.target.value;
          console.log("comment", commentDesc);
        });
        sendbtnTag.addEventListener("click", () =>
          handleComment(postBox.id, showCommentTag, writeCommentInput)
        );
      });
    });
    //click like icon
    const icons = document.querySelectorAll(".like");
    for (const icon of icons) {
      icon.addEventListener("click", async (e) => {
        const postBox = e.target.closest(".postBox");
        const likeBoxInput = postBox.querySelector(".likeBox");
        const likedUserIds = await gettingLikeOfPost(postBox.id);
        handleLike(postBox.id, likedUserIds, likeBoxInput);
      });
    }
    //click trash icon
    const trashs = document.querySelectorAll(".bx-trash");
    for (const trash of trashs) {
      trash.addEventListener("click", async () => {
        const trashId = trash.id;
        handleDeletePost(trashId);
      });
    }
    //click post profile
    const postProfiles = document.querySelectorAll(".postProfile");
    for (const profile of postProfiles) {
      profile.addEventListener("click", () => {
        localStorage.setItem("profileUserId", profile.id);
        location.replace(
          "/Social-media-app(Task-2)/frontend/public/profile.html"
        );
      });
    }
  } catch (err) {
    console.log("postError", err);
  }
};
gettingPosts();

//add Post
let file;
let desc;

//add desc
const descTag = document.querySelector(".postDesc");
descTag.addEventListener("keyup", (e) => {
  desc = e.target.value;
  console.log("postDescription", desc);
});

//add image
const imageInput = document.querySelector("#file");
const imgTag = document.querySelector(".image");
imageInput.addEventListener("change", function (e) {
  file = e.target.files[0];
  console.log("selectedFile", file);
  if (file) {
    imgTag.style.display = "block";
    imgTag.src = URL.createObjectURL(file);
  }
});

//click post button
const btnTag = document.querySelector(".postBtn");
btnTag.addEventListener("click", (e) => {
  handleClick(e);
});

const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return (data = await res.json());
  } catch (err) {
    console.log(err);
  }
};

const handleClick = async (e) => {
  e.preventDefault();
  let imgUrl = "";
  if (file) imgUrl = await upload(file);
  try {
    const res = await fetch("http://localhost:3000/post/addPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ desc, img: imgUrl }),
    });
    const data = await res.json();
    console.log("Post submitted:", data);
    imgTag.style.display = "none";
    descTag.value = "";
    gettingPosts();
    return data;
  } catch (err) {
    console.log(err);
  }
};

//delete post
const handleDeletePost = async (trashId) => {
  try {
    const res = await fetch("http://localhost:3000/post/deletePost", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ trashId }),
    });
    const data = await res.json();
    console.log("Post deleted:", data);
    gettingPosts();
  } catch (err) {
    console.log("DeletePostError", err);
  }
};

//fetching html
fetch("leftProfile.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("left").innerHTML = data;
    document.querySelector(".leftImage").src = currentUser.profilePic
      ? `./upload/${currentUser.profilePic}`
      : `./defaultPic/defaultUser.jpg`;
    document.querySelector(".leftName").innerHTML = currentUser.name;
  });

fetch("rightProfile.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("right").innerHTML = data;
  });
