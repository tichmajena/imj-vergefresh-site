export function slugify(str = 's') {
	if (!str) return '';
	str = str.replace(/^\s+|\s+$/g, '');

	// Make the string lowercase
	str = str.toLowerCase();

	// Remove accents, swap ñ for n, etc
	var from =
		'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
	var to =
		'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	// Remove invalid chars
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		// Collapse whitespace and replace by -
		.replace(/\s+/g, '-')
		// Collapse dashes
		.replace(/-+/g, '-');

	return str;
}

export function dataURItoBlob(dataURI: string) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	var ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString });
	return blob;
}

export function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
}

export function zodValidationErrors(error: any) {
	let messages: any = {};
	error?.errors.forEach(({ path, message }: any) => {
		console.log(path[0], message);
		if (!messages[path[0]]?.msg) messages[path[0]] = { msg: [], code: 'error' };
		messages[path[0]].msg.push(message);
	});
	return messages;
}

export const getNextDays = (daysToAdd = 1, currentDate = new Date()) => {
	const nextDate = new Date(currentDate);
	nextDate.setDate(currentDate.getDate() + daysToAdd);
	return nextDate;
};

export function getLineBreakChar(string: string) {
	const indexOfLF = string.indexOf('\n', 1); // No need to check first-character

	if (indexOfLF === -1) {
		if (string.indexOf('\r') !== -1) return '\r';

		return '\n';
	}

	if (string[indexOfLF - 1] === '\r') return '\r\n';

	return '\n';
}

export function normalizeBreaks(text: string, break_ = '\n') {
	return text.replace(/\r\n/g, break_);
}

// // Import required modules
// const fetch = require('node-fetch');
// const { JSDOM } = require('jsdom');

// Function to perform SEO analysis on a given URL
async function checkSEO(url: string) {
	try {
		// Fetch the page HTML
		const response = await fetch(url);
		const html = await response.text();

		// Parse the HTML using JSDOM
		const dom = new JSDOM(html);
		const document = dom.window.document;

		console.log(`\nAnalyzing SEO for: ${url}\n`);

		// 1. Check the Title Tag
		const titleElement = document.querySelector('title');
		const title = titleElement ? titleElement.textContent.trim() : 'Title not found';
		console.log('Title:', title);
		if (title.length > 0 && title.length <= 60) {
			console.log('Status: ✅ Title is of ideal length.\n');
		} else {
			console.log('Status: ⚠️ Title length should ideally be under 60 characters.\n');
		}

		// 2. Check the Meta Description
		const metaDescElement = document.querySelector('meta[name="description"]');
		if (metaDescElement) {
			const description = metaDescElement.getAttribute('content').trim();
			console.log('Meta Description:', description);
			if (description.length > 0 && description.length <= 160) {
				console.log('Status: ✅ Meta description is of ideal length.\n');
			} else {
				console.log(
					'Status: ⚠️ Consider shortening the meta description to under 160 characters.\n'
				);
			}
		} else {
			console.log('Meta Description: Not Found ⚠️\n');
		}

		// 3. Check for H1 Headings
		const h1Elements = document.querySelectorAll('h1');
		console.log(`Found ${h1Elements.length} <h1> tag(s).`);
		if (h1Elements.length === 1) {
			console.log('Status: ✅ A single <h1> tag is ideal.\n');
		} else {
			console.log('Status: ⚠️ There should ideally be ONE <h1> tag per page.\n');
		}

		// 4. Check the Canonical Tag
		const canonicalElement = document.querySelector('link[rel="canonical"]');
		const canonical = canonicalElement
			? canonicalElement.getAttribute('href').trim()
			: 'Canonical tag not found';
		console.log('Canonical URL:', canonical, '\n');

		// 5. Check Images for alt Attributes
		const images = document.querySelectorAll('img');
		let missingAltCount = 0;
		images.forEach((img, index) => {
			const altText = img.getAttribute('alt');
			if (!altText || altText.trim() === '') {
				missingAltCount++;
			}
		});
		console.log(`Total Images Found: ${images.length}`);
		if (missingAltCount === 0) {
			console.log('Status: ✅ All images have alt attributes.\n');
		} else {
			console.log(
				`Status: ⚠️ ${missingAltCount} image(s) are missing alt text. Consider adding descriptive alt attributes.\n`
			);
		}
	} catch (error) {
		console.error('Error fetching or processing the URL:', error);
	}
}

// // Provide the URL you want to analyze
// const urlToCheck = process.argv[2] || 'https://example.com';
// checkSEO(urlToCheck);

// Function to check the sequential order of headings
function checkHeadingSequence(document) {
	// Get all headings (h1 - h6) in the document in order
	const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

	// Keep track of the last heading level we encountered
	let previousLevel = 0; // 0 means no prior heading

	console.log('Checking heading sequence:\n');

	headings.forEach((heading, index) => {
		// Extract the numeric level from the tag name (e.g. "H2" becomes 2)
		const currentLevel = parseInt(heading.tagName.substring(1));

		// If this is the first heading, warn if it's not h1 (optional check)
		if (index === 0 && currentLevel !== 1) {
			console.warn(
				`Warning: The first heading is <${heading.tagName}>. It is best practice to start with an <h1>.`
			);
		}

		// Compare with the previous heading level
		// If the current level is more than one level deeper than the previous, log a warning
		if (previousLevel !== 0 && currentLevel > previousLevel + 1) {
			console.warn(
				`Warning: Heading <${heading.tagName}> at position ${index + 1} skips a level (previous was <h${previousLevel}>). Consider using <h${previousLevel + 1}>.`
			);
		}

		// Update previousLevel for the next iteration.
		previousLevel = currentLevel;
	});

	if (headings.length === 0) {
		console.log('No headings found on the page.');
	} else {
		console.log('\nHeading sequence check complete.');
	}
}

// Main function to fetch and process the page
async function runHeadingChecker(url) {
	try {
		// Fetch the HTML content from the URL
		const response = await fetch(url);
		const html = await response.text();

		// Parse the HTML with JSDOM
		const dom = new JSDOM(html);
		const document = dom.window.document;

		console.log(`\nAnalyzing heading sequence for: ${url}`);

		// Run heading sequence check
		checkHeadingSequence(document);
	} catch (error) {
		console.error('Error fetching or processing the URL:', error);
	}
}

// // Execute the script with a URL provided via the command line (or default to example.com)
// const targetUrl = process.argv[2] || 'https://example.com';
// runHeadingChecker(targetUrl);
