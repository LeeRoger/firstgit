var playersJson = window.localStorage.playersJson;
var players = jQuery.parseJSON(playersJson);
var baseUrl = "task13-vote2.html";
var selfUrl = "task13-judgeFlow2.html"
var nextUrl = "";

// 获取玩家对象
function getPlayers() {
    if(typeof(window.localStorage) !== "undefined") {
        var playersJson = window.localStorage.playersJson;
        var players = jQuery.parseJSON(playersJson);
        return players;
    } else {
        alert("抱歉！您的浏览器不支持 Web Storage ...");
        return false;
    }
}

// 获取当前所处状态
function getState() {
    var stateUrl = window.location.search;
    var patt = /state=(\w+)/;
    var state = stateUrl.match(patt)[1];
    return state;
}

// 更新页面天数、状态变化时页面内容的变化
function updateGameStep() {
    var day = window.localStorage.day;
    day = parseInt(day);
    console.log(day);    
    for (var i=1; i<day; i++) {
        var addGameStep = $(".game-step:first").clone();
        $("#game").append(addGameStep);
        console.log("add");
    }
    for (var i=0; i<day-1; i++) {
        $(".game-step").get(i).classList.add("not-today");
        $(".game-step-detail").get(i).classList.add("is-hidden");
        //$(".game-step-hidden").get(i).classList.remove("is-hidden");
    }
    var dayZn = ["一", "二", "三", "四", "五", "六", "七", "八", "九",
                 "十", "十一", "十二", "十三", "十四", "十五", "十六",
                 "十七", "十八"];
    $(".day-number").each(function(index) {
        $(this).text(dayZn[index]);
    });
    $(".down-up:last").addClass("flipy");

    var state = getState();
    var states = ["start", "killer", "police", "ghost", "speak", "voter", "start"];
    var pos = states.indexOf(state);
    var players = getPlayers();
    for (var i=0; i<pos; i++) {
        var selector = "." + states[i+1] + ":last";
        $(selector).attr("disabled", "disabled");
        switch (i) {
            case 0:
                var playerNum = (players["killer"].length > 0) ? players["killer"][day-1] : 0;
                var content = (playerNum === 0) ? "<i></i>" :
                              "<p>" + playerNum + "号被杀手杀死，真实身份是" + 
                              players[playerNum]["role"] + "</p>";
                $(selector).after(content);
                break;
            case 1: 
                var playerNum = (players["police"].length > 0) ? players["police"][day-1] : 0;
                // 警察当天死了，还是可以查验人的，但第二天不能查人了，所以当players["police"][day-1]==="nobody"时需做处理
                var content = (playerNum===0 || playerNum==="nobody") ? "<i></i>" :
                              "<p>" + playerNum + "号被警察查验，真实身份是" + 
                              players[playerNum]["role"] + "</p>";
                $(selector).after(content);
                break;
            case 4:
                var playerNum = (players["voter"].length > 0) ? players["voter"][day-1] : 0;
                var content = (playerNum === 0) ? "<i></i>" :
                              "<p>" + playerNum + "号被投票投死，真实身份是" + 
                              players[playerNum]["role"] + "</p>";
                $(selector).after(content);
                break;
        }
    }    
}

// 投票结束后判断游戏是否结束，并弹出提示框
function whoWin() {
    var players = getPlayers();
    var killerNum = 0;
    var civilianNum = 0;
    var roleList = window.localStorage.roleListString.split('#');
    var total = roleList.length;
    for (var i=0; i<total; i++) {
        if (players[i+1]["role"]==="杀手" && players[i+1]["alive"]===1) {
            killerNum += 1;
        }
        if(players[i+1]["role"]==="平民" && players[i+1]["alive"]===1) {
            civilianNum += 1;
        }
    }
    if (killerNum===0) {       
        $("#hintResultWord").text("游戏结束，查看结果");
        $(".hint-step").addClass("is-hidden");
        $(".hint-result-step").removeClass("is-hidden");
        nextUrl = "task13-result.html?result=police";
        popInfo();
        return "police";
    } else if (killerNum>=civilianNum) {
        $("#hintResultWord").text("游戏结束，查看结果");
        $(".hint-step").addClass("is-hidden");
        $(".hint-result-step").removeClass("is-hidden");
        nextUrl = "task13-result.html?result=killer";
        popInfo();
        return "killer";
    } else {
        $(".hint-step").addClass("is-hidden");
        $(".hint-result-step").removeClass("is-hidden");
        nextUrl = "task13-judgeFlow2.html?state=start";
        popInfo();
        return "keep";
    }
}

