var SkillData = function() {
	var MAX_COUNT = 1;
	var list = {}
	var completeCount = 0;

	function init() {
		loadData("skill1.skill");
	}

	function loadData(fileName) {
		var request = $.ajax({
			url : "skill/" + fileName,
			type : "GET"
		});

		request.done(loadComplete);
	}

	function loadComplete(data) {
		var jsonData = jQuery.parseJSON(data);
		list[jsonData["id"]] = jsonData;
		completeCount++;
		if (completeCount == MAX_COUNT) {
			Main.skillReady();
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
