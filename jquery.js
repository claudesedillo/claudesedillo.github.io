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
    
    while(x <= users.length) {
        
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
        class: theUserID,
        href: "profile.html"//change this to the profile html.

    }); //sets the name as the UserID to identify who's the person to be placed on the profile.

    pAuthor.append(theLink); //add the link to the div with "by"
    
    //set the post to have an id of "post" (CAN CHANGE)
    postDiv.attr("id", "post");
    pBody.html(bodyValue); //add the body value
    title.html(titleValue); //add the title value
    
    
    //append them all to the post Div.
    postDiv.append(title);
    postDiv.append(pAuthor);
    postDiv.append(pBody);
    
    
    //Append the newly created post to the postContainer
    $("div#postContainer").append(postDiv);
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
    }
    
    else {
        console.log("no more posts.")
    }
    
    console.log("PostIndex update: " + postIndex);

    
    //Add a see more text here.
    //createSeeMore();   
    
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
//        console.log(photos);
//        console.log(users);
//        console.log(albums);
//        console.log(posts);
        
        postIndex = posts.length - 1; //Index of the posts.
        
        //checking purposes
        console.log("FIRST LOAD POST: " + postIndex);
        
        //Preload posts needed.
        loadPosts();
        
    });
    
    
    //When clicked, 
    $(document).on("click", "a", function() {
        //Checking the classname value.
        console.log("User ID: " + $(this).attr("class"));
        
        //Call a function that would go to the profile and set up all data
        //regarding the user, based from the userID.
        
        //setUpProfile();
    })
     

});






