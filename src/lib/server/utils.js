export const page_json = JSON.stringify({
	id: '',
	type: 'page',
	title: ['Svedit', []],
	subtitle: ['A template for building rich content editors with Svelte 5', [[24, 44, 'emphasis']]],
	heading: ['Title', []],
	subheading: ['Title', []],
	sidebar: [
		{
			type: 'image',
			icon: 'windmill',
			layout: 1,
			classes: '',
			image: 'key.jpg',
			title: ['Vision', []],
			description: [
				'A continent with an enriched livelihood, achieved through fair and ethical growing and trade in fresh produce.',
				[]
			]
		}
	],
	body: [
		{
			type: 'story',
			icon: 'windmill',
			layout: 2,
			classes: '',
			image: 'vision',
			title: ['Vision', []],
			description: [
				'A continent with an enriched livelihood, achieved through fair and ethical growing and trade in fresh produce.',
				[]
			]
		}

		/*{
			type: 'story',
			icon:'windmill',
			layout: 2,
			classes: '',
			image: '',
			title: ['Mission', []],
			description: [
				'To achieve sustainable excellence & returns in our services, while ensuring worldwide fresh produce trade within international standards and procedures.',
				[]
			]
		}*/
	]
});

export const page_json_clean = JSON.stringify({
	id: '',
	type: 'page',
	title: ['Title', []],
	heading: ['Heading', []],
	subheading: ['Subheading', []],
	subtitle: ['Subtitle', []],
	body: []
});
