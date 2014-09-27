var Monster = function() {

	var maxHp = 0;
	var curHp = 0;
	var color = "";

	function setMonster(id) {
		var monster = RoleData.getData(id);
		maxHp = monster.hp;
		curHp = monster.hp;
		color = monster.color;

		var bossImg = document.getElementById("monsterImg");
		bossImg.src = "image/" + monster.fightPic;
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
		var curWidth = curHp / maxHp * 350;

		var monsterBlood = document.getElementById("monsterBlood");
		TweenLite.to(monsterBlood, 0.5, {
			width : curWidth
		});

		//attack();
	}

	function attack() {
		var bossImg = document.getElementById("monsterImg");
		TweenMax.to(bossImg, 0.1, {
			top : $("#monsterImg").position().top + 20,
			repeat : 1,
			yoyo : true
		});
	}

	function homing() {
		var bossImg = document.getElementById("monsterImg");

		TweenMax.to(bossImg, 0.2, {
			left : 230,
			top : 30,
		});
		
		Game.roundInit();
	}

	return {
		"setMonster" : setMonster,
		"getHurt" : getHurt,
		"homing" : homing,
		"attack" : attack
	}

}();

