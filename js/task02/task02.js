// 后续应该不会写这么多变量，这个跟一个html页面关联度太高了
// 应该能适用于所有的游戏，要不然每个游戏都要写
var roleNumNodeList = document.getElementsByClassName("player-detail-role-num");
var roleNum = { killer: 0, police: 0, civilian: 0, judge: 1, sniper: 0, doctor: 0 };
var roleNumList = [roleNum.killer, roleNum.police, roleNum.civilian, roleNum.judge, roleNum.sniper, roleNum.doctor];
var roleList = ["杀手", "警察", "平民", "法官", "狙击手", "医生"];
var playerRoleListShuffled = new Array();

// 获取input.value，需注意命名规范，下面三种方式都可以，当然还有更多写法
//var playerNumInput = playerNumSet.playerNumInput; // player-num-set.player-num-input或者player_num_set.player_num_input都是错误的
//var playerNumInput = document.forms[0].elements["player-num-input"];
var playerNumInput = document.getElementById("playerNumInput");
var playerNumSetBar = document.getElementById("playerNumSetBar");
var playerNum = 0;

var setBarDown = document.getElementById("setBarDown");
var setBarAdd = document.getElementById("setBarAdd");

var popErr = document.getElementById("popErr");
var popErrNum = document.getElementById("popErrNum");
var choiceConfirm = document.getElementById("popErrNumChoiceConfirm");
var gameStart = document.getElementById("gameStart");

// 获得玩家数量
function getPlayerNum() {
    playerNum = parseInt(playerNumInput.value); 
}

// 更新角色数量数组
function updateRoleNumList(roleNum) {
    roleNumList = [roleNum.killer, roleNum.police, roleNum.civilian, roleNum.judge, roleNum.sniper, roleNum.doctor];
}

// 获得角色数量
function getRoleNum(playerNum) {
    killers = ((playerNum-1)%4 == 3) ? Math.ceil((playerNum-1)/4) : Math.floor((playerNum-1)/4);
    roleNum.killer = (killers > 1) ? killers-1 : killers;
    roleNum.sniper = (roleNum.killer === killers) ? 0 : 1;
    console.log(roleNum.killer + '人' + ' FgetRoleNum.roleNum.killer');
    roleNum.police = roleNum.killer;
    roleNum.doctor = roleNum.sniper;
    roleNum.civilian = playerNum - 1 - 2 * killers;
    console.log(roleNumList + ' FgetRoleNum.roleNumList.updatebefore');
    updateRoleNumList(roleNum);
    console.log(roleNumList + ' FgetRoleNum.roleNumList.updateafter');
}

// 写入角色数量
function writeRoleNum() {
    for (var i=0; i<roleNumNodeList.length; i++) {
        roleNumNodeList[i].innerHTML = roleNumList[i] + "人";
    }
}

// 检查输入的值
function checkInputNum(playerNum) {
    return (playerNum >= 4 && playerNum <= 18) ? true : false;
}

// 同步两个input的value，同时保证input的值不会错
function getSameNum() {
    playerNumInput.value = playerNumSetBar.value;
}


// 弹出错误提醒并添加动画
function popErrHint() {
    popErr.classList.add("is-fixed");
    popErrNum.style.transform = "translate(-50%, -80%)";
    setTimeout(function() {
        popErrNum.style.transform = "translate(-50%, -50%)";
    }, 100);
}

// 获取滑动条的背景渐变
function getBackground() {
    var colorWidth = ((parseFloat(playerNumSetBar.value)-4)/14)*100;
    var colorBreak = ((parseFloat(playerNumSetBar.value)-4)/14)*100+0.1;
    var linearGradient = 'linear-gradient(to right, #FBB435, #FBB435 ' + colorWidth + '%, gray ' + colorBreak +'%, gray)';
    playerNumSetBar.style.background = linearGradient;
}

// 使得初始value值不为4时，仍能获得背景渐变
document.getElementById('setPlayer').onload = getBackground();

// 洗牌算法，从后往前遍历，将之与之前的任意元素(包含自身)交换
function shuffle(array) {
    var _array = array.concat();
    for (var i=_array.length-1; i>=0; i--) {
        var j = Math.floor(Math.random() * (i+1));  // 0<=j<=i
        var temp = _array[i];
        _array[i] = _array[j];
        _array[j] = temp;
    }
    return _array;
}

