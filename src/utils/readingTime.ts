// Estimates reading time from raw markdown/MDX source.
// Prose and code are counted separately - code is skimmed/read at a different pace than prose.

const WORDS_PER_MINUTE = 225;
const CODE_LINES_PER_MINUTE = 45;

export interface ReadingTime {
	words: number;
	codeLines: number;
	minutes: number;
	text: string;
}

const FENCED_CODE = /^[ \t]*(?:```|~~~)[^\n]*\n[\s\S]*?^[ \t]*(?:```|~~~)[ \t]*$/gm;
const MDX_IMPORTS = /^[ \t]*(?:import|export)\s[^\n]*$/gm;
const IMAGES = /!\[[^\]]*\]\([^)]*\)/g;
const LINKS = /\[([^\]]*)\]\([^)]*\)/g;
const JSX_OR_HTML_TAGS = /<\/?[A-Za-z][^>]*>/g;
const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu;

export function getReadingTime(body: string | undefined): ReadingTime {
	const source = (body ?? '').replace(/^---\r?\n[\s\S]*?\r?\n---/, '');

	let codeLines = 0;
	const prose = source
		.replace(FENCED_CODE, (block) => {
			// don't count the opening/closing fences themselves
			codeLines += Math.max(0, block.split('\n').filter((l) => l.trim().length > 0).length - 2);
			return ' ';
		})
		.replace(MDX_IMPORTS, ' ')
		.replace(IMAGES, ' ')
		.replace(LINKS, '$1')
		.replace(JSX_OR_HTML_TAGS, ' ')
		.replace(/`([^`]*)`/g, '$1');

	const words = prose.match(WORD)?.length ?? 0;
	const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE + codeLines / CODE_LINES_PER_MINUTE));

	return { words, codeLines, minutes, text: `${minutes} min read` };
}
