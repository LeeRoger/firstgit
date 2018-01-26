var playersJson = window.localStorage.playersJson;
var players = jQuery.parseJSON(playersJson);
var nextUrl = task13-vote.html;
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

// 更新弹出框内容以及即将跳转的带参数的链接
function updatePopErr() {
    //var states = ["start", "killer", "police", "sniper", "doctor", "voter"];
    var stateUrl = window.location.search;
    var patt = /state=(\w+)/;
    var state = stateUrl.match(patt)[1];
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


var fsm = StateMachine.creat({
    initial: 'start',
    events: [
        { name: 'kill',  from: 'start',  to: 'killer' },
        { name: 'check', from: 'killer', to: 'police' },
        { name: 'snipe', from: 'police', to: 'sniper' },
        { name: 'save',  from: 'sniper', to: 'doctor' },
        { name: 'vote',  from: 'doctor', to: 'voter'  },  // 这个好像没有必要了
        { name: 'clear', from: ['killer', 'police', 'sniper', 'doctor', 'voter'], to: 'start'}
    ],
    methods: [
        onBeforeEvent
    ]
})