// 为玩家分配角色
function getPlayerRole() {
    var playerRoleList = new Array();
    for (var i=0; i<roleList.length; i++) {
        for (var j=0; j<roleNumList[i]; j++) {
            //playerRoleList.push(roleList[i]);
            playerRoleList = playerRoleList.concat(roleList[i]);
        }
    }
    console.log(playerRoleList); console.log(" 打乱前玩家角色");
    playerRoleListShuffled = shuffle(playerRoleList);
}

// 本地储存游戏玩家角色列表
function storeRoleList(list) {
    var listString = list.join("#");
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("roleListString", listString);
        console.log(localStorage.getItem("roleListString"));
    } else {
        alert("抱歉！您的浏览器不支持 Web Storage ...");
    }
}


setBarAdd.onclick = function() {
    if (parseInt(playerNumSetBar.value) === 18) {
        alert("人不能更多了！");
    } else {
        playerNumSetBar.value = (parseInt(playerNumSetBar.value) + 1).toString();
        console.log(typeof(playerNumSetBar.value));
        getBackground();
        getSameNum();
        getPlayerNum();
        getRoleNum(playerNum);
        writeRoleNum();
    }
}

setBarDown.onclick = function() {
    if (parseInt(playerNumSetBar.value) === 4) {
        alert("人不能更少了！");
    } else {
        playerNumSetBar.value = (parseInt(playerNumSetBar.value) - 1).toString();
        console.log(typeof(playerNumSetBar.value));
        getBackground();
        getSameNum();
        getPlayerNum();
        getRoleNum(playerNum);
        writeRoleNum();
    }
}

playerNumSetBar.onchange = function() {
    playerNumInput.value = playerNumSetBar.value;
    console.log(playerNumInput.value + ' playerNumSetBar.onchange.playerNumInput.value');
    playerNumInput.placeholder = playerNumInput.value;
    getPlayerNum();
    getRoleNum(playerNum);
    writeRoleNum();
}

playerNumInput.onchange = function() {
    getPlayerNum();
    if (checkInputNum(playerNum)) {
        playerNumSetBar.value = playerNumInput.value;
        console.log(playerNumSetBar.value + ' playerNumInput.onchange.playerNumSetBar.value');
        getBackground();
        getRoleNum(playerNum);
        writeRoleNum();
    } else {
        popErrHint();
    }
}

choiceConfirm.onclick = function() {
    popErr.classList.remove("is-fixed");
    getSameNum();
}

// 用户输入后直接点击“去发牌”后做校验
// 后续这里应该需要添加传输数据的操作
gameStart.onclick = function() {
    //getSameNum();
    getPlayerNum();
    if (checkInputNum(playerNum)) {
        console.log(playerNum + ' button.onclick.playerNum');
        console.log(roleNumList + ' button.onclick.roleNumList.beforeupdate');
        getRoleNum(playerNum);
        writeRoleNum();
        getPlayerRole();
        console.log(playerRoleListShuffled); console.log(" 打乱后玩家角色");
        storeRoleList(playerRoleListShuffled);
        window.location.href = "task13-checkID.html"
    } else {
        popErrHint();
    }
}

// 废弃的一些东西
//var playerNum = (playerNumInput.value==playerNumSetbar.value) ? playerNumInput.value : playerNumSetBar.value;
// getSameNum();
// 同步两个input的value 
/*
var getSameNum = function() {
    playerNumInput.value = playerNumSetBar.value;
    playerNumInput.onchange = function() {
        playerNumSetBar.value = playerNumInput.value;
        var colorWidth = ((parseFloat(playerNumSetBar.value)-4)/14)*100;
        var colorBreak = ((parseFloat(playerNumSetBar.value)-4)/14)*100+0.1;
        var linearGradient = 'linear-gradient(to right, #FBB435, #FBB435 ' + colorWidth + '%, white ' + colorBreak +'%, white)';
        playerNumSetBar.style.background = linearGradient;
    }
    playerNumSetBar.onchange = function() {
        playerNumInput.value = playerNumSetBar.value;
        playerNumInput.placeholder = playerNumInput.value;
    }
}
*/

/*popErrNum.onclick = function() {
    popErrNum.style.transform = "translate(-50%, 0)";
    setTimeout(function() {
        popErrNum.style.transform = "translate(-50%, -50%)";
    }, 2000);
}*/