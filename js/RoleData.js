var RoleData = function() {
	var MAX_COUNT = 7;
	var list = {}
	var completeCount = 0;

	function init() {
		loadData("card001.role");
		loadData("card002.role");
		loadData("card003.role");
		loadData("card004.role");
		loadData("card005.role");
		loadData("card006.role");
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
