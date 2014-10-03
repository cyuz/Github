var CookiesAdapter = function()
{
    var setObj = {};   
    
    const DEFAULT_ROLES = ["c1", "c2", "c6", "c7", "c11", "c12"];

    var init = function()
    {
        loadCookies();
    }
    
    var loadCookies = function()
    {
        var cookiesArray = $.cookie();
        if(cookiesArray["roles"] != undefined)
        {
            var rolesArray = cookiesArray["roles"].split(",");
            for(var i=0;i<rolesArray.length;i++)
            {
                setObj[rolesArray[i]] = rolesArray[i];
            }
        }
        else
        {
            for(var i=0;i<DEFAULT_ROLES.length;i++)
            {
                setObj[DEFAULT_ROLES[i]] = DEFAULT_ROLES[i];                                        
                saveCookies();
            }
        }
    }
    
    var saveCookies = function()
    {
        var roleStr = "";
		for (var entry in setObj) {            
            roleStr += entry;      
            roleStr += ",";
        }     

        if(roleStr.length > 0)
        {
            roleStr = roleStr.substring(0, roleStr.length - 1);
        }
        
         $.cookie("roles", roleStr, { expires: 365, path: '/' });
    }
    
    
    var getRoles = function()
   {
		var roleArray = [];
		for (var entry in setObj) {
            roleArray.push(entry);
        }       
        
        return roleArray;
   }
   
   var enableRole = function(roleID)
   {
        if(setObj[roleID] == undefined)
        {
            setObj[roleID] = roleID;
            saveCookies();
            return true;
        }
        return false;
   }
    
    
	return {
		"init" : init,
        "getRoles" : getRoles,
        "enableRole" : enableRole,
	}

    


}();