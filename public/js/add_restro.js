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

function create_new_restaurant(name, description, photo_url, address, pincode, gst){
    obj = {
        name:name,
        description:description,
        photo_url:photo_url,
        tax_percent:gst,
        address:address,
        pincode:pincode
    }
    $.ajax({
        type: "POST",
        url: BASE_URL+"/add_restaurant",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json",
        headers: {"X-Auth-Token": jwt_token},
        success: function (response) {
            if(response.hasOwnProperty("error")){
                alert(response.error)
            }else{
                setCookie("rest_id", response.restaurant_id, 30)  
                check_if_jwt_exists_and_go_to_admin_panel();       
            }
        },
        statusCode: {
           401: function(xhr) {
               var obj = JSON.parse(xhr.responseText)
               alert(obj.error)
           }
       },
       failure: function(reponse){
           alert(reponse)
       }
    });
}


function check_if_jwt_exists_and_go_to_admin_panel(){
    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")

    if(jwt_token!=null && rest_id!=null){
        window.location = "RestroHome.html";
    }else if(jwt_token==null)
        window.location = "signIn.html";
}

function addRestro(e){
    e.preventDefault();
    
    res_name = $('#res-name').val()
    gst = $('#gst').val()
    addr = $('#addr').val()
    Pincode = $('#Pincode').val()
    description = $('#description').val()
    photo_url = "https://www.travelandleisureindia.in/wp-content/uploads/2019/12/Express-inn-feature-2.jpg"

    create_new_restaurant(res_name, description, photo_url ,addr, Pincode, gst)
}


function check_if_jwt_exists_and_go_to_admin_panel(){
    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")

    if(jwt_token==null){
        window.location = "signIn.html";
    }else if(rest_id!=null)
        window.location = "RestroHome.html";
}

$(document).ready(function() {
    check_if_jwt_exists_and_go_to_admin_panel()
    jwt_token = getCookie("jwt_token")
});