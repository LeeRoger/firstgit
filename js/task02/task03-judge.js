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
        var players = getPlayers();
        var playersJson = JSON.stringify(players);
        window.localStorage.setItem("playersJson", playersJson);
        window.location.href = "task13-judgeFlow.html";  
    }
} 

// 更新玩家数据结构
/* 
players = {
    1: {role: "平民", alive: 1, deathWay: "狙击狙死", skills: 0},
    ...
}
*/

// 这样的写法有点混乱，不太符合面向对象编程的写法吧
function creatPlayer(roleList, role, alive, deathWay, skills) {
    var alive = arguments[2] ? arguments[2] : 1;
    var deathWay = arguments[3] ? arguments[3] : "";
    var skills = arguments[4] ? arguments[4] : 0;
    var killers = 0;
    for (var i=0; i<roleList.length; i++) {
        if (roleList[i] === "杀手") {
            killers += 1;
        }
    }
    // var role = role;
    //console.log(role); console.log(role === "医生" || "狙击手");
    //console.log(role);
    // role === "医生" || "狙击手" 不是我想象的那样role是医生或者狙击手
    skills = (role === "医生" || role === "狙击手") ? killers : 0;
    //console.log(skills);
    /*if (role === "医生" || "狙击手") {
        skills = killers;
    } else {
        skills = 0;
    }*/ 

    var obj = new Object();
    obj.role = role;
    obj.alive = alive;
    obj.deathWay = deathWay;
    obj.skills = skills;
    return obj;
}

function getPlayers(roleList) {
    var roleList = localStorage.roleListString.split('#');
    var players = new Object();
    for (var i=0; i<roleList.length; i++) {
        players[i+1] = creatPlayer(roleList, roleList[i]);
    }
    return players;
}
