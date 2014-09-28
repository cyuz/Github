var Result = function() {

	var monsterName;

	function init() {
		$("#confirmBtn").click(confirmToMissionView);
		hideResultView();
	}

	function showVictory() {
		$("#resultText").text("");
		$("#resultText").append(monsterName + "：請給我木材！</br>");
		$("#resultText").append(monsterName + "：請給我食物！</br>");
		$("#resultText").append(monsterName + "：請給我石頭！</br>");
		$("#resultText").append(monsterName + "：請給我黃金！</br>");
		$("#resultText").append(monsterName + "：糟了，是世界奇觀！</br>");
		$("#victory").show();
		$("#defeat").hide();
		showResultView();
	}

	function showDefeat() {
		$("#resultText").text("");
		$("#resultText").append(monsterName + "：GGGGGGGGGGGGGG</br>");
		$("#resultText").append(monsterName + "：GGGGGG</br>");
		$("#resultText").append(monsterName + "：嗨～肉腳你們好阿！</br>");
		$("#resultText").append(monsterName + "：GGGGGGG</br>");
		$("#resultText").append(monsterName + "：GGGGGGGGGGG</br>");
		$("#resultText").append(monsterName + "：玩得不錯</br>");
		$("#resultText").append(monsterName + "：GGGGGGininder</br>");
		$("#defeat").show();
		$("#victory").hide();
		showResultView();
	}

	function hideResultView() {
		TweenMax.to($("#resultView"), 0, {
			opacity : 0,
			display : "none"
		});
	}

	function showResultView() {
		TweenMax.to($("#resultView"), 0.2, {
			opacity : 1,
			display : "inline"
		});
	}

	function confirmToMissionView() {
		hideResultView();
		Main.toMissionView();
	}

	function setMonster(id) {
		var monster = RoleData.getData(id);
		monsterName = monster.name;
	}

	return {
		"init" : init,
		"showVictory" : showVictory,
		"showDefeat" : showDefeat,
		"setMonster" : setMonster
	}

}();

