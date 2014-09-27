var Monster = function() {

	var maxHp = 0;
	var curHp = 0;
	var atk = 0;
	var color = "";

	var p_maxHp = 0;
	var p_curHp = 0;

	function setMonster(id) {
		var monster = RoleData.getData(id);
		maxHp = monster.hp;
		curHp = monster.hp;
		color = monster.color;
		atk = monster.atk;

		var bossImg = document.getElementById("monsterImg");
		bossImg.src = "image/" + monster.fightPic;

		playMonsterBloodAni(0);
	}

	function getHurt(site, color, damage, health, shield) {
		var bossImg = document.getElementById("monsterImg");
		var moveLeft = bossImg.style.left;

		var leftValue = (2.5 - site) * 5;

		TweenMax.to(bossImg, 0.1, {
			left : $("#monsterImg").position().left + leftValue,
			top : $("#monsterImg").position().top - 5,
			repeat : 1,
			yoyo : true
		});

		curHp -= damage;
		if (curHp < 0) {
			curHp = 0;
		}
		playMonsterBloodAni(0.5);

		p_curHp += health;
		if (p_curHp > p_maxHp) {
			p_curHp = p_maxHp;
		}
		playPlayerBloodAni(0, 0.5);
		//attack();
	}

	function attack() {
		if (curHp <= 0) {
			alert("victory");
			Main.toMissionView();
			return;
		}

		var bossImg = document.getElementById("monsterImg");
		TweenMax.to(bossImg, 0.1, {
			delay : 0.2,
			top : 100,
			repeat : 1,
			yoyo : true,

		});

		p_curHp -= atk;
		if (p_curHp < 0) {
			p_curHp = 0;
		}

		playPlayerBloodAni(0.3, 0.5, checkPlayerHp);

	}

	function playMonsterBloodAni(during) {
		var curWidth = curHp / maxHp * 350;
		var monsterBlood = document.getElementById("monsterBlood");
		TweenLite.to(monsterBlood, during, {
			width : curWidth
		});
	}

	function playPlayerBloodAni(delay, during, callback) {
		var curWidth = p_curHp / p_maxHp * 550;
		var playerBlood = document.getElementById("playerBlood");
		TweenLite.to(playerBlood, during, {
			delay : delay,
			width : curWidth,
			onComplete : callback
		});
	}

	function checkPlayerHp() {
		if (p_curHp <= 0) {
			alert("defeat");
			Main.toMissionView();
			return;
		}
		Game.roundInit();
	}

	function homing() {
		var bossImg = document.getElementById("monsterImg");

		TweenMax.to(bossImg, 0.1, {
			left : 230,
			top : 30,
		});
	}

	function setPlayerHp(hp) {
		p_maxHp = hp;
		p_curHp = hp;
		playPlayerBloodAni(0, 0);
	}

	return {
		"setMonster" : setMonster,
		"setPlayerHp" : setPlayerHp,
		"getHurt" : getHurt,
		"homing" : homing,
		"attack" : attack
	}

}();

