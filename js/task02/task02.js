var roleNumNodeList = document.getElementsByClassName("player-detail-role-num");
var roleNum = {
    killer: 0,
    police: 0,
    civilian: 0,
    judge: 1
};
var roleNumList = [roleNum.killer, roleNum.police, roleNum.civilian, roleNum.judge];

var popErrNum = document.getElementById("popErrNum");
//var playerNumInput = player-num-set.player-num-input;
//var playerNumInput = document.forms[0].elements["player-num-input"];
var playerNumInput = document.getElementById("playerNumInput");
var playerNumSetBar = document.getElementById("playerNumSetBar");
//var playerNum = (playerNumInput.value==playerNumSetbar.value) ? playerNumInput.value : playerNumSetBar.value;
var playerNum;

var choiceConfirm = document.getElementById("popErrNumChoiceConfirm");
var popErr = document.getElementById("popErr");
var gameStart = document.getElementById("gameStart");

/*popErrNum.onclick = function() {
    popErrNum.style.transform = "translate(-50%, 0)";
    setTimeout(function() {
        popErrNum.style.transform = "translate(-50%, -50%)";
    }, 2000);
}*/

// 获得玩家数量
function getPlayerNum() {
    playerNum = playerNumInput.value; 
}

// 更新角色数量数组
function updateRoleNumList(roleNum) {
    roleNumList = [roleNum.killer, roleNum.police, roleNum.civilian, roleNum.judge];
}

// 获得角色数量
function getRoleNum(num) {
    if ((num-1)%4 == 3) {
        roleNum.killer = Math.ceil((num-1)/4);
    } else {
        roleNum.killer = Math.floor((num-1)/4);
    }
    console.log(roleNum.killer + '人' + ' FgetRoleNum');
    roleNum.police = roleNum.killer;
    roleNum.civilian = num - 1 - 2 * roleNum.killer;
    console.log(roleNumList + ' FgetRoleNum.updatebefore');
    updateRoleNumList(roleNum);
    console.log(roleNumList + ' FgetRoleNum.updateafter');
}

// 写入角色数量
function writeRoleNum() {
    for (var i=0; i<roleNumNodeList.length; i++) {
        roleNumNodeList[i].innerHTML = roleNumList[i] + "人";
    }
}

// 检查输入的值，错误则弹窗
function checkInputNum(playerNum) {
    if (playerNum >= 4 && playerNum <= 18) {
        return true;
    } else {
        popErr.classList.add("is-fixed");
        return false;
    }
}

// 同步两个input的value 
function getSameNum() {
    playerNumInput.value = playerNumSetBar.value;
}

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

// 获取滑动条的背景渐变
function getBackground() {
    var colorWidth = ((parseFloat(playerNumSetBar.value)-4)/14)*100;
    var colorBreak = ((parseFloat(playerNumSetBar.value)-4)/14)*100+0.1;
    var linearGradient = 'linear-gradient(to right, #FBB435, #FBB435 ' + colorWidth + '%, white ' + colorBreak +'%, white)';
    playerNumSetBar.style.background = linearGradient;
}

// 使得初始value值不为4时，仍能获得背景渐变
getBackground();

playerNumSetBar.onchange = function() {
    playerNumInput.value = playerNumSetBar.value;
    console.log(playerNumInput.value + ' playerNumSetBar.onchange.playerNumInput.value');
    playerNumInput.placeholder = playerNumInput.value;
    getPlayerNum();
    getRoleNum(playerNum);
    writeRoleNum();
}

playerNumInput.onchange = function() {
    playerNumSetBar.value = playerNumInput.value;
    console.log(playerNumSetBar.value + ' playerNumInput.onchange.playerNumSetBar.value');
    getBackground();
}

choiceConfirm.onclick = function() {
    popErr.classList.remove("is-fixed");
    getSameNum();
}

// getSameNum();

gameStart.onclick = function() {
    //getSameNum();
    getPlayerNum();
    if (checkInputNum(playerNum)) {
        console.log(playerNum + ' button.onclick');
        console.log(roleNumList + ' button.onclick.beforeupdate');
        getRoleNum(playerNum);
        writeRoleNum();
    } else {
        popErrNum.style.transform = "translate(-50%, -80%)";
        setTimeout(function() {
            popErrNum.style.transform = "translate(-50%, -50%)";
        }, 100);
    }
}
