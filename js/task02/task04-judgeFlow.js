var playersJson = window.localStorage.playersJson;
var players = jQuery.parseJSON(playersJson);
var nextUrl = "task13-vote.html";
var day = window.localStorage.day ? window.localStorage.day : "1";

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
    var addGameStep = $(".game-step:first").clone();
    for (var i=1; i<day; i++) {
        $("#game").append(addGameStep);
    }
    for (var i=0; i<day-1; i++) {
        $(".game-step-detail").get(i).classList.add("is-hidden");
        $(".game-step-hidden").get(i).classList.remove("is-hidden");
    }
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
            nextUrl += "?state=" + "killer" + "&day=" + day; 
            break;
        case "killer":
            $("#hintWord").text("即将前往警察验人页面");
            nextUrl += "?state=" + "police" + "&day=" + day;
            break;
        case "police":
            $("#hintWord").text("即将前往狙击狙人页面");
            nextUrl += "?state=" + "sniper" + "&day=" + day;
            break;
        case "sniper":
            $("#hintWord").text("即将前往医生救人页面");
            nextUrl += "?state=" + "doctor" + "&day=" + day;
            break;
        case "doctor":
            $("#hintWord").text("即将黑夜解密页面");
            nextUrl = "task13-judgeNight.html" + "?state=" + "voter" + "&day=" + day;
            break;
        default:
            alert("程序出问题了");
    }
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
    updatePopErr();
});


var fvm = new StateMachine({
    init: 'start',
    transitions: [
        { name: 'kill',  from: 'start',  to: 'killer' },
        { name: 'check', from: 'killer', to: 'police' },
        { name: 'snipe', from: 'police', to: 'sniper' },
        { name: 'save',  from: 'sniper', to: 'doctor' },
        { name: 'vote',  from: 'doctor', to: 'voter'  },  // 这个好像没有必要了
        { name: 'clear', from: ['killer', 'police', 'sniper', 'doctor', 'voter'], to: 'start'}
    ],
    data: function() {
        var state = getState();
        var states = ["start", "killer", "police", "sniper", "doctor", "start"];
        var pos = states.indexOf(state);
        var stateClass = states[pos+1];
        var selector = "." + stateClass;
        //console.log(state);
        return {
            stateClass: stateClass,
            selector: selector
        }
    },
    methods: {
        onBeforeTransition: function() {
            var state = getState();
            var states = ["start", "killer", "police", "sniper", "doctor", "start"];
            var pos = states.indexOf(state);
            var stateClass = states[pos+1];
            var selector = "." + stateClass;
            console.log("onBeforeTransition初始值设置完毕");
            $(".game-step-detail-role").on("click", function() {
                if ($(this).hasClass(stateClass)) {
                    updatePopErr();
                    popInfo();
                    console.log("同时执行了");
                    //return true;
                    $(selector).attr("disabled", "disabled");
                    /*$("#roleConfirm").one("click", function() {
                        console.log("done");
                        $("#popHint").removeClass("is-fixed");
                        return true;
                    });*/ /*
                    $("#roleCancel").one("click", function() {
                        $("#popHint").removeClass("is-fixed");
                        $(selector).removeAttr("disabled");
                        console.log("有点奇怪");
                        return false;
                    });*/
                } else {
                    $("#hintWord").text("请按照正确的游戏步骤进行哦");
                    popInfo();
                    $("#roleConfirm").one("click", function() {
                        $("#popHint").removeClass("is-fixed");
                    });
                    $("#roleCancel").one("click", function() {
                        $("#popHint").removeClass("is-fixed");
                    });
                    return false;
                }
            });
            console.log("onBeforeTransition");
            //popInfo();
        },
        onLeaveStart: function() {
            if (! $("#roleCancel").one("click", function() {
                        $("#popHint").removeClass("is-fixed");
                        $(".killer").removeAttr("disabled");
                        console.log("究竟哪里有问题");
                        return false;
                    })) { return false }
        },
        /*
        onLeaveState: function() {
            
            console.log(this.selector);
            $("#roleCancel").one("click", function() {
                $("#popHint").removeClass("is-fixed");
                $(".killer").removeAttr("disabled");
                console.log("onLeaveStart false");
                return false;
            });
            console.log("onLeaveStart");
            if (this.onBeforeTransition()) {
                $("#roleConfirm").one("click", function() {
                    console.log("onLeaveState成功了");
                    return true;
                });
            } else {
                return false;
            }
        },*/
        onKill: function() {
            //$(".game-step-detail-role").off("click");
            $("#roleConfirm").click(function() {
                $("#popHint").removeClass("is-fixed");
                console.log("成功了");
            });
            
            /*
            $(".killer").one("click", function() {
                $("#popHint").addClass("is-fixed");
                $(".pop-hint-role").animate({transfrom: 'translate(-50%, -70%)'}, "fast");
                $(".pop-hint-role").animate({transfrom: 'translate(-50%, -50%)'}, "slow");
                $("#roleConfirm").click(function() {

                })
            })*/
            console.log("onkill");
        }
    }
});
/*
$(".game-step-detail-role").click(function() {
    var state = getState();
    var states = ["start", "killer", "police", "sniper", "doctor", "start"];
    var pos = states.indexOf(state);
    var stateClass = states[pos+1];
    console.log(stateClass);
    if ($(this).hasClass(stateClass)) {
        popInfo();
    } else {
        $("#hintWord").text("请按照正确的游戏步骤进行哦");
        popInfo();
    }
});
*/
$(".killer").one("click", function() {
    //var keep = fvm.onBeforeTransition();
    //$(".game-step-detail-role").off("click");
    //console.log(keep);
    //if (typeof(keep) === "undefined" ) {
        console.log("执行了");
        //fvm.onKill();
        //$(".game-step-detail-role").off("click");
        fvm.kill();
    //}
});
/*
$(".killer").click(function() {
    if (fvm.onBeforeTransition()) {
        fvm.onKill();
    }
});*/
/*
$(".game-step-detail-role").click(function() {
    fvm.onTransition();
});*/