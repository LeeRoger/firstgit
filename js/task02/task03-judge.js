document.body.onload = function() {
    var total = localStorage.roleListString.split('#').length;
    var persons = document.getElementsByClassName('person');
    // 范围不要写错了
    for (var i=total; i<persons.length; i++) {         
        persons[i].classList.add('is-hidden');
    }
}

var judgeLook = document.getElementById("judgeLook");

// 获取点击次数
function getClickCount() {
    if(typeof(Storage) !== "undefined") {
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount)+1;
        } else {
            localStorage.clickcount = 1;
        }
        return parseInt(localStorage.clickcount);
    } else {
        alert("抱歉！您的浏览器不支持 Web Storage ...");
        return false;
    }
}

// 更新玩家角色
function updatePlayerRole(roleList) {
    var roles = document.getElementsByClassName("identity");
    for (var i=0; i<roleList.length; i++) {
        roles[i].innerHTML = roleList[i];
    }
}

// 隐藏封面
function hiddenPoker() {
    var covers = document.getElementsByClassName("identity-cover");
    for (var i=0; i<covers.length; i++) {
        covers[i].classList.add("is-hidden");
    }
}

judgeLook.onclick = function() {
    var click = getClickCount();
    if (click === 1) {
        var roleList = localStorage.roleListString.split("#");
        updatePlayerRole(roleList);
        hiddenPoker();
        judgeLook.innerHTML = "开始游戏";
        localStorage.clickcount = -1;
    } else {
        window.location.href = "task13-vote.html";  
    }
}