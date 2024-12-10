import {execSync} from 'child_process';
import {VscodeUiConnectorPluginOptions} from './rollup.js';

export function openFileAtLine(
	filepath: string,
	line: number,
	col: number | undefined,
	opts?: VscodeUiConnectorPluginOptions
) {
	const nvimCommand = col
		? `:edit +call\\ cursor(${line},${col}) ${filepath}`
		: `:edit +${line} ${filepath}`;
	const tmuxCommand = `tmux send-keys -t : Escape "${nvimCommand}" Enter`;

	try {
		execSync(tmuxCommand, {stdio: 'inherit'});
		if (opts?.postExec) {
			execSync(opts.postExec);
		}
	} catch (error) {
		console.error('Error occurred while sending command to Neovim:', error);
	}
}
