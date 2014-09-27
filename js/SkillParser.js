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
    
    function getSkillTargets(skillID, attacker, defender)
    {
        var targets = new Array();
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return targets;
        }                
        
        if(data.target_type == "all")
        {
            targets.concat(attacker.filterSkillTarget(data.target_color, data.target_race));
            defender.concat(attacker.filterSkillTarget(data.target_color, data.target_race));
        }
        else if(data.target_type == "self")
        {
            targets.concat(attacker.filterSkillTarget(data.target_color, data.target_race));
        }
        else if(data.target_type == "enemy")
        {
            defender.concat(attacker.filterSkillTarget(data.target_color, data.target_race));
        }
        return targets;
        
    }
    
    
    function generateSkillEffect(skillID)
    {
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return false;
        }

        switch(data.condition_type)
        {
            case "atk":
                break;
            case "shield":
                break;
            case "heal":
                break;
            case "energy":
                break;
        }
        
        return false;
    }
    
    function takeSkillEffect(skillID, targets)
    {
        var data = SkillData.getData(skillID);
        if(data == undefined)
        {
            return;
        }
        
        for(var i=0;i<targets.length;i++)
        {
            targets[i].takeSkillEffect(data.effect_type, data.effect_operator, data.effect_value);
        }
    }
    
    function activeSkill(skillID, attacker, defender)
    {
        if(SkillParser.checkSkillCondition(skillID, attacker, defender))
        {
            var targets = SkillParser.getSkillTargets(skillID, attacker, defender);
            if(targets.length != 0)
            {
                SkillParser.takeSkillEffect(skillID, targets);
            }
        }    
    }
    
	return {
		"checkSkillCondition" : checkSkillCondition,
        "getSkillTargets" : getSkillTargets,
        "takeSkillEffect" : takeSkillEffect,
        "activeSkill" : activeSkill
    }


}();