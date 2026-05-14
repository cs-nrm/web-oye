export function normalizeSlug(slug = '') {
	let value = String(slug);
	try {
		value = decodeURIComponent(value);
	} catch {
		// Keep the original value if a remote slug contains malformed escapes.
	}

	return value
		.normalize('NFKC')
		.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-');
}
