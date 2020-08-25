const snapshot = require('./../src/functions/usernameToColor/__snapshots__/usernameToColor.spec.js.snap')
const result = {}
Object.keys(snapshot).map((key) => {
		const uid = key.replace('usernameToColor ', '').replace(' has the proper color 1', '')
		result[uid] = JSON.parse(snapshot[key].replace('Color ', '').replace(",\n}\n", "}"))
})
console.log(JSON.stringify(result))
