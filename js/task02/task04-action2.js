var states = ["killer", "police", "voter"];
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
	var baseUrl = "task13-judgeFlow2.html";
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
		case "voter":
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

// 更新页面上玩家身份
function updatePlayerRole() {
	var roleList = window.localStorage.roleListString.split('#');
	var total = roleList.length;
	
	for(var i=0; i<total-1; i++) {
		var person = $(".player:first").clone();
		$("#allPlayers").append(person);
	}
	$("div.vote").each(function(index) {
		$(this).children(".identity").text(roleList[index]);
		$(this).children(".number").text((index+1).toString() + "号");
	})
}

// 更新页面上玩家死亡状态，当天的玩家状态
function updatePlayerLife() {
	var day = parseInt(window.localStorage.day);
	var players = getPlayers();
	var deathAll = players["death"];
	var deathNum = [];
	for (var i=0; i<day-1; i++) {
		for (var j=0; j<deathAll[i].length; j++) {
			deathNum.push(deathAll[i][j]);
		}
	}
	for (var i=0; i<deathNum.length; i++) {
		$("div.vote").get(deathNum[i]-1).classList.add("is-dead");
	}
	// 当天的玩家状态
	var state = getState();
	var death = players["death"].concat().pop() ?
	            players["death"].concat().pop() : [];
	for (var i=0; i<death.length; i++) {
		if (state==="voter") {
			$("div.vote").get(death[i]-1).classList.add("is-dead");
		} else {
			$("div.vote").get(death[i]-1).classList.add("want-help");
		}
	}
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
function storePlayers(players) {
	var playersJson = JSON.stringify(players);
    window.localStorage.setItem("playersJson", playersJson);
}

// 确认该state下该角色是否能发动技能，对于杀手好像没有必要
function canSkill(players) {
	var state = getState();
	var roleList = window.localStorage.roleListString.split('#');
	var total = roleList.length;
	var skillNum = 0;
	
	switch (state) {
		case "police": // 需注意警察本局被杀手杀死时能否发动技能
			for (var i=0; i<total; i++) {
				if (players[i+1]["role"]==="警察") {
					if (players[i+1]["alive"]===1) {
						skillNum += 1;
					} else {
						var death = players["death"].concat().pop();
						skillNum = (death.indexOf(i+1)===-1) ? skillNum : skillNum+1;
					}
				} 
			}
			break;
		default:
			skillNum = 1;
	}
	return skillNum>0;
}

// 更新玩家对象并储存
function updatePlayers(actionNum) {
	var state = getState();
	var states = ["killer", "police", "sniper", "doctor","voter"];
	var roleList = window.localStorage.roleListString.split('#');
	var total = roleList.length;
	var day = parseInt(window.localStorage.day);
	var players = getPlayers();
	//actionNum = isNaN(parseInt(actionNum)) ? actionNum : parseInt(actionNum);

	switch (state) {
		case "killer": // 这里有点问题，杀手应该必须杀人吧==没有问题，杀手死了，狙击手还活着
			players["death"].push([]);
			players[state].push(actionNum);
			if (actionNum !== "nobody") {
				players[actionNum]["alive"] = 0;
				players[actionNum]["deathWay"] = "杀手杀死";				
				players["death"][day-1].push(actionNum);				
			}
			break;
		case "police":
			players[state].push(actionNum);
			break;
		case "voter":
			players[state].push(actionNum);
			players[actionNum]["alive"] = 0;
			players[actionNum]["deathWay"] = "投票投死";
			players["death"][day-1].push(actionNum);
			break;
		default:
			console.log("我的逻辑有漏洞了");
	}
	storePlayers(players);
}

// 弹出提醒框
function popInfo() {
    $("#popHint").addClass("is-fixed");
    $(".pop-hint-role").animate({top: '45%'}, 20);
    $(".pop-hint-role").animate({top: '50%'}, 100);
}

$(document).ready(function() {
	updatePageText();
	updatePlayerRole();
	updatePlayerLife();
	window.sessionStorage.setItem("actionNum", "nobody");
	// 医生状态时标出本局被杀的人
	

	$("div.vote").not(".is-dead").click(function() {
		$("div.vote").removeClass("is-clicked");
		$(this).addClass("is-clicked");	
		textNum = $(this).children(".number").text();
		actionNum = parseInt(textNum);
		console.log(actionNum);
		window.sessionStorage.setItem("actionNum", actionNum);
	});

	$(".role-choice").click(function() {
        $("#popHint").removeClass("is-fixed");          
    });

	$(".next-step").click(function() {
		var players = getPlayers();
		var state = getState();
		var roleList = window.localStorage.roleListString.split("#");
		var judgeNum = roleList.indexOf("法官") + 1;
		var actionNum = window.sessionStorage.actionNum;
		actionNum = isNaN(parseInt(actionNum)) ? actionNum : parseInt(actionNum);
		//console.log(actionNum);
		if (actionNum===judgeNum) {
			$("#hintWord").text("不要动法官哦");
			$("div.vote").removeClass("is-clicked");
			actionNum = "nobody";
			window.sessionStorage.setItem("actionNum", actionNum);
			popInfo();
		} else {
			console.log((state==="killer" || state==="voter") && actionNum==="nobody");
			if ((state==="killer" || state==="voter") && actionNum==="nobody") {
				if (state==="killer" && !canSkill(players)) {
					console.log("杀手全死了，但狙击手还活着");
					updatePlayers(actionNum);
					window.location.href = nextUrl;
				} else {
					$("#hintWord").text("客官一定要选个人哦");
					popInfo();
				}
			} else {
				if (canSkill(players) || actionNum==="nobody") {
					updatePlayers(actionNum);
					window.location.href = nextUrl;
				} else {
					$("#hintWord").text("这个角色已经没有技能了哟");
					$("div.vote").removeClass("is-clicked");
					actionNum = "nobody";
					window.sessionStorage.setItem("actionNum", actionNum);
					popInfo();
				}
			}
		}
	});
});
