import Mustache from 'mustache';
export function renderTemplateString(templateString: string, data: object): string {
	return Mustache.render(templateString, data);
}
