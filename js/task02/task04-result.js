// 获取谁赢了
function getResult() {
    var stateUrl = window.location.search;
    var patt = /result=(\w+)/;
    var result = stateUrl.match(patt)[1];
    return result;
}

// 更新页面玩家数量
function updateRoleNum() {
	var roleNum = { killer: 0, police: 0, civilian: 0, judge: 1, sniper: 0, doctor: 0 };
	var playerNum = window.localStorage.roleListString.split('#').length;
	killers = ((playerNum-1) % 4 == 3) ? Math.ceil((playerNum-1) / 4) : Math.floor((playerNum-1) / 4);
    roleNum.killer = (killers > 1) ? killers-1 : killers;
    roleNum.sniper = (roleNum.killer === killers) ? 0 : 1;
    roleNum.police = roleNum.killer;
    roleNum.doctor = roleNum.sniper;
    roleNum.civilian = playerNum - 1 - 2 * killers;

	var roles = ["killer", "police", "civilian", "sniper", "doctor"];
	$(".how-many").each(function(index) {
		$(this).text(roleNum[roles[index]] + "人");
	})
}

// 根据游戏结果更新页面
function updateGameResult() {
	var result = getResult();
	var playersJson = window.localStorage.playersJson;
    var players = jQuery.parseJSON(playersJson);
    var deathResult = players["death"].concat();
    var deathAll = [];
    var dayZn = ["一", "二", "三", "四", "五", "六", "七", "八", "九",
                 "十", "十一", "十二", "十三", "十四", "十五", "十六",
                 "十七", "十八"];

    // 更新每天具体的情况
    var day = $(".day:first").clone();
    for (var i=0; i<deathResult.length; i++) {
    	var death = deathResult[i];
    	var dayNum = ".day-number:eq(" + i + ")";
    	var dayDetail = ".day-detail:eq(" + i + ")";
    	
    	if (i > 0) {
    		var dayAdd = day.clone(); // 为了防止后面复制的时候将第一天的内容复制进去
    		$(".result-detail-day").append(dayAdd);
    	}
    	$(dayNum).text("第" + dayZn[i] + "天");
    	
    	for (var j=0; j<death.length; j++) {
    		deathAll.push(death[j]);
    		var time = (j === death.length-1) ? "白天：" : "晚上：";
    		var content = time + death[j] + "号被" + 
    		                   players[death[j]]["deathWay"] + "了，" + 
    		                   death[j] + "号是" + players[death[j]]["role"] + "<br>";
    		$(dayDetail).append(content);
    	}
    	
    }

    // 更新游戏结果部分
    var dayCount = window.localStorage.day;
    if (result === "police") {
    	$(".who-win h3").text("警察胜利");
    	//var police = players["police"];
    	var voter = players["voter"];
    	var killerNum = 0;
    	
    	for (var i=0; i<voter.length; i++) {
    		if (players[voter[i]]["role"]==="杀手" || players[voter[i]]["role"]==="狙击手") {
    			killerNum += 1;
    		}
    	}
    	var resultMsg = "本轮游戏共抓出杀手" + killerNum + "人，共经历了" + dayCount + 
    	                "个白天，在杀人游戏中击败了67%的玩家";
    	$(".result-detail-msg").text(resultMsg);
    } else {
    	$(".who-win h3").text("杀手胜利");
    	var killedNum = 0;
    	for (var i=0; i<deathAll.length; i++) {
    		if (players[deathAll[i]]["deathWay"]==="杀手杀死" || 
    			players[deathAll[i]]["deathWay"]==="狙击狙死") {
    			killedNum += 1;
    		}
    	}
    	var resultMsg = "本轮游戏共击杀" + killedNum + "人，共经历了" + dayCount + 
    	                "个白天，在杀人游戏中击败了67%的玩家";
    	$(".result-detail-msg").text(resultMsg);
    }

}

$(document).ready(function() {
	updateRoleNum();
	updateGameResult();
});