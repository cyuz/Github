var RoleFunc = function()
{

    const ROLE_COUNT = 6;
    const MAX_ENERGY = 300;
    const ENERGY_SIZE = 70;
    const LEFT_CENTER_X = "0px";
    const RIGHT_CENTER_X = "530px";
    const BALL_FLY_TIME = 1;
    const FUNCTION_DELAY_TIME = 1;
    const ENERGY_UPDATE_TIME = 0.5;
    const COMBO_DAMAGE_RATE = 0.25;
    
    var char_roles = new Array(ROLE_COUNT);
    var characterDatas = new Array();
    var maxTotalhp = 0;
    var sameElementComboHit = 0;
    var animationCount = 0;
    var bonusAPEffect = 0;
    var bonusHPEffect = 0;
    var bonusShieldEffect = 0;
    var charactersDiv = undefined;
    

    
    var init = function()
    {
        charactersDiv = $("#gameView > #player_area")[0]
        updateComboHit();    
    }

    
    var createRole = function()
    {
        if(charactersDiv == undefined)
        {
            console.log("not bind to div");
            return;
        }
        
        
        clearRoles();
        
        maxTotalhp = 0;

        
        for (var i = 0; i < arguments.length && i < ROLE_COUNT; i++)
        {            
            var characterDataInfo = RoleData.getData(arguments[i]);            
            
            char_roles[i] = new Character(i, characterDataInfo);
            var div = createCharacterDiv(charactersDiv, arguments[i]);
            char_roles[i].bindDisplay(div);
            maxTotalhp += characterDataInfo.hp;
        }        
        
        Monster.setPlayerHp(maxTotalhp);
    }
    
    var clearRoles = function()
    {
        char_roles.length = 0;
        maxTotalhp = 0;
        if(charactersDiv != undefined)
        {                    
            while (charactersDiv.firstChild) {
                charactersDiv.removeChild(charactersDiv.firstChild);
             }     
        }
    }
    
    var createCharacterDiv = function(charactersDiv, index_num)
    {
        if(charactersDiv == undefined)
        {
            console.log("not bind to div");
            return;
        }
        
        var characterdiv = document.createElement('div');
        var divIdName = 'character_'+index_num+'_div';
        characterdiv.setAttribute('id',divIdName);
        characterdiv.className = "rolebox";
        //characterdiv.className += " bk_purple";
        
        charactersDiv.appendChild(characterdiv);        
        
        var character_bk = document.createElement('div');
        divIdName = 'role_img_bk';
        character_bk.setAttribute('id',divIdName);        
        character_bk.className = "role_img_bk";
        characterdiv.appendChild(character_bk);            
        
        var energydiv = document.createElement('img');
        divIdName = 'energy_div';
        energydiv.setAttribute('id',divIdName);
        energydiv.className = "energybox";
        //energydiv.className += " energyboxcolor";

        characterdiv.appendChild(energydiv);             
        
        var characterImg = document.createElement('img');
        divIdName = 'role_img';
        characterImg.setAttribute('id',divIdName);        
        characterImg.className = "role_img";
        characterdiv.appendChild(characterImg);              
        
        
        return characterdiv;
    }
        

    

    
    var giveOrb = function(posIndex, orbIndex)
    {        
        var orb = BallData.getBall(orbIndex);
        char_roles[posIndex].acceptOrb(orb);
    }
    
    var activeSkill = function(posIndex)
    {
        char_roles[posIndex].activeSkill();
    }
    
    var conclude = function()
    {    
    
        //console.log("conclude");
        for(var i=0; i<char_roles.length;i++)
        {
            if(char_roles[i] != null)
            {
                addAnimationCount();
            }
        }
                
        for(var i=0; i<char_roles.length;i++)
        {
            if(char_roles[i] != null)
            {
                char_roles[i].startAttack();
            }
        }
    }    
    
    var addAnimationCount = function()
    {
        animationCount++;
    }
    
    var removeAnimationCount = function()
    {        
        animationCount--;
        if(animationCount == 0)
        {
        
            clearSameElementComboHit();
            if (window.hasOwnProperty('Game'))
            {
                 
                //TODO change global game state;
                //Game.roundInit();
                Monster.attack();
            }
            
        }
    }
    
    var roundStart = function()
    {
        clearState();
        activePasiiveSkillEffect();
        consumeStateEnergy();
    }
    
    var clearState = function()
    {
        for(var i=0; i<char_roles.length;i++)
        {
            if(char_roles[i] != null)
            {
                char_roles[i].clearState();
            }
        }
    }
    
    var activePasiiveSkillEffect = function()
    {
        for(var i=0; i<char_roles.length;i++)
        {
            if(char_roles[i] != null)
            {
                SkillParser.activeSkill(char_roles[i].pSkill, RoleFunc, Monster);
            }
        }
    }

    var consumeStateEnergy = function()
    {
        for(var i=0; i<char_roles.length;i++)
        {
            if(char_roles[i] != null)
            {
                char_roles[i].consumeStateEnergy();
            }
        }            
    }
    

    var getComboDamageBonusRate = function()
    {
        if(sameElementComboHit <= 0)
        {
            return 0;
        }
        return (sameElementComboHit - 1) * COMBO_DAMAGE_RATE;
    }
    
    var getComboDamageRate = function()
    {
        if(sameElementComboHit <= 0)
        {
            return 0;
        }
        else
        {
            return getComboDamageBonusRate() + 1;
        }
    }
    
    var addSameElementComboHit = function(addValue)
    {
        sameElementComboHit += addValue;
        updateComboHit();
    }

    var clearSameElementComboHit = function()
    {
        sameElementComboHit = 0;
        updateComboHit();
    }
    
    var getSameElementComboHit = function()
    {
        return sameElementComboHit;
    }
    
    var updateComboHit = function()
    {
        $("#combotHit > #combotHitValue")[0].innerHTML = sameElementComboHit;
        var bonusRate = "+" + (getComboDamageBonusRate() * 100) + "%";
        $("#combotHit > #combotHitRate")[0].innerHTML = bonusRate;
    }
        
    

    function Character(index, characterDataInfo)
    {
        this.id = characterDataInfo.id
        this.index = index;
        this.name = characterDataInfo.name;
        this.color = characterDataInfo.color;
        this.hp = characterDataInfo.hp;
        this.atk = characterDataInfo.atk;
        this.atkAdd = 0;
        this.atkMul = new Array(1);
        this.heal = characterDataInfo.heal;
        this.healAdd = 0;
        this.healMul = new Array(1);        
        this.shield = characterDataInfo.shield;
        this.shieldAdd = 0;
        this.shieldMul = new Array(1);
        this.race = characterDataInfo.race;
        this.skill = characterDataInfo.skill;
        this.pSkill = characterDataInfo.pSkill;                        
        this.fightPic = characterDataInfo.fightPic;
        this.comboHitTimes = 0;
        //-1 means none
        this.energyIcon = undefined;      
        this.roleIcon = undefined;        
        this.energy = 0;
        this.energyAdd = 0;
        this.energyMul = new Array(1);
        this.orbQueue = new Array();
        this.updatetl = new TimelineLite({autoRemoveChildren:true});    
        
        this.clearState()
        {
            this.atkAdd = 0;
            this.atkMul = new Array(1);
            this.healAdd = 0;
            this.healMul = new Array(1); 
            this.shieldAdd = 0;
            this.shieldMul = new Array(1);
            this.energyAdd = 0;
            this.energyMul = new Array(1);           
        }
        
        this.getFinalAtk()
        {
            var atkValue = this.atk + this.atkAdd;
            if(atkValue <= 0)
            {
                return 0;
            }
            
            for(var i=0;i<this.atkMul.length;i++)
            {
                atkValue *= this.atkMul[i];
            }
            
            return  Math.round(atkValue);
        }        
        
        this.getFinalHeal()
        {
            var healValue = this.heal + this.healAdd;
            if(healValue <= 0)
            {
                return 0;
            }
            
            for(var i=0;i<this.healMul.length;i++)
            {
                healValue *= this.healMul[i];
            }
            
            return  Math.round(healValue);
        }   

        this.getFinalShield()
        {
            var shieldValue = this.shield + this.shieldAdd;
            if(shieldValue <= 0)
            {
                return 0;
            }
            
            for(var i=0;i<this.shieldMul.length;i++)
            {
                shieldValue *= this.shieldMul[i];
            }
            
            return  Math.round(shieldValue);
        }           
        
        this.consumeStateEnergy()
        {
        
            var energyValue = this.energy + this.energyAdd;
            if(energyValue > 0)
            {
                for(var i=0;i<this.energyMul.length;i++)
                {
                    energyValue *= this.energyMul[i];
                } 
                
                energyValue = Math.round(energyValue);
            }
            else
            {
                //in case < 0
                energyValue = 0;
            }
            
            var addEnergy = energyValue - this.energy;
            this.changeEnergy(addEnergy);
            this.energyAdd = 0;
            this.energyMul = new Array(1);              
        }
        
        this.acceptOrb = function(orb){
        
            if(this.color == orb.color)
            {
                this.comboHitTimes++;
                addSameElementComboHit(1);
                this.orbQueue.push(orb);
                this.changeEnergy(orb.energy * 2);                
            }
            else
            {            
                this.changeEnergy(orb.energy);
            }
        };
        
        
        this.changeEnergy = function(addValue)
        {
            this.energy += addValue;
            if(this.energy > MAX_ENERGY)
            {
                this.energy = MAX_ENERGY;
            }
            this.updateEnergyDisplay()            
        }
        
        
        this.updateEnergyDisplay = function()
        {  
            var width = this.energy / MAX_ENERGY * ENERGY_SIZE;
            this.updatetl.to(this.energyIcon, ENERGY_UPDATE_TIME, {width:width});            
        }
        
        this.consumeAttackEnergy = function(attackLevel)
        {
            if(attackLevel)
            {
                this.changeEnergy(-this.skillEnergyCost[attackLevel - 1]);
                
                this.updateEnergyDisplay();
            }
            
            removeAnimationCount();
        }
        

        
        
        
        this.startAttack = function()
        {        
        
            if(this.comboHitTimes > 0)
            {
                this.normalAttack();                                    
            }            
            else
            {
                removeAnimationCount();
            } 
           
            
        }
        
        this.normalAttack = function()
        {
        
            console.log("index: " + this.index + ",comboHitTimes times --" + this.comboHitTimes);           
                
            var centerPos = (this.index < 3) ? LEFT_CENTER_X: RIGHT_CENTER_X;            
            
            //var ballDivArray = new Array();
            
           
            
            for(var i=0;i<this.orbQueue.length;i++)
            {
                var orb = this.orbQueue[i];
                
                var ballDiv = createBalldiv(charactersDiv, this.index, orb.color, orb.image);                
                
                //ballDivArray[i] = ballDiv;
                console.log("index: " + this.index + " attack once");  
                if(i ==0)
                {
                    this.updatetl.to(this.roleIcon, 0.1, {x:0,y:-5}, "mylabel");
                    this.updatetl.to(this.roleIcon, 0.1, {x:0,y:0});                 
                    this.updatetl.to(ballDiv, BALL_FLY_TIME, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-730px"}]}, ease:Power1.easeInOut, onComplete:removeBallDiv, onCompleteParams:[charactersDiv, ballDiv, this, i]}, "-=0.1")                
                }
                else
                {
                    var overlap = "mylabel+="+(i*0.2);
                    this.updatetl.to(this.roleIcon, 0.1, {x:0,y:-5}, overlap);
                    this.updatetl.to(this.roleIcon, 0.1, {x:0,y:0});                 
                    this.updatetl.to(ballDiv, BALL_FLY_TIME, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-730px"}]}, ease:Power1.easeInOut, onComplete:removeBallDiv, onCompleteParams:[charactersDiv, ballDiv, this, i]}, "-=0.8");                
                }
                
                

            }                                                            

            //this.updatetl.staggerTo(ballDivArray, 1.5, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-900px"}]}, ease:Power1.easeInOut, onComplete:removeBallDivTween, onCompleteParams:[charactersDiv, "{self}" ,this]}, 0, removeAllBallDiv);
            
            //then call cleanOrbs
            
            this.updatetl.append(TweenLite.delayedCall(FUNCTION_DELAY_TIME, finishNormalAttack, [this] ));            
            
            
                

        };
        
        
        this.getNormalAttackValue = function(ballIndex)
        {
            var orb = this.orbQueue[ballIndex];
            var rate = 1;
            if(orb.rate != undefined)
            {
                rate = orb.rate;
            }
            var comboDagameRate = getComboDamageRate();
            
            var damageValue =  Math.round(this.getFinalAtk() * rate * comboDagameRate);
            var healValue =  Math.round(this.getFinalHeal() * rate * comboDagameRate);
            var shieldValue =  Math.round(this.getFinalShield() * rate * comboDagameRate);
            var result = new Array();
            result[0] = damageValue;
            result[1] = healValue;
            result[2] = shieldValue;
            return result;
        }
        
        this.finishNormalAttack = function()
        {
            console.log("index:" + this.index + ", attack done");
            this.comboHitTimes = 0;
            this.orbQueue.length = 0;
            removeAnimationCount();
        }
        
        
        this.bindDisplay = function(mainDiv)
        {
            this.energyIcon = mainDiv.querySelector("#energy_div");
            this.roleIcon = mainDiv.querySelector("#role_img");
            this.roleIcon.setAttribute('src', "image/" + this.fightPic);
            this.rold_bk =  mainDiv.querySelector("#role_img_bk");
                        
            
            if(this.color == "red")
            {
                this.rold_bk.style.backgroundImage = "url(image/fire_bk.png)"; // change it
                this.rold_bk.style.backgroundSize="cover";
                this.energyIcon.src="image/fire_energy.png";
            }
            else if(this.color == "green")
            {
                this.rold_bk.style.backgroundImage = "url(image/forest_bk.png)"; // change it
                this.rold_bk.style.backgroundSize="cover";
                this.energyIcon.src="image/forest_energy.png";
            }
            else if(this.color == "blue")
            {
               this.rold_bk.style.backgroundImage = "url(image/water_bk.png)"; // change it
               this.rold_bk.style.backgroundSize="cover";
               this.energyIcon.src="image/water_energy.png";
            }            

        }
 
        
        this.takeSkillEffect(effectType, effectOperator, effectValue)
        {
            switch(effectType)
            {
                case "atk":
                    if(effectOperator == "+")
                    {
                        this.atkAdd += effectValue;
                    }
                    else if(effectOperator == "-")
                    {
                       this.atkAdd -= effectValue;
                    }
                    else if(effectOperator == "*")
                    {
                        this.atkMul += effectValue;
                    }
                break;
                case "heal":
                    if(effectOperator == "+")
                    {
                        this.healAdd += effectValue;
                    }
                    else if(effectOperator == "-")
                    {
                        this.healAdd -= effectValue;
                    }
                    else if(effectOperator == "*")
                    {
                        this.healMul += effectValue;
                    }                  
                break;
                case "shield":
                    if(effectOperator == "+")
                    {
                        this.shieldAdd += effectValue;
                    }
                    else if(effectOperator == "-")
                    {
                        this.shieldAdd -= effectValue;
                    }
                    else if(effectOperator == "*")
                    {
                        this.shieldMul -= effectValue;
                    }                 
                break;
                case "energy":
                    if(effectOperator == "+")
                    {
                        this.energyAdd += effectValue;
                    }
                    else if(effectOperator == "-")
                    {
                        this.energyAdd -= effectValue;
                    }
                    else if(effectOperator == "*")
                    {
                        this.energyMul -= effectValue;
                    }                 
                break;
            }
        }     

        this.activeSkill()
        {
        }   

    }


    function finishNormalAttack(player)
    {
        player.finishNormalAttack();
    }
    
    function consumePlayerAttackEnergy(player, attackLevel)
    {
        player.consumeAttackEnergy(attackLevel);
    }
    
    function createBalldiv(parentdiv, index, color, imgSrc)
    {
        var balldiv = document.createElement("div");
        balldiv.className = "attackOrbPos" + index;        
        var newimg = document.createElement("img");
        newimg.src = "image/" + imgSrc;
        newimg.className = "orb_icon";
        balldiv.appendChild(newimg);
        
        
        parentdiv.appendChild(balldiv);
        
        return balldiv;
    }
    
    function removeBallDiv(parentdiv, ballDiv, player, ballIndex)
    {            
        var attakResult = player.getNormalAttackValue(ballIndex);
        console.log("ball remove, damage:" + attakResult[0] + ",heal:" + attakResult[1] + ",shield:" + attakResult[2]);
        Monster.getHurt(player.index, player.color, attakResult[0], attakResult[1], attakResult[2]);
            
        parentdiv.removeChild(ballDiv);
    }
    
    function removeBallDivTween(parentdiv, tween)
    {
        Monster.getHurt(this.index, this.color, 0, 0, 0);
        console.log("ball remove");
        parentdiv.removeChild(tween.target);
    }
    
    var removeAllBallDiv = function(parentdiv, ballArray)
    {
        console.log("all ball remove");
        for(var i=0;i<ballArray.length;i++)
        {
            parentdiv.removeChild(ballArray[i]);
        }
    }        
    
    
    var getHp = function()
    {
        return Monster.getPlayerHp();
    }
    
    var getColorCount = function(targetColor)
    {
        var count = 0;
        for(var i=0;i<char_roles.length;i++)
        {
            if(char_roles[i].color == targetColor)
            {
                count++;
            }
        }
        
        return count;
    }
    
    var getRaceCount = function(targetRace)
    {
        var count = 0;
        for(var i=0;i<char_roles.length;i++)
        {
            if(char_roles[i].race == targetRace)
            {
                count++;
            }
        }
        
        return count;        
    }
    
    
    function filterSkillTarget(targetColor, targetRace)
    {
        var targets = new Array();
        for(var i=0;i<char_roles.length;i++)
        {
            if(char_roles[i].color == targetColor || targetColor == "all")
            {
                if(char_roles[i].race == targetRace || targetRace == "all")
                {
                    targets[targets.length] = char_roles[i];
                }
            }
        }        

        
        return targets;
    }
    

    
    
	return {
		"init" : init,
		"createRole" : createRole,
        "clearRoles" : clearRoles,
        "giveOrb": giveOrb,
        "conclude": conclude,
        "getSameElementComboHit": getSameElementComboHit,
        "getColorCount": getColorCount,
        "getRaceCount": getRaceCount,
        "getHp": getHp,
        "filterSkillTarget": filterSkillTarget,
        "roundStart" : roundStart
	}    
    
    

}();



