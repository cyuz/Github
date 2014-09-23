var MissionData = function() {
	$(document).ready(init);

	var MISSION_COUNT = 1;
	var missionList = {}
	var completeCount = 0;

	function init() {
		loadData("fireI.ball");
		loadData("fireII.ball");
		loadData("fireIII.ball");
		loadData("waterI.ball");
		loadData("waterII.ball");
		loadData("waterIII.ball");
		loadData("woodI.ball");
		loadData("woodII.ball");
		loadData("woodIII.ball");
	}

	function loadData(fileName) {
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

	function getMission(id) {
		return ballList[id];
	}

	return {
		"get" : getMission
	}
}();
