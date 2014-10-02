var Result = function() {
	var isVictory = false;

	function init() {
		$("#confirmBtn").click(confirmToMissionView);
		hideResultView();
	}

	function showVictory() {
		isVictory = true;
		$("#victory").show();
		$("#defeat").hide();
		showResultView();
	}

	function showDefeat() {
		isVictory = false;
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
		Main.toMissionView(isVictory);
	}

	return {
		"init" : init,
		"showVictory" : showVictory,
		"showDefeat" : showDefeat
	}

}();

