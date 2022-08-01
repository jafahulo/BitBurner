/** @param {NS} ns */
export async function main(ns) {
	var fileName = ns.args[0];
	// Creates an array of servers to scan
	if (fileName) {
		var servers = JSON.parse(ns.read(fileName));
	} else {
		ns.run("findServers.js");
		var servers = JSON.parse(ns.read("Servers.txt"));
	}

	function getNumberOfPortsAbleToOpen() {
		var portsAbleToOpen = 0;
		var portFiles = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
		for (var port of portFiles) {
			if (ns.fileExists(port)) ++portsAbleToOpen;
		}
		return portsAbleToOpen;
	}

	// configure target money, security threshold, available RAM,
	// and how many threads to use for each server.
	for (var target in servers) {
		// try { // don't crash early
		// await ns.write("hackingLevels.txt", ns.getServerRequiredHackingLevel(target) + "\n", "a");

		if (!ns.hasRootAccess(target)) {
			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
				var requiredPorts = ns.getServerNumPortsRequired(target);
				var portsAbleToOpen = getNumberOfPortsAbleToOpen();
				if (portsAbleToOpen >= requiredPorts) {


					// Defines how much money a server should have before we hack it
					// In this case, it is set to 75% of the server's max money


					var moneyThresh = servers[target].moneyMax * 0.75;

					var securityThresh = servers[target].minDifficulty + 5;

					var availableRam = servers[target].maxRam - servers[target].ramUsed;

					var threads = Math.floor(availableRam / ns.getScriptRam('farmer.js'));
					threads = (threads < 1) ? 1 : threads;


					// Print server info
					ns.tprint("");
					ns.tprint("----- Attacking " + target + "-----");
					ns.tprint("Available RAM: " + availableRam);
					ns.tprint("Threads: " + threads);


					// If we have the BruteSSH.exe program, use it to open the SSH Port
					// on the target server

					for (var i = 0; i <= portsAbleToOpen; i++) {
						switch (i) {
							case 1:
								ns.brutessh(target);
								ns.tprint("Brute SSH ☑️");
								break;
							case 2:
								ns.ftpcrack(target)
								ns.tprint("ftp crack ☑️");
								break;
							case 3:
								ns.httpworm(target)
								ns.tprint("http worm ☑️");
								break;
							case 4:
								ns.relaysmtp(target)
								ns.tprint("relay SMTP ☑️");
								break;
							case 5:
								ns.sqlinject(target)
								ns.tprint("sql inject ☑️");
								break;

						}
					}

					// Get root access to target server
					ns.nuke(target);
					ns.tprint("Nuked ☑️");

					// Copy payload to target
					await ns.scp('farmer.js', target)

					ns.tprint("Copied payload ☑️");

					// Run payload with configured arguments
					ns.exec('farmer.js', target, threads, target, moneyThresh, securityThresh);

					ns.tprint("Farmer is running on " + target + " ☑️");
					ns.tprint("----------------------------\n")
				} else {
					ns.tprint(target + ": Can't open enough ports");
				}
				// } else {
				// 	ns.tprint("Cannot hack " + target + ". Level " + ns.getHackingLevel() + "/" + ns.getServerRequiredHackingLevel(target));
			}
			// } catch {
			// ns.tprint("Attacking " + target + " failed.");
			// }
		} else {
			ns.tprint(target + "☑️");
		}
	}
}