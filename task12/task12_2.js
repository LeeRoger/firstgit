var dropLocation = document.getElementById("dropLocation");
var dropFood = document.getElementById("dropFood");
var dropSick = document.getElementById("dropSick");
/*var dropList = [dropLocation, dropFood, dropSick];*/
var dropElse = document.getElementsByClassName("drop-else");

var tabBoss = document.getElementById("tabBoss");
var tabStaff = document.getElementById("tabStaff");
var tabBossContent = document.getElementById("boss");
var tabStaffContent = document.getElementById("staff");

/*var myList = [1, 2, 3, 4, 5];
var x = 1;*/

function dropFuncLoc() {
    if (dropLocation.classList.contains("open")==true) { dropLocation.classList.remove("open"); }
    else { dropLocation.classList.add("open"); }
    /*dropLocation.classList.add("open");*/
    dropFood.classList.remove("open");
    dropSick.classList.remove("open");
}

function dropFuncFood() {
    if (dropFood.classList.contains("open")==true) { dropFood.classList.remove("open"); }
    else { dropFood.classList.add("open"); }
    dropLocation.classList.remove("open");
    dropSick.classList.remove("open");
}

function dropFuncSick() {
    if (dropSick.classList.contains("open")==true) { dropSick.classList.remove("open"); }
    else { dropSick.classList.add("open"); }
    dropLocation.classList.remove("open");
    dropFood.classList.remove("open");
}

function dropFuncElse() {
    dropLocation.classList.remove("open");
    dropFood.classList.remove("open");
    dropSick.classList.remove("open");
}

function tabFuncBoss() {
    tabStaff.classList.remove("active");
    tabBoss.classList.add("active");
    tabStaffContent.style.display = "none";
    tabBossContent.style.display = "block";
}

function tabFuncStaff() {
    tabStaff.classList.add("active");
    tabBoss.classList.remove("active");
    tabStaffContent.style.display = "block";
    tabBossContent.style.display = "none";
}

/*
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
    }*/ /*
    dropList.forEach(function(item, index, array) {
        if ("open" in item.classList) { item.classList.remove("open"); }
        else { item.classList.add("open"); break; }
    }); 
} */
/*
function dropElseFunc() {
    for ( var dropElement in dropList) {
        if ("open" in dropElement.classList) {
            dropElement.classList.remove("open");
        } 
} */