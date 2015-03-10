/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        buildAddPage();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var db = window.openDatabase("todo", "1.0", "ToDo", 1000000);
db.transaction(function(trans) {
    trans.executeSql("CREATE TABLE IF NOT EXISTS Todo (description, user, time)");
    getTodos(trans);
});



$( "#user-flip" ).bind( "change", function(event, ui) {
    window.localStorage.setItem("user", $(this).val());
    $("#user-setting").text(window.localStorage.getItem("user"));
    db.transaction(function(trans) {
        getTodos(trans);
    })
});
$( "#time-flip" ).bind( "change", function(event, ui) {
    window.localStorage.setItem("time", $(this).val());
    $("#time-setting").text(window.localStorage.getItem("time"));
    db.transaction(function(trans) {
        getTodos(trans);
    })
});
$("#btnSubmit").click(function() {
    var description = $('#inputDescription').val();
    var user = $('#inputUser').val();
    var time = $('#inputTime').val();

    addTodo(description, user, time);

    $('#inputTime').val('');
    $('#inputUser').val('');
    $('#inputDescription').val('');
});
$("#addlink").click(function() {
    buildAddPage();
})

function errorCB(err) {
    alert("Error processing SQL: " + err.message);
    return true;
}

function getTodos(trans) {
    trans.executeSql('SELECT * FROM Todo', [], function(trans, results){
        var htmlRows = '';
        var len = results.rows.length;
        for (var i=0; i<len; i++){
            htmlRows += '<tr><td>'
            if(window.localStorage.getItem("time") === "on") {
                var time = results.rows.item(i).time;
                console.log(time);
                if (time === 'undefined') {
                    time = '-';
                }
                htmlRows += time + '</td><td>'
            }
            htmlRows += results.rows.item(i).description + '</td>';
            if(window.localStorage.getItem("user") === "on") {
                var user = results.rows.item(i).user;
                console.log(user);
                if (user === "undefined") {
                    user = '-';
                }
                htmlRows += '<td>' + user + '</td>';
            }
            htmlRows += '</tr>'
        }

        $('#results > tbody').html(htmlRows);
    }, errorCB);
}

function addTodo(description, user, time) {
    db.transaction(function(trans){ 
        trans.executeSql('INSERT INTO Todo (description, user, time) VALUES (?,?,?)', [ description, user, time ]);
        getTodos(trans);
    }, errorCB);
}

function buildAddPage() {
    htmlInputs ='';
    if(window.localStorage.getItem("time") === "on") {
        htmlInputs += '<input id="inputTime" type="text" placeholder="When should you do it?"/></br>';
    }
    if(window.localStorage.getItem("user") === "on") {
        htmlInputs += '<input id="inputUser" type="text" placeholder="Who should do it?"/></br>';
    }
    $('#inputfields').html(htmlInputs);
}