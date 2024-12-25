import {execSync} from 'child_process';
import {type ServerOptions} from './config.js';

export function openFileAtLine(
	filepath: string,
	line: number,
	col: number | undefined,
	opts?: ServerOptions,
) {
	const nvimCommand = col
		? `:edit +call\\ cursor(${line},${col}) ${filepath}`
		: `:edit +${line} ${filepath}`;
	const tmuxCommand = `tmux send-keys -t ${opts.tmuxOptions.session} Escape "${nvimCommand}" Enter`;

	try {
		execSync(tmuxCommand, {stdio: 'inherit'});
	} catch (error) {
		console.error('Error occurred while sending command to Neovim:', error);
	}
}
