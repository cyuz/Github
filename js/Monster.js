var Monster = function() {
	var monster;
	var maxHp = 0;
	var curHp = 0;
	var atk = 0;
	var atkAdd = 0;
	var atkMul = [1];
	var color = "";
	var race = "";
	var skill = "";
	var pSkill = "";

	var p_maxHp = 0;
	var p_curHp = 0;
	var p_shield = 0;

	var curColorMap;
	var colorMapping = {
		"red" : {
			"red" : 1,
			"blue" : 1.25,
			"green" : 0.75
		},
		"blue" : {
			"red" : 0.75,
			"blue" : 1,
			"green" : 1.25
		},
		"green" : {
			"red" : 1.25,
			"blue" : 0.75,
			"green" : 1
		}
	}

	var difficultyMap = {
		1 : 0.8,
		2 : 1,
		3 : 1.2,
		4 : 1.4
	}

	var skillEffectCount = 0;

	var waitSkillEffect = false;

	var curLayer = -1;
	var curMonsterLayer = 0;

	var m_difficulty = 1;

	var updatetl = new TimelineLite({
		autoRemoveChildren : true
	});

	function setMonster(monsterLayer) {
		curLayer = -1;
		curMonsterLayer = monsterLayer;
	}

	function nextLayer() {
		curLayer++;

		if (curLayer > curMonsterLayer.length - 1) {
			Result.showVictory();
			return;
		}
		setMonsterData(curMonsterLayer[curLayer]);
	}

	function setMonsterData(id) {
		m_difficulty = difficultyMap[$("#difficulty").val()];

		monster = RoleData.getData(id);
		maxHp = monster.hp * m_difficulty;
		curHp = monster.hp * m_difficulty;
		color = monster.color;
		race = monster.race;
		atk = monster.atk * m_difficulty;
		skill = monster.skill;
		pSkill = monster.pSkill;

		curColorMap = colorMapping[monster.color];
		var bossImg = document.getElementById("monsterImg");
		bossImg.onclick = showTips;

		$("#monsterBloodDiv").hover(showMonsterBlood, hidePlayerBlood);
		$("#playerBloodDiv").hover(showPlayerBlood, hidePlayerBlood);

		p_shield = 0;
		playPlayerShieldAni(0, 0.3);

		changeMonsterPic();
	}

	function showPlayerBlood(e) {
		$("#playerBloodTips").text(p_curHp + "/" + p_maxHp);
		showBloodTips(e.pageY - 45, e.pageX);
	}

	function showMonsterBlood(e) {
		$("#playerBloodTips").text(curHp + "/" + maxHp);
		showBloodTips(e.pageY + 20, e.pageX);
	}

	function showBloodTips(t, l) {
		TweenMax.to($("#playerBloodTips"), 0, {
			top : t,
			left : l,
			opacity : 1,
			display : "inline",
		});
	}

	function hidePlayerBlood(e) {
		TweenMax.to($("#playerBloodTips"), 0, {
			opacity : 0,
			display : "none",
		});
	}

	function changeMonsterPic() {
		if (curLayer == 0) {
			switchPic();
			return;
		}
		TweenMax.to($("#monsterImg"), 0.3, {
			css : {
				alpha : 0,
			},
			onComplete : switchPic
		});
		Game.roundInit();
	}

	function switchPic() {
		var bossImg = document.getElementById("monsterImg");

		bossImg.src = "image/" + monster.fightPic;

		TweenMax.to($("#monsterImg"), 0.3, {
			css : {
				alpha : 1
			},
			onComplete : picReady
		});

		playMonsterBloodAni(0);
	}

	function picReady() {

	}

	function showTips() {
		CardTips.setRole(monster.id);
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

		SoundHandler.hit();

		activeSkillEffect();

		var colorCoefficient = curColorMap[color];
		damage *= colorCoefficient;

		changeMonsterHp(-damage);

		healPlayerHp(health, shield);
	}

	function getFinalAtk() {
		var atkValue = atk + atkAdd;
		if (atkValue <= 0) {
			return 0;
		}

		for (var i = 0; i < atkMul.length; i++) {
			atkValue *= atkMul[i];
		}

		return Math.round(atkValue);
	}

	function attack() {

		if (skillEffectCount > 0) {
			waitSkillEffect = true;
			return;
		}

		if (!checkMonsterIsLive()) {
			return;
		}

		var bossImg = document.getElementById("monsterImg");
		TweenMax.to(bossImg, 0.1, {
			//delay : 0.2,
			top : 75,
			repeat : 1,
			yoyo : true,

		});

		SoundHandler.monsterHit();

		damagePlayerHp(getFinalAtk(), true);
	}

	function healPlayerHp(health, shield) {
		p_curHp += health;
		if (p_curHp > p_maxHp) {
			p_curHp = p_maxHp;
		}
		playPlayerBloodAni(0, 0.5);

		p_shield += shield;
		if (p_shield > p_maxHp * 2) {
			p_shield = p_maxHp * 2;
		}
		playPlayerShieldAni(0, 0.5);
	}

	function damagePlayerHp(damage, afterAttack) {
		var remainShield = p_shield - damage;
		var bloodDelay = 0;
		if (remainShield < 0) {
			if (p_shield > 0) {
				bloodDelay = 0.3;
			}
			p_shield = 0;

			p_curHp += remainShield;
			if (p_curHp < 0) {
				p_curHp = 0;
			}
		} else {
			p_shield = remainShield;
		}

		playPlayerShieldAni(0.3, 0.3);

		if (afterAttack) {
			playPlayerBloodAni(0.3 + bloodDelay, 0.3, checkPlayerHpAndNextRound);
		} else {
			playPlayerBloodAni(0.3 + bloodDelay, 0.3, checkPlayerHp);
		}
	}

	function changeMonsterHp(changeValue) {
		curHp += changeValue;
		if (curHp > maxHp) {
			curHp = maxHp;
		}
		if (curHp < 0) {
			curHp = 0;
		}
		playMonsterBloodAni(0.5);
	}

	function checkMonsterIsLive() {
		if (curHp <= 0) {
			nextLayer();
			return false;
		} else {
			return true
		}
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

	function playPlayerShieldAni(delay, during, callback) {
		var curWidth = p_shield / (p_maxHp * 2) * 550;
		var shield = document.getElementById("shield");
		TweenLite.to(shield, during, {
			delay : delay,
			width : curWidth,
			onComplete : callback
		});
	}

	function checkPlayerHpAndNextRound() {
		if (p_curHp <= 0) {
			Result.showDefeat();
			return;
		}
		p_shield = 0;
		playPlayerShieldAni(0, 0);
		Game.roundInit();
	}

	function checkPlayerHp() {
		if (p_curHp <= 0) {
			Result.showDefeat();
		}
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
		p_shield = 0;
		playPlayerShieldAni(0, 0);
	}

	function getPlayerHp() {
		return p_curHp;
	}

	function getHp() {
		return curHp;
	}

	function filterSkillTarget(effectType, targetColor, targetRace) {
		var targets = new Array();
		if (targetColor == color || targetColor == "all") {
			if (targetRace == race || targetRace == "all") {
				targets[0] = Monster;
			}
		}
		return targets;
	}

	function takeSkillEffect(effectType, effectOperator, effectValue) {
		switch(effectType) {
			case "atk":
				if (effectOperator == "+") {
					atkAdd += effectValue;
				} else if (effectOperator == "-") {
					atkAdd -= effectValue;
				} else if (effectOperator == "*") {
					atkMul[atkMul.length] = effectValue;
				}
				addBuffIcon("atk_buff_text.png", effectOperator + effectValue);
				break;
			case "hp":
				if (effectOperator == "+") {
					changeMonsterHp(effectValue);
				} else if (effectOperator == "-") {
					changeMonsterHp(-effectValue);
                    //skill direct check
                    checkMonsterIsLive();
				} else if (effectOperator == "*") {
					var newValue = Math.round(curHp * effectValue);
					changeMonsterHp(newValue - curHp);
				}
				break;
		}
	}

	function roundStart() {
		clearState();
		activePasiiveSkillEffect();
	}

	function clearState() {
		atkAdd = 0;
		atkMul = [1];
	}

	function activePasiiveSkillEffect() {
		SkillParser.activeSkill(pSkill, Monster, RoleFunc, Monster);
	}

	function activeSkillEffect() {
		SkillParser.activeSkill(skill, Monster, RoleFunc, Monster);
	}

	function addBuffIcon(buffImg, text) {
		var buffdiv = createBuffdiv(buffImg, text);
		updatetl.to(buffdiv, 0.5, {
			visibility : "visible",
			x : 0,
			y : -30,
			ease : Power1.easeInOut,
			onComplete : removeChildDiv,
			onCompleteParams : [buffdiv]
		}, "-=0.25");
	}

	function createBuffdiv(imgSrc, text) {
		var buffdiv = document.createElement("div");
		buffdiv.className = "monster_buff_icon";
		buffdiv.style.backgroundImage = "url(image/" + imgSrc + ")";
		buffdiv.style.backgroundSize = "cover";

		//var newimg = document.createElement("img");
		//newimg.src = "image/" + imgSrc;
		//newimg.className = "buff_icon";
		//buffdiv.appendChild(newimg);
		var newtext = document.createElement("div");
		newtext.className = "buff_text";
		newtext.innerHTML = text;
		buffdiv.appendChild(newtext);

		$("#gameView > #monster")[0].appendChild(buffdiv);

		return buffdiv;
	}

	function addSkillIcon(skillImg, text, skillID) {
		skillEffectCount++;
		var skillDiv = createSkillDiv(skillImg, text);
		updatetl.fromTo(skillDiv, 0.5, {
			x : -30
		}, {
			visibility : "visible",
			x : 60,
			ease : Expo.easeIn,
			onComplete : removeChildSkillDiv,
			onCompleteParams : [skillDiv, skillID]
		}, "-=0.25");
	}

	function createSkillDiv(imgSrc, text) {
		var buffdiv = document.createElement("div");
		buffdiv.className = "monster_skill_icon";
		buffdiv.style.backgroundImage = "url(image/" + imgSrc + ")";
		buffdiv.style.backgroundSize = "cover";

		//var newimg = document.createElement("img");
		//newimg.src = "image/" + imgSrc;
		//newimg.className = "buff_icon";
		//buffdiv.appendChild(newimg);
		var newtext = document.createElement("div");
		newtext.className = "buff_text";
		newtext.innerHTML = text;
		buffdiv.appendChild(newtext);

		$("#gameView > #monster")[0].appendChild(buffdiv);

		return buffdiv;
	}

	function removeChildSkillDiv(childdiv, skillID) {
		skillEffectCount--;
		if (skillEffectCount == 0) {
			if (waitSkillEffect) {
				waitSkillEffect = false;
				attack();
			}
		}
		removeChildDiv(childdiv);
	}

	function removeChildDiv(childdiv) {
		$("#gameView > #monster")[0].removeChild(childdiv);
	}

	function skillAnimation(skillID) {
		//addSkillIcon("skill_text.png", "", skillID);
	}

	return {
		"setMonster" : setMonster,
		"setPlayerHp" : setPlayerHp,
		"getHurt" : getHurt,
		"homing" : homing,
		"attack" : attack,
		"getPlayerHp" : getPlayerHp,
		"getHp" : getHp,
		"filterSkillTarget" : filterSkillTarget,
		"takeSkillEffect" : takeSkillEffect,
		"roundStart" : roundStart,
		"skillAnimation" : skillAnimation,
		"checkMonsterIsLive" : checkMonsterIsLive,
		"healPlayerHp" : healPlayerHp,
		"damagePlayerHp" : damagePlayerHp,
		"nextLayer" : nextLayer
	}
}();