// 根据状态反馈哪些玩家被杀或者被票死
function updatePageRole() {
    var day = parseInt(window.localStorage.day);
    var state  = getState();
    var players = getPlayers();
}
    
// 更新弹出框内容以及即将跳转的带参数的链接
function updatePopErr() {
    //var states = ["start", "killer", "police", "sniper", "doctor", "voter"];
    var state = getState();
    switch (state) {
        case "start":
            $("#hintWord").text("即将前往杀手杀人页面");
            nextUrl = baseUrl + "?state=" + "killer"; 
            break;
        case "killer":
            $("#hintWord").text("即将前往警察验人页面");
            nextUrl = baseUrl + "?state=" + "police";
            break;
        case "police":
            $("#hintWord").text("亡灵请发表遗言");
            nextUrl = selfUrl + "?state=" + "ghost";
            break;
        case "ghost":
            $("#hintWord").text("玩家请依次发言");
            nextUrl = selfUrl + "?state=" + "speak";
            break;
        case "speak":
            $("#hintWord").text("即将前往投票页面");
            nextUrl = baseUrl + "?state=" + "voter";
            break;
        case "voter":
            $("#hintWord").text("即将前往新的一天");
            nextUrl = selfUrl + "?state=" + "start";
            break;
        default:
            alert("程序出问题了");
    }
    console.log(nextUrl);
}

// 弹出提醒框
function popInfo() {
    $("#popHint").addClass("is-fixed");
    $(".pop-hint-role").animate({top: '45%'}, 20);
    $(".pop-hint-role").animate({top: '50%'}, 100);
} 

$(document).ready(function() {
    console.log("文档加载完毕");
    updateGameStep();
    var state = getState();
    // 投票完成后检测游戏是否结束
    if (state === "voter") {
        var result = whoWin();
        $("#resultConfirm").click(function() {
            if (result === "keep") {
                var day = parseInt(window.localStorage.day);
                window.localStorage.setItem("day", day+1);
            }
            window.location.href = nextUrl;
        });
    }

    $(".game-step-detail-role").on("click", function() {
        var state = getState();
        var states = ["start", "killer", "police", "ghost", "speak", "voter", "start"];
        var pos = states.indexOf(state);
        var stateClass = states[pos+1];
        var selector = "." + stateClass;
     
        console.log($(this).hasClass(stateClass));
        if ($(this).hasClass(stateClass)) {
            updatePopErr();
            popInfo();
            $(selector).attr("disabled", "disabled");

            $("#roleConfirm").click(function() {
                console.log("done");
                $("#popHint").removeClass("is-fixed");
                //$(selector).attr("disabled", "disabled");
                window.location.href = nextUrl;
            });

            $("#roleCancel").click(function() {
                $("#popHint").removeClass("is-fixed");
                $(selector).removeAttr("disabled");
            });
        } else {
            /* 只用一个提示框有点问题，就是当前状态下点击下一个状态的按钮
            然后取消，点击下下个状态的按钮，点击确认后页面居然跳转了
            看来是对event-loop理解不够，或者对on理解不够，只能通过增加提示框规避*/
            $("#hintErrWord").text("请按照正确的游戏步骤进行哦");
            var showErrStep = function() {
                $(".hint-step").addClass("is-hidden");
                $(".hint-err-step").removeClass("is-hidden");
            }
            var hiddenErrStep = function() {
                $(".hint-step").removeClass("is-hidden");
                $(".hint-err-step").addClass("is-hidden");
            }
            
            showErrStep();
            popInfo();

            $(".err-step").one("click", function() {
                $("#popHint").removeClass("is-fixed");
                hiddenErrStep();           
            });
        }
    });

    for(var i=0; i<5; i++) {
        var selectors = [".killer", ".police", ".ghost", ".speak", ".voter"];
        $(selectors[i]).click(function() {
            console.log("选择正确则将开始游戏")
        });
    }

    $(".down-up").not(":last").click(function() {
        $(this).toggleClass("flipy");
        $(this).closest("h3").nextAll(".game-step-hidden").toggle("fast");
    });

});