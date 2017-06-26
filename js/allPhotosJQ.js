var photos, albums, posts, users; //collection of all
var getPhotos, getAlbums, getPosts, getUsers; //functions


var theUser; //Stores the user that owns the photo.
var thePhoto; //that certain photo
var theAlbum; //Stores the album that contains the photo
var photoIndex; //Stores the index of the photo, from the last.

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





function loadPhotos() {
    var i;
    var imgElement;
    
    if(photoIndex != -1) {
        for(i = 0; i < 15; i++) {
            imgElement = $("<img>"); //create img
            imgElement.attr({ 
                class: photos[photoIndex].id, //give class as pic id
                src: photos[photoIndex].thumbnailUrl //git the url to display photo
            });

            //append to photoJar
            $("#photoJar").append(imgElement);

            photoIndex--;
        }
    }
    
    else{
        alert("There are no longer any photos!");
    }
    
    console.log("PhotoIndex (After LoadPhoto call): " + photoIndex);
}

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

function searchPhoto(picID) {

    var x = 0;
    
    while(x < photos.length) {
        if(picID == photos[x].id)
            return photos[x];
        
        x++;
    }
    
    return "NOTFOUND!";
}

function searchAlbum(albumId) {
    var x = 0;
    
    while (x < albums.length) {
        if(albumId == albums[x].id) {
            return albums[x];
        }
        x++;
    }
    
    return "NOTFOUND!";
}

function setUpDisplayPhoto(picID) {
    var temp; //placeHolder for ids
    
    //get that photo
    thePhoto = searchPhoto(picID);
    console.log("Search for photo: " + thePhoto.id);
    console.log("Photo found: " + thePhoto.id);
    
    //find the album
    theAlbum = searchAlbum(thePhoto.albumId);
    console.log("Search for album: " + thePhoto.albumId);
    console.log("Album found: " + theAlbum.id);
    
    //find the user
    searchUser(theAlbum.userId);
    console.log("Search for user: " + theAlbum.userId);
    console.log("User found: " + theUser.id);
    
    
    //display the Photo
    $("#picName").html(thePhoto.title);
    $("img#viewPhoto").attr("src", thePhoto.url);
    $("#userName").html(theUser.username);
    $("#albumName").html(theAlbum.title);
    
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
        
        
        //Get photoIndex
        photoIndex = photos.length - 1; //This will ensure that we'll start //from the last.
        
        console.log("PhotoIndex START: " + photoIndex);
        loadPhotos();

    });
    
    //On click, view its name, album, author.
    $(document).on("click", "div#photoJar img", function() {
       var picID;
       picID = $(this).attr("class");
       console.log("Photo id: " + picID); 
        
        //change the class to yes to make the linking of html page work.
        if($("a#albumName").attr("class") == "no" &&
           $("a#userName").attr("class") == "no") {
            
            $("a#userName").attr("class", "yes");
            $("a#albumName").attr("class", "yes");
            $("span#By").html("By: ");
            $("span#From").html("From album: ");
            
        }

        setUpDisplayPhoto(picID);
        
    });
    
    
    //On click, just load more photos
    $(document).on("click", "a#showMore", function() {
       
        loadPhotos(); 
        
    });
    
    //On click on user, send in the id.
    $(document).on("click", "a#userName", function() {
         if($(this).attr("class") != "no") {
            console.log("The user ID: " + theUser.id); 
            window.location.href = "profile.html?userID=" + theUser.id;
         }
         else {
             console.log("Please select a photo");
         }
    });
    
    //on click on album, send in the albumID
    $(document).on("click", "a#albumName", function() {
       if($(this).attr("class") != "no") {
           console.log("The album ID: " + theAlbum.id); 
           window.location.href = "profileSpecificAlbum.html" + "?" + "albumID=" + theAlbum.id;
        }
        else {
            console.log("Please select a photo");
        }
    });
    
});







