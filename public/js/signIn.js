// Global variables
BASE_URL = "https://admin-fine-dine.herokuapp.com/api/v1/admin"

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

$(document).ready(function() {
    if(getCookie("jwt_token")!=null)
    window.location = "RestroSelection.html";
});

function _log_in_admin(email, password){
    obj = {
        email:email,
        password:password
    }
     $.ajax({
         type: "POST",
         url: BASE_URL+"/authenticate",
         data: JSON.stringify(obj),
         dataType: "json",
         processData: false,
         contentType: "application/json",
         success: function (response) {
             if(response.hasOwnProperty("error")){
                 alert(response.error)
             }else{
             setCookie("jwt_token", response.jwt_token, 30)
             window.location = "RestroSelection.html";
             }
         },
         statusCode: {
            401: function(xhr) {
                var obj = JSON.parse(xhr.responseText)
                alert(obj.error)
            }
        },
        failure: function(reponse){
            console.log(reponse)
        }
     }); 
}

function loginAdmin(e){
    e.preventDefault();

    email = document.getElementById("email").value;
    pass = document.getElementById("pass").value;

    _log_in_admin(email, pass)
}