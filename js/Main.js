var Main = function() {
	var rewardMap = {
		1 : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
		2 : [19, 20, 21, 22, 23, 24],
		3 : [25, 26, 27, 28, 29, 30, 31, 32],
		4 : [33, 34, 35, 36, 37, 38, 39, 40]
	}

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
		SoundHandler.init();
		Game.init();
		CookiesAdapter.init();
		TeamManager.init();
		TeamManager.createTeamRolesFromData();

		CardTips.init();

		$("#missionBlue").data("mission", "mon003");
		$("#missionBlue").click(goMission);

		$("#missionRed").data("mission", "mon001");
		$("#missionRed").click(goMission);

		$("#missionYellow").data("mission", "mon004");
		$("#missionYellow").click(goMission);

		$("#missionGreen").data("mission", "mon002");
		$("#missionGreen").click(goMission);
		TweenMax.to([$("#missionView"), $("#guideMission")], 0, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		setTimeout(loadingEnd, 1500);
	}

	function loadingEnd() {
		TweenMax.to($("#coverView"), 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		toMissionView();
	}

	function goMission(e) {
		var m = $(e.currentTarget).data("mission");
		Game.setMission(m);
		TeamManager.setMission(m);
		TeamManager.createTeamRolesFromData();
		toTeamView();
	}

	function toMissionView(giveNewcard) {
		TweenMax.to([$("#missionView"), $("#guideMission")], 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
		TweenMax.to([$("#teamView"), $("#guideTeam")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to([$("#gameView"), $("#guideGame")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		SoundHandler.stopfightSound();
		SoundHandler.playGeneralSound();

		if (giveNewcard) {
			getNewCard();
		}
	}

	function getNewCard() {
		var rewardList = rewardMap[$("#difficulty").val()];
		var rewardIndex = Math.random() * rewardList.length >> 0;
		var rewardId = rewardList[rewardIndex];
		//CookiesAdapter.set
		CookiesAdapter.enableRole("c" + rewardId);
		CardTips.setRole("c" + rewardId);
	}

	function toTeamView() {
		TweenMax.to([$("#missionView"), $("#guideMission")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to([$("#teamView"), $("#guideTeam")], 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
		TweenMax.to([$("#gameView"), $("#guideGame")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
	}

	function toGameView() {
		TweenMax.to([$("#missionView"), $("#guideMission")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to([$("#teamView"), $("#guideTeam")], 0.5, {
			css : {
				alpha : 0,
				display : 'none'
			}
		});
		TweenMax.to([$("#gameView"), $("#guideGame")], 0.5, {
			css : {
				alpha : 1,
				display : 'inline'
			}
		});
		SoundHandler.playfightSound();
		SoundHandler.stopGeneralSound();
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

