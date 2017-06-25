var photos, albums, posts, users;
var getPhotos, getAlbums, getPosts, getUsers;

//This variable is a count to determine the posts to be loaded
//Starting for the recent post (index 9);
var postIndex;

//store the data on a variable.
function storeObject(type, data) {
    
    if(type == "photos") {
        photos = data;
        return "Photos done!";
    }
    
    else if (type == "posts") {
        posts = data;
        return "Posts done!";
    }    
    
    else if (type == "albums") {
        albums = data;
        return "Albums done!";
    }    
    
    else if (type == "users") {
        users = data;
        return "Users done!";
    }
    
    else {
        console.log("There was a problem.");
    }
}


//Gets the certain data from json depending on type
function getIt(type) {
    var root = 'http://jsonplaceholder.typicode.com/';
                return $.ajax(root+type, {
                                method: 'GET'
                                 }).then(function(data) {
                                    return storeObject(type, data);
                                });
}

//Promises to get the data.
getUsers = new Promise(function(resolve, reject) {
                                resolve(getIt("users"));    
                         });
getAlbums = new Promise(function(resolve, reject) {
                                resolve(getIt("albums"));
});

getPhotos = new Promise(function(resolve, reject) {
                                resolve(getIt("photos"));
});

getPosts = new Promise(function(resolve, reject) {
                                resolve(getIt("posts"));
});


//This function returns the name of the user, given the ID.
function searchUser(theId) {
    var x = 0;
    
    console.log(theId);
    while(x < users.length) {

        if(users[x].id == theId) {
            return users[x].username;
        }
        
        x++;
    }
    
    return "No name";
    
}


function createPosts(titleValue, authorValue, bodyValue, theUserID) {
    //Separate this to create posts
    var postDiv = $("<div></div>");
    var pBody = $("<p></p>");
    var title = $("<h1></h1>");
    var pAuthor = $("<p>By: </p>");
    var theLink = $("<a></a>");
    
    //Create the link.
    theLink.html(authorValue);
    theLink.attr({
        class: theUserID
        //href: "profile.html"//change this to the profile html.

    }); //sets the name as the UserID to identify who's the person to be placed on the profile.

    pAuthor.append(theLink); //add the link to the div with "by"
    
    //set the post to have an id of "post" (CAN CHANGE)
    postDiv.attr("class", "post");
    pBody.html(bodyValue); //add the body value
    title.html(titleValue); //add the title value
    
    
    //append them all to the post Div.
    postDiv.append(title);
    postDiv.append(pAuthor);
    postDiv.append(pBody);
    
    
    //Append the newly created post to the postContainer
    //$("div#postContainer").append(postDiv);
    $(postDiv).hide().appendTo("div#postContainer").fadeIn(500);
}

function createSeeMore() {
    var seeMoreDiv = $("<div></div>");
    

    seeMoreDiv.html("See more");
    seeMoreDiv.attr("id", "seeMore");
    
    $(seeMoreDiv).hide().appendTo("div#postContainer").slideDown(150, "swing");
}


function loadPosts() {
    
  
    var i;
    var theUserID;
    var theAuthor; //name of the author of the post.
    
    if(postIndex != -1) {
        //Load the 10 recent posts from each user (always loads ten)
        for(i = 0; i < 10; i++) {
             //get UserID
             theUserID = posts[postIndex].userId;

            //get the name of the author, given the user ID.
             theAuthor = searchUser(theUserID);

            //Create post
             createPosts(posts[postIndex].title,
                         theAuthor,
                         posts[postIndex].body,
                         theUserID);
            postIndex--;
        }
        
            //Add a see more text here.
            createSeeMore();   
    }
    
    else {
        console.log("no more posts.")
    }
    
    console.log("PostIndex update: " + postIndex);

    

    
}


$("document").ready(function() {
    
    //Get objects, and perform necessary tasks needed.
    getPhotos.then(function(result) {
        console.log(result);
        return getAlbums;
    }).then(function(result) {
        console.log(result);
        return getPosts;
    }).then(function(result) {
        console.log(result);
        return getUsers;
    }).then(function(result) {
        console.log(result)
        
        //checking purposes
        console.log(photos);
        console.log(users);
        console.log(albums);
        console.log(posts);
        
        //If error occurs, check this.
        postIndex = posts.length - 1; //Index of the posts.

        //checking purposes
        console.log("FIRST LOAD POST: " + postIndex);
        
        //Preload posts needed.
        loadPosts();
    });
    
    
    //When clicked,  redirects user to the profile page of specific username clicked(PLUS the iduser //value).
    $(document).on("click", "div.post a", function() {
        //Checking the classname value.
//        console.log("User ID: " + $(this).attr("class"));
//        console.log("Only anchors inside div#post is selected.");
        window.location.href = "profile.html?userID=" +  $(this).attr("class");
    });
     
    
    //When see more is clicked, load next ten.
    $(document).on("click", "#seeMore", function() {
        
        //delete current see more
        $("#seeMore").slideUp(150,"swing", function() {
            $(this).remove();
        });
        
        //then load the next posts (tracked by indexPosts)
        if(postIndex != -1) 
            loadPosts();
        else {
            setTimeout(function() {
                var noMore = $("<div></div>");
            
                noMore.attr("id", "noMore");
                noMore.html("No more post to be shown.");
                $(noMore).hide().appendTo("div#postContainer").slideDown(150, "swing");
            }, 500);
            
        }
    });
    
    
});







