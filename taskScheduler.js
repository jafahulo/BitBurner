/** @param {NS} ns */
export async function main(ns) {
	ns.run("findServers.js");
	let firstRun = true;

	function getAllHackLevels() {
		let uniqueHackLevels = [];
		let servers = JSON.parse(ns.read("servers.txt"));
		let levels = []
		
		// get each hack level
		for (let i in servers) {
			levels.push(servers[i].requiredHackingSkill);
		}

		// sort the levels from least to greatest
		levels = levels.sort(function (a, b) { return a - b });

		// flush out duplicate values
		levels.forEach((c) => {
			if (!uniqueHackLevels.includes(c)) {
				uniqueHackLevels.push(c);
			}
		});

		// share the fruits of our labors
		ns.tprint("Hack levels:\n" + uniqueHackLevels);
		return uniqueHackLevels;
	}

	let hackLevels = getAllHackLevels();


	// var portFiles = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];


	const hasHackLevelChanged = async () => {
		let currentHackLevel = await ns.getHackingLevel();
		if (currentHackLevel !== await ns.getHackingLevel()) {
			currentHackLevel = await ns.getHackingLevel();
			return true;
		} else {
			return false;
		}
	}

	while (true) {
		if (await ns.getHackingLevel() == 1 && firstRun) {
			firstRun = false;
			ns.tprint("Welcome! Running farm.js");
			hackLevels.shift();
			ns.run("farm.js", 1, "servers.txt");
		}

		if (await hasHackLevelChanged()) {
			for (let level of hackLevels) {
				if (level <= await ns.getHackingLevel()) {
					ns.tprint("\n\n----- Achieved Needed Level " + level + " -----\n\n");
					ns.run("farm.js", 1, "servers.txt");
					hackLevels.shift();
					ns.tprint("\n\nNext hack levels: " + hackLevels.slice(0, 3) + "...\n\n");
				}
			}
			// ns.tprint("\n\nHack levels:\n" + uniqueHackLevels);
		}
		// buy upgrades automatically
		// for (let file of portFiles) {
		// 	if (!ns.fileExists(file)) {
		// 		switch (file) {
		// 			case "BruteSSH.exe":
		// 				if (ns.getPlayer().money >= 500000) {
		// 					ns.purchaseProgram(file);
		// 				}
		// 				break;
		// 			case "FTPCrack.exe":
		// 				if (ns.getPlayer().money >= 1500000) {
		// 					ns.purchaseProgram(file);
		// 				}
		// 				break;
		// 			case "relaySMTP.exe":
		// 				if (ns.getPlayer().money >= 5000000) {
		// 					ns.purchaseProgram(file);
		// 				}
		// 				break;
		// 			case "HTTPWorm.exe":
		// 				if (ns.getPlayer().money >= 30000000) {
		// 					ns.purchaseProgram(file);
		// 				}
		// 				break;
		// 			case "SQLInject.exe":
		// 				if (ns.getPlayer().money >= 250000000) {
		// 					ns.purchaseProgram(file);
		// 				}
		// 				break;

		// 		}
		// 	}
		// }
		await ns.sleep(1000);
	}
}