var RoleData = function() {
	var MAX_COUNT = 2;
	var list = {}
	var completeCount = 0;

	function init() {
		loadData("mauer.role");
		loadData("monster.role");
	}

	function loadData(fileName) {
		var request = $.ajax({
			url : "role/" + fileName,
			type : "GET"
		});

		request.done(loadComplete);
	}

	function loadComplete(data) {
		var jsonData = jQuery.parseJSON(data);
		list[jsonData["id"]] = jsonData;
		completeCount++;
		if (completeCount == MAX_COUNT) {
			Main.roleReady();
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
