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
    this.acceptOrb = function(orb){
        if(orb.isEnergyOrb)
        {
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
        
        this.cleanOrbs();
        
        this.energyOrbs.length = 0;
    };
    
    
    this.cleanOrbs = function()
    {
        if(typeof this.orbIcons[0] != 'undefined')
        {
            for(var i = 0; i < 3; i++)
            {
                TweenLite.to(this.orbIcons[i], 1, {backgroundColor:"#989898"});     
            }
        }
            
    }
    
    this.attack = function(attackLevel)
    {
        //attack here
        //alert("attack Level " + attackLevel);
        this.onAttack();
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
    }
    
}

Player.prototype = Object.create(Role.prototype);
Player.prototype.constructor = Player;