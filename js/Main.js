var Main = function() {
	$(document).ready(init);

	function init() {
		MissionData.init();
	}

	function missionReady() {
		BallData.init();
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

		CardTips.init();

		$("#missionBlue").data("mission", "mon001");
		$("#missionBlue").click(goMission);

		$("#missionRed").data("mission", "mon001");
		$("#missionRed").click(goMission);

		$("#missionYellow").data("mission", "mon002");
		$("#missionYellow").click(goMission);

		$("#missionGreen").data("mission", "mon001");
		$("#missionGreen").click(goMission);

		//toMissionView();
		TweenMax.to($("#teamView"), 0, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to($("#gameView"), 0, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});

		//Game.roundInit();
	}

	function goMission(e) {
		var m = $(e.currentTarget).data("mission");
		Game.setMission(m);
		TeamManager.setMission(m);
		toTeamView();
	}

	function toMissionView() {
		TweenMax.to($("#missionView"), 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
		TweenMax.to($("#teamView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to($("#gameView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
	}

	function toTeamView() {
		TweenMax.to($("#missionView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to($("#teamView"), 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
		TweenMax.to($("#gameView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
	}

	function toGameView() {
		TweenMax.to($("#missionView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to($("#teamView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to($("#gameView"), 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
	}

	return {
		"toMissionView" : toMissionView,
		"toTeamView" : toTeamView,
		"toGameView" : toGameView,
		"missionReady" : missionReady,
		"ballReady" : ballReady,
		"roleReady" : roleReady,
		"skillReady" : skillReady
	}
}();

