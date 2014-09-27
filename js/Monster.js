var Monster = function() {

	var maxHp = 0;
	var curHp = 0;
	var atk = 0;
    var atkAdd =0;
    var atkMul = [1];
	var color = "";
    var race = "";
    var pSkill = "";
    
	var p_maxHp = 0;
	var p_curHp = 0;
    var updatetl = new TimelineLite({autoRemoveChildren:true}); 

	function setMonster(id) {
		var monster = RoleData.getData(id);
		maxHp = monster.hp;
		curHp = monster.hp;
		color = monster.color;
        race = monster.race;
		atk = monster.atk;
        pSkill = monster.pSkill;

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
    
    function getFinalAtk()
    {
        var atkValue = atk + atkAdd;
        if(atkValue <= 0)
        {
            return 0;
        }
            
        for(var i=0;i<atkMul.length;i++)
        {
            atkValue *= atkMul[i];
        }
            
        return  Math.round(atkValue);    
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

		p_curHp -= getFinalAtk();
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
    
    function getPlayerHp() {
        return p_curHp;
    }
    
    function getHp()
    {
        return curHp;
    }
    
    function filterSkillTarget(targetColor, targetRace)
    {
        var targets = new Array();
        if(targetColor == color || targetColor == "all")
        {
            if(targetRace == race || targetRace == "all")
            {
                targets[0] = Monster;
            }
        }
        
        return targets;
    }
    
    function takeSkillEffect(effectType, effectOperator, effectValue)
    {
        switch(effectType)
        {
            case "atk":
                if(effectOperator == "+")
                {
                    atkAdd += effectValue;
                    addBuffIcon("atk_up.png");
                }
                else if(effectOperator == "-")
                {
                    atkAdd -= effectValue;
                    addBuffIcon("atk_up.png");
                }
                else if(effectOperator == "*")
                {
                    atkMul[atkMul.length] = effectValue;
                    if(effectValue > 1)
                    {
                        addBuffIcon("atk_up.png");
                    }
                    else
                    {
                        addBuffIcon("atk_down.png");
                    };
                }
            break;
        }
    }    

    function roundStart()
    {
        clearState();
        activePasiiveSkillEffect();
    }
    
    function clearState()
    {
        var atkAdd =0;
        var atkMul = [1];    
    }
    
    function activePasiiveSkillEffect()
    {
        SkillParser.activeSkill(pSkill, Monster, RoleFunc);
    }
    
    function addBuffIcon(buffImg)
    {
        var buffdiv = createBuffdiv(buffImg);                
        updatetl.to(buffdiv, 0.5, {x:0, y:-30, ease:Power1.easeInOut, onComplete:removeBuffdiv, onCompleteParams:[buffdiv]});
    }
    
    function createBuffdiv(imgSrc)
    {
        var buffdiv = document.createElement("div");
        buffdiv.className = "monster_buff_icon";        
        var newimg = document.createElement("img");
        newimg.src = "image/" + imgSrc;
        newimg.className = "buff_icon";
        buffdiv.appendChild(newimg);
        
        $("#gameView > #monster")[0].appendChild(buffdiv);
        
        return buffdiv;    
    }    
    
    
    function removeBuffdiv(buffdiv)
    {
        $("#gameView > #monster")[0].removeChild(buffdiv);
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
        "takeSkillEffect":takeSkillEffect,
        "roundStart" : roundStart
	}

}();

