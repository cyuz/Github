var RoleData = function() {
	var MAX_COUNT = 14;
	var list = {}
	var playerList = {}
	var completeCount = 0;

	function init() {
		loadData("c1.role");
		loadData("c2.role");
		loadData("c3.role");
		loadData("c4.role");
		loadData("c5.role");
		loadData("c6.role");
		loadData("c7.role");
		loadData("c8.role");
		loadData("c9.role");
		loadData("c10.role");
		loadData("monster001.role");
		loadData("monster002.role");
		loadData("monster003.role");
		loadData("monster004.role");
        loadData("c1.role");
        loadData("c2.role");
        loadData("c3.role");
        loadData("c4.role");
        loadData("c5.role");
        loadData("c6.role");
        loadData("c7.role");
        loadData("c8.role");
        loadData("c9.role");
        loadData("c10.role");
        /*
        loadData("c2.role");
        loadData("c3.role");
        loadData("c4.role");
        loadData("c5.role");
        loadData("c6.role");
        loadData("c7.role");
        loadData("c8.role");
        loadData("c9.role");
        loadData("c10.role");
        loadData("c11.role");
        loadData("c12.role");
        loadData("c13.role");
        loadData("c14.role");
        loadData("c15.role");
        loadData("c16.role");
        loadData("c17.role");
        loadData("c18.role");
        loadData("c19.role");
        loadData("c20.role");
        loadData("c21.role");
        loadData("c22.role");
        loadData("c23.role");
        loadData("c24.role");
        loadData("c25.role");
        loadData("c26.role");
        loadData("c27.role");
        loadData("c28.role");
        loadData("c29.role");      
        loadData("c30.role");
        loadData("c31.role");
        loadData("c32.role");
*/
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
		if (!jsonData["isMonster"]) {
			playerList[jsonData["id"]] = jsonData;
		}
		completeCount++;
		if (completeCount == MAX_COUNT) {
			Main.roleReady();
		}
	}

	function playerList() {
		return playerList;
	}

	function getData(id) {
		return list[id];
	}

	return {
		"init" : init,
		"playerList" : playerList,
		"getData" : getData
	}
}();
