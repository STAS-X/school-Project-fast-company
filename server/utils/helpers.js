function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateUserData() {
	const genNumber = getRandomInt(1, 10);
	return {
		rate: getRandomInt(1, 5),
		completedMeetings: getRandomInt(0, 200),
		image: `https://xsgames.co/randomusers/avatar.php?g=${genNumber < 5 ? 'male' : genNumber < 8 ? 'female' : 'pixel'}`,
		// `https://api.dicebear.com/9.x/avataaars/${(Math.random() + 1).toString(36).substring(7)}/svg`,
	};
}

module.exports = {
	generateUserData,
};
