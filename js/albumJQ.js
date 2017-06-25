var photos, albums, posts, users; //collection of all
var getPhotos, getAlbums, getPosts, getUsers; //functions

var albumID; 
var theUser;
var theAlbum;
var myPhotos = [0];
var photoIndex = 0; //keep track on where to put the photo object.


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
    var found = false
    
    while(x < users.length &&!found) {
        
        if(users[x].id == theId) {
            theUser = users[x];
            found = true;
        }
        
        x++;
    }
    if(found == false)
        theUser = null;
    
}

function searchAlbum() {
    var x = 0;
    
    while(x < albums.length) {
        if(albums[x].id == albumID) {
            return albums[x];
        }
        x++;
    }
    
    return "ALBUM NOT FOUND";
}


//sets up the value for use
//Plus sets up the tag albume title and who made it.
function setUpValues() {
    var temp = (window.location.href).split("=");
    albumID = temp[1];
    console.log(albumID);
    
    
    
    theAlbum = searchAlbum();
    searchUser(theAlbum.userId);
    console.log(theAlbum.title + " " + theUser.username);
    $("h1#albumTitle").html(theAlbum.title);
    $("span#username").html(theUser.username);
    
}

function getMyPhotos() {
    var x;
    console.log("PHOTOINDEX BEFORE: " + photoIndex);
    for (x = 0; x < photos.length; x++) {
        if(photos[x].albumId == albumID) {
            myPhotos[photoIndex] = photos[x];
            photoIndex++;
        }
    }
    
    console.log("PHOTOINDEX AFTER: " + photoIndex);
    console.log("myPhotos: " + myPhotos.length);
    console.log(myPhotos[49].id);
}

function showPhotos() {
    var x;
    var anImg;
    var index = myPhotos.length - 1; //I will be using the index from the last (latest //photo)
    
    console.log("INDEX BEFORE: " + index);
    for(x = 0; x < myPhotos.length; x++) {
        anImg = $("<img>");
        anImg.attr({src: myPhotos[index].url,
                class: "materialboxed",
                width: "150"
               });
    anImg.attr("data-caption", myPhotos[index].title + " by " + theUser.username + "; From: " + theAlbum.title);
    
    $(".container").append(anImg);
    $(".materialboxed").materialbox();
        index--;
    }
    console.log("index after: " + index);
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
        
        //Gets the albumID and userID
        setUpValues();
        //get the photos for this album.
        getMyPhotos();
        
        //by default, it only shows a max of 15.
        showPhotos();
 
    });
    
 
    
    
});







