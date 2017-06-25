var photos, albums, posts, users; //collection of all
var getPhotos, getAlbums, getPosts, getUsers; //functions

var theUser;
var ownAlbum = [0], ownPosts = [0], ownPhotos = [0]; //specifically for that certain user.
var albumIndex = 0, ownPostsIndex = 0, ownPhotosIndex = 0;
var temp = (window.location.href).split("=");

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

function setUserTab() {
   //var temp = (window.location.href).split("=");
    
    searchUser(temp[1]);
        
    console.log("UserID: " + temp[1] + " Username: " + theUser.username);
    $("span.userName").html(theUser.username);
    $("#tabSwipe").tabs({ 'swipeable': true });
}

function fillupData() {
    //Fill up personal information
    $("span#name").html(theUser.name);
    $("span#email").html(theUser.email);
    $("span#phone").html(theUser.phone);
    $("span#website").html(theUser.website);
    

    //fill up address
    $("span#street").html(theUser.address.street);
    $("span#suite").html(theUser.address.suite);
    $("span#city").html(theUser.address.city);
    $("span#zipcode").html(theUser.address.zipcode);
    
    //fill up company
    $("span#compName").html(theUser.company.name);
    $("span#phrase").html(theUser.company.catchPhrase);
    $("span#business").html(theUser.company.bs);
}

function getMyPost() {
    var theID = temp[1];
    var i;
    console.log("inside postCount: " + theID);
    
    for(i = 0; i < posts.length; i++) {
        if(theID == posts[i].userId) {
            ownPosts[ownPostsIndex] = posts[i];
            ownPostsIndex++;
        }
    }
    
    console.log("Total posts: " + ownPosts.length);
    return ownPosts.length;
    
}

function createPosts() {
    var aUl = $("<ul></ul>");
    var aLi;
    var divHead;
    var divBody;
    var i; //index;
    var tempIndex;
    var size;

    size = getMyPost();
    tempIndex = size - 1;
    aUl.attr("class", "collapsible popout");
    
    
    
    //For loop
    for(i = 0; i < size; i++) {
        
        //get title
        divHead = $("<div></div>");
        divHead.attr("class", "collapsible-header");
        divHead.html(ownPosts[tempIndex - i].title);
    
        //get body
        divBody = $("<div></div>");
        divBody.attr("class", "collapsible-body");
        divBody.html(ownPosts[tempIndex - i].body);
        
        //append to li
        aLi = $("<li></li>");
        aLi.append(divHead);
        aLi.append(divBody);
        
        //append to ul
        aUl.append(aLi);
    }
    
    
    $("div#posts").append(aUl);
    $('.collapsible').collapsible(); 
    //Do not place this before the append. It will not work.
}

function getMyAlbums() {
    var theID = temp[1];
    var i;
    
    console.log("Inside getMyalbum: " + theID);
    
    for(i = 0; i < albums.length; i++) {
        if(theID == albums[i].userId) {
            ownAlbum[albumIndex] = albums[i];
            albumIndex++;
        }
    }
    
    console.log("Album size: " + ownAlbum.length);
}

function setRecentUploads() {
    var i;
    var index;
    getMyAlbums();
    index = ownAlbum.length - 1;
    
    for(i = 0; i < 3; i++) {
        if(i == 0) {
            $("li#recentA1").html(ownAlbum[index].title);
            $("li#recentA1").attr("class", ownAlbum[index].id);

        }
        
        else if(i == 1) {
            $("li#recentA2").html(ownAlbum[index].title);
            $("li#recentA2").attr("class", ownAlbum[index].id);
        }
        
        else {
            $("li#recentA3").html(ownAlbum[index].title);
            $("li#recentA3").attr("class", ownAlbum[index].id);
        }
        
        index--;
    }
}

function setRecentPosts() {
    var i;
    var index;
    index = ownPosts.length - 1;
    
    for(i = 0; i < 3; i++) {
        if(i == 0) {
            $("li#recentP1").html(ownPosts[index].title);
            $("li#recentP1").attr("class", ownPosts[index].id);

        }
        
        else if(i == 1) {
            $("li#recentP2").html(ownPosts[index].title);
            $("li#recentP2").attr("class", ownPosts[index].id);
        }
        
        else {
            $("li#recentP3").html(ownPosts[index].title);
            $("li#recentP3").attr("class", ownPosts[index].id);
        }
        
        index--;
    }
}

function createAlbums(){
    console.log("Inisde createAlbums: " + ownAlbum.length);
    var size = ownAlbum.length;
    var i;
    var index = size - 1;
    var anchor;
    
    for(i = 0; i < size; i++) {
        //create anchor
        anchor = $("<a></a>");
        anchor.attr("class", "collection-item");
        
        //add an id (which will be passed on href)
        anchor.attr("id", ownAlbum[index].id);
        
        //add value inside anchor tag
        anchor.html(ownAlbum[index].title);
        
        
        //append to the collection
        $("div.collection").append(anchor);
        
        //decrement index
        index--;
        
    }
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
        fillupData();
        createPosts();
        setRecentUploads();
        setRecentPosts();
        createAlbums();
        document.title = theUser.username;
       
    });
    
    $(document).on("click", "div.collection a", function() {
        var albumID;
        var name = theUser.username;
        albumID = $(this).attr("id");
        console.log(name + " " + albumID); 
        window.location.href = "profileSpecificAlbum.html" + "?" + "albumID=" + albumID;
    });
    
    
});







