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
    window.location = "https://admin-fine-dine.herokuapp.com/admin/panel";
});

function _create_admin(f_name, l_name, email, phone, password){
 obj = {
    f_name:f_name,
    l_name:l_name,
    email_id:email,
    contact:phone,
    password:password
}
 $.ajax({
     type: "POST",
     url: BASE_URL+"/create_admin",
     data: JSON.stringify(obj),
     dataType: "json",
     processData: false,
     contentType: "application/json",
     success: function (response) {
        setCookie("jwt_token", response.jwt_token, 30)
        window.location = "https://admin-fine-dine.herokuapp.com/admin/panel";
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

function createAdmin(e){
    e.preventDefault();

    fname = document.getElementById("fname").value;
    lname = document.getElementById("lname").value;
    email = document.getElementById("email").value;
    phone = document.getElementById("phone").value;
    pass = document.getElementById("pass").value;

    console.log(fname)
    console.log(lname)
    console.log(email)
    console.log(pass)
    console.log(phone)

    _create_admin(fname, lname, email, phone, pass)
}