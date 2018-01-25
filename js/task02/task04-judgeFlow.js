var playersJson = window.localStorage.playersJson;
var players = jQuery.parseJSON(playersJson);

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

var fsm = StateMachine.creat({
    initial: 'start',
    events: [
        { name: 'kill',  from: 'start',  to: 'killer' },
        { name: 'check', from: 'killer', to: 'police' },
        { name: 'snipe', from: 'police', to: 'sniper' },
        { name: 'save',  from: 'sniper', to: 'doctor' },
        { name: 'vote',  from: 'doctor', to: 'voter'  },
        { name: 'clear', from: ['killer', 'police', 'sniper', 'doctor', 'voter'], to: 'start'}
    ],
    methods: [
        
    ]
})
