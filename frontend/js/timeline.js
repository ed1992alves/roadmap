var timeline = null;
var items;

// Configuration for the Timeline
var options = {
    editable:{
      add: false,         // add new items by double tapping
      updateTime: true,  // drag items horizontally
      updateGroup: true, // drag items from one group to another
      remove: false,       // delete an item by tapping the delete button top right
      overrideItems: false  // allow these options to override item.editable
    },
    format:{
      minorLabels:{
        day: 'D, ddd',
      }
    },
    verticalScroll: true,
    zoomable: false,
    zoomMax: 1000 * 60 * 60 * 24 * 7,     // 1 week
    zoomMin: 1000 * 60 * 60 * 24 * 7, 
    orientation: 'top',
    showCurrentTime:false,
    timeAxis: {scale: 'day', step: 1},
    minHeight: this.innerHeight - 98,
    maxHeight: this.innerHeight - 98,
    onMove: function(item,callback){
      event.stopPropagation();
      console.log("Stop");
      changeContentInterface(item);
    }
  };


// Create a DataSet (allows two way data-binding)
function itemsManually()
{
    items = new vis.DataSet([
        {id: 1, className: "Medium", content: 'item 1', start: '2018-04-20', detail: ["Era uma vez uma historinha muito engraçada inventada pelo Edgar."]},
        {id: 2, className: "Medium", content: 'item 3', start: '2018-06-18', detail: ["Tururu uma vez uma historinha muito parva inventada pelo Edgar.", "Tururu uma vez uma historinha muito parvinha inventada pelo Edgar."]},
        {id: 3, className: "Medium", content: 'item 4', start: '2018-06-16', end: '2018-07-19'},
        {id: 4, className: "Critical", content: 'item 6', start: '2018-06-27'},
        {id: 5, className: "High", content: 'item 7', start: '2018-04-10', end: '2018-06-13'},
        {id: 6, className: "Critical",content: 'item 8', start: '2018-07-10', end: '2018-07-13'},
    ]); 
    startTimeline();
}

function getItem(i){
    return items._data[i];;
}

function newItem(startDate, endDate){
    return { start: startDate, end : endDate, className: 'Medium', detail: ""};
}

function addItem(id, className, content, startDate, endDate, detail){
    items.add({id: id, className: className, content: content , start: startDate, end: endDate, detail:detail})
    timeline.setItems(items);
    timeline.setSelection(id);
    timeline.moveTo(items._data[id].start);
}

function changeItemDates(index, startDate, endDate){
  items._data[index]['start'] = startDate;
  items._data[index]['end'] = endDate;
  timeline.setItems(items);
  timeline.setSelection(index);
}

function changeItem(index, data){
    
   items._data[index].content = data['content'];
   items._data[index]['className'] = data['className'];
   items._data[index]['start'] = data['startDate'];
   items._data[index]['end'] = data['endDate'];
   items._data[index]['detail'] = data['detail'];
    
   timeline.setItems(items);
   timeline.setSelection(index);
   timeline.moveTo(items._data[index].start);
}

function removeItem(indice){
    items.remove(indice);
}

function changeOptions(zoomMax, zoomMin, timeAxis){
    options.zoomMax= zoomMax;
    options.zoomMin= zoomMin; 
    options.timeAxis = timeAxis;

    timeline.setOptions(options);
    timeline.moveTo(timeline.getCurrentTime());
}

function moveTimeline(){
  timeline.moveTo(timeline.getCurrentTime());
}

function changePriority(data){

  items = new vis.DataSet(data);
  timeline.setItems(items);
}

function startTimeline(data){
    
    items = new vis.DataSet(data);
    timeline = new vis.Timeline(container, items, options);
    timeline.moveTo(timeline.getCurrentTime());
  
    timeline.on('rangechanged', function(e){
      if(e.byUser)
        enableToday(true);
    });

    timeline.on('select', function (props) {
        isToday(new Date(items._data[props.items].start));
        showModal(props.items);
    });
  
    timeline.on('click', function(props){ 
  
      if(props.what == "axis"){
        firstDay = props.time.getFullYear()+'-'+ formatNumber(props.time.getMonth()+1) +'-' + formatNumber(props.time.getDate()) + ' 00:00:00';
        lastDay = props.time.getFullYear()+'-'+ formatNumber(props.time.getMonth()+1) +'-' + formatNumber(props.time.getDate()) + ' 23:59:59';
        showModal(0,firstDay, lastDay);
      }
      
    });
  
  }

