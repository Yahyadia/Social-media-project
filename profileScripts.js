// const baseUrl = "https://tarmeezacademy.com/api/v1"    

function getCurrentUserId()
{
    // console.log(window.location.search)
    const urlParams = new URLSearchParams(window.location.search)
    var id = urlParams.get("Id")
    return id    
}

// console.log(yes)

setupUI()
showProfileDetails()
profilePosts()

function showProfileDetails()
{
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    .then(function(response) {
        // console.log(response.data.data)
        const user = response.data.data
        document.getElementById("profile-image").src = user.profile_image
        document.getElementById("profile-email").innerHTML = user.email
        document.getElementById("profile-name").innerHTML = user.name
        document.getElementById("profile-username").innerHTML = user.username
        // POSTS & COMMENTS COUNTS
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
    })
}

function profilePosts ()
{    
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then(function (response) {                
        let posts = response.data.data        
        console.log(posts);

        document.getElementById("user-posts").innerHTML = ""
        for(post of posts){    
            console.log(post)
            let postTitle = ""
            if(post.title != null){
                postTitle = post.title
            }

            // SHOW EDIT BTN OR NOT
            let user = JSON.parse(localStorage.getItem("user"))
            let isMyPost = user != null && user.id == post.author.id                

            let editBtnContent = ""

            if(isMyPost){
                editBtnContent = `
                    <button class="btn btn-primary float-end mx-1" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    <button class="btn btn-danger float-end" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                `
            }
            // alert(user)
            // console.log(tags)
            // let postTitle = post.title
            // if(postTitle == null){
                //     postTitle = ``
                // }نفس الفكرة فوق 
                let content = `
                    <div class="card shadow-lg mb-3">
                        <div class=" card-header">
                            <img class="rounded-circle border border-1" src="${post.author.profile_image}" alt="" style="width: 40px; height:40px;">
                            <b>${post.author.username}</b>
                            ${editBtnContent}
                        </div>
                        <div class="card-body" style="cursor: pointer" onclick="postClicked(${post.id})">
                            <img class="w-100" src="${post.image}" alt="">
                            <h6 style="color: hsl(0, 0%, 40%);">${post.created_at}</h6>
                            <h4 class="">${post.title}</h4>
                            <p>${post.body}</p>
                            <hr>
                            <div id="tags">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                </svg>
                                <span>(${post.comments_count}) Comments</span>                      
                                <span id="tag-posts-${post.id}">                                            
                                </span>
                            </div>
                        </div>
                    </div>`
                // console.log(post)
                document.getElementById("user-posts").innerHTML += content 

                const currentPostTagsId = `tag-posts-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML += "" 
                let tags = post.tags
                    
                for(tag of tags){       
                    let content =
                        `
                            <span class="bg-secondary p-2 rounded-5 text-white">${tag.name}</span> 
                        `              
                    document.getElementById(currentPostTagsId).innerHTML += content
                        
                }
        }
    })
}    