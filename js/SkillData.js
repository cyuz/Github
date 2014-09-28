var SkillData = function() {
	var MAX_COUNT = 2;
	var list = {}
	var completeCount = 0;

	function init() {
		loadData("skill1.skill");
        loadData("pskill001.skill");
        
        /*
        loadData("sk1.skill");                
        loadData("sk2.skill");
        
        loadData("sk3.skill");
        loadData("sk4.skill");
        loadData("sk5.skill");        
        loadData("sk6.skill");
        loadData("sk7.skill");
        loadData("sk8.skill");
        loadData("sk9.skill");
        loadData("sk10.skill");
        
        loadData("sk11.skill");        
        loadData("sk12.skill");
        loadData("sk13.skill");
        loadData("sk14.skill");
        loadData("sk15.skill");
        loadData("sk16.skill");
        loadData("sk17.skill");
        loadData("sk18.skill");
        loadData("sk19.skill");        
        loadData("sk20.skill");
        loadData("sk21.skill");
        loadData("sk22.skill");
        loadData("sk23.skill");
        loadData("sk24.skill");
        loadData("sk25.skill");
        loadData("sk26.skill");
        loadData("sk27.skill");
        loadData("sk28.skill");
        loadData("sk29.skill");
        loadData("sk30.skill");        
        loadData("sk31.skill");
        loadData("sk32.skill");        
        loadData("psk1.skill");
        loadData("psk2.skill");
        loadData("psk3.skill");
        loadData("psk4.skill");
        loadData("psk5.skill");
        loadData("psk6.skill");
        loadData("psk7.skill");
        loadData("psk8.skill");
        loadData("psk9.skill");
        loadData("psk10.skill");
        loadData("psk11.skill");
        loadData("psk12.skill");
        loadData("psk13.skill");
        loadData("psk14.skill");
        loadData("psk15.skill");
        loadData("psk16.skill");
        loadData("psk17.skill");
        loadData("psk18.skill");
        loadData("psk19.skill");
        loadData("psk20.skill");
        loadData("psk21.skill");
        loadData("psk22.skill");
        loadData("psk23.skill");
        loadData("psk24.skill");
        loadData("psk25.skill");
        loadData("psk26.skill");
        loadData("psk27.skill");
        loadData("psk28.skill");
        loadData("psk29.skill");
        loadData("psk30.skill");
        loadData("psk31.skill");
        loadData("psk32.skill");     
*/        
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
