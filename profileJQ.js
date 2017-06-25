var photos, albums, posts, users;
var getPhotos, getAlbums, getPosts, getUsers;
var userName;


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

function setUserTab() {
    var temp = (window.location.href).split("=");
    userName = searchUser(temp[1]);
        
    console.log("UserID: " + temp[1] + " Username: " + userName);
    $("span#userName").html(userName);
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
        console.log(window.location.href);
        

        setUserTab();
        $("#tabSwipe").tabs({ 'swipeable': true });
    });
    
    
    
});







