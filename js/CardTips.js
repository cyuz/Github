var CardTips = function() {

	var cardTipsName;
	var cardTipsRace;
	var cardTipsHp;
	var cardTipsATK;
	var cardTipsHealth;
	var cardTipsShield;
	var cardTipsColorImg;
	var skillName;
	var skillDes;
	var pSkillName;
	var pSkillDes;

	function init() {
		var cardTips = document.getElementById("cardTips");
		cardTipsName = document.createElement("div");
		cardTipsName.className = "cardTipsName";
		cardTips.appendChild(cardTipsName);

		cardTipsRace = document.createElement("div");
		cardTipsRace.className = "cardTipsRace";
		cardTips.appendChild(cardTipsRace);

		cardTipsHp = document.createElement("div");
		cardTipsHp.className = "cardTipsHp";
		cardTips.appendChild(cardTipsHp);

		cardTipsATK = document.createElement("div");
		cardTipsATK.className = "cardTipsATK";
		cardTips.appendChild(cardTipsATK);

		cardTipsHealth = document.createElement("div");
		cardTipsHealth.className = "cardTipsHealth";
		cardTips.appendChild(cardTipsHealth);

		cardTipsShield = document.createElement("div");
		cardTipsShield.className = "cardTipsShield";
		cardTips.appendChild(cardTipsShield);

		cardTipsColorImg = document.createElement("div");
		cardTipsColorImg.className = "cardTipsColorImg";
		cardTips.appendChild(cardTipsColorImg);

		cardTipsRoleImg = document.createElement("img");
		cardTipsRoleImg.className = "cardTipsRoleImg";
		cardTips.appendChild(cardTipsRoleImg);

		skillName = document.createElement("div");
		skillName.className = "skillName";
		cardTips.appendChild(skillName);

		skillDes = document.createElement("div");
		skillDes.className = "skillDes";
		cardTips.appendChild(skillDes);

		pSkillName = document.createElement("div");
		pSkillName.className = "pSkillName";
		cardTips.appendChild(pSkillName);

		pSkillDes = document.createElement("div");
		pSkillDes.className = "pSkillDes";
		cardTips.appendChild(pSkillDes);

		hideCradTipsView(0);
		$("#cardTipsView").click(hideTips);
	}

	function setRole(id) {
		var role = RoleData.getData(id);
		cardTipsName.innerHTML = role.name;
		if (role.race == 1) {
			cardTipsRace.innerHTML = "格鬥";
		} else if (role.race == 2) {
			cardTipsRace.innerHTML = "魔法";
		} else {
			cardTipsRace.innerHTML = "超能";
		}
		cardTipsHp.innerHTML = role.hp;
		cardTipsATK.innerHTML = role.atk;
		cardTipsHealth.innerHTML = role.heal;
		cardTipsShield.innerHTML = role.shield;
		cardTipsColorImg.className = "cardTipsColorImg cardTipsColorImg" + role.color;

		var skill = SkillData.getData(role.skill);
		skillName.innerHTML = skill.skillName;
		skillDes.innerHTML = skill.desc;

		var pSkill = SkillData.getData(role.pSkill);
		pSkillName.innerHTML = pSkill.skillName;
		pSkillDes.innerHTML = pSkill.desc;

		cardTipsRoleImg.src = "./image/" + role.fightPic;

		showCradTipsView();
	}

	function hideTips() {
		hideCradTipsView(0.2);
	}

	function hideCradTipsView(durtion) {
		TweenMax.to($("#cardTipsView"), durtion, {
			opacity : 0,
			display : "none"
		});
	}

	function showCradTipsView() {
		TweenMax.to($("#cardTipsView"), 0.2, {
			opacity : 1,
			display : "inline"
		});
	}

	return {
		"init" : init,
		"setRole" : setRole
	}

}();

