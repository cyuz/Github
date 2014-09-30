var Result = function() {

	var monsterName;

	function init() {
		$("#confirmBtn").click(confirmToMissionView);
		hideResultView();
	}

	function showVictory() {
		$("#resultText").text("");
		$("#resultText").append(monsterName + "：臣亮言：先帝創業未半，而中道崩殂；今天下三分，益州疲敝，此誠危急存亡之秋也。然侍衛之臣，不懈於內；忠志之士，忘身於外者：蓋追先帝之殊遇，欲報之于陛下也。誠宜開張聖聽，以光先帝遺德，恢弘志士之氣");
		$("#victory").show();
		$("#defeat").hide();
		showResultView();
	}

	function showDefeat() {
		$("#resultText").text("");
		$("#resultText").append(monsterName + "：GGGGGGGGGGG</br>");
		$("#resultText").append(monsterName + "：GGGGGG</br>");
		$("#resultText").append(monsterName + "：嗨～肉腳你們好阿！</br>");
		$("#resultText").append(monsterName + "：GGGGGGG</br>");
		$("#resultText").append(monsterName + "：GGGGGGGGG</br>");
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

	function setMonster(layer) {
		var monster = RoleData.getData(layer[layer.length - 1]);
		monsterName = monster.name;
	}

	return {
		"init" : init,
		"showVictory" : showVictory,
		"showDefeat" : showDefeat,
		"setMonster" : setMonster
	}

}();

