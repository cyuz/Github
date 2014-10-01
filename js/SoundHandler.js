var SoundHandler = function() {

	function init() {
		soundManager.setup({
			onready : function() {
				s_generalSound = loadSound("generalSound");
				s_fightSound = loadSound("fightSound");
				s_eatBall = loadSound("eatBall");
				s_hit = loadSound("hit");
				s_monsterHit = loadSound("monsterHit");

				playGeneralSound();
			}
		});
	}

	function playGeneralSound() {
		s_generalSound.play({
			volume : 50,
			onfinish : playGeneralSound
		});
	}

	function stopGeneralSound() {
		s_generalSound.stop();
	}

	function playfightSound() {
		s_fightSound.play({
			volume : 50,
			onfinish : playfightSound
		});
	}

	function stopfightSound() {
		s_fightSound.stop();
	}

	function loadSound(fileName) {
		return soundManager.createSound({
			url : 'sound/' + fileName + '.mp3'
		});
	}

	function eatBall() {
		if (s_eatBall) {
			s_eatBall.play({
				volume : 20
			});
		}
	}

	function monsterHit() {
		if (s_monsterHit) {
			s_monsterHit.play({
				volume : 15
			});
		}
	}

	function hit() {
		if (s_hit) {
			s_hit.play({
				volume : 10
			});
		}
	}

	return {
		"init" : init,
		"playGeneralSound" : playGeneralSound,
		"stopGeneralSound" : stopGeneralSound,
		"playfightSound" : playfightSound,
		"stopfightSound" : stopfightSound,
		"eatBall" : eatBall,
		"monsterHit" : monsterHit,
		"hit" : hit
	}

}();

