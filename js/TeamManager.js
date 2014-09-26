var TeamManager = function()
{
    var selectedRolesArray = new Array();
    var selectedRolesDiv = new Array(6);
    
    function init()
    {                        
        var plyaerLevelDiv = createDiv($("#teamView")[0], "playerlevel", ["playerlevel", "transparent_green"]);
        plyaerLevelDiv.innerHTML = "LV 99";
        
        var playerNameDiv = createDiv($("#teamView")[0], "playername", ["playername", "transparent_green"]);
        playerNameDiv.innerHTML = "小智";
        
        var playerCashDiv = createDiv($("#teamView")[0], "playercash", ["playercash", "playeresource", "transparent_green"]);
        
        createImg(playerCashDiv, "iocn_resource",  "image/icon_cash.png", ["icon_resource"]);
        var cashResourceDiv = createDiv(playerCashDiv, "value", ["resource_value", "transparent_green"]);
        cashResourceDiv.innerHTML = 1234567;        
        
        var playerMoneyDiv = createDiv($("#teamView")[0], "playermoney", ["playermoney", "playeresource", "transparent_green"]);
        
        createImg(playerMoneyDiv, "iocn_resource", "image/icon_money.png", ["icon_resource"]);
        var moneyResourceDiv = createDiv(playerMoneyDiv, "value", ["resource_value", "transparent_green"]);        
        moneyResourceDiv.innerHTML = 1234567;        
        
        var stageDataDiv = createDiv($("#teamView")[0], "playermoney", ["stagedata", "transparent_green"]);
        
        createDiv(stageDataDiv, "stagename", ["stagename", "transparent_green"]); 
        createImg(stageDataDiv, "bossimg", undefined, ["bossimg", "transparent_green"]); 
        
        
        selectedRolesDiv[0] = createDiv($("#teamView")[0], "selected_role_0", ["selected_role", "selected_role_0", "transparent_green"]);
        createImg(selectedRolesDiv[0], "selected_role_0_img", undefined, ["icon_role"]); 
        selectedRolesDiv[0].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[0].setAttribute("ondragover", "TeamManager.allowDrop(event)");
        
        selectedRolesDiv[1] = createDiv($("#teamView")[0], "selected_role_1", ["selected_role", "selected_role_1", "transparent_green"]);
        createImg(selectedRolesDiv[1], "selected_role_1_img", undefined, ["icon_role"]);
        selectedRolesDiv[1].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[1].setAttribute("ondragover", "TeamManager.allowDrop(event)");        

        selectedRolesDiv[2] = createDiv($("#teamView")[0], "selected_role_2", ["selected_role", "selected_role_2", "transparent_green"]);
        createImg(selectedRolesDiv[2], "selected_role_2_img", undefined, ["icon_role"]);
        selectedRolesDiv[2].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[2].setAttribute("ondragover", "TeamManager.allowDrop(event)");        
    
        selectedRolesDiv[3] = createDiv($("#teamView")[0], "selected_role_3", ["selected_role", "selected_role_3", "transparent_green"]);
        createImg(selectedRolesDiv[3], "selected_role_3_img", undefined, ["icon_role"]);
        selectedRolesDiv[3].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[3].setAttribute("ondragover", "TeamManager.allowDrop(event)");        

        selectedRolesDiv[4] = createDiv($("#teamView")[0], "selected_role_4", ["selected_role", "selected_role_4", "transparent_green"]);
        createImg(selectedRolesDiv[4], "selected_role_4_img", undefined, ["icon_role"]);
        selectedRolesDiv[4].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[4].setAttribute("ondragover", "TeamManager.allowDrop(event)");        

        selectedRolesDiv[5] = createDiv($("#teamView")[0], "selected_role_5", ["selected_role", "selected_role_5", "transparent_green"]);
        createImg(selectedRolesDiv[5], "selected_role_5_img", undefined, ["icon_role"]);
        selectedRolesDiv[5].setAttribute("ondrop", "TeamManager.drop(event)");
        selectedRolesDiv[5].setAttribute("ondragover", "TeamManager.allowDrop(event)");                       
        
        var teamRolesViewDiv = createDiv($("#teamView")[0], "role_area", ["role_area", "transparent_green"]);
        
        
        var temp = createDiv(teamRolesViewDiv, undefined, ["scrollbar"]);
        temp = createDiv(temp, undefined, ["track"]);
        temp = createDiv(temp, undefined, ["thumb"]);
        temp = createDiv(temp, undefined, ["end"]);
        temp = createDiv(teamRolesViewDiv, undefined, ["viewport"]);        
        temp = createDiv(temp, undefined, ["overview"]);
        
/*
        createRoleView(temp, "1");
        createRoleView(temp, "2");
        createRoleView(temp, "3");
        createRoleView(temp, "4");
        createRoleView(temp, "5");
        createRoleView(temp, "6");
        createRoleView(temp, "7");
        createRoleView(temp, "8");
        createRoleView(temp, "9");
        createRoleView(temp, "10");
        createRoleView(temp, "11");
        createRoleView(temp, "12");            
                        
        $('#role_area').tinyscrollbar();
        */

        
       
        var menuDiv = createDiv($("#teamView")[0], "menu", ["menu", "transparent_green"]);
        temp = createDiv(menuDiv, "btn_start", ["btn_start", "transparent_green"]);
        temp.innerHTML = "START";
        temp.onclick = TeamManager.start;
        temp = createImg(menuDiv, "btn_return", "image/icon_return.png", ["btn_return"]);       
        temp.onclick = TeamManager.back;
        
        
      
        
     
    }
    
    function start() {
        alert("start");
    }
    
    function back() {
        alert("return");
    }
    
    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var srcImg = document.getElementById(data);
        var tragetImgId = undefined;
        if($("#"+ev.target.id)[0].tagName == "DIV")
        {
            tragetImgId = $("#"+ ev.target.id + "> img")[0].id;
            $("#"+ ev.target.id + "> img")[0].src = srcImg.src;
            $("#"+ ev.target.id + "> img")[0].setAttribute("draggable", false);            
        }
        else
        {
            tragetImgId = $("#"+ ev.target.id)[0].id;
            $("#"+ ev.target.id)[0].src = srcImg.src;
            $("#"+ ev.target.id)[0].setAttribute("draggable", false);
        }
        
        var oldImgId = selectedRolesArray[tragetImgId];
        if(oldImgId != undefined)
        {
            var oldImg = document.getElementById(oldImgId);
            oldImg.setAttribute("draggable", true);
            oldImg.style.opacity = "1";
        }
        srcImg.setAttribute("draggable", false);
        srcImg.style.opacity = "0.3";
        selectedRolesArray[tragetImgId] = data;
    }      
    
    
    function createRoleView(parentdiv, roleId)
    {
    
        var roleViewDiv = createDiv(parentdiv, undefined, ["role", "transparent_green"]);
        var imgId = undefined;
        var imgSrc = undefined;
        if(roleId != undefined)
        {
            imgId = "role_" + roleId + "_img";
            imgSrc = "image/" + roleId + ".png";
        }
        var roleImg = createImg(roleViewDiv, imgId, imgSrc, ["icon_role"]);
        roleImg.setAttribute("draggable", true);
        roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
        return roleViewDiv;
    }
    
    function createImg(parentdiv, imgId, imgSrc, divClass)
    {
        var newImg = document.createElement("img");
        if(imgId != undefined)
        {
            var imgIdName = imgId;
            newImg.setAttribute('id',imgIdName);
        }
        if(imgSrc != undefined)
        {
            newImg.src = imgSrc;
        }
        newImg.className = divClass[0];
        for(var i=1;i<divClass.length;i++)
        {
            newImg.className += " " + divClass[i];
        }
        
        parentdiv.appendChild(newImg);
        
        
        return newImg;
    }    
    
    function createDiv(parentdiv, divId, divClass)
    {
        var newdiv = document.createElement("div");
        if(divId != undefined)
        {        
            var divIdName = divId;
            newdiv.setAttribute('id',divIdName);        
        }
        newdiv.className = divClass[0];
        for(var i=1;i<divClass.length;i++)
        {
            newdiv.className += " " + divClass[i];
        }
        
        parentdiv.appendChild(newdiv);
        
        
        return newdiv;
    }
    
    function setLevel(playerLevel)
    {
        $("#playerlevel")[0].innerHTML = "LV " + playerLevel;
    }
    
    function setName(playername)
    {
        $("#playername")[0].innerHTML = playername;
    }
    
    function setCash(playerCash)
    {
        $("#playercash > #value")[0].innerHTML = playerCash;
    }
    
    function setMoney(playerMoney)
    {
        $("#playerMoney > #value")[0].innerHTML = playerMoney;
    }
    
    function createTeamRoles(role_array)
    {
        var temp = $(".viewport > .overview");
        
        temp.empty();
        
        for(var i=0;i<role_array.length;i++)
        {
            var roleID = role_array[i];
            
            createRoleView(temp[0], roleID);                                               
        }
        $('#role_area').tinyscrollbar();
    }
        
    
    
    return {
        "init" : init,
        "allowDrop" : allowDrop,
        "drag" : drag,
        "drop" : drop,
        "start" : start,
        "back" : back,
        "createTeamRoles" : createTeamRoles
    }
    
}();