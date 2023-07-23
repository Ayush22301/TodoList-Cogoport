
var todolist = [];

var categories = [];

var priorities = [];

var activity = [];

let typeOfRender = 0 , dateFilterStart , dateFilterEnd , exactVal;


let c = 0;
function getNewId(){
    return c++;
}

function createTask(details,category,dueDate,isDone,priority,tags)
{
    return {id:getNewId(),taskDetails:details,category:category,dueDate:dueDate,isDone:isDone,priority:priority,tags:tags,subTasks:[]};
}

function renderItem(list,item){
    var li = document.createElement("li");
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkbox";
    checkBox.id = item.id;
    checkBox.setAttribute('onclick','checkItem(this)')
    var textDiv = document.createElement("div");
    textDiv.appendChild(document.createTextNode(String(item.taskDetails)));
    var adSubButton = document.createElement("button");
    adSubButton.id = item.id;
    adSubButton.setAttribute('onclick','addSubTasks()');
    adSubButton.appendChild(document.createTextNode("+Subtask"));
    var viewButton = document.createElement("button");
    viewButton.id = item.id;
    viewButton.setAttribute('onclick','viewItem()');
    viewButton.appendChild(document.createTextNode("View"));
    var deleteButton = document.createElement("button");
    deleteButton.id = item.id;
    deleteButton.setAttribute('onclick','deleteItem()')
    deleteButton.appendChild(document.createTextNode("Delete"));
    var editButton = document.createElement("button");
    editButton.id = item.id;
    editButton.setAttribute('onclick','editItem(this)')
    editButton.appendChild(document.createTextNode("Edit"));
    li.appendChild(checkBox);
    li.appendChild(textDiv);
    li.appendChild(adSubButton);
    li.appendChild(viewButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
}

function renderList(){
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    for(var i=0;i<todolist.length;i++)
    {
        if(typeOfRender===1)
        {
            if(todolist[i].dueDate<dateFilterStart || todolist[i].dueDate>dateFilterEnd)continue;
        }
        renderItem(list,todolist[i]);
    }
}

function renderSubTask(list,item){
    var li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "spaceAround"
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkbox";
    checkBox.id = item.id;
    checkBox.setAttribute('onclick','checkItem(this)')
    var textDiv = document.createElement("div");
    textDiv.appendChild(document.createTextNode(String(item.taskDetails)));
    var dateDiv = document.createElement("div");
    dateDiv.appendChild(document.createTextNode(String(item.dueDate)));
    li.appendChild(checkBox);
    li.appendChild(textDiv);
    li.appendChild(dateDiv);
    list.appendChild(li);
}

function insertTaskInCategories(cat,id){
    var idx = categories.findIndex((elmnt) => elmnt.category.toLowerCase()===cat.toLowerCase());
    if(idx===-1)
    {
        categories.push({category:cat,tasks:[id]});
    }
    else
    {
        categories[idx].tasks.push(id);
    }
}

function insertTaskInPriorities(x,id){
    var idx = priorities.findIndex((elmnt) => elmnt.priority.toLowerCase()===x.toLowerCase());
    if(idx===-1)
    {
        priorities.push({priority:x,tasks:[id]});
    }
    else
    {
        priorities[idx].tasks.push(id);
    }
}

fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < 3; i++)
    {
        var crntDay = new Date().toLocaleString();
        var task = createTask(data[i].title,"No Category",crntDay,data[i].completed,"low",[]);
        todolist.push(task);
        insertTaskInCategories(task.category,task.id);
        insertTaskInPriorities(task.priority,task.id);
    }
    typeOfRender = 0;
    console.log(todolist);
    renderList();
  })
  .catch(error => {
    console.log('Error:', error.message);
  });



