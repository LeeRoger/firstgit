var checkHiddenRole = document.getElementById("checkHiddenRole");

// 获取本地储存游戏角色，并返回一个数组
function getRoleList() {
    var storage = window.localStorage;
    var roleList = new Array();
    if (typeof(storage.getItem("roleListString")) !== "undefined") {
        //roleListString = storage.getItem("roleListString");
        roleList = storage.getItem("roleListString").split("#");
        console.log(roleList);
        return roleList;
    } else {
        alert("请返回并重新设置玩家人数");
        return false;
    }
}

// 更新玩家序号和角色
function updatePlayerSeqNum(num, roleList) {
    var playerSeqNumList = document.getElementsByClassName("player-seq-num");
    var total = playerSeqNumList.length;
    var playerRoleDetail = document.getElementById("playerRoleDetail");
    
    // 点击按钮后上方显示的编号为1,2,2,3,3,...
    // 点击按钮后下方隐藏并传递的编号为2,2,3,3,4,4,...
    for (var i=0; i<total; i++) {
        var seqNumTop = 1 + Math.floor(parseInt(num) / 2); //初始状态为1
        playerSeqNumList[i].innerHTML = seqNumTop;
        playerRoleDetail.innerHTML = roleList[seqNumTop-1];
    }
    playerSeqNumList[total-1].innerHTML = 1 + Math.floor((parseInt(num) + 1) / 2);
}

// 更新显示状态，默认不显示
function updateDisplay(element, num) {
    var num = arguments[1] ? arguments[1] : 0;
    if (num) {
        element.classList.remove("is-hidden");
    } else {
        element.classList.add("is-hidden");
    }
}

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

// 按钮点击事件
checkHiddenRole.onclick = function() {
    var checkPlayerRole = document.getElementById("checkPlayerRole");
    var hiddenPlayerRole = document.getElementById("hiddenPlayerRole");
    var checkRole = document.getElementsByClassName("check-role")[0];
    var hiddenRole = document.getElementsByClassName("hidden-role")[0];

    playerRoleList = getRoleList();
    clickCount = getClickCount();
    console.log(clickCount);
    console.log(typeof(clickCount));
    updatePlayerSeqNum(clickCount, playerRoleList);
    // 点按钮后上方显示的编号为 1,2,2,3,3,...
    if (clickCount < 2 * playerRoleList.length - 1 && clickCount > 0) {
        display = clickCount % 2;
        updateDisplay(checkPlayerRole, 1-display);
        updateDisplay(checkRole, 1-display);
        updateDisplay(hiddenPlayerRole, display);
        updateDisplay(hiddenRole, display);
        /* 单数次为点击查看身份，双数次为点击隐藏并传递
        if (clickCount % 2 === 1) {
            updateDisplay(checkPlayerRole, 0);
            updateDisplay(hiddenPlayerRole, 1);
            updateDisplay(checkRole, 0);
            updateDisplay(hiddenRole, 1);
        } else {
            updateDisplay(checkPlayerRole, 1);
            updateDisplay(hiddenPlayerRole, 0);
            updateDisplay(checkRole, 1);
            updateDisplay(hiddenRole, 0);
        }
        */
    } else if (clickCount === 2 * playerRoleList.length - 1) {
        var nowBegin = document.getElementsByClassName("now-begin")[0];
        
        updateDisplay(checkPlayerRole, 0);
        updateDisplay(hiddenPlayerRole, 1);
        updateDisplay(checkRole, 0);
        updateDisplay(hiddenRole, 0);
        updateDisplay(nowBegin, 1);

        localStorage.clickcount = -1;
    } else {
        window.location.href = "task13-judge.html";
    }
}