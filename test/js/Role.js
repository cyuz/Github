var Role = function()
{

function Orb(isEnergyOrb, basicElement)
{
    this.isEnergyOrb = isEnergyOrb;
    this.basicElement = basicElement;
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

function Monster(name, basicElement)
{
    Role.call(this);
    this.name = name;
    this.basicElement = basicElement;
}

Monster.prototype = Object.create(Role.prototype);
Monster.prototype.constructor = Monster;


function Player(name, basicElement)
{
    Role.call(this);
    this.name=name;
    this.basicElement = basicElement;
    this.energyOrbs = new Array();
    this.comboHitTimes = 0;
    //-1 means none
    this.lastHitTime = -1;
    this.orbIcons = new Array(3);
    this.hitIcon = 'undefined';
    this.attackIcon = 'undefined';
    this.attackIconOffsetLeft = 'undefined';
    this.attackIconOffsetTop = 'undefined';
    this.acceptOrb = function(orb){
        if(orb.isEnergyOrb)
        {
            if(this.energyOrbs.length >= 3)
            {
                return 1;
            }
        
            var acceptIndex = this.energyOrbs.length;
            if(typeof this.orbIcons[0] != 'undefined')
            {
                if(orb.basicElement == 1)
                {
                    TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#FF0000"});            
                }
                else if(orb.basicElement == 2)
                {
                    TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#0000FF"});          
                }
                else if(orb.basicElement == 3)
                {
                    TweenLite.to(this.orbIcons[acceptIndex], 1, {backgroundColor:"#00FF00"});         
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
    
        if(typeof this.orbIcons[0] != 'undefined')
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
        if(typeof this.attackIcon  != 'undefined')
        {
            this.startAttackOrb();
            console.log("Do it");
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
        if(typeof this.hitIcon != 'undefined')
        {
            this.hitIcon.innerHTML = this.comboHitTimes + "hits";
        }
        
        //alert("combot hit times:" + this.comboHitTimes);
        
        //todo compute damage


        this.lastHitTime = currentTime;    
    };
    this.checkComboExpire = function()
    {
        var d = new Date();
        var currentTime = d.getTime();
        if(currentTime - this.lastHitTime > 5000)
        {
            this.comboHitTimes = 0;
            if(typeof this.hitIcon != 'undefined')
            {            
                this.hitIcon.innerHTML = "";
            }
        }
    };
    
    this.bindDisplay = function(mainDiv, attackerDiv)
    {
        this.hitIcon = mainDiv.find("#combo_div")[0];
        this.orbIcons[0] = mainDiv.find("#orbs_1_div")[0];
        this.orbIcons[1] = mainDiv.find("#orbs_2_div")[0];
        this.orbIcons[2] = mainDiv.find("#orbs_3_div")[0];
        this.attackIcon = attackerDiv;    
    };
    
    this.startAttackOrb = function()
    {
        
        this.attackIconOffsetLeft = this.attackIcon.offsetLeft;
        this.attackIconOffsetTop  = this.attackIcon.offsetTop;
        
        TweenLite.to(this.attackIcon, 0.1, {backgroundColor:"#000000", onComplete:movePlayerAttackOrbToBoss, onCompleteParams:[this]});       
    };
    
    this.moveAttackOrbToBoss = function()
    {
        TweenLite.to(this.attackIcon, 1, {bezier:{type:"soft", values:[{left:this.attackIconOffsetLeft, top:(this.attackIconOffsetTop+200)}, {left:"270px", top:"200px"}, {left:"270px", top:"1000px"}]}, ease:Power1.easeInOut, onComplete:endPlayerAttackOrb, onCompleteParams:[this]});
    };
    
    this.endAttackOrb = function()
    {
        TweenLite.to(this.attackIcon, 0.1, {backgroundColor:"transparent", onComplete:moveBackPlayerAttackOrb, onCompleteParams:[this]});
    };
    
    this.moveBackAttackOrb = function()
    {
        TweenLite.to(this.attackIcon, 0.1, {left:"", top:"", onComplete:cleanPlayerOrbs, onCompleteParams:[this]});
    };
    
}

Player.prototype = Object.create(Role.prototype);
Player.prototype.constructor = Player;

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

return {
    "Player":Player,
    "Orb":Orb
}

}



