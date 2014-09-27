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
        //characterdiv.className += " bk_purple";
        
        charactersDiv.appendChild(characterdiv);        
        
        var character_bk = document.createElement('div');
        divIdName = 'role_img_bk';
        character_bk.setAttribute('id',divIdName);        
        character_bk.className = "role_img_bk";
        characterdiv.appendChild(character_bk);            
        
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
                //Game.roundInit();
                Monster.attack();
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
            var width = this.energy / 999 * 70;
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
                
            var centerPos = (this.index < 3) ? "0px": "530px";            
            
            //var ballDivArray = new Array();
            
            for(var i=0;i<this.orbQueue.length;i++)
            {
                var orb = this.orbQueue[i];
                
                var ballDiv = createBalldiv(roleFuncManager.charactersDiv, this.index, orb.color, orb.image);                
                
                //ballDivArray[i] = ballDiv;
                
                var doDamage = false;
                if(i == this.orbQueue.length - 1)
                {
                    doDamage = true;
                }
                
                //move
                
                var overLap = "+=0";
                
                if(i != 0)
                {
                    voerLap = "-=0.5";
                }
                
                this.updatetl.to(ballDiv, 1, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-730px"}]}, ease:Power1.easeInOut, onComplete:removeBallDiv, onCompleteParams:[roleFuncManager.charactersDiv, ballDiv, this, doDamage]}, overLap);
            }                                                            

            //this.updatetl.staggerTo(ballDivArray, 1.5, {bezier:{type:"thru", values:[{left:ballDiv.offsetLeft, top:ballDiv.offsetTop}, {left:centerPos, top:"-450px"}, {left:"270px", top:"-900px"}]}, ease:Power1.easeInOut, onComplete:removeBallDivTween, onCompleteParams:[roleFuncManager.charactersDiv, "{self}" ,this]}, 0, removeAllBallDiv);
            
            //then call cleanOrbs
            
            this.updatetl.append(TweenLite.delayedCall(1, finishNormalAttack, [this] ));            
            
            
                

        };
        
        
        this.getNormalAttackValue = function()
        {
            var damageValue = this.ap * this.comboHitTimes * this.roleFuncManager.sameElementComboHit;
            var healValue = this.ap * this.comboHitTimes * this.roleFuncManager.sameElementComboHit;
            var shieldValue = this.ap * this.comboHitTimes * this.roleFuncManager.sameElementComboHit;
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
            roleFuncManager.removeAnimationCount();
        }
        
        
        this.bindDisplay = function(mainDiv)
        {
            this.energyIcon = mainDiv.querySelector("#energy_div");
            this.roleIcon = mainDiv.querySelector("#role_img");
            this.roleIcon.setAttribute('src', "pic/" + this.icon);
            this.rold_bk =  mainDiv.querySelector("#role_img_bk");
                        
            
            if(this.color == "red")
            {
                this.rold_bk.style.backgroundImage = "url(image/fire_bk.png)"; // change it
                this.rold_bk.style.backgroundSize="cover";
            }
            else if(this.color == "green")
            {
                this.rold_bk.style.backgroundImage = "url(image/forest_bk.png)"; // change it
                this.rold_bk.style.backgroundSize="cover";
            }
            else if(this.color == "blue")
            {
               this.rold_bk.style.backgroundImage = "url(image/water_bk.png)"; // change it
               this.rold_bk.style.backgroundSize="cover";
            }            

        };
       
     


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
    
    function removeBallDiv(parentdiv, ballDiv, player, doDamage)
    {
        if(!doDamage)
        {
            console.log("ball remove, damage fake");
            Monster.getHurt(player.index, player.color, 0, 0, 0);
        }
        else
        {            
            var attakResult = player.getNormalAttackValue();
            console.log("ball remove, damage:" + attakResult[0] + ",heal:" + attakResult[1] + ",shield:" + attakResult[2]);
            Monster.getHurt(player.index, player.color, attakResult[0], attakResult[1], attakResult[2]);
        }
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
    
    
    
    
    

}



