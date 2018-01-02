var blingList = document.getElementsByClassName("bling");
var count = blingList.length;
var idBling;
var idClear;

// 获取16位颜色随机数，也可以用产生三个[0,255]的随机数，只要返回值是字符串就行
function getRandomColor() {
	var colorTo10 = parseInt("ffffff", 16);
	var colorString = Math.round(Math.random() * colorTo10).toString(16);
	return "#" + ("000000" + colorString).slice(-6);  // 不足六位的前面补足0
}

// 获取[0,num)间的随机数
function getRandomNum(num) {
	return Math.floor(Math.random() * num);
}

function reset() {
	for (var i=0; i<count; i++) {
		blingList[i].style.backgroundColor = "orange";
	}
}

function bling() {
	// 生成三个不同的随机数，并改变相应div背景颜色
	var baseList = new Array();  // 这里千万不能放在外面，要不然9个数取完之后，就无限循环了！！！

	for (var i=0; i<count; i++) {
		baseList[i] = i;
	}

	for (var num,i=0; i<3; i++) {
		num = getRandomNum(count);
		do {
			num = getRandomNum(count);
		} while (baseList[num]==null);
		baseList[num] = null;
		blingList[num].style.backgroundColor = getRandomColor();
	}
	// 重置样式，可以修改时间以改变闪的缓冲时间
	idClear = window.setTimeout(reset, 1500);
}

function startBling() {
	idBling = window.setInterval(bling, 2000);

}

function stopBling() {
	window.clearInterval(idBling);
}

/* 为了js与html更好的分离，下面这样写可能更好
var startBling = document.getElementById("startBling");
var stopBling = document.getElementById("stopBling");

startBling.onclick = function() {
	idBling = window.setInterval(bling, 2000);
}
stopBling.onclick = function() {
	window.clearInterval(idBling);
}
*/