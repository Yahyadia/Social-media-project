
let currentPage = 1
let lastPage = 1
setupUI()
getAllPosts()
// ///////////////////////////////////////////////////////////////////////////////////////////// INFINTITE SCROLL,,PAGINATION
window.addEventListener("scroll", function()
{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeightff;
    console.log(window.innerHeight , window.pageYOffset , document.body.offsetHeight)
    if (endOfPage && currentPage <= lastPage) {
        currentPage = currentPage += 1
        getAllPosts(currentPage, false)
        // console.log(lastPage)
    }
})

    // ///////////////////////////////////////////////////////////////////////////////////////////// GET ALL POSTS
function getAllPosts (page = 1, reload = true)
{
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then(function (response) {                
        let posts = response.data.data        
        // console.log(posts);
        lastPage = response.data.meta.last_page 
        // console.log(response.data.meta.last_page)
        if(reload){
            document.getElementById("posts").innerHTML = ``
        }

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
                            <span onclick="usernameClicked(${post.author.id})"  style="cursor: pointer">
                                <img class="rounded-circle border border-1" src="${post.author.profile_image}" alt="" style="width: 40px; height:40px;">
                                <b>${post.author.username}</b>
                            <span/>
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
                document.getElementById("posts").innerHTML += content 

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
    .finally(() => {
        toggleLoader(false)
    })
}    





/////////////////////////////////////////////////////////////////////////////////////////////// POST CLICKED
function postClicked(postId)
{
    // const token = localStorage.getItem("token")
    // console.log(token)
    // alert(postId)
    window.location = `postDetails.html?Id=${postId}`
}





/////////////////////////////////////////////////////////////////////////////////////////////// POST CLICKED
function usernameClicked(userId)
{
    // const token = localStorage.getItem("token")
    // console.log(token)
    alert(userId)
    window.location = `profile.html?Id=${userId}`
}
