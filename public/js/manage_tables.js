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

function getAllTables(){

    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")
    
    $.ajax({
        type: "GET",
        url: BASE_URL+"/all_tables?restaurant_id="+rest_id,
        dataType: "json",
        contentType: "application/json",
        headers: {"X-Auth-Token": jwt_token},
        success: function (response) {
            if(response.hasOwnProperty("error")){
                alert(response.error)
            }else if(response.hasOwnProperty("tables")){
                tables = response.tables
                tables.forEach(element => {
                    $('#create_new_table').after(`
                <div id="card-${element.id}" class="p-4 w-full lg:w-1/3">
                <div class="h-5/6 shadow-md bg-opacity-75 px-8 pt-16 pb-24 rounded-xl overflow-hidden text-center relative border-2 border-gray-200">
                    <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">${element.name}</h1>
                    <button class="border-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 my-8 rounded-lg outline-none remove_table" id="${element.id}">Remove</button><br>
                    <a class="cursor-pointer text-indigo-500 inline-flex items-center mb-10 hover:text-blue-700 download_qrcode" onclick="getQRCode(${element.id})">Download QR
                        <img src="Download.svg">
                    </a>
                </div>
                </div>
                `)
                });    

            }else alert('Unknown Response'+response)
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

function createTable(){
    check_if_jwt_exists()
    table_name = $('#table-name').val()

    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")

    obj = {
        restaurant_id: rest_id,
        table: table_name
    }

    $.ajax({
        type: "POST",
        url: BASE_URL+"/create_table",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        headers: {"X-Auth-Token": jwt_token},
        success: function (response) {
            if(response.hasOwnProperty("error")){
                alert(response.error)
            }else if(response.hasOwnProperty("table_id")){
                $('#create_new_table').fadeOut();
                $('#table-name').val('')
                alert("Table created")
                table_id = response.table_id
                
                $('#create_new_table').after(`
                <div id="card-${table_id}" class="p-4 w-full lg:w-1/3">
                <div class="h-5/6 shadow-md bg-opacity-75 px-8 pt-16 pb-24 rounded-xl overflow-hidden text-center relative border-2 border-gray-200">
                    <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">${table_name}</h1>
                    <button class="border-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 my-8 rounded-lg outline-none remove_table" id="${table_id}">Remove</button><br>
                    <a class="cursor-pointer text-indigo-500 inline-flex items-center mb-10 hover:text-blue-700 download_qrcode" onclick="getQRCode(${table_id})">Download QR
                        <img src="Download.svg">
                    </a>
                </div>
                </div>
                `)
            }else alert('Unknown Response'+response)
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

function getQRCode(table){
    console.log("fetching qr code for id "+ table)
    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")

    $.ajax({
        type: "GET",
        url: BASE_URL+"/code?restaurant_id="+rest_id+"&table="+table,
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(reponse)
            if(response.hasOwnProperty("error")){
                alert(response.error)
            }else {
                console.log(response)
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

$(document).on('click', '.remove_table', function(){
    table_id = this.id
    console.log(table_id)

    $.ajax({
        type: "DELETE",
        url: BASE_URL+"/table?id="+table_id,
        dataType: "json",
        contentType: "application/json",
        headers: {"X-Auth-Token": jwt_token},
        success: function (response) {
            if(response.hasOwnProperty("error")){
                alert(response.error)
            }else if(response.hasOwnProperty("success")){
                console.log(response)  
                alert("Table has been removed")
                $("#card-"+table_id).fadeOut();
            }else alert('Unknown response')
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
})

$('#btn-create').click(function(){
    $('#create_new_table').fadeIn();
})

function check_if_jwt_exists(){
    jwt_token = getCookie("jwt_token")
    rest_id = getCookie("rest_id")

    if(jwt_token==null)
        window.location = "signIn.html";
    else if(rest_id==null)
        window.location = "RestroSelection.html";
}

$(document).ready(function() {
    check_if_jwt_exists()
    getAllTables()
});