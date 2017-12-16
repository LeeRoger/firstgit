var dropLocation = document.getElementById("dropLocation");
var dropFood = document.getElementById("dropFood");
var dropSick = document.getElementById("dropSick");
var dropList = [dropLocation, dropFood, dropSick];
var dropElse = document.getElementsByClassName("drop-else");
var myList = [1, 2, 3, 4, 5];
var x = 1;

function dropFunc() {
    /*if (x in myList) { alert("in操作符成功"); }*/ 
    /*
    for (var i=0; i<dropList.length; i++) {
        for (var j=0; j<dropList[i].classList.length; j++) {
            if (dropList[i].classList[j] == "open") { dropList[i].classList.remove("open"); }
            else { dropList[i].classList.add("open"); }
        } 
    
        if ("open" in dropElement.classList) {
            dropElement.classList.remove("open");
        }
        else {
            dropElement.classList.add("open");
        }
    } 
    }*/ 
    dropList.forEach(function(item, index, array) {
        if ("open" in item.classList) { item.classList.remove("open"); }
        else { item.classList.add("open"); break; }
    }); 
}
/*
function dropElseFunc() {
    for ( var dropElement in dropList) {
        if ("open" in dropElement.classList) {
            dropElement.classList.remove("open");
        } 
} */