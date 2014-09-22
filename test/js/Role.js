var RoleFunc = function()
{

    const ROLE_COUNT = 6;
    
    this.char_roles = new Array(ROLE_COUNT);
    this.orbDatas = new Array();
    this.characterDatas = new Array();
    this.maxTotalhp = 0;
    this.currenthp = 0;
    this.currentShield = 0;
    this.sameElementComboHit = 0;
    
    function Orb(isEnergyOrb, basicElement, hitCount)
    {
        this.isEnergyOrb = isEnergyOrb;
        this.basicElement = basicElement;
        this.hitCount = hitCount;
    }

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
        this.orbDatas.push(new Orb(false, 1, 1));
        this.orbDatas.push(new Orb(false, 2, 1));
        this.orbDatas.push(new Orb(false, 3, 1));
        this.orbDatas.push(new Orb(true, 1, 1));
        this.orbDatas.push(new Orb(true, 2, 1));
        this.orbDatas.push(new Orb(true, 3, 1));
        
        this.characterDatas.push(new CharacterDataInfo("role_1", 1, 30, 800, "CelesSprite.png"));
        this.characterDatas.push(new CharacterDataInfo("role_2", 2, 40, 700, "Edgar_Roni_Figaro_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_3", 3, 50, 600, "Locke_Cole_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_4", 1, 60, 500, "Mog_(Final_Fantasy_VI)_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_5", 2, 70, 400, "Shadow_(Final_Fantasy_VI)_small.png"));
        this.characterDatas.push(new CharacterDataInfo("role_6", 3, 80, 300, "Umaro_small.png"));    
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
        divIdName = 'combo_div';
        combodiv.setAttribute('id',divIdName);
        combodiv.className = "combobox";
        combodiv.className += " comboboxcolor";

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
        var orb = this.orbDatas[orbIndex];
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
    
    


    function Role()
    {
        this.name = "";
        this.hp = 0;
        this.ap = 0;
        //element 0=none,1=fire,2=water,3=forest,4=dark?
        this.basicElement = 0;
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
        this.energyOrbs = new Array();
        this.comboHitTimes = 0;
        //-1 means none
        this.lastHitTime = -1;
        this.orbIcons = new Array(3);
        this.hitIcon = undefined;
        this.attackIcon = undefined;
        this.attackIconOffsetLeft = undefined;
        this.attackIconOffsetTop = undefined;
        this.roleIcon = undefined;
        this.acceptOrb = function(orb){
        
            if(this.basicElement == orb.basicElement)
            {
                roleFuncManager.sameElementComboHit++;
            }        
        
            if(orb.isEnergyOrb)
            {
                if(this.energyOrbs.length >= 3)
                {
                    return 1;
                }
            
                var acceptIndex = this.energyOrbs.length;
                if(this.orbIcons[0] != undefined)
                {
                    if(orb.basicElement == 1)
                    {
                        TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#FF0000"});            
                    }
                    else if(orb.basicElement == 2)
                    {
                        TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#00FF00"});          
                    }
                    else if(orb.basicElement == 3)
                    {
                        TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#0000FF"});         
                    }
                    else
                    {
                        TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#000000"});         
                    }
                }
                this.energyOrbs.push(orb);                
                
                if(this.energyOrbs.length >= 3)
                {
                    this.consumeEnergyOrbs();
                }
            }
            else
            {
                this.handleDamage(orb);
            }
        };    
        this.consumeEnergyOrbs = function()
        {
            var orbsLength = this.energyOrbs.length;
            var attackLevel = 0;

            for(var i = 0; i < orbsLength; i++)
            {
                if(this.energyOrbs[i].basicElement == this.basicElement)
                {
                    attackLevel++;
                }  
            }        
            
            this.attack(attackLevel);
            
            
        };
        
        
        this.cleanOrbs = function()
        {
            console.log("clean orb");
        
            if(this.orbIcons[0] != undefined)
            {
                for(var i = 2; i >= 0; i--)
                {
                    TweenLite.to(this.orbIcons[i], 0.1, {backgroundColor:"#989898"});     
                }
            }
            
            this.energyOrbs.length = 0;
                
        }
        
        this.attack = function(attackLevel)
        {
            //attack here
            //alert("attack Level " + attackLevel);
            if(this.attackIcon  != undefined)
            {
                this.startAttackOrb(attackLevel);
                console.log("attack level --" + attackLevel);
                //TweenLite.to(this.attackIcon, 0.1, {backgroundColor:"#FF0000"});
                //alert(this.attackIcon.offsetLeft +","+ this.attackIcon.offsetTop);
                //TweenLite.to(this.attackIcon, 1, {bezier:{curviness:1.25, values:[{left:"0px", top:"100px"}, {left:"300px", top:"200px"}, {left:"300px", top:"1000px"}]}, backgroundColor:"#FF0000", ease:Circ.easeInOut, onComplete:cleanPlayerOrbs, onCompleteParams:[this]});
                //TweenLite.fromTo(this.attackIcon, 1, {left:"35px", top:"35px", backgroundColor:"#ff0000"}, {left:"35px", top:"-100px",  backgroundColor:"#ff0000", ease:Circ.easeInOut, onComplete:cleanPlayerOrbs, onCompleteParams:[this]});
            }
            else
            {
                this.cleanOrbs();
                this.onAttack();
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
                if(this.hitIcon != undefined)
                {
                    this.hitIcon.innerHTML = this.comboHitTimes + "hits";
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
                if(this.hitIcon != undefined)
                {            
                    this.hitIcon.innerHTML = "";
                }
            }
        };
        
        this.bindDisplay = function(mainDiv, attackerDiv)
        {
            this.hitIcon = mainDiv.querySelector("#combo_div");
            this.roleIcon = mainDiv.querySelector("#role_img");
            this.orbIcons[0] = mainDiv.querySelector("#orb0_iv");
            this.orbIcons[1] = mainDiv.querySelector("#orb1_iv");
            this.orbIcons[2] = mainDiv.querySelector("#orb2_iv");
            this.attackIcon = attackerDiv;
            this.roleIcon.setAttribute('src', "pic/" + this.icon);
            
            if(this.basicElement == 1)
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#800000"});
            }
            else if(this.basicElement == 2)
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#008000"});
            }
            else if(this.basicElement == 3)
            {
                TweenLite.to(mainDiv, 0.1, {backgroundColor:"#000080"});
            }            

        };
        
        this.startAttackOrb = function(attackLevel)
        {
            
            this.attackIconOffsetLeft = this.attackIcon.offsetLeft;
            this.attackIconOffsetTop  = this.attackIcon.offsetTop;                                                
            
            console.log("x:y@" + this.attackIconOffsetLeft + ":" + this.attackIconOffsetTop);
            
            var attackColor = "#000000";
            if(this.basicElement == 1)
            {
                attackColor = "#FF0000";
            }
            else if(this.basicElement == 2)
            {
                attackColor = "#00FF00";
            }
            else if(this.basicElement == 3)
            {
                attackColor = "#0000FF";
            }


            //create a TimelineLite instance
            var tl = new TimelineLite();

            //change color and size
            tl.to(this.attackIcon, 0.1, {backgroundColor:attackColor, width:(25 * (attackLevel+1)), height:(25 * (attackLevel+1))});

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
            tl.to(this.attackIcon, 1, {bezier:{type:"thru", values:[{left:this.attackIconOffsetLeft, top:this.attackIconOffsetTop}, {left:centerPointOffsetLeft, top:500}, {left:"270px", top:"1000px"}]}, directionalRotation:"1080_cw", ease:Power1.easeInOut});

            //change color to transparent
            tl.to(this.attackIcon, 0.1, {backgroundColor:"transparent"});

            //moveback
            tl.to(this.attackIcon, 0.1, {left:"", top:"", width:"", height:"", directionalRotation:""});

            //then call cleanOrbs
            tl.call(cleanPlayerOrbs, [this]);
     
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


    function cleanPlayerOrbs(player)
    {
        player.cleanOrbs();
    }
    
    function updateHP(hpdiv, currenthp, maxTotalhp, shieldValue)
    {
        hpdiv.innerHTML = "hp:" + currenthp + "/" + maxTotalhp + ", shiled:" + shieldValue;
    }
    
    
    
    

}



