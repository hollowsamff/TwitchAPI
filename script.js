    $("document").ready(function() {
  //Twitch usera
  var twitchUser =["ESL_SC2","OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"];
  //Used to find not live streams
  var oldTwitchUsers = [];
  
  runAjax();
       
//Function that is used to set the tracker to default        
function resetTrackerValues(){
        //Stops user pressing button again till the steams have loaded - stops error when the user press the button when effects are runing(the not active stream boxes move down a line everytime the buttom is pressed)
        $("#allLineButton").css("display","none");
        $("#allLineButton").prop('disabled', true);
        
        setTimeout(function() {
          
          $("#allLineButton").prop('disabled', false);
          $("#allLineButton").fadeIn(0); 
          
       }, 1500);
        
        //Remove old values - function that shows the offline streams uses append so old values need to be cleared
        $(".cardOffLine").remove();      
        $("#MainPageLink").html("Twitch Tv Tracker - All Streams");
      
        runAjax();
        } 
      
 ////////Button events
  $("button").on("click", function(e) {
    e.preventDefault() ;

    var buttonSelected = this.id;
        
    switch(buttonSelected){
        
      case "allLineButton": //Refresh stream values
        
        $("#messagesToUser").html("");
        $("#addChannelForm").fadeOut(0);    
        $("#addFindForm").fadeOut(0); 
        resetTrackerValues();

      break;  
        
      case "onLineButton": //Show active streams  
       $("#messagesToUser").html("");
       $("#MainPageLink").html("Twitch Tv Tracker - Online Streams");
       $(".cardOnLine").fadeIn(1000);
       $(".cardOffLine").fadeOut(1000);
       $("#addChannelForm").fadeOut(1000);    
       $("#addFindForm").fadeOut(1000);  
        
      break;
      
      case "offLineButton": //Show not active streams 
      $("#messagesToUser").html("");  
      $("#MainPageLink").html("Twitch Tv Tracker - Offline Streams");
      $(".cardOffLine").fadeIn(1000);  
      $(".cardOnLine").fadeOut(1000);
      $("#addChannelForm").fadeOut(1000);    
      $("#addFindForm").fadeOut(1000);   
        
      break;
       
      case "findChannel":
       
       $("#messagesToUser").html(""); 
       $("#MainPageLink").html("Twitch Tv Tracker - Find Stream"); 
       $(".cardOffLine").fadeIn(1000);  
       $(".cardOnLine").fadeIn(1000); 
       $("#addChannelForm").fadeOut();    
        
       $("#inputSearch").val(""); 
       $("#addFindForm")
      .stop(true, true)
      .show("clip", { direction: "horizontal" }, 500)
      .animate({ opacity: 1 }, { duration: 0, queue: false });
 
      break;
        
      case "addChannel":
    
       $("#messagesToUser").html(""); 
       $("#MainPageLink").html("Twitch Tv Tracker - Add Stream"); 
       $(".cardOffLine").fadeIn(1000);  
       $(".cardOnLine").fadeIn(1000); 
       
       $("#addFindForm").fadeOut();
       
        
       $("#inputChannel").val("");   
       $("#addChannelForm")
      .stop(true, true)
      .show("clip", { direction: "horizontal" },500)
      .animate({ opacity: 1 }, { duration: 0, queue: false });

      break; 
        
      default:
       
       $("#MainPageLink").html("Twitch Tv Tracker - All Streams");
       $(".cardOffLine").fadeIn(1000);  
       $(".cardOnLine").fadeIn(1000); 
       $("#addChannelForm").fadeOut(1000);    
       $("#addFindForm").fadeOut(1000);  
     
      break;
        
    };
  
  });//End function
                         
 /////////////////////////Find live users function   
  function runAjax() {

    $.ajax({
     
      url: "https://api.twitch.tv/kraken/streams?channel=" + twitchUser + "",
      dataType: "json",
      type: "GET",
      headers: { "Client-ID": "w51kxvu5oulvwi4krcwwumhkxdjwsw" },
      success: function(data) {
        console.log(data);

        try { //Stop errors when the data object is empty  - i.e when no streams are found

          //Send ajax requests for all the users in array and add vales to variable
          for (var i = 0; i < data.streams.length; i++){
       
            var streamDescription =
              "<b>Now playing: </b> " +
              data.streams[i].game +
              "-" +
              data.streams[i].channel.status;
            var steamUrl = data.streams[i].channel.url;
            var logo = data.streams[i].channel.logo;
            var channelName = data.streams[i].channel.display_name;
            var followers =
              "<b>Followers:</b> " + data.streams[i].channel.followers + "<br>";
            var totalViews =
              "<b>Total Views:</b> " + data.streams[i].channel.views + "<br>";
            var streamView = "<b>Views:</b> " + data.streams[i].viewers;

            
            //Add the stream user channels to an array
            oldTwitchUsers.push(channelName);
            
            //Only append the values if they have not been appended befor - when the last index is equal to the first index
            if (oldTwitchUsers.lastIndexOf(channelName) === oldTwitchUsers.indexOf(channelName)){
              
              $("#quoteHolder").append(
              "<div class='cardOnLine card-outline-success'  id='"+channelName+"' style='width: 17rem;'><div class='online'><b><a target='_blank' href='https://www.twitch.tv/"+channelName+"'>"+channelName +"</a><button  name='"+channelName+"' class='closeStreamIcon'>x</button>&nbsp;<br>Online</b></div><img style='height: 11rem;' class='card-img-top' src='" + logo + "' alt='Card image cap'><div class='card-block'><p class='card-text online-text'>" +
                followers +
                totalViews +
                streamDescription +
                "<br>" +
                streamView +
                "</div></div></p>"
                  
                );  
              
            }
            //Remove duplicates from array
            oldTwitchUsers = oldTwitchUsers.filter(function(currentValue, currentIndex, array) {
    
            if (currentIndex != array.indexOf(currentValue)){

                  //alert("Duplicate value has been removed"); 
             }
            //alert(arr.indexOf(currentValue));  
            return currentIndex == array.indexOf(currentValue);

            });
            
            //Code to remove the live users from the twitch users array 
            if (twitchUser.indexOf(channelName) !== -1) { //Check if they are in the array
              
               var searchIndex = $.inArray(channelName,twitchUser); 
               twitchUser.splice(searchIndex,1);//Then remove found value from array      

            }         

           }//End for

          var random = Math.random();
          var fadetype = 0;

          if (random < 0.5) {
            fadetype = "horizontal";
          } else {
            fadetype = "vertical";
          }

          //Show stream user data
          $(".cardOnLine")
            .stop(true, true)
            .show("clip", { direction: fadetype }, 1500)
            .animate({ opacity: 1 }, { duration: 1500, queue: false });
 
           //Find offline streams     
           allStreams();
          
        }catch (e) {
          if (e instanceof TypeError) {  //When error happens show error message
            console.log("Couldn't access data object");
          }
        } //End catch
      }, //End success

      cache: false
      
    }); //End ajax
  
  }//End function

      
/////////////////////////Find not live users function 
  function allStreams() {
   
    //loop though the twitchUser array
    for(var i = 0; i < twitchUser.length; i++){
      
      duplicatesInUserArray();
      
  }

    ////Find all offline users
    for (var i = 0; i < twitchUser.length; i++) {
      $.ajax({
        url: "https://api.twitch.tv/kraken/channels/" + twitchUser[i] + "",
        dataType: "json",
        type: "GET",
        headers: { "Client-ID": "w51kxvu5oulvwi4krcwwumhkxdjwsw" },
        success: function(data) {

          //var steamUrl = data.streams[i].channel.url;
          var logo = data.logo;
          var channelName = data.display_name;
          var followers = "<br><b>Followers:</b> " + data.followers + "<br>";
          var totalViews = "<b>Total Views:</b> " + data.views + "<br>";
          //var streamView = "<b>Views:</b> "+ data.streams[i].viewers;
         
          $("#quoteHolder").append(
           "<div class='cardOffLine' id='"+channelName+"' style='width: 17rem;'><div class='offline'><b><a target='_blank' href='https://www.twitch.tv/"+channelName+"'>"+channelName+"</a><button name='"+channelName+"' class='closeStreamIcon'>x</button><br>Offline</b></div><img style='height: 5rem;' class='card-img-top' src='"+
              logo +"'alt='User profile image'><div class='card-block'><p class='card-text offline-text'>" +
              followers +
              totalViews +
              "</div></div></p>"
          );

          var random = Math.random();
          var fadetype = "";

          if (random < 0.5) {
            fadetype = "horizontal";
          } else {
            fadetype = "vertical";
          }

          //Show data
          $(".cardOffLine")
            //.stop(true, true)
            .show("clip", { direction: fadetype }, 1000)
            .animate({ opacity: 1 }, { duration: 1000, queue: false });
        }
      });
    } //End for
 
  }//End function
  
 //////////Used to test if there any duplicate in the array that holds all the twitch users 
  function duplicatesInUserArray(){
    
      //Test for duplicates fuction from https://stackoverflow.com/questions/16747798/delete-duplicate-elements-from-an-array
      //filter() iterates over all the elements of the array and returns only those for which the callback returns true. 
     //.indexOf() returns the index of the leftmost element in the array. If there are duplicate elements, then they will be removed when their index is compared to the leftmost one.
      
    /* currentValue stores values from the array - indexof return the first index of an item an array ( the index of currentValue in this case) 
    currentIndex stores the current postion being checked - if the postition being checked and the postion of currentValue are differnt that means the values exists more than once in the array - only return values were the indexes are the same (no duplicates)
    */
     
    //arr is old array , index is current position in array ,  currentValue is value being checked
    twitchUser = twitchUser.filter(function(currentValue, currentIndex, array) {
    
        if (currentIndex != array.indexOf(currentValue)){
            
              //alert("Duplicate value has been removed"); 
         }
        //alert(arr.indexOf(currentValue));  
        return currentIndex == array.indexOf(currentValue);
      
    })
       
  }
     
/////////Function to add a user to the tracker  - when add channel button is pressed
    
 $(document).on("click", "#submit", function(e) {
  e.preventDefault();

    var contant = $("#inputChannel").val().trim().toLowerCase();
   
     //Remove old values - function that shows the offline streams uses append so old values need to be cleared
     $(".cardOffLine").remove();      
     $("#MainPageLink").html("Twitch Tv Tracker - All Streams");
     //Check if stream user exists    
     $.ajax({   
      url: "https://api.twitch.tv/kraken/channels/" + contant ,
      dataType: "json",
      type: "GET",
      headers: { "Client-ID": "w51kxvu5oulvwi4krcwwumhkxdjwsw" },
      timeout: 1000,
      success: function(data){ 
      console.log(data);
        
         //Add users that exist to the array
         twitchUser.push(data.display_name);
          //alert(twitchUser);
         duplicatesInUserArray();
         //Add user to the array that holds all the users
         twitchUser.push(data.display_name);
         resetTrackerValues();
         
         //$("#addChannelForm").fadeOut(1000);
         $("#messagesToUser").html("The '"+contant+"' channel  was add to the tracker");
       
     }, 
      error: function(xhr, textStatus, errorThrown){
       
        //$("#addChannelForm").toggle(1000);  
        resetTrackerValues();
        $("#messagesToUser").html("The '"+contant+"' channel does not exist")
    
      }
       
     });
   
  
}); 
  
//////////Remove all stream box but the one with the id identical to the search
 $(document).on("click", "#showSeachStream", function(e) { 
 // e.preventDefault(); 
  e.preventDefault();

  var contant = $("#inputSearch").val().trim();
    
   if(!contant){
     
     contant = "nothing";
     
   }
   
    $(".cardOffLine").fadeOut();
    $(".cardOnLine").fadeOut();
    $("#"+contant+"").fadeIn(1000);//Every box has the same id as the stream title
 
    $("#messagesToUser").html("Search result from '"+contant+"' (search is case sensative)<br>");
   
 });
      
           
//////////Remove stream box when the cross button is pressed
 $(document).on("click", ".closeStreamIcon", function(e) { 
 // e.preventDefault(); 

  var id =  this.name ;
   
   $("#"+id+" ").fadeOut(); 
   
     var random = Math.random();
          var fadetype = "";

          if (random < 0.5) {
            fadetype = "horizontal";
          } else {
            fadetype = "vertical";
          }
   
   var options = {};
$("#"+id+" ").hide( "clip", options, 1000, callback );
   

 });
      
      
}); //End document ready


    
