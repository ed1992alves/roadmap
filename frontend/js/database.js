base_ip = 'localhost';
base_url = 'http://' + base_ip +'/project-roadmap-website/backend/index.php/api';
userName= 'Edgar Costa';
userId=1;


//get All users
function getUsers(){
    $.ajax({
      contentType: "text/plain",
      type: 'GET',
      data: {
          format: 'json'
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
      },
      success: function(data){
          data = JSON.parse(data);
          users = data['data'];
      },
      url: base_url+'/users'
  })
}

//get All events 
async function getEvents(firstPriority, secondPriority){

    url = base_url+'/events/priority/' + userId + '&' +firstPriority +'&'+ secondPriority;

    if(secondPriority == null)
    {
        url = base_url+'/events/priority/' + userId + '&' +firstPriority 
    }

    if(firstPriority == null){
        url = base_url+'/events/'+userId;
    }

    return new Promise(function(resolve, reject) {
        $.ajax({
            contentType: "text/plain",
            type: 'GET',
            data: {
                format: 'json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                itemsManually();
                reject(textStatus);
            },
            success: function(data){
                data = JSON.parse(data);
                resolve(data);
            },
            url: url,
        })
    });
}

//Get information of an event by id
async function getInfoByEvent(i){
    return new Promise(function(resolve, reject) {
    $.ajax({
        contentType: "text/plain",
        type: 'GET',
        data: {
            format: 'json'
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            reject(textStatus);
        },
        success: function(data){
            data = JSON.parse(data);
            resolve(data);
        },
        url: base_url+'/usersbyevent/'+ items._data[i].id
      })
    });
}

// Edit Event 
function changeContent(postForm, i){
    $.ajax({
      type: 'PATCH',
      data: postForm,
      dataType: 'json',
      url: base_url+'/changeevent/'+i,
      success: function(data) {
          // Do something with the result
          changeItem(i, postForm);
      },
      error: function(result){
        console.log('error'+ result);
      }
    });
  }

// Edit date
function changeDates(postForm, i){
    $.ajax({
      type: 'PATCH',
      data: postForm,
      dataType: 'json',
      url: base_url+'/changeeventdates/'+i,
      success: function(data) {
          changeItemDates(i,postForm['startDate'], postForm['endDate']);
      },
      error: function(result){
        console.log('error'+ result);
      }
    });
  }

/* Submit new event*/
function sendNewEvent(postForm){
    console.log(postForm);
    $.ajax({
         type: "POST",
         url: base_url+'/addevent',
         data: postForm,
         dataType: 'json',
         success: function(data){
           addItem(data['id'], postForm.className, postForm.content , postForm.startDate, postForm.endDate, postForm.detail);
       },
       error: function(result){
        console.log('error'+ result);
      }
         
     });
}

// Delete event
function deleteEvent(indice){
    $.ajax({
      type: 'DELETE',
      url: base_url+'/deleteevent/'+indice,
      success: function(data) {
          // Do something with the result
          removeItem(indice);
      },
      error: function(result){
        console.log('error'+ result);
      }
    });
  }

function getUserName(){

    return [{name: userName}];
}

