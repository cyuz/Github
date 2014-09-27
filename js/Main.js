var Main = function() {
	$(document).ready(init);

	function init() {
		MissionData.init();
	}

	function missionReady() {
		BallData.init();
	}

	function ballReady() {
		Game.init();
		Game.setMission("fireBoss");
		Game.roundInit();
	}

	function ballReady() {
		RoleData.init();
	}

	function roleReady() {
		SkillData.init();
	}

	function skillReady() {
		gameReady();
	}

	function gameReady() {
		Game.init();
		TeamManager.init();
		TeamManager.createTeamRolesFromRoleData();
		Game.setMission("fireBoss");
		Game.roundInit();
	}

	return {
		"missionReady" : missionReady,
		"ballReady" : ballReady,
		"roleReady" : roleReady,
		"skillReady" : skillReady
	}
}();

