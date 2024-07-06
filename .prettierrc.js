export default {
	bracketSpacing: true,
	endOfLine: 'lf',
	bracketSameLine: false,
	jsxSingleQuote: true,
	semi: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
	importOrder: [
		'^@remix-run/(.*)$', // remix imports
		'<THIRD_PARTY_MODULES>',
		'<THIRD_PARTY_TS_TYPES>',
		'<TS_TYPES>',
		'^services/(.*)$',
		'^models/(.*)$',
		'^components/(.*)$',
		'^utils/(.*)$',
		'^lib/(.*)$',
		'^[./]', // other imports
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	plugins: [
		'prettier-plugin-tailwindcss',
		'@trivago/prettier-plugin-sort-imports',
	],
}
