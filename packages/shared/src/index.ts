export type NodeInformation = {
	tagName: string;
	textContent?: string;
	id?: string;
	className?: string;
	classText?: string;
	styleText?: string;
	// parentTagName?: any;
};

export const propertyPriorityList: ReadonlyArray<keyof NodeInformation> = [
	'id',
	'textContent',
	'classText',
	'styleText',
	'tagName',
	'className',
] as const;