function addTaskButton(){
    var prntDiv = event.target.parentNode;
    prntDiv.innerHTML = "";
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.id = "inputItem";
    inputBox.value = "";
    inputBox.placeholder = "Enter a new task";
    prntDiv.appendChild(inputBox);
    var categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "categoryItem";
    categoryInput.value = "";
    categoryInput.placeholder = "Enter the category";
    prntDiv.appendChild(categoryInput);
    var dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.class = "dateItem";
    dateInput.value = new Date().toLocaleString();
    prntDiv.appendChild(dateInput);
    var priorityInput = document.createElement("input");
    priorityInput.type = "text";
    priorityInput.id = "priorityInput";
    priorityInput.value = "";
    priorityInput.placeholder = "Choose a priority only b/w [low,med,high]";
    prntDiv.appendChild(priorityInput);
    var tagsInput = document.createElement("input");
    tagsInput.type = "text";
    tagsInput.id = "tagsInput";
    tagsInput.value = "";
    tagsInput.placeholder = "Enter Tags comma separated without space";
    prntDiv.appendChild(tagsInput);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('onclick','saveItem()');
    saveButton.appendChild(document.createTextNode("Save"));
    prntDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('onclick','cancelItem()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    prntDiv.appendChild(cancelButton);
}

// function extractDueDateFromText(todoText) {
//     const tomorrowRegex = /\btomorrow\b/i;
//     const dateRegex = /\b(\d{1,2}(st|nd|rd|th)?(?:\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+)?(?:\d{2,4})?)\b/i;
//     const timeRegex = /\b(\d{1,2}:\d{2}(?:\s+)?(am|pm))\b/i;
//     const matchTomorrow = todoText.match(tomorrowRegex);
//     const matchDate = todoText.match(dateRegex);
//     const matchTime = todoText.match(timeRegex);
//     let dueDate = null;
//     if (matchTomorrow) {
//       const today = new Date();
//       dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     } else if (matchDate) {
//       dueDate = new Date(matchDate[0]);
//     }
  
//     if (matchTime) {
//       const time = matchTime[0];
//       const [hours, minutes] = time.split(':');
//       dueDate.setHours(hours % 12 + (matchTime[2].toLowerCase() === 'pm' ? 12 : 0), minutes);
//     }
//     if (dueDate) {
//       const modifiedTodoText = todoText.replace(tomorrowRegex, '').replace(dateRegex, '').replace(timeRegex, '').trim();
//       return { dueDate, modifiedTodoText };
//     }
  
//     return { dueDate: null, modifiedTodoText: todoText };
//   }

function saveItem(){
    var prntDiv = event.target.parentNode;
    var data = prntDiv.children;
    if(data[0].value==="")
    {
        alert("Enter valid task. Data not saved");
        cancelItem();
        return;
    }
    var priority = data[3].value;
    var tagString = data[4].value;
    for(var i=0;i<tagString.length;i++)
    {
        if(tagString[i]===' ')
        {
            alert("No space in b/w, comma separated only. Data not saved");
            cancelItem();
            return;
        }
    }
    var tags = tagString.split(',');
    if(tagString==="")tags=[];
    if((priority !== "low") && (priority !== "med") && priority !== "high")
    {
        alert("Choose priority b/w low,med and high only. Data not saved");
        cancelItem();
        return;
    }
    // console.log(data);
    var datetime = new Date();
    activity.push({name:`New Task Added ${data[0].value}`,timeStamp:datetime});

    // var txt = data[0].value;
    // var dt = data[2].value;
    // console.log(dt)
    // const {x,y} = extractDueDateFromText(txt);
    // console.log(x);
    // console.log(y);
    // if(y)
    // {
    //     data[0].value = x;
    //     data[2].value = y;
    // }

    var task = createTask(data[0].value,data[1].value,data[2].value,false,data[3].value,tags);
    todolist.push(task);
    insertTaskInCategories(task.category,task.id);
    insertTaskInPriorities(task.priority,task.id);
    prntDiv.innerHTML = "";
    var addBtn = document.createElement("button");
    addBtn.id = "addTask";
    addBtn.setAttribute('onclick','addTaskButton()');
    addBtn.appendChild(document.createTextNode("Add Task"));
    prntDiv.appendChild(addBtn);
    typeOfRender = 0;
    // console.log(todolist);
    renderList();
}

function cancelItem(){
    var prntDiv = event.target.parentNode;
    prntDiv.innerHTML = "";
    var addBtn = document.createElement("button");
    addBtn.id = "addTask";
    addBtn.setAttribute('onclick','addTaskButton()');
    addBtn.appendChild(document.createTextNode("Add Task"));
    prntDiv.appendChild(addBtn);
    typeOfRender = 0;
    renderList();
}

function deleteItem()
{
    let buttonId = event.target.id;
    console.log(buttonId);
    var idx = -1;
    for (let i = 0; i < todolist.length; i++) {
        if(Number(buttonId) === todolist[i].id)
        {
            idx = i;
            break;
        }
    }
    console.log(idx);
    if (idx != -1) 
    {
        var datetime = new Date();
        activity.push({name:`Task Deleted : ${todolist[idx].taskDetails}`,timeStamp:datetime});
        todolist.splice(idx, 1);
    }
    console.log(todolist);
    typeOfRender = 0;
    renderList();
}


function viewItem()
{
    var btn = event.target;
    let prnt = btn.parentNode;
    var id = btn.id;
    var idx = -1;
    for (let i = 0; i < todolist.length; i++) {
        if(Number(id) === todolist[i].id)
        {
            idx = i;
            break;
        }
    }
    if(idx===-1)
    {
        typeOfRender = 0;
        renderList();
        return;
    }
    var datetime = new Date();
    activity.push({name:`Task Viewed : ${todolist[idx].taskDetails}`,timeStamp:datetime});

    for (let i = 0; i < 4; i++) {
        prnt.removeChild(prnt.lastChild);
    }
    prnt.style.display = "flex";
    prnt.style.flexDirection = "column";
    prnt.style.justifyContent = "space-around";
    var detail = document.createElement("div");
    detail.appendChild(document.createTextNode(`Detail : ${todolist[idx].taskDetails}`));
    var date = document.createElement("div");
    date.appendChild(document.createTextNode(`Due Date : ${todolist[idx].dueDate}`));
    var priority = document.createElement("div");
    priority.appendChild(document.createTextNode(`Priority : ${todolist[idx].priority}`));
    var category = document.createElement("div");
    category.appendChild(document.createTextNode(`Category : ${todolist[idx].category}`));
    var xyz = document.createElement("div");
    xyz.appendChild(document.createTextNode("Tags :"));
    var tagsList = document.createElement("div");
    tagsList.style.display = "flex";
    tagsList.style.gap = "2%";
    todolist[idx].tags.forEach(elmnt => {
        var innerDiv = document.createElement("div");
        innerDiv.appendChild(document.createTextNode(`${elmnt}`));
        tagsList.appendChild(innerDiv);
    });
    var xy = document.createElement("div");
    xy.appendChild(document.createTextNode("SubTasks :"));
    var subList = document.createElement("ul");
    todolist[idx].subTasks.forEach(elmnt => {
        renderSubTask(subList,elmnt);
    });
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('onclick','cancelItem()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    prnt.appendChild(detail);
    prnt.appendChild(date);
    prnt.appendChild(priority);
    prnt.appendChild(category);
    prnt.appendChild(xyz);
    prnt.appendChild(tagsList);
    prnt.appendChild(xy);
    prnt.appendChild(subList);
    prnt.appendChild(cancelButton);
}

function saveEditItem(){
    let buttonId = event.target.id;
    var idx = -1;
    for (let i = 0; i < todolist.length; i++) {
        if(Number(buttonId) === todolist[i].id)
        {
            idx = i;
            break;
        }
    }
    if(idx===-1)
    {
        typeOfRender = 0;
        renderList();
        return;
    }
    var datetime = new Date();
    activity.push({name:`Task Edited with id : ${todolist[idx].id}`,timeStamp:datetime});


    var prntDiv = event.target.parentNode;
    var data = prntDiv.children;
    if(data[0].value==="")
    {
        alert("Enter valid task. Data not saved");
        cancelItem();
        return;
    }
    var priority = data[3].value;
    var tagString = data[4].value;
    for(var i=0;i<tagString.length;i++)
    {
        if(tagString[i]===' ')
        {
            alert("No space in b/w, comma separated only. Data not saved");
            cancelItem();
            return;
        }
    }
    var tags = tagString.split(',');
    if(tagString==="")tags=[];
    if((priority !== "low") && (priority !== "med") && priority !== "high")
    {
        alert("Choose priority b/w low,med and high only. Data not saved");
        cancelItem();
        return;
    }
    var cat = todolist[idx].category;
    var ind = categories.findIndex(x => x.category===cat);
    categories[ind].tasks = categories[ind].tasks.filter(x => Number(x)!==Number(buttonId));
    insertTaskInCategories(data[1].value,Number(buttonId));
    console.log(categories);

    var p = todolist[idx].priority;
    ind = priorities.findIndex(x => x.priority===p);
    priorities[ind].tasks = priorities[ind].tasks.filter(x => Number(x)!==Number(buttonId));
    insertTaskInPriorities(data[3].value,Number(buttonId));
    console.log(priorities);

    todolist[idx].taskDetails = data[0].value;
    todolist[idx].category = data[1].value;
    todolist[idx].dueDate = data[2].value;
    todolist[idx].priority = data[3].value;
    todolist[idx].tags = tags;
    // insertTaskInPriorities(task.priority,task.id);
    renderList();
}

function editItem(button){
    let buttonId = button.id;
    let prnt = button.parentNode;
    console.log(buttonId);  
    var idx = -1;
    for (let i = 0; i < todolist.length; i++) {
        if(Number(buttonId) === todolist[i].id)
        {
            idx = i;
            break;
        }
    }
    if(idx===-1)
    {
        typeOfRender = 0;
        renderList();
        return;
    }
    prnt.innerHTML = "";
    prnt.style.display = "flex";
    prnt.style.flexDirection = "column";
    prnt.style.justifyContent = "space-around";
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.id = "inputItem";
    inputBox.value = todolist[idx].taskDetails;
    inputBox.placeholder = "Enter task";
    prnt.appendChild(inputBox);
    var categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "categoryItem";
    categoryInput.value = todolist[idx].category;
    categoryInput.placeholder = "Enter the category";
    prnt.appendChild(categoryInput);
    var dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.class = "dateItem";
    dateInput.value = todolist[idx].dueDate;
    prnt.appendChild(dateInput);
    var priorityInput = document.createElement("input");
    priorityInput.type = "text";
    priorityInput.id = "priorityInput";
    priorityInput.value = todolist[idx].priority;
    priorityInput.placeholder = "Choose a priority only b/w [low,med,high]";
    prnt.appendChild(priorityInput);
    var tagsInput = document.createElement("input");
    tagsInput.type = "text";
    tagsInput.id = "tagsInput";
    tagsInput.value = todolist[idx].tags.join(',');
    tagsInput.placeholder = "Enter Tags comma separated without space";
    prnt.appendChild(tagsInput);
    var saveButton = document.createElement("button");
    saveButton.id = buttonId;
    saveButton.setAttribute('onclick','saveEditItem()');
    saveButton.appendChild(document.createTextNode("Save"));
    prnt.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('onclick','cancelItem()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    prnt.appendChild(cancelButton);
}

function checkItem(checkBox)
{
    var divNode = checkBox.parentNode.children[1];
    if(checkBox.checked)
    {
        divNode.style.textDecoration = "line-through";
    }
    else{
        divNode.style.textDecoration = "none";
    }
}

function insertSubTask(){
    var id = event.target.id;
    var prnt = event.target.parentNode;
    var data = prnt.children;
    var subTask = {id:getNewId(),taskDetails:data[0].value,dueDate:data[1].value,isDone:"false"};
    var idx = -1;
    for (let i = 0; i < todolist.length; i++) {
        if(Number(id) === todolist[i].id)
        {
            idx = i;
            break;
        }
    }
    if(idx===-1)
    {
        typeOfRender = 0;
        renderList();
        return;
    }
    todolist[idx].subTasks.push(subTask);
    alert("Sub Task added successfully, You can now add more subtasks, stop by clicking done button");
    console.log(todolist);
    var datetime = new Date();
    activity.push({name:`SubTask ${data[0].value}  Added to: ${todolist[idx].taskDetails}`,timeStamp:datetime});
}


function addSubTasks(){
    var id = event.target.id;
    var prnt = event.target.parentNode;
    prnt.innerHTML = "";
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.id = "inputItem";
    inputBox.value = "";
    inputBox.placeholder = "Enter sub task";
    prnt.appendChild(inputBox);
    var dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.class = "dateItem";
    dateInput.value = new Date().toLocaleString();
    prnt.appendChild(dateInput);
    var savebtn = document.createElement("button");
    savebtn.id = id;
    savebtn.setAttribute('onclick','insertSubTask()');
    savebtn.appendChild(document.createTextNode("Save"));
    var donebtn = document.createElement("button");
    donebtn.id = id;
    donebtn.setAttribute('onclick','cancelItem()');
    donebtn.appendChild(document.createTextNode("Done"));
    prnt.appendChild(savebtn);
    prnt.appendChild(donebtn);
}


function cancelFilter()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "dateFilter";
    btn.setAttribute('onclick','dateRangeFilter()');
    btn.appendChild(document.createTextNode("Due Date"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
    }
    renderList();
}

function cancelFilter1()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "categoryFilter";
    btn.setAttribute('onclick','categoryFilter()');
    btn.appendChild(document.createTextNode("Category"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
    }
    renderList();
}


function cancelFilter2()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "priorityFilter";
    btn.setAttribute('onclick','priorityFilter()');
    btn.appendChild(document.createTextNode("Priority"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function cancelFilter3()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "dateSorter";
    btn.setAttribute('onclick','dateRangeSorter()');
    btn.appendChild(document.createTextNode("Due Date"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function cancelFilter4()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "prioritySorter";
    btn.setAttribute('onclick','prioritySorter()');
    btn.appendChild(document.createTextNode("Priority"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function cancelFilter5()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "exactSearch";
    btn.setAttribute('onclick','exactSearch()');
    btn.appendChild(document.createTextNode("By Exact Item"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}


function cancelFilter6()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "subSearch";
    btn.setAttribute('onclick','subSearch()');
    btn.appendChild(document.createTextNode("By Exact subTask"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function cancelFilter7()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "tagSearch";
    btn.setAttribute('onclick','tagSearch()');
    btn.appendChild(document.createTextNode("By Tags"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}


function cancelFilter8()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "partialSearch";
    btn.setAttribute('onclick','partialSearch()');
    btn.appendChild(document.createTextNode("By Partial Keywords"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}


function cancelFilter9()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "idSorter";
    btn.setAttribute('onclick','idSorter()');
    btn.appendChild(document.createTextNode("Date Added"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function cancelFilter10()
{
    var crnt = event.target.parentNode;
    var prnt = crnt.parentNode;
    crnt.innerHTML = "";
    var btn = document.createElement("button");
    btn.id = "categorySearch";
    btn.setAttribute('onclick','categorySearch()');
    btn.appendChild(document.createTextNode("By Category"));
    prnt.replaceChild(btn,crnt);
    if(typeOfRender>0)
    {
        typeOfRender = 0;
        // renderList();
    }
    renderList();
}

function dateFilter(){
    var crnt = event.target.parentNode;
    var start = crnt.children[0].value;
    var end = crnt.children[1].value;
    typeOfRender = 1;
    dateFilterStart = start;
    dateFilterEnd = end;
    renderList();
    var datetime = new Date();
    activity.push({name:"duedate filter applied",timeStamp:datetime});
}

function dateRangeFilter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[1];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("From :"));
    var startDate = document.createElement("input");
    startDate.type = "date";
    startDate.setAttribute("class","dateItem1");
    startDate.value = new Date().toLocaleString();
    innerDiv.appendChild(startDate);
    innerDiv.appendChild(document.createTextNode("To :"));
    var endDate = document.createElement("input");
    endDate.type = "date";
    endDate.setAttribute("class","dateItem1");
    endDate.value = new Date().toLocaleString();
    innerDiv.appendChild(endDate);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','dateFilter()');
    saveButton.appendChild(document.createTextNode("Ok"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function filterByCategory(){
    var cat = event.target.parentNode.children[0].value;
    var idx = categories.findIndex((elmnt) => elmnt.category.toLowerCase()===cat.toLowerCase());
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    if(idx===-1)return;
    var arr = categories[idx].tasks;
    for(var i=0;i<arr.length;i++)
    {
        var item = todolist.find((elmnt) => elmnt.id===arr[i]);
        if(item)
        {
            renderItem(list,item);
        }
    }
    var datetime = new Date();
    activity.push({name:"category filter applied",timeStamp:datetime});
}

function categoryFilter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[2];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Category :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','filterByCategory()');
    saveButton.appendChild(document.createTextNode("Ok"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter1()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function filterByPriority(){
    var p = event.target.parentNode.children[0].value;
    console.log(p);
    console.log(priorities);
    var idx = priorities.findIndex((elmnt) => elmnt.priority.toLowerCase()===p.toLowerCase());
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    if(idx===-1)return;
    var arr = priorities[idx].tasks;
    for(var i=0;i<arr.length;i++)
    {
        var item = todolist.find((elmnt) => elmnt.id===arr[i]);
        if(item)
        {
            renderItem(list,item);
        }
    }
    var datetime = new Date();
    activity.push({name:"priority filter applied",timeStamp:datetime});
}

function priorityFilter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[3];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Priority :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','filterByPriority()');
    saveButton.appendChild(document.createTextNode("Ok"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter2()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function sortList(dsc){
    if(dsc)
    {
        todolist.sort((a,b) => (a.dueDate < b.dueDate) ? 1:-1);
    }
    else
    {
        todolist.sort((a,b) => (a.dueDate > b.dueDate) ? 1:-1);
    }
    renderList();
    var datetime = new Date();
    activity.push({name:"duedate sorting applied",timeStamp:datetime});
}

function sortList1(dsc){
    const arr = {
        "low": 0,
        "med": 1,
        "high": 2
    }
    console.log(arr[todolist[0].priority]);
    if(dsc)
    {
        todolist.sort((a,b) => (arr[a.priority] < arr[b.priority]) ? 1:-1);
    }
    else
    {
        todolist.sort((a,b) => (arr[a.priority] > arr[b.priority]) ? 1:-1);
    }
    renderList();
    var datetime = new Date();
    activity.push({name:"priority sorting applied",timeStamp:datetime});
}

function sortList2(dsc){
    if(dsc)
    {
        todolist.sort((a,b) => (a.id < b.id) ? 1:-1);
    }
    else
    {
        todolist.sort((a,b) => (a.id > b.id) ? 1:-1);
    }
    renderList();
    var datetime = new Date();
    activity.push({name:"Date Added sorting applied",timeStamp:datetime});
}

function dateRangeSorter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[1];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    var ascSort = document.createElement("button");
    ascSort.setAttribute("class","dateItem1");
    ascSort.setAttribute("onclick",`sortList(${0})`);
    ascSort.appendChild(document.createTextNode("Ascending Order"));
    innerDiv.appendChild(ascSort);
    var dscSort = document.createElement("button");
    dscSort.setAttribute("class","dateItem1");
    dscSort.setAttribute("onclick",`sortList(${1})`);
    dscSort.appendChild(document.createTextNode("Decending Order"));
    innerDiv.appendChild(dscSort);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter3()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function prioritySorter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[2];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    var ascSort = document.createElement("button");
    ascSort.setAttribute("class","dateItem1");
    ascSort.setAttribute("onclick",`sortList1(${0})`);
    ascSort.appendChild(document.createTextNode("Ascending Order"));
    innerDiv.appendChild(ascSort);
    var dscSort = document.createElement("button");
    dscSort.setAttribute("class","dateItem1");
    dscSort.setAttribute("onclick",`sortList1(${1})`);
    dscSort.appendChild(document.createTextNode("Decending Order"));
    innerDiv.appendChild(dscSort);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter4()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function idSorter(){
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[3];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    var ascSort = document.createElement("button");
    ascSort.setAttribute("class","dateItem1");
    ascSort.setAttribute("onclick",`sortList2(${0})`);
    ascSort.appendChild(document.createTextNode("Ascending Order"));
    innerDiv.appendChild(ascSort);
    var dscSort = document.createElement("button");
    dscSort.setAttribute("class","dateItem1");
    dscSort.setAttribute("onclick",`sortList2(${1})`);
    dscSort.appendChild(document.createTextNode("Decending Order"));
    innerDiv.appendChild(dscSort);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter9()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}


function resultExactSearch(){
    var prnt = event.target.parentNode;
    var val = prnt.children[0].value;
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    for (let i = 0; i < todolist.length; i++) {
        if(todolist[i].taskDetails.toLowerCase() !== val.toLowerCase())continue;
        renderItem(list,todolist[i]);
    }
    var datetime = new Date();
    activity.push({name:`Searching applied with ${val}`,timeStamp:datetime});
}

function exactSearch()
{
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[1];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Item Detail :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','resultExactSearch()');
    saveButton.appendChild(document.createTextNode("Search"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter5()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function resultSubSearch(){
    var prnt = event.target.parentNode;
    var val = prnt.children[0].value;
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    for (let i = 0; i < todolist.length; i++) {
        let flag = false;
        for(let j=0;j<todolist[i].subTasks.length;i++)
        {
            if(todolist[i].subTasks[j].taskDetails!==val)continue;
            flag = true;
            break;
        }
        if(!flag)continue;
        renderItem(list,todolist[i]);
    }
    var datetime = new Date();
    activity.push({name:`Searching applied with ${val}`,timeStamp:datetime});
}

function subSearch()
{
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[2];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("SubTask Detail :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','resultSubSearch()');
    saveButton.appendChild(document.createTextNode("Search"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter6()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}


function resultTagSearch(){
    var prnt = event.target.parentNode;
    var val = prnt.children[0].value;
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    var arr = val.split(',');
    if(val==="")arr=[];
    for (let i = 0; i < todolist.length; i++) {
        let flag = true;
        for(let j=0;j<arr.length;j++)
        {
            var txt = arr[j].toLowerCase();
            if(todolist[i].tags.find(elmnt => elmnt.toLowerCase()===txt))continue;
            flag = false;
        }
        if(!flag)continue;
        renderItem(list,todolist[i]);
    }
    var datetime = new Date();
    activity.push({name:`Searching applied with ${val}`,timeStamp:datetime});
}


function tagSearch()
{
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[3];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Tags comma separated without space :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','resultTagSearch()');
    saveButton.appendChild(document.createTextNode("Search"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter7()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}

function resultPartialSearch(){
    var prnt = event.target.parentNode;
    var val = prnt.children[0].value;
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    let arr = todolist.filter(elmnt => elmnt.taskDetails.includes(val));
    for (let i = 0; i < arr.length; i++) {
        renderItem(list,arr[i]);
    }
    var datetime = new Date();
    activity.push({name:`Searching applied with ${val}`,timeStamp:datetime});
}


function partialSearch()
{
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[4];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Text :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','resultPartialSearch()');
    saveButton.appendChild(document.createTextNode("Search"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter8()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}


function resultCategorySearch()
{
    var prnt = event.target.parentNode;
    var val = prnt.children[0].value;
    if(val==="")val = "No Category";
    let list = document.getElementById("finalList");
    if(list)list.innerHTML = '';
    let arr = todolist.filter(elmnt => elmnt.category.toLowerCase()===val.toLowerCase());
    for (let i = 0; i < arr.length; i++) {
        renderItem(list,arr[i]);
    }
    var datetime = new Date();
    activity.push({name:`Searching applied with ${val}`,timeStamp:datetime});
}

function categorySearch()
{
    var prntDiv = event.target.parentNode;
    var crntChild = prntDiv.children[5];
    crntChild.innerHTML = "";
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","innerDiv");
    innerDiv.appendChild(document.createTextNode("Category :"));
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.setAttribute("class","dateItem1");
    innerDiv.appendChild(inputBox);
    var saveButton = document.createElement("button");
    saveButton.setAttribute('class','okcancel');
    saveButton.setAttribute('onclick','resultCategorySearch()');
    saveButton.appendChild(document.createTextNode("Search"));
    innerDiv.appendChild(saveButton);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute('class','okcancel');
    cancelButton.setAttribute('onclick','cancelFilter10()');
    cancelButton.appendChild(document.createTextNode("Cancel"));
    innerDiv.appendChild(cancelButton);
    prntDiv.replaceChild(innerDiv,crntChild);
}


function cancelBackLogs()
{
    var prnt = event.target.parentNode;
    var crnt = prnt.children[0];
    typeOfRender = 0;
    renderList();
    var btn = document.createElement("button");
    btn.setAttribute("onclick",'viewBacklogs()');
    btn.id = "backLog";
    btn.appendChild(document.createTextNode("View BackLogs"));
    prnt.replaceChild(btn,crnt);
}

function viewBacklogs()
{
    var prnt = event.target.parentNode;
    var crnt = prnt.children[0];
    typeOfRender = 1;
    dateFilterStart = new Date(0);
    dateFilterEnd = new Date().toLocaleString();
    renderList();
    var btn = document.createElement("button");
    btn.setAttribute("onclick",'cancelBackLogs()');
    btn.appendChild(document.createTextNode("Cancel"));
    prnt.replaceChild(btn,crnt);
    var datetime = new Date();
    activity.push({name:"backlogs viewed",timeStamp:datetime});
}


function cancelActLogs()
{
    var prnt = event.target.parentNode;
    var crnt = prnt.children[1];
    typeOfRender = 0;
    renderList();
    var btn = document.createElement("button");
    btn.setAttribute("onclick",'viewActLog()');
    btn.id = "actLog";
    btn.appendChild(document.createTextNode("View Activity Log"));
    prnt.replaceChild(btn,crnt);
}

function viewActLog()
{
    var datetime = new Date();
    activity.push({name:"activity log viewed",timeStamp:datetime});
    var prnt = event.target.parentNode;
    var crnt = prnt.children[1];
    
    let list = document.getElementById("finalList");
    list.innerHTML = '';

    for (let i = 0; i < activity.length; i++) {
        var li = document.createElement("li");
        var txt = document.createElement("div");
        txt.style.width = "70%"
        var currentDate = activity[i].timeStamp;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; 
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        txt.appendChild(document.createTextNode(`${day}/${month}/${year}  ${hours}:${minutes}:${seconds} :  ${activity[i].name}`));
        li.appendChild(txt);
        list.appendChild(li);
    }
    var btn = document.createElement("button");
    btn.setAttribute("onclick",'cancelActLogs()');
    btn.appendChild(document.createTextNode("Cancel"));
    prnt.replaceChild(btn,crnt);
}


function checkReminders()
{
    var rem = "";
    for (let i = 0; i < todolist.length; i++) {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const newHour = currentHour + 1;
        currentDate.setHours(newHour);
        var x = new Date(todolist[i].dueDate);
        if(currentDate.getTime()>=x.getTime())
        {
            rem = rem+String(todolist[i].taskDetails)+", ";
        }
    }
    // console.log(rem);
    alert(`Reminder !!! Following tasks have due date in 1 hour : ${rem}`)
}


setInterval(checkReminders, 60000); 