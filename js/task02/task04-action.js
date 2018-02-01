var states = ["killer", "police", "sniper", "doctor","voter"];
var nextUrl = "";

// 获取当前所处状态
function getState() {
    var stateUrl = window.location.search;
    var patt = /state=(\w+)/;
    var state = stateUrl.match(patt)[1];
    return state;
}

// 根据state更新页面文本内容
function updatePageText() {
	var state = getState();
	var baseUrl = "task13-judgeFlow.html";
	nextUrl = baseUrl + "?state=" + state;
	switch(state) {
		case "killer":
			$("h2.vote").text("杀手杀人");
			$(".audio-hint").html("杀手请睁眼，杀手请指定要杀的人");
			$(".action-hint").text("点击下方玩家头像，对被击杀的玩家进行标记");
			$(".next-step").text("确定");
			break;
		case "police":
			$("h2.vote").text("警察验人");
			$(".audio-hint").html("警察请睁眼<br>警察请指定要验的人");
			$(".action-hint").text("点击下方玩家头像，对被查验的玩家进行标记");
			$(".next-step").text("确定");
			break;
		case "sniper":
			$("h2.vote").text("狙击狙人");
			$(".audio-hint").html("狙击手请睁眼, (狙击手请告诉法官是否开枪)<br>狙击手请选择要杀的对象");
			$(".action-hint").text("点击下方玩家头像，对被狙击的玩家进行标记");
			$(".next-step").text("确定");
			break;
		case "doctor":
			$("h2.vote").text("医生救人");
			$(".audio-hint").html("医生请睁眼, (医生请告诉法官是否打针)<br>医生请选择要针的对象");
			$(".action-hint").text("点击下方玩家头像，对被针的玩家进行标记");
			nextUrl = "task13-judgeNight.html" + "?state=" + state;
			$(".next-step").text("确定");
			break;
		case "voter":
			nextUrl = "task13-judgeNight.html" + "?state=" + state;
			$(".next-step").text("确定");
			break;
		default:
			alert("程序出问题了");
	}
	// 根据state更新按钮显示
	$(".action").each(function() {
		if (state !== "voter") {
			if(!$(this).hasClass(state)) {
				$(this).addClass("is-hidden");
			}
		}		
	});
}

// 更新玩家
function updatePlayerRole() {
	var roleList = window.localStorage.roleListString.split('#');
	var total = roleList.length;
	
	for(var i=0; i<total-1; i++) {
		var person = $(".player:first").clone();
		$("#players").append(person);
	}
	$("div.vote").each(function(index) {
		$(this).children(".identity").text(roleList[index]);
		//console.log(typeof((index+1).toString()));
		$(this).children(".number").text((index+1).toString() + "号");
	})
}

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

// 储存玩家对象
function storePlayers(palyers) {
	var playersJson = JSON.stringify(players);
    window.localStorage.setItem("playersJson", playersJson);
}

// 确认该state下是否能发动技能
function canSkill(players) {
	var state = getState();
	var correspond = {
		killer: "杀手", police: "警察",
		sniper: "狙击手", doctor: "医生"
	};
	var total = window.localStorage.roleListString.split('#').length;
	var roleNum = 0;
	for (var i=0; i<total; i++) {
		if (players[i+1]["role"]===correspond[state] && players[i+1]["alive"]===1) {
			roleNum += 1;
		}
	}
	var result = (roleNum>0) ? true : false;
	return result;
}

// 更新玩家对象
function updatePlayers(players, actionNum, roleList) {
	var state = getState();
	var states = ["killer", "police", "sniper", "doctor","voter"];
	var total = roleList.length;
	var day = parseInt(window.localStorage.day);
	var players = getPlayers();

	switch (state) {
		case "killer":
			players["death"][day-1] = [];
			players[state][day-1].push(actionNum);
			if (actionNum !== "nobody") {
				players[actionNum]["alive"] = 0;
				players[actionNum]["deathWay"] = "杀手杀死";				
				players["death"][day-1].push(actionNum);				
			}
			storePlayers(players);
			break;
		case "police":
			players[state][day-1].push(actionNum);
			storePlayers(players);
			break;
		case "sniper":
			players["death"][day-1].push(actionNum);
			players[state][day-1].push(actionNum);
			if (actionNum !== "nobody") {
				players[actionNum]["deathWay"] = "狙击狙死";
				players["skills"] = (players["skills"]===0) ? 
			}
			
	}
}

$(document).ready(function() {
	updatePageText();
	updatePlayerRole();
	window.sessionStorage.setItem("actionNum", "nobody");
});
