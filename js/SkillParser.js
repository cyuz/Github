var SkillParser = function() {


    function checkSkillCondition(skillID, attacker, defender)
    {
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return false;
        }
        
        switch(data.condition_type)
        {
            case "all":
                return true;
            case "enemyhp":
                return verifyHP(defender, data.condition_operator, data.condition_value);
            case "selfhp":
                return verifyHP(attacker, data.condition_operator, data.condition_value);   
            case "red":
            case "blue":
            case "green":
                return verifyPlayerColor(data.condition_type, data.condition_operator, data.condition_value);
             case "1":
             case "2":
             case "3":
                return verifyPlayerRace(data.condition_type, data.condition_operator, data.condition_value);
        }
        
        return false;
    }
    
    function verifyHP(targetObject, operator, value)
    {        
        return valueComparator(targetObject.getHp(), operator, value);
    }
    
    function valueComparator(currentValue, operator, targetValue)
    {
        if(operator =="<")
        {
            return (currentValue < targetValue);
        }
        else if(operator == ">=")
        {
            return (currentValue >= targetValue);
        }
        else
        {
            console.log("bug value operator:" + operator);
            return false;
        }
    }
    
    function verifyPlayerColor(targetColor, operator, targetValue)
    {
        return valueComparator(RoleFunc.getColorCount(targetColor), operator, targetValue);
    }

    function verifyPlayerRace(targetRace, operator, targetValue)
    {
        return valueComparator(RoleFunc.getRaceCount(targetRace), operator, targetValue);
    }
    
    function getSkillTargets(skillID, attacker, defender, unit)
    {
        var targets = new Array();
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return targets;
        }
        
        if(data.target_type == "itself")
        {
            return [unit];
        }
        else if(data.effect_type == "strategy")
        {
            return [Game];
        }
        else if(data.target_type == "all")
        {
            var temp = attacker.filterSkillTarget(data.effect_type, data.target_color, data.target_race);
            var temp2 = defender.filterSkillTarget(data.effect_type, data.target_color, data.target_race);
            return temp.concat(temp2);
        }
        else if(data.target_type == "self")
        {
            return attacker.filterSkillTarget(data.effect_type, data.target_color, data.target_race);
        }
        else if(data.target_type == "enemy")
        {
            return defender.filterSkillTarget(data.effect_type, data.target_color, data.target_race);
        }
        
    }
    
    
    function takeSkillEffect(skillID, targets)
    {
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return;
        }
        
        if(data.effect_type == "strategy")
        {
            Game.setStrategy(data.effect_value);
        }
        else
        {
            for(var i=0;i<targets.length;i++)
            {
                targets[i].takeSkillEffect(data.effect_type, data.effect_operator, data.effect_value);
            }
        }
    }
    
    function activeSkill(skillID, attacker, defender, unit)
    {
        if(SkillParser.checkSkillCondition(skillID, attacker, defender))
        {
            unit.skillAnimation(skillID);
            var targets = SkillParser.getSkillTargets(skillID, attacker, defender, unit);
            if(targets.length != 0)
            {
                SkillParser.takeSkillEffect(skillID, targets);
            }
        }    
    }
    
    function getSkillDesc(skillID)
    {
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return "使用技能";
        }
        else
        {
            return data.desc;
        }
    }
    
	return {
		"checkSkillCondition" : checkSkillCondition,
        "getSkillTargets" : getSkillTargets,
        "takeSkillEffect" : takeSkillEffect,
        "activeSkill" : activeSkill,
        "getSkillDesc" : getSkillDesc
    }


}();