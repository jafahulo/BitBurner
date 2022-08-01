/** @param {NS} ns */

export async function main(ns) {
while (true) {
	const target = ns.args[0];
	const securityThreshold = ns.args[1];
	const moneyThreshold = ns.args[2];

		if (ns.getServerSecurityLevel(target) > securityThreshold) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target);
		} else {
			// Otherwise, hack it
			await ns.hack(target);
		}
}
}