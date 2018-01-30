var playersJson = window.localStorage.playersJson;
var players = jQuery.parseJSON(playersJson);
var baseUrl = "task13-vote.html";
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
    var states = ["start", "killer", "police", "sniper", "doctor", "start"];
    var pos = states.indexOf(state);
    for (var i=0; i<pos; i++) {
        var selector = "." + states[i+1] + ":last";
        $(selector).attr("disabled", "disabled");
    }    
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
            $("#hintWord").text("即将前往狙击狙人页面");
            nextUrl = baseUrl + "?state=" + "sniper";
            break;
        case "sniper":
            $("#hintWord").text("即将前往医生救人页面");
            nextUrl = baseUrl + "?state=" + "doctor";
            break;
        case "doctor":
            $("#hintWord").text("即将黑夜解密页面");
            nextUrl = "task13-judgeNight.html" + "?state=" + "voter";
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

    $(".game-step-detail-role").on("click", function() {
        var state = getState();
        var states = ["start", "killer", "police", "sniper", "doctor", "start"];
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
            看来是对event-loop理解不够，或者对on理解不够，只能通过增加提示框规避
            $("#hintWord").text("请按照正确的游戏步骤进行哦");
            popInfo();
            $(".role-choice").one("click", function() {
                $("#popHint").removeClass("is-fixed");
            })*/
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

    for(var i=0; i<4; i++) {
        var selectors = [".killer", ".police", ".sniper", ".doctor"];
        $(selectors[i]).click(function() {
            console.log("选择正确则将开始游戏")
        });
    }

    $(".down-up").not(":last").click(function() {
        $(this).toggleClass("flipy");
        //console.log($(this).closest("h3").next("div").html());
        $(this).closest("h3").nextAll(".game-step-hidden").toggle("fast");
        //$(".game-step-hidden").not(":last").toggle("fast");
    });

});
/*
$(".killer").click(function() {
    //$(".game-step-detail-role").off("click");
    console.log("选择杀手则将开始游戏");
});
$(".police").click(function() {
    //$(".game-step-detail-role").off("click");
    console.log("选择警察则将开始游戏");
});
$(".sniper").click(function() {
    console.log("选择狙击则将开始游戏");
});
$(".doctor").click(function() {
    console.log("选择医生则将开始游戏");
});
*/