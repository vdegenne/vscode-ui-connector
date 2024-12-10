export function convertToWindowsPathIfNecessary(path: string) {
	if (process.platform === 'win32') {
		return path.replace(/\//g, '\\');
	}
	return path;
}
