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
      console.log("de");
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
          <img class="userProfile postProfile" id=${
            post.userId
          } src="./upload/${post.profilePic}"/>
          <span class="userName">${post.name}</span>
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
                <img class="userProfile" src=${currentUser.profilePic}/>
                <input type="text" class="writeComment" placeholder="Write a comment"/>
            </div>              
              <button type="button" class="postBtn sendbtn">Send</button>
          </div>
          <div class="comments"></div>
        </div>
        `;
      postsBox.append(box);
    }
  } catch (err) {
    console.log("userPostsError", err);
  }
};

gettingUserPosts();

//get like post
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

//update profile
let coverfile;
let pofilefile;
let profileName;

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
        name: profileName,
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
