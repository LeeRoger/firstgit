var nextUrl = "";
// 获取当前所处状态
function getState() {
    var stateUrl = window.location.search;
    var patt = /state=(\w+)/;
    var state = stateUrl.match(patt)[1];
    return state;
}

// 获取玩家对象
function getPlayers() {
    var playersJson = window.localStorage.playersJson;
    var players = jQuery.parseJSON(playersJson);
    return players;
}

// 投票结束后判断游戏是否结束
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
		if(players[i+1]["role"]==="狙击手" && players[i+1]["alive"]===1) {
			killerNum += 1;
		}
		if(players[i+1]["role"]==="平民" && players[i+1]["alive"]===1) {
			civilianNum += 1;
		}
	}
	if (killerNum===0) {
		return "police";
	} else if (killerNum>=civilianNum) {
		return "killer";
	} else {
		return "keep";
	}
}

// 更新页面上玩家死亡结果
function updateDeath() {
	//var day = parseInt(window.localStorage.day);
	var players = getPlayers();
	var day = players["death"].length;
	var death = players["death"][day-1].concat();
	var total = death.length;

	if (total === 0) {
		$(".night-answer-detail").text("今晚是个平安夜");
	} else {
		var content = death[0] + "号被" + players[death[0]]["deathWay"] +
		           "了，真实身份是" + players[death[0]]["role"];
		$(".night-answer-detail:first").text(content);
		for (var i=1; i<total; i++) {
			var element = $(".night-answer-detail:first").clone();
			var content = death[i] + "号被" + players[death[i]]["deathWay"] +
		           "了，真实身份是" + players[death[i]]["role"];
		    element.text(content);
		    $(".night-answer").append(element);
		}
	}
}

// 根据state与玩家死亡状况更新页面，以及下一步跳转页面
function updatePage() {
	var state = getState();
	var day = parseInt(window.localStorage.day);
	
	switch (state) {
		case "doctor":
			nextUrl = "task13-vote.html" + "?state=" + "voter";
			updateDeath();
			break;
		case "voter":
			$(".night-answer img").attr("src", "images/img-js/night_girl2.png")
			$(".night-after").addClass("is-hidden");
			var result = whoWin();
			if (result === "keep") {
				var dayZn = ["一", "二", "三", "四", "五", "六", "七", "八", "九",
                             "十", "十一", "十二", "十三", "十四", "十五", "十六",
                             "十七", "十八"];
                $("#nextStep").text("第" + dayZn[day] + "天");
                //window.localStorage.setItem("day", (day+1).toString());
                nextUrl = "task13-judgeFlow.html" + "?state=" + "start";
			} else {
				$("#nextStep").text("游戏结束，查看结果");
				nextUrl = "task13-result.html" + "?result=" + result;
			}
			updateDeath();
			break;
		default:
			console.log("应该不会出现的");
	}
}

$(document).ready(function() {
	updatePage();
	$("#nextStep").click(function() {
		var text = $(this).text();
		if (text.indexOf("第") === 0) {
			var day = parseInt(window.localStorage.day);
			window.localStorage.setItem("day", (day+1).toString());
		}
		window.location.href = nextUrl;
	});
});