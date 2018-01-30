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
	// 根据state更新按钮
	$(".action").each(function() {
		if(!$(this).hasClass(state)) {
			$(this).addClass("is-hidden");
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
		console.log(typeof((index+1).toString()));
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

$(document).ready(function() {
	updatePageText();
	updatePlayerRole();
});
