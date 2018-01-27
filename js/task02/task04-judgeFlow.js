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

$(document).ready(function() {
    console.log("123");
    updateGameStep();
    updatePopErr();
});


var fsm = new StateMachine({
    init: 'start',
    transitions: [
        { name: 'kill',  from: 'start',  to: 'killer' },
        { name: 'check', from: 'killer', to: 'police' },
        { name: 'snipe', from: 'police', to: 'sniper' },
        { name: 'save',  from: 'sniper', to: 'doctor' },
        { name: 'vote',  from: 'doctor', to: 'voter'  },  // 这个好像没有必要了
        { name: 'clear', from: ['killer', 'police', 'sniper', 'doctor', 'voter'], to: 'start'}
    ],
    methods: {
        onBeforeTranstion: function() {
            var state = getState();
            var states = ["start", "killer", "police", "sniper", "doctor", "start"];
            var pos = states.indexOf(state);
            var stateClass = "." + states[pos+1];
            console.log("233");
            $(".game-step-detail-role").click(function() {
                if ($(this).hasClass(stateClass)) {
                    $("#popHint").addClass("is-fixed");
                    $(".pop-hint-role").animate({transfrom: 'translate(-50%, -70%)'}, "fast");
                    $(".pop-hint-role").animate({transfrom: 'translate(-50%, -50%)'}, "slow");
                } else {
                    $("#hintWord").text("请按照正确的游戏步骤进行哦");

                }
            });
        },
        onkill: function() {
            $(".killer").one("click", function() {
                $("#popHint").addClass("is-fixed");
                $(".pop-hint-role").animate({transfrom: 'translate(-50%, -70%)'}, "fast");
                $(".pop-hint-role").animate({transfrom: 'translate(-50%, -50%)'}, "slow");
                $("#roleConfirm").click(function() {

                })
            })
        }
    }
});

$("killer").click(function() {
    fsm.kill();
})