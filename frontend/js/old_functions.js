function getFirstDate(){
    var aux = new Date(items._data[1].start);
    var aux2 = 1; 

    for(i=1; i< items.length; i++){
        if (aux >= new Date(items._data[i].start))
        {
          aux = new Date(items._data[i].start);
          aux2= i;
        }
    }
    return [aux,aux2];
  }

  function getLastDate(){
    var aux = new Date(items._data[1].start);
    var aux2 = 1; 

    for(i=1; i<= items.length; i++){

        if (aux < new Date(items._data[i].end))
        {
          aux = new Date(items._data[i].end);
          aux2= i;
        }
    }
    return [aux,aux2];
  }

  function goToFirstEvent(){
    [first_date, first_index] = getFirstDate();
    timeline.moveTo(first_date);
    timeline.setSelection(first_index);
    cleanLayout();
    addContent(first_index);
    $(".firstOneButton").attr('disabled','disabled');
    $(".lastOneButton").removeAttr('disabled');
  }

  function goToLastEvent(){
    [last_date, last_index] = getLastDate();
    timeline.moveTo(last_date);
    timeline.setSelection(last_index);
    cleanLayout();
    addContent(last_index);
    $(".firstOneButton").removeAttr('disabled');
    $(".lastOneButton").attr('disabled','disabled');
  }