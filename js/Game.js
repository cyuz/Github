var Game = function() {
	//$(document).ready(init);

	const GAME_WIDTH = 450;
	const GAME_HEIGHT = 585;

	const ROAD_COUNT = 6;
	const ROAD_INTERVAL = 90;

	var gameInterval;

	const STATE_WAIT = 1;
	const STATE_COUNTDOWN = 2;
	const STATE_SHOW = 3;

	var arriveCount = 0;
	var combo = 0;
	var skyDownNum = 0;

	var gameState;

	var ballProbabilityPolicy = [];

	/*
	 * skill
	 */
	var skyDownRate = 1;

	function init() {

		createRoad();
		createBridge();

		RoleFunc.init();

		hideTimeBar();
		hideBonus();
	}

	function setRole(roleArray) {
		RoleFunc.createRole(roleArray[0], roleArray[1], roleArray[2], roleArray[3], roleArray[4], roleArray[5]);
	}

	function setMission(missionId) {
		var missionData = MissionData.getData(missionId);
		ballProbabilityPolicy = [];
		for (var key in missionData.ballProbabilityPolicy) {
			var value = missionData.ballProbabilityPolicy[key];
			for (var index = 0; index < value; index++) {
				ballProbabilityPolicy.push(key);
			}
		}

		Monster.setMonster(missionData.mosterLayer);
	}

	function gameToWait() {
		arriveCount = 0;
		combo = 0;

		Monster.homing();

		gameState = STATE_WAIT;

		randomBridge();

		initAllSkill();

		addBall(createEnergyBall(), 0);
		addBall(createEnergyBall(), 1);
		addBall(createEnergyBall(), 2);
		addBall(createEnergyBall(), 3);
		addBall(createEnergyBall(), 4);
		addBall(createEnergyBall(), 5);
	}

	function createRoad() {
		for (var index = 0; index < ROAD_COUNT; index++) {
			var road = document.createElement("div");
			$(road).addClass("road");
			$(road).css("top", 15);
			$(road).css("left", 20 + index * ROAD_INTERVAL);
			$("#game").append(road);
		}
	}

	function createBridge() {
		for (var i = 0; i < ROAD_COUNT - 1; i++) {
			for (var j = 0; j < 6; j++) {

				var bridge = document.createElement("div");
				bridge.className = "bridge";
				tempId = "bridge" + i + "_" + j;
				bridge.id = tempId;
				$(bridge).css("top", 10 + 90 * j + ((i % 2) + 1) * 45);
				$(bridge).css("left", 25 + i * ROAD_INTERVAL);
				var goleftRoad = "road" + i + "_" + (j * 2 + (i % 2));
				var goRightRoad = "road" + (i + 1) + "_" + (j * 2 + (i % 2));
				$(bridge).addClass(goRightRoad);
				$(bridge).addClass(goleftRoad);
				$(bridge).data(goRightRoad, "right");
				$(bridge).data(goleftRoad, "left");
				bridge.onclick = bridgeClick;

				$("#game").append(bridge);
			}
		}
	}

	function randomBridge() {
		var bridges = $('.bridge');
		bridges.each(function(i, v) {
			if ((Math.random() * 2 >> 0 ) == 1) {
				$(this).toggleClass("hide");
			}
		});
	}

	function recoverBridge() {
		var hideBridges = $('.bridge.hide');
		if (hideBridges.length > 0) {
			var index = Math.random() * hideBridges.length >> 0;
			$(hideBridges[index]).removeClass('hide');
		}
	}

	function wash(arr) {
		var i = arr.length;
		while (i) {
			var j = Math.random() * i >> 0;
			var k = arr[--i];
			arr[i] = arr[j];
			arr[j] = k;
		}
	}

	function bridgeClick(event) {
		if (gameState == STATE_SHOW) {
			return;
		}

		if ($(".site" + event.target.id).length == 0) {
			$(event.target).addClass('hide');
			if (gameState == STATE_WAIT) {
				gameState = STATE_COUNTDOWN;
				TweenLite.to($("#timerbar"), 3, {
					width : 0,
					ease : Linear.easeNone,
					onComplete : gameShow
				});
				$("#timerbarArea").show();
			}
		}
	}

	function gameShow() {
		hideTimeBar();
		gameState = STATE_SHOW;
		speedFaster();
	}

	function hideTimeBar() {
		TweenLite.to($("#timerbar"), 0, {
			width : 547
		});
		$("#timerbarArea").hide();
	}

	function createEnergyBall() {
		var ball = document.createElement("div");

		$(ball).addClass("ball");
		//設定屬性
		setBallData(ball, getRandomBall());

		return ball;
	}

	function addBall(ball, road) {
		$(ball).css("top", 15);
		$(ball).css("left", 25 + road * ROAD_INTERVAL);
		var nowSite = "road" + road + "_0";
		$(ball).addClass("site" + nowSite);
		$(ball).data("nowSite", nowSite);
		//設定移動
		$(ball).addClass("down");
		$(ball).data("moveSite", "down");
		//移動計數器歸零
		$(ball).data("count", 0);

		$(ball).data("road", road);
		$(ball).data("layer", 0);
		$(ball).data("onBridge", false);

		$("#game").append(ball);
	}

	function getRandomBall() {
		var missionData = MissionData.getData("fireBoss");
		var index = Math.random() * ballProbabilityPolicy.length >> 0;
		var ballId = ballProbabilityPolicy[index];
		return BallData.getBall(ballId);
	}

	function setBallData(ball, ballData) {
		var img = document.createElement("img");
		img.className = ballData.css;
		img.src = "image/" + ballData.image;
		$(ball).data("id", ballData.id);
		$(ball).append(img);
	}

	function ballRun() {
		$(".down").css('top', '+=3px');
		$(".left").css('left', '+=3px');
		$(".right").css('left', '-=3px');
		var balls = $('.ball');
		balls.each(function(i, v) {
			var ball = $(this);
			var nowCount = ball.data("count") + 1;
			var maxCount;
			if (ball.hasClass('down')) {
				maxCount = 15;
			} else {
				maxCount = 30;
			}

			if (nowCount >= maxCount) {
				var curBridge = $("." + ball.data("nowSite"));
				if (curBridge.length == 0 || curBridge.hasClass("hide")) {
					var nowRoad;
					var nowSite;
					if (ball.data("onBridge")) {
						if (ball.data("moveSite") == "right") {
							nowRoad = ball.data("road") - 1;
						} else {
							nowRoad = ball.data("road") + 1;
						}
						ball.data("road", nowRoad);

						nowSite = "road" + nowRoad + "_" + ball.data("layer");
					} else {
						ball.data("layer", ball.data("layer") + 1);
						if (ball.data("layer") > 12) {
							ballArrive(ball);
							//recoverBridge();
							//addBall(createEnergyBall(), Math.random() * ROAD_COUNT >> 0);
						} else {
							nowRoad = ball.data("road");
							nowSite = "road" + nowRoad + "_" + ball.data("layer");
						}

					}

					ball.removeClass("site" + ball.data("nowSite"));
					ball.addClass("site" + nowSite);
					ball.data("nowSite", nowSite);

					var moveSite = "down";
					ball.removeClass(ball.data("moveSite"));
					ball.addClass(moveSite);
					ball.data("moveSite", moveSite);

					ball.data("onBridge", false);
				} else {
					var moveSite = curBridge.data(ball.data("nowSite"));
					ball.removeClass(ball.data("moveSite"));
					ball.addClass(moveSite);
					ball.data("moveSite", moveSite);

					var nowSite = curBridge.attr("id");
					ball.removeClass("site" + ball.data("nowSite"));
					ball.addClass("site" + nowSite);
					ball.data("nowSite", nowSite);

					ball.data("layer", ball.data("layer") + 1);

					ball.data("onBridge", true);
				}
				ball.data("count", 0);
			} else {
				ball.data("count", nowCount);
			}
		})
	}

	function ballArrive(ball) {
		var arriveRoad = ball.data("road");
		var arriveId = ball.data("id");
		var basicelement;

		RoleFunc.giveOrb(arriveRoad, arriveId);

		ball.remove();

		arriveCount++;
		if (arriveCount == ROAD_COUNT) {
			combo = RoleFunc.getSameElementComboHit();
			startSkyDown(combo);
			if (combo <= 0) {
				gamePause();
				Monster.attack();
				//gameToWait();
			}
		} else if (arriveCount > ROAD_COUNT && arriveCount == (skyDownNum + 1) * ROAD_COUNT) {
			gamePause();
			RoleFunc.conclude();
		}
	}

	function startSkyDown(combo) {
		skyDownNum = combo * skyDownRate;

		for (var i = 0; i < skyDownNum; i++) {
			setTimeout(skyDown, i * 1000);
		}
		if (skyDownNum > 0) {
			showBonus();
		}
	}

	function skyDown() {
		addBall(createEnergyBall(), 0);
		addBall(createEnergyBall(), 1);
		addBall(createEnergyBall(), 2);
		addBall(createEnergyBall(), 3);
		addBall(createEnergyBall(), 4);
		addBall(createEnergyBall(), 5);
	}

	function gameStart() {
		if (!gameInterval) {
			gameInterval = setInterval(ballRun, gameSpeed);
		}
	}

	function gamePause() {
		if (gameInterval) {
			clearInterval(gameInterval);
			gameInterval = null;
		}
	}

	function gameResume() {
		if (gameState == STATE_SHOW) {
			gameStart();
		}
	}

	function speedFaster() {
		gamePause();
		gameSpeed = 1;
		gameStart();
	}

	function speedSlower() {
		gamePause();
		gameSpeed = 50;
		gameStart();
	}

	function speedNormal() {
		gamePause();
		gameSpeed = 5;
		gameStart();
	}

	function showBonus() {
		TweenLite.to($("#bouns"), 0.8, {
			left : 0,
			ease : Expo.easeOut,
			onComplete : bonusMoveRight
		});
	}

	function bonusMoveRight() {
		TweenLite.to($("#bouns"), 0.5, {
			left : 800,
			ease : Expo.easeIn,
			onComplete : hideBonus
		});
	}

	function hideBonus() {
		TweenLite.to($("#bouns"), 0, {
			left : -600
		});
	}

	/*
	 *
	 */
	function initAllSkill() {
		setSkyDownRate(1);
	}

	function setSkyDownRate(rate) {
		skyDownRate = rate;
	}

	return {
		"init" : init,
		"setMission" : setMission,
		"setRole" : setRole,
		"pause" : gamePause,
		"resume" : gameResume,
		"roundInit" : gameToWait
	}

}();
