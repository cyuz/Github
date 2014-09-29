var MissionData = function() {
	var MAX_COUNT = 4;
	var list = {}
	var completeCount = 0;

	function init() {
		loadData("mon001.mission");
		loadData("mon002.mission");
		loadData("mon003.mission");
		loadData("mon004.mission");
	}

	function loadData(fileName) {
		var request = $.ajax({
			url : "mission/" + fileName,
			type : "GET"
		});

		request.done(loadComplete);
	}

	function loadComplete(data) {
		var jsonData = jQuery.parseJSON(data);
		list[jsonData["id"]] = jsonData;
		completeCount++;
		if (completeCount == MAX_COUNT) {
			Main.missionReady();
		}
	}

	function getData(id) {
		return list[id];
	}

	return {
		"init" : init,
		"getData" : getData
	}
}();
