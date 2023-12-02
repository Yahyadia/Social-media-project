const baseUrl = "https://tarmeezacademy.com/api/v1"    


function setupUI(){
    let token = localStorage.getItem("token")
    let user = JSON.parse(localStorage.getItem("user"))       
    
    const LoginDiv = document.getElementById("login-div")
    const LogoutDiv = document.getElementById("logout-div")
    const createPostBtn = document.getElementById("add-post-btn")
    const profileBtn = document.getElementById("profile-btn")
    // const commentDiv = document.getElementById("comment-div")
    
    if(token == null){
        if(createPostBtn != null){
            createPostBtn.style.display = "none"
        }
        profileBtn.style.setProperty("display", "none" , "important")
        LogoutDiv.style.setProperty("display", "none" , "important")
        LoginDiv.style.setProperty("display", "block" , "important")                
        
    }else{        
        if(createPostBtn != null){
            createPostBtn.style.display = "block"
        }    
        LoginDiv.style.setProperty("display", "none" , "important")
        LogoutDiv.style.display = "block"        
        profileBtn.style.setProperty("display", "block" , "important")
        imageAndUser ()
    }
}



function toggleLoader(show = true){
    if(show){
        document.getElementById("loader").style.setProperty("display", "block" , "important")
    }else{
        document.getElementById("loader").style.setProperty("display", "none" , "important")
    }
}
// ///////////////////////////////////////////////////////////////////////////////////////////// LOGIN
function loginBtnClicked(){
        
    const username = document.getElementById("usernameInput").value
    const password = document.getElementById("passwordInput").value
    // console.log(username,password)
    toggleLoader(true)
    axios.post(`${baseUrl}/login`, {
        username: username,
        password: password
    })
    .then(function (response) {
        console.log(response);
        const token = response.data.token 
        const user = response.data.user 
        console.log(token, user)
        
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        
        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("loged in successfully", "success")
        setupUI()     
        // console.log(response.data.user.username)
        // console.log(response.data.user.profile_image)

        // let userName = response.data.user.username
        // const userImage = response.data.user.profile_image
        // imageUser(userName, userImage)
        // imageUser()
        showAllPosts()
    })
    .finally(() => {
        toggleLoader(false)
    })
    
}


    // ///////////////////////////////////////////////////////////////////////////////////////////// REGISTER
    function registerBtnClicked(){
        const username = document.getElementById("register-username-input").value
        const password = document.getElementById("register-password-input").value
        let namee = document.getElementById("register-name-input").value                        
        let image = document.getElementById("register-image-input").files[0]       
        
        let name = "no name"                    
        if(namee = null){
            namee = name                       
        }

        // const params = {
        //     username: username,
        //     password: password,
        //     name: name
        // }
        const url = `${baseUrl}/register`

        let formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)
        formData.append("name", name)
        formData.append("image", image)
        
        toggleLoader(true)
        axios.post(url, formData)
        .then(response => {
            // console.log(response)
            const token = response.data.token 
            const user = response.data.user 

            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))

            const modal = document.getElementById("register-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()        
            
            showAlert("New User Registered successfully", "success")
            setupUI()  

            // let userName = response.data.user.username
            // const userImage = response.data.user.profile_image
            // imageUser(userName, userImage)          

            // imageUser()
        })
        .catch(error => {
            console.log(error)
            console.log(error.response.data.message)
            const registerError = error.response.data.message
            showAlert(registerError, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })
    }
    
    
    // ///////////////////////////////////////////////////////////////////////////////////////////// LOG OUT
    function logOutBtnClicked(){
        let token = localStorage.getItem("token")
        localStorage.removeItem("token") 
        localStorage.removeItem("user")        
        showAlert("loged out succesfully", "success")
        setupUI()    
        // showAllPosts()
    }
    
    // ///////////////////////////////////////////////////////////////////////////////////////////// SHOW ALERT
    function showAlert(customMessage, alertColor){
        
        const alertPlaceholder = document.getElementById('success-alert')
        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                    `   <div>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                
                alertPlaceholder.append(wrapper)
            }
        appendAlert(customMessage, alertColor)    
        //todo: HIDE AELRT
        setTimeout(()=>{
            const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
            // const modal = document.getElementById("success-alert")
            // const modalInstance = bootstrap.Modal.getInstance(alert)
            // modalInstance.hide()
            // alert.hide()
        },2000)
    }
    // show()
    
    
    //////////////////////////////////////////////////////////////////// CREATE NEW POSTS AND UPDATE
    function createPostBtnClicked (){
        toggleLoader(true)
        let postId = document.getElementById("is-edit-input").value
        let isCreate = postId == null || postId == ""
        // alert(isCreate)

        const titleInput = document.getElementById("post-title-input").value
        const bodyInput = document.getElementById("post-body-input").value
        const imageInput = document.getElementById("post-image-input").files[0]
        
        const token = localStorage.getItem("token")
        console.log(token)
        
        let formData =new FormData()
        formData.append("title", titleInput)
        formData.append("body", bodyInput)
        formData.append("image", imageInput)
        
        const config = {
            headers: {
                "content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        }
        
        let url = ``

        if(isCreate){
            url = `${baseUrl}/posts`            
        }else{
            formData.append("_method", "put")
            url = `${baseUrl}/posts/${postId}`
        }
        axios.post(url, formData, config)
        .then(response => {
            console.log(response)
            if(isCreate){                    
                showAlert("post has created successfully", "success")
            }else{
                showAlert("post has updated successfully", "success")
            }
            
            const modal = document.getElementById("create-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            getAllPosts()
        })
        .catch(error => {            
            const registerError = error.response.data.message
            showAlert(registerError, "danger")            
        })
        .finally(() => {
            toggleLoader(false)
        })    
    }
    
    ////////////////////////////////////////////////////////////////////////////////////// PROFILE IMAGE AND USERNAME

    function imageAndUser (){
        // let token = localStorage.getItem("token")
        let user = JSON.parse(localStorage.getItem("user"))
        
        document.getElementById("user-image").src = user.profile_image
        document.getElementById("user-account").innerHTML = user.username
        
    }

    /////////////////////////////////////////////////////////////////////////////////////////////// DELETE BTN CLICKED

function deletePostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("post-id").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

/////////////////////////////////////////////////////////////////////////////////////////////// CONFIRM DELETE BTN CLICKED

function ConfirmDeleteBtnClicked()
{
    const postId = document.getElementById("post-id").value
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            // "content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }
    const url = `${baseUrl}/posts`

    axios.delete(`${url}/${postId}`, config)
    .then(function (response) 
    {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("Post has deleted successfully", "success")
        getAllPosts()
    })
    .catch(error => {
        console.log(error)
        showAlert(error.response.data.error_message, "danger" )
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////// EDIT POST CLICKED
function editPostBtnClicked(postObject)
{   
    // alert(check)
    let post = JSON.parse(decodeURIComponent(postObject))
    // console.log(post)
    document.getElementById("is-edit-input").value = post.id 
    document.getElementById("modal-post-submit-btn").innerHTML = "Update"
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    document.getElementById("post-image-input").files[0] = post.image
    // alert("hello")
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

/////////////////////////////////////////////////////////////////////////////////////////////// NEW POST BTN CLICKED

function newPostBtnClicked()
{
    document.getElementById("is-edit-input").value = "" 
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create a new post"
    document.getElementById("modal-post-submit-btn").innerHTML = "Create"
    
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

/////////////////////////////////////////////////////////////////////////////////////////////// PROFILE CLICKED

function profileClicked()
{
    const user =  JSON.parse(localStorage.getItem("user")) 
    console.log(user.id)
    window.location = `profile.html?Id=${user.id}`
}