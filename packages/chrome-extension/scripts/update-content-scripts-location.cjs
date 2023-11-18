const fs = require('fs');
const pathlib = require('path');

// Function to get the file name of the js file in dist/assets starting with 'index-'
function getFileName() {
	const files = fs.readdirSync(pathlib.join('dist', 'assets'));
	const filteredFiles = files.filter(
		(file) => file.startsWith('index-') && file.endsWith('.js')
	);
	if (filteredFiles.length > 0) {
		return filteredFiles[0]; // Assuming only one file matches the criteria
	}
	return null; // If no matching file is found
}

// Function to update manifest.json with the new path
function updateManifest(filePath) {
	const manifestPath = pathlib.join('..', 'manifest.json');
	const manifest = require(manifestPath);

	if (
		manifest &&
		manifest.content_scripts &&
		manifest.content_scripts.length > 0
	) {
		manifest.content_scripts[0].js = ['dist/assets' + pathlib.sep + filePath]; // Update the path

		// Write the updated manifest back to the file
		fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
		console.log('Manifest updated successfully!');
	} else {
		console.error(
			'Manifest structure is invalid or does not contain content_scripts.'
		);
	}
}

const fileName = getFileName();
if (fileName) {
	updateManifest(fileName);
} else {
	console.error(
		'No matching JS file found in dist/assets starting with index-.'
	);
}
