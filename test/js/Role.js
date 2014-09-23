var RoleFunc = function()
{

    const ROLE_COUNT = 6;
    
    this.char_roles = new Array(ROLE_COUNT);
    this.characterDatas = new Array();
    this.maxTotalhp = 0;
    this.currenthp = 0;
    this.currentShield = 0;
    this.sameElementComboHit = 0;
    this.animationCount = 0;
    

    function CharacterDataInfo(name, basicElement, ap, hp, icon, skillEnergyCost)
    {
        this.name = name;
        this.basicElement = basicElement;
        this.ap = ap;
        this.hp = hp;
        this.icon = icon;
        this.skillEnergyCost = skillEnergyCost;
    }    
    
    this.init = function()
    {
        this.characterDatas.push(new CharacterDataInfo("role_1", "red", 30, 800, "CelesSprite.png", [100,250,500]));
        this.characterDatas.push(new CharacterDataInfo("role_2", "green", 40, 700, "Edgar_Roni_Figaro_small.png", [100,250,500]));
        this.characterDatas.push(new CharacterDataInfo("role_3", "blue", 50, 600, "Locke_Cole_small.png", [100,250,500]));
        this.characterDatas.push(new CharacterDataInfo("role_4", "red", 60, 500, "Mog_(Final_Fantasy_VI)_small.png", [100,250,500]));
        this.characterDatas.push(new CharacterDataInfo("role_5", "green", 70, 400, "Shadow_(Final_Fantasy_VI)_small.png", [100,250,500]));
        this.characterDatas.push(new CharacterDataInfo("role_6", "blue", 80, 300, "Umaro_small.png", [100,250,500]));    
    }
    
    
    this.bind = function(charactersDiv, globalActionFunc)
    {
        this.charactersDiv = charactersDiv;
        this.globalActionFunc = globalActionFunc;                        
    }
    
    this.createRole = function()
    {
        if(this.charactersDiv == undefined)
        {
            alert("not bind to div");
            return;
        }
        
        this.maxTotalhp = 0;
        this.currenthp = 0;
        this.currentShield = 0;
        
        for (var i = 0; i < arguments.length && i < ROLE_COUNT; i++)
        {
            var characterDataInfo = this.characterDatas[arguments[i]];
            this.char_roles[i] = new Character(characterDataInfo, this);
            var divs = createCharacterDiv(this.charactersDiv, arguments[i]);
            this.char_roles[i].bindDisplay(divs[0], divs[1]);
            this.maxTotalhp += characterDataInfo.hp;
        }
        this.currenthp = this.maxTotalhp;
        
        this.hpdiv = createHPDiv(this.charactersDiv);
        
        updateHP(this.hpdiv, this.currenthp, this.maxTotalhp, this.currentShield);
    }
    
    this.clearRoles = function()
    {
        this.char_roles.length = 0;
        this.maxTotalhp = 0;
        this.currenthp = 0;
        this.currentShield = 0;
        this.hpdiv = undefined;
        if(this.charactersDiv != undefined)
        {
            //todo : memory leak?
            while(charactersDiv.firstChild)
            {
                charactersDiv.removeChild(charactersDiv.firstChild);
            }
        }
    }
    
    var createCharacterDiv = function(charactersDiv, index_num)
    {
        if(charactersDiv == undefined)
        {
            alert("not bind to div");
            return;
        }
        
        var characterdiv = document.createElement('div');
        var divIdName = 'character_'+index_num+'_div';
        characterdiv.setAttribute('id',divIdName);
        characterdiv.className = "rolebox";
        characterdiv.className += " bk_purple";
        
        charactersDiv.appendChild(characterdiv);        
        
        var combodiv = document.createElement('div');
        divIdName = 'energy_div';
        combodiv.setAttribute('id',divIdName);
        combodiv.className = "energybox";
        combodiv.className += " energyboxcolor";

        characterdiv.appendChild(combodiv);             
        
        var characterImg = document.createElement('img');
        divIdName = 'role_img';
        characterImg.setAttribute('id',divIdName);        
        characterdiv.appendChild(characterImg);        
        
        var orbdiv0 = document.createElement('div');
        divIdName = 'orb0_iv';
        orbdiv0.setAttribute('id',divIdName);
        orbdiv0.className = "orbbox";
        orbdiv0.className += " grey";
        orbdiv0.className += " orbpos0";

        characterdiv.appendChild(orbdiv0);
        
        var orbdiv1 = document.createElement('div');
        divIdName = 'orb1_iv';
        orbdiv1.setAttribute('id',divIdName);
        orbdiv1.className = "orbbox";
        orbdiv1.className += " grey";
        orbdiv1.className += " orbpos1";

        characterdiv.appendChild(orbdiv1);
        
        var orbdiv2 = document.createElement('div');
        divIdName = 'orb2_iv';
        orbdiv2.setAttribute('id',divIdName);
        orbdiv2.className = "orbbox";
        orbdiv2.className += " grey";
        orbdiv2.className += " orbpos2";

        characterdiv.appendChild(orbdiv2);   
        
        var attackdiv = document.createElement('div');
        divIdName = 'attack_'+index_num+'_div';
        attackdiv.setAttribute('id',divIdName);
        attackdiv.className = "orbbox";
        attackdiv.className += " transparent";   
        attackdiv.className += " attackOrbPos" + index_num;           
        charactersDiv.appendChild(attackdiv);
        
        return {
            0:characterdiv,
            1:attackdiv,
        }
        
        
    }
    
    var createHPDiv = function(charactersDiv)
    {
    
        if(charactersDiv == undefined)
        {
            alert("not bind to div");
            return;
        }        
    
        var hpdiv = document.createElement('div');
        var divIdName = 'hp_div';
        hpdiv.setAttribute('id',divIdName);
        charactersDiv.appendChild(hpdiv);
        
        return hpdiv;
    }
    

    
    this.giveOrb = function(posIndex, orbIndex)
    {
        var orb = BallData.getBall(orbIndex);
        this.char_roles[posIndex].acceptOrb(orb);
    }
    
    this.checkComboExpire = function()
    {
        for(var i=0; i<this.char_roles.length;i++)
        {
            if(this.char_roles[i] != null)
            {
                this.char_roles[i].checkComboExpire();
            }
        }
    }
    
    this.conclude = function()
    {
        //alert("conclude");
        for(var i=0; i<this.char_roles.length;i++)
        {
            if(this.char_roles[i] != null)
            {
                this.addAnimationCount();
            }
        }
                
        for(var i=0; i<this.char_roles.length;i++)
        {
            if(this.char_roles[i] != null)
            {
                this.char_roles[i].startAttack();
            }
        }
    }    
    
    this.addAnimationCount = function()
    {
        this.animationCount++;
    }
    
    this.removeAnimationCount = function()
    {
        this.animationCount--;
        if(this.animationCount == 0)
        {
            if (window.hasOwnProperty('Game'))
            {
                 
                //TODO change global game state;
                Game.roundInit();
            }
            
        }
    }
    


    function Role()
    {
        this.name = "";
        this.hp = 0;

        this.basicElement = "red";
        this.skillKindie = "";
        this.onAttack = function(){
            //todo
        };
        this.onBeHit = function(){
            //todo
        };
        this.onBeDamage = function(){
            //todo
        }
    }


    function Character(characterDataInfo, roleFuncManager)
    {
        Role.call(this);
        this.roleFuncManager = roleFuncManager;
        this.name = characterDataInfo.name;
        this.basicElement = characterDataInfo.basicElement;
        this.hp = characterDataInfo.hp;
        this.ap = characterDataInfo.ap;
        this.icon = characterDataInfo.icon;
        this.comboHitTimes = 0;
        //-1 means none
        this.lastHitTime = -1;
        this.orbIcons = new Array(3);
        this.energyIcon = undefined;
        this.attackIcon = undefined;
        this.attackIconOffsetLeft = undefined;
        this.attackIconOffsetTop = undefined;
        this.roleIcon = undefined;
        this.skillEnergyCost = characterDataInfo.skillEnergyCost;
        this.energy = 0;
        this.oldDisplayTotalEnergy = 0;
        this.oldDisplayStage = 0;
        this.oldWidth = 0;
        this.updatetl = new TimelineLite({autoRemoveChildren:true});            
        
        this.acceptOrb = function(orb){
        
            if(this.basicElement == orb.color)
            {
                roleFuncManager.sameElementComboHit++;
                this.changeEnergy(orb.energy);
            }
            else
            {            
                this.changeEnergy(orb.energy / 2);
            }
        };
        
        
        this.changeEnergy = function(addValue)
        {
            this.energy += addValue;
            this.updateEnergyDisplay()            
        }
        
        
        this.updateEnergyDisplay = function()
        {            
            var currentStageEnergy = 0;
            var currentStageCeil = 999;
            var currentStage = 0;
            var currentStageFloor = 0;
            for(currentStage = 0; currentStage < this.skillEnergyCost.length; currentStage++)
            {                                
                if(this.energy < this.skillEnergyCost[currentStage])
                {                   
                    currentStageCeil = this.skillEnergyCost[currentStage];
                    break;
                }
                
                currentStageFloor = this.skillEnergyCost[currentStage];
            }
                    
            
            currentStageEnergy = this.energy - currentStageFloor;
            
            var scaleWValue = currentStageEnergy / (currentStageCeil - currentStageFloor);
            if(scaleWValue > 1)
            {
                scaleWValue = 1;
            }
            var newWidth = scaleWValue * 100;
            if(this.energy > this.oldDisplayTotalEnergy)
            {
                if(this.oldDisplayStage < currentStage)
                {
                    
                    var diff = currentStage - this.oldDisplayStage;                
                    this.updatetl.fromTo(this.energyIcon, (100 - this.oldWidth) / 100, {width:this.oldWidth}, {width:100});
                    for(var i = 0; i < (diff -1); i++)
                    {
                        this.updatetl.fromTo(this.energyIcon, 1, {width:0}, {width:100});
                    }
                    this.updatetl.fromTo(this.energyIcon, 1, {width:0}, {width:newWidth});
                    for(var i = this.oldDisplayStage; i < currentStage; i++)
                    {
                        if(this.basicElement == "red")
                        {
                            this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#FF0000"});
                        }
                        else if(this.basicElement == "green")
                        {
                            this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#00FF00"});
                        }
                        else if(this.basicElement == "blud")
                        {
                            this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#0000FF"});
                        }                   
                    }                 
                    
                }
                else
                {
                     this.updatetl.to(this.energyIcon, scaleWValue, {width:newWidth});
                }
            }
            else if(this.energy < this.oldDisplayTotalEnergy)
            {
                
                for(var i = this.oldDisplayStage - 1; i >= 0; i--)
                {
                    this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#989898"});
                }
                this.updatetl.to(this.energyIcon, 1, {width:0})

                for(var i = 0; i < currentStage; i++)
                {
                    this.updatetl.fromTo(this.energyIcon, 1, {width:0}, {width:100});
                }
                this.updatetl.fromTo(this.energyIcon, scaleWValue, {width:0}, {width:newWidth});
                
                for(var i = 0; i < currentStage; i++)
                {
                    if(this.basicElement == "red")
                    {
                        this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#FF0000"});
                    }
                    else if(this.basicElement == "green")
                    {
                        this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#00FF00"});
                    }
                    else if(this.basicElement == "blud")
                    {
                        this.updatetl.to(this.orbIcons[i], 0.1, {backgroundColor:"#0000FF"});
                    }                   
                }                 
            }
            

            


            this.oldDisplayStage = currentStage;
            this.oldDisplayTotalEnergy = this.energy;
            this.oldWidth = newWidth;
            
        }
        
        this.consumeAttackEnergy = function(attackLevel)
        {
            if(attackLevel)
            {
                this.changeEnergy(-this.skillEnergyCost[attackLevel - 1]);
                
                this.updateEnergyDisplay();
            }
            
            roleFuncManager.removeAnimationCount();
        }
        
        
        this.startAttack = function()
        {
            var attackLevel = 0;
            var currentStage = 0;
            for(currentStage = 0; currentStage < this.skillEnergyCost.length; currentStage++)
            {              
                if(this.energy >= this.skillEnergyCost[currentStage])
                {  
                    attackLevel = currentStage + 1;
                }
            }                   
            
            if(attackLevel > 0)
            {
                this.attack(attackLevel);                                    
            }
            else
            {
                roleFuncManager.removeAnimationCount();
            }
        };
        
        
        this.attack = function(attackLevel)
        {
        
            console.log("attack level --" + attackLevel);           
           
            //attack here
            //alert("attack Level " + attackLevel);
            if(this.attackIcon  != undefined)
            {
                
                
                this.attackIconOffsetLeft = this.attackIcon.offsetLeft;
                this.attackIconOffsetTop  = this.attackIcon.offsetTop;                                                
                
                
                var attackColor = "#000000";
                if(this.basicElement == "red")
                {
                    attackColor = "#FF0000";
                }
                else if(this.basicElement == "green")
                {
                    attackColor = "#00FF00";
                }
                else if(this.basicElement == "blue")
                {
                    attackColor = "#0000FF";
                }


                //change color and size
                this.updatetl.to(this.attackIcon, 0.1, {backgroundColor:attackColor, width:(25 * (attackLevel)), height:(25 * (attackLevel))});

                var centerPointOffsetLeft = 270;
                if(this.attackIconOffsetLeft > 270)
                {
                    centerPointOffsetLeft = this.attackIconOffsetLeft + 100;
                }
                else if(this.attackIconOffsetLeft < 270)
                {
                    centerPointOffsetLeft = this.attackIconOffsetLeft - 100;
                }
                
                //move
                this.updatetl.to(this.attackIcon, 1, {bezier:{type:"thru", values:[{left:this.attackIconOffsetLeft, top:this.attackIconOffsetTop}, {left:centerPointOffsetLeft, top:"-450px"}, {left:"270px", top:"-900px"}]}, directionalRotation:"1080_cw", ease:Power1.easeInOut, onComplete:doDamage, onCompleteParams:[this.basicElement, attackLevel]});

                //change color to transparent
                this.updatetl.to(this.attackIcon, 0.1, {backgroundColor:"transparent"});

                //moveback
                this.updatetl.to(this.attackIcon, 0.1, {left:"", top:"", width:"", height:"", directionalRotation:""});                                  
                
                //then call cleanOrbs
                this.updatetl.call(consumePlayerAttackEnergy, [this, attackLevel]);
                
            }
            else
            {
                //call cleanOrbs
                this.updatetl.call(consumePlayerAttackEnergy, [this, attackLevel]);
            }
        };
        
        
        this.handleDamage = function(orb)
        {
            if(roleFuncManager.currenthp >= 0)
            {
                var d = new Date();
                var currentTime = d.getTime();
                if(currentTime - this.lastHitTime <= 5000)
                {
                    this.comboHitTimes++;            
                }
                else
                {
                    this.comboHitTimes = 1;
                }
                
                //alert("combot hit times:" + this.comboHitTimes);
                
                //todo compute damage

                var damage = this.comboHitTimes * 10;
                if(roleFuncManager.currentShield > 0)
                {
                    if(roleFuncManager.currentShield >= damage)
                    {
                        roleFuncManager.currentShield -= damage;
                        damage = 0;
                    }
                    else
                    {
                        damage -= roleFuncManager.currentShield;
                        roleFuncManager.currentShield = 0;
                    }
                }
                
                if(damage > 0)
                {                               
                    roleFuncManager.currenthp -= this.comboHitTimes * 10;            
                    if(roleFuncManager.currenthp <= 0)
                    {
                        roleFuncManager.currenthp = 0;
                        alert("death");
                    }
                }

                
                updateHP(roleFuncManager.hpdiv, roleFuncManager.currenthp, roleFuncManager.maxTotalhp, roleFuncManager.currentShield);

                this.lastHitTime = currentTime;  
            }            
        };
        this.checkComboExpire = function()
        {
            var d = new Date();
            var currentTime = d.getTime();
            if(currentTime - this.lastHitTime > 5000)
            {
                this.comboHitTimes = 0;
            }
        };
        
        this.bindDisplay = function(mainDiv, attackerDiv)
        {
            this.energyIcon = mainDiv.querySelector("#energy_div");
            this.roleIcon = mainDiv.querySelector("#role_img");
            this.orbIcons[0] = mainDiv.querySelector("#orb0_iv");
            this.orbIcons[1] = mainDiv.querySelector("#orb1_iv");
            this.orbIcons[2] = mainDiv.querySelector("#orb2_iv");
            this.attackIcon = attackerDiv;
            this.roleIcon.setAttribute('src', "pic/" + this.icon);
            
            if(this.basicElement == "red")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#800000"});
            }
            else if(this.basicElement == "green")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#008000"});
            }
            else if(this.basicElement == "blue")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#000080"});
            }            

        };
        

        
    }

    Character.prototype = Object.create(Role.prototype);
    Character.prototype.constructor = Character;

    function movePlayerAttackOrbToBoss(player)
    {
        player.moveAttackOrbToBoss();
    }

    function endPlayerAttackOrb(player)
    {
        player.endAttackOrb();
    }

    function moveBackPlayerAttackOrb(player)
    {
        player.moveBackAttackOrb();
    }


    function consumePlayerAttackEnergy(player, attackLevel)
    {
        player.consumeAttackEnergy(attackLevel);
    }
    
    function updateHP(hpdiv, currenthp, maxTotalhp, shieldValue)
    {
        hpdiv.innerHTML = "hp:" + currenthp + "/" + maxTotalhp + ", shiled:" + shieldValue;
    }
    
    
    function doDamage(element, attackLevel)
    {
        //TODO, change to skill later
        //alert(element + ":" + attackLevel);
    }
    
    
    

}



