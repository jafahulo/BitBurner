/** @param {NS} ns */

export async function main(ns) {
	// // delete previous content
	// await ns.write("servers.txt", "home", "w");

	var allServers = {
		"home": {}
	}

	// recurrsively scan every server and add them to an array
	for (var i = 0; i <=  Object.keys(allServers).length; i++) {
		// scan current server to find it's connections
		var results = await ns.scan(Object.keys(allServers)[i]);

		// add servers to our object
		for (var result of results) {
			let server = ns.getServer(result);
			// result[server.hostname] = server;
			
			if(!allServers.hasOwnProperty(result)) allServers[result]=server;
		}
	}
	ns.tprint("Discovered " + Object.keys(allServers).length + " servers.");
	//write discovered servers to an array
	await ns.write("servers.txt", JSON.stringify(allServers), "w");
}