const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = +localStorage.getItem("profileUserId");
const profileBox = document.querySelector(".userProfileBox");
const postsBox = document.querySelector(".userPosts");
const profileUpdatBox = document.querySelector(".updateBox");

document.querySelector(".icon4").addEventListener("click", () => {
  profileUpdatBox.style.display = "none";
});

const handleUpdate = async () => {
  profileUpdatBox.style.display = "block";
};

const handleFollow = async () => {
  const userRelationship = JSON.parse(localStorage.getItem("relationship"));
  const fetching = userRelationship.includes(currentUser.id)
    ? `http://localhost:3000/follow/deleteRelationship`
    : `http://localhost:3000/follow/addRelationship`;
  try {
    const res = await fetch(fetching, {
      method: userRelationship.includes(currentUser.id) ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ followedUserId: userId }),
    });
    const data = await res.json();
    console.log("ReturnData", data);
    location.reload();
    localStorage.removeItem("relationship");
  } catch (err) {
    console.log("Error", err);
  }
};

const gettingClickUser = async () => {
  try {
    const res = await fetch(`http://localhost:3000/users/find/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    const userData = await res.json();
    console.log("userData", userData);
    const relationshipData = await gettingRelationship();
    console.log("userRelationship", relationshipData);
    const childProfileBox = document.createElement("div");
    childProfileBox.className = "childProfileBox";
    childProfileBox.innerHTML = `
       <div class="profileBox">
      <div class="coverPicBox">
        <img src="./upload/${userData.coverPic}" class="coverPic" />
      </div>
      <div class="profilePicBox">
        <img src="./upload/${
          userData.profilePic
        }" class="profilePic" />                      
      </div>
      <div class="parentInfo">
      <div class="userInfoBox">
          <h3 class="profileUsername">${userData.name}</h3>  
      <div class="infoBox">
            <div class="contactIcons">
            <i class='bx bxl-facebook icon3'></i>
            <i class='bx bxl-instagram icon3'></i>
            <i class='bx bxl-telegram icon3'></i>
            <i class='bx bxl-linkedin icon3'></i>
            <i class='bx bxl-twitter icon3'></i>
           </div>
           <i class='bx bx-dots-vertical-rounded icon3'></i>          
          </div>
          <button type="button" class=${
            userData.id === currentUser.id ? "updateBtn" : "followBtn"
          }>${
      userData.id === currentUser.id
        ? "Update"
        : relationshipData.includes(currentUser.id)
        ? "Following"
        : "Follow"
    }</button>
        </div>
        </div>
    </div>
    `;
    profileBox.append(childProfileBox);
    if (userData.id === currentUser.id) {
      const updateBtnTag = document.querySelector(".updateBtn");
      updateBtnTag.addEventListener("click", () => handleUpdate());
    } else {
      const btnTag = document.querySelector(".followBtn");
      btnTag.addEventListener("click", () => handleFollow());
    }
  } catch (err) {
    console.log("UserProfileError", err);
  }
};
gettingClickUser();

//get relationship for this user
const gettingRelationship = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/follow/getRelationship?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const relationships = await res.json();
    localStorage.setItem("relationship", JSON.stringify(relationships));
    console.log("relationship", relationships);
    return relationships;
  } catch (err) {
    console.log("relationshipError", err);
  }
};

//get post for this user
const gettingUserPosts = async () => {
  postsBox.innerHTML = "";
  try {
    const res = await fetch(
      `http://localhost:3000/post/getPost?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const postData = await res.json();
    let posts = [...postData];
    console.log("postData", postData);
    for (const post of posts) {
      const likes = await gettingLikeOfPost(post.id);
      const likeIcon = likes.includes(currentUser.id)
        ? `<i class="bx bxs-heart icon2 like"></i>`
        : `<i class="bx bx-heart icons like"></i>`;
      console.log("likeData", likes);
      const box = document.createElement("div");
      box.className = "postBox";
      box.id = post.id;
      box.innerHTML = `
        <div class="info">
           <div class="info2">
            <img class="userProfile postProfile" id=${
              post.userId
            } src="./upload/${post.profilePic}"/>
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
                <img class="userProfile" src="./upload/${
                  currentUser.profilePic
                }"/>
                <input type="text" class="writeComment" placeholder="Write a comment"/>
            </div>              
              <button type="button" class="postBtn sendbtn">Send</button>
          </div>
          <div class="comments"></div>
        </div>
        `;
      postsBox.append(box);
      //click comment box
      const commentBoxs = document.querySelectorAll(".comment");
      commentBoxs.forEach((commentBox) => {
        commentBox.addEventListener("click", (e) => {
          const postBox = e.target.closest(".postBox");
          console.log("postId", postBox.id);
          const commentContainer = postBox.querySelector(".commentContainer");
          const showCommentTag = postBox.querySelector(".comments");
          // Show the comment container for this post
          const isOpen = commentBox.classList.contains("open");
          commentBox.classList.toggle("open");
          commentContainer.style.display = isOpen ? "none" : "block";
          //fetch comments
          if (!isOpen) {
            gettingComments(postBox.id, showCommentTag);
          }

          //create new comment
          const writeCommentInput = postBox.querySelector(".writeComment");
          const sendbtnTag = postBox.querySelector(".sendbtn");

          // Listen for typing in the comment input
          if (!writeCommentInput.classList.contains("listener-attached")) {
            writeCommentInput.addEventListener("keyup", (e) => {
              commentDesc = e.target.value;
            });
            writeCommentInput.classList.add("listener-attached");
          }

          if (!sendbtnTag.classList.contains("listener-attached")) {
            sendbtnTag.addEventListener("click", () =>
              handleComment(postBox.id, showCommentTag, writeCommentInput)
            );
            sendbtnTag.classList.add("listener-attached");
          }
          writeCommentInput.value = "";
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
    }
  } catch (err) {
    console.log("userPostsError", err);
  }
};
gettingUserPosts();

//update profile
let coverfile;
let pofilefile;
let profileName = "";

//update name
const nameTag = document.querySelector(".updateName");
nameTag.addEventListener("keyup", (e) => {
  profileName = e.target.value;
  console.log("updatedName", profileName);
});

//update cover image
const coverImageInput = document.querySelector("#coverFile");
console.log("cover", coverImageInput);
const coverImgTag = document.querySelector(".coverImage");
coverImageInput.addEventListener("change", function (e) {
  coverfile = e.target.files[0];
  console.log("selectedCoverFile", coverfile);
  if (coverfile) {
    coverImgTag.style.display = "block";
    coverImgTag.src = URL.createObjectURL(coverfile);
  }
});

//update profile image
const profileImageInput = document.querySelector("#profileFile");
const profileImgTag = document.querySelector(".profileImage");
profileImageInput.addEventListener("change", function (e) {
  pofilefile = e.target.files[0];
  console.log("selectedCoverFile", pofilefile);
  if (pofilefile) {
    profileImgTag.style.display = "block";
    profileImgTag.src = URL.createObjectURL(pofilefile);
  }
});

//click update button
const updateBtn = document.querySelector(".profileBtn");
updateBtn.addEventListener("click", (e) => {
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
  let coverUrl;
  let profileUrl;
  coverUrl = coverfile ? await upload(coverfile) : currentUser.coverPic;
  profileUrl = pofilefile ? await upload(pofilefile) : currentUser.profilePic;
  try {
    const res = await fetch("http://localhost:3000/users/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: profileName ? profileName : currentUser.name,
        coverPic: coverUrl,
        profilePic: profileUrl,
      }),
    });
    const data = await res.json();
    console.log("Post submitted:", data);
    location.reload();
    return data;
  } catch (err) {
    console.log(err);
  }
};

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
          <img class="userProfile" src="./upload/${comment.profilePic}"/>
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
    location.reload();
  } catch (err) {
    console.log("DeletePostError", err);
  }
};

//fetching html
fetch("leftProfile.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("leftPage").innerHTML = data;
    document.querySelector(
      ".leftImage"
    ).src = `./upload/${currentUser.profilePic}`;
    document.querySelector(".leftName").innerHTML = currentUser.name;
  });

fetch("rightProfile.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("rightPage").innerHTML = data;
  });
