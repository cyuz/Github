var BallData = function() {
	$(document).ready(init);

	var BALL_COUNT = 9;
	var ballList = {}
	var completeCount = 0;

	function init() {
		loadBallData("fireI.ball");
		loadBallData("fireII.ball");
		loadBallData("fireIII.ball");
		loadBallData("waterI.ball");
		loadBallData("waterII.ball");
		loadBallData("waterIII.ball");
		loadBallData("woodI.ball");
		loadBallData("woodII.ball");
		loadBallData("woodIII.ball");
	}

	function loadBallData(fileName) {
		var request = $.ajax({
			url : "ball/" + fileName,
			type : "GET"
		});

		request.done(loadComplete);
	}

	function loadComplete(data) {
		var jsonData = jQuery.parseJSON(data);
		ballList[jsonData["id"]] = jsonData;
		completeCount++;
		if (completeCount == BALL_COUNT) {
			Game.init();
		}
	}

	function getBall(id) {
		return ballList[id];
	}

	return {
		"getBall" : getBall
	}
}();
