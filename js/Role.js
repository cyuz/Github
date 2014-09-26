var RoleFunc = function()
{

    const ROLE_COUNT = 6;
    
    this.char_roles = new Array(ROLE_COUNT);
    this.characterDatas = new Array();
    this.maxTotalhp = 0;
    this.sameElementComboHit = 0;
    this.animationCount = 0;
    

    function CharacterDataInfo(name, basicElement, ap, hp, icon)
    {
        this.name = name;
        this.basicElement = basicElement;
        this.ap = ap;
        this.hp = hp;
        this.icon = icon;
    }    
    
    this.init = function()
    {
        this.characterDatas.push(new CharacterDataInfo("role_1", "red", 30, 800, "CelesSprite.png"));
        this.characterDatas.push(new CharacterDataInfo("role_2", "green", 40, 700, "Edgar_Roni_Figaro_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_3", "blue", 50, 600, "Locke_Cole_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_4", "red", 60, 500, "Mog_(Final_Fantasy_VI)_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_5", "green", 70, 400, "Shadow_(Final_Fantasy_VI)_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_6", "blue", 80, 300, "Umaro_small.png"));    
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
            console.log("not bind to div");
            return;
        }
        
        this.maxTotalhp = 0;

        
        for (var i = 0; i < arguments.length && i < ROLE_COUNT; i++)
        {
            var characterDataInfo = this.characterDatas[arguments[i]];
            this.char_roles[i] = new Character(i, characterDataInfo, this);
            var div = createCharacterDiv(this.charactersDiv, arguments[i]);
            this.char_roles[i].bindDisplay(div);
            this.maxTotalhp += characterDataInfo.hp;
        }
    }
    
    this.clearRoles = function()
    {
        this.char_roles.length = 0;
        this.maxTotalhp = 0;
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
            console.log("not bind to div");
            return;
        }
        
        var characterdiv = document.createElement('div');
        var divIdName = 'character_'+index_num+'_div';
        characterdiv.setAttribute('id',divIdName);
        characterdiv.className = "rolebox";
        characterdiv.className += " bk_purple";
        
        charactersDiv.appendChild(characterdiv);        
        
        var energydiv = document.createElement('div');
        divIdName = 'energy_div';
        energydiv.setAttribute('id',divIdName);
        energydiv.className = "energybox";
        energydiv.className += " energyboxcolor";

        characterdiv.appendChild(energydiv);             
        
        var characterImg = document.createElement('img');
        divIdName = 'role_img';
        characterImg.setAttribute('id',divIdName);        
        characterImg.className = "role_img";
        characterdiv.appendChild(characterImg);                
        
        return characterdiv;
        
        
    }

    

    
    this.giveOrb = function(posIndex, orbIndex)
    {
        var orb = BallData.getBall(orbIndex);
        this.char_roles[posIndex].acceptOrb(orb);
    }
    
    this.conclude = function()
    {
        //console.log("conclude");
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
    



    function Character(index, characterDataInfo, roleFuncManager)
    {
        this.index = index;
        this.roleFuncManager = roleFuncManager;
        this.name = characterDataInfo.name;
        this.color = characterDataInfo.basicElement;
        this.hp = characterDataInfo.hp;
        this.ap = characterDataInfo.ap;
        this.icon = characterDataInfo.icon;
        this.comboHitTimes = 0;
        //-1 means none
        this.energyIcon = undefined;      
        this.roleIcon = undefined;        
        this.energy = 0;
        this.orbQueue = new Array();
        this.updatetl = new TimelineLite({autoRemoveChildren:true});    
        
        
        this.acceptOrb = function(orb){
        
            if(this.color == orb.color)
            {
                this.comboHitTimes++;
                roleFuncManager.sameElementComboHit++;
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
            if(this.energy > 999)
            {
                this.energy = 999;
            }
            this.updateEnergyDisplay()            
        }
        
        
        this.updateEnergyDisplay = function()
        {  
            var width = this.energy / 999 * 100;
            this.updatetl.to(this.energyIcon, 1, {width:width});            
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
        
            if(this.comboHitTimes > 0)
            {
                this.normalAttack(this.comboHitTimes);                                    
            }            
            else
            {
                roleFuncManager.removeAnimationCount();
            } 
           
            
        }
        
        this.normalAttack = function(attackLevel)
        {
        
            console.log("index: " + this.index + ",comboHitTimes times --" + this.comboHitTimes);           
                
            var centerPos = (this.index < 3) ? "0px": "550px";            
            
            var ballDivArray = new Array();
            
            for(var i=0;i<this.orbQueue.length;i++)
            {
                var orb = this.orbQueue[i];
                
                var ballDiv = createBalldiv(roleFuncManager.charactersDiv, this.index, orb.color, orb.image);                
                
                ballDivArray[i] = ballDiv;
                
                //move
                //this.updatetl.to(ballDiv, 1, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-900px"}]}, ease:Power1.easeInOut, onComplete:removeBallDiv, onCompleteParams:[roleFuncManager.charactersDiv, ballDiv]});
            }                                                            

            this.updatetl.staggerTo(ballDivArray, 1.5, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-900px"}]}, ease:Power1.easeInOut, onComplete:removeBallDivTween, onCompleteParams:[roleFuncManager.charactersDiv, "{self}"]}, 0.5, removeAllBallDiv);
            
            //then call cleanOrbs
            this.updatetl.call(finishNormalAttack, [this]);
                

        };
        
        this.finishNormalAttack = function()
        {
            var damage = this.ap * this.comboHitTimes * this.roleFuncManager.sameElementComboHit;
            Monster.getHurt(this.index, this.color, damage);
            this.comboHitTimes = 0;
            this.orbQueue.length = 0;
            roleFuncManager.removeAnimationCount();
            console.log("index:" + this.index+",damage:"+damage);
        }
        
        
        this.bindDisplay = function(mainDiv)
        {
            this.energyIcon = mainDiv.querySelector("#energy_div");
            this.roleIcon = mainDiv.querySelector("#role_img");
            this.roleIcon.setAttribute('src', "pic/" + this.icon);
            
            if(this.color == "red")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#800000"});
            }
            else if(this.color == "green")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#008000"});
            }
            else if(this.color == "blue")
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#000080"});
            }            

        };
       
     


    }


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
        balldiv.appendChild(newimg);
        
        
        parentdiv.appendChild(balldiv);
        
        return balldiv;
    }
    
    function removeBallDiv(parentdiv, ballDiv)
    {
        parentdiv.removeChild(ballDiv);
    }
    
    function removeBallDivTween(parentdiv, tween)
    {
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
    
    
    
    
    

}



