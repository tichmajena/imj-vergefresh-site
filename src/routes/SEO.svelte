<script>
  export let siteUrl;
  export let siteTitle;
  export let metaTitle;
  export let metadescription;
  export let branches = [];
  export let services = [];
  // export let siteTitleAlt;
  // export let siteLanguage;
  // export let entityHash;
  // export let pageTitle;
  // export let pageUrl;
  // export let pageSlug;
  // export let datePublished;
  // export let lastUpdated;
  export let siteLogo;
  export let facebookPage;
  export let telephone;
  export let address;
  export let twitterHandle;
  export let linkedinProfile;
  export let images = [];

  // const schemaOrgWebsite = {
  // 	'@type': 'WebSite',
  // 	'@id': `${siteUrl}/#website`,
  // 	url: siteUrl,
  // 	name: siteTitle,
  // 	description: siteTitleAlt,
  // 	publisher: {
  // 		'@id': `${siteUrl}/#/schema/person/${entityHash}`
  // 	},
  // 	potentialAction: [
  // 		{
  // 			'@type': 'SearchAction',
  // 			target: `${siteUrl}/?s={search_term_string}`,
  // 			'query-input': 'required name=search_term_string'
  // 		}
  // 	],
  // 	inLanguage: siteLanguage
  // };

  //TODO: Relook at this
  // const breadcrumbs = [
  // 	{ name: 'Home', slug: '' },
  // 	{ name: pageTitle, pageSlug }
  // ];

  // const schemaOrgBreadcrumbList = {
  // 	'@type': 'BreadcrumbList',
  // 	'@id': `${siteUrl}#breadcrumb`,
  // 	itemListElement: breadcrumbs.map((element, index) => ({
  // 		'@type': 'ListItem',
  // 		position: index + 1,
  // 		item: {
  // 			'@type': 'WebPage',
  // 			'@id': `${siteUrl}/${element.slug}`,
  // 			url: `${siteUrl}/${element.slug}`,
  // 			name: element.name
  // 		}
  // 	}))
  // };

  // const schemaOrgWebPage = {
  // 	'@type': 'WebPage',
  // 	'@id': `${siteUrl}#webpage`,
  // 	url: siteUrl,
  // 	name: pageTitle,
  // 	isPartOf: {
  // 		'@id': `${siteUrl}/#website`
  // 	},
  // 	primaryImageOfPage: {
  // 		'@id': `${pageUrl}#primaryimage`
  // 	},
  // 	datePublished,
  // 	dateModified: lastUpdated,
  // 	author: {
  // 		'@id': `${siteUrl}/#/schema/person/${entityHash} `
  // 	},
  // 	description: metadescription,
  // 	breadcrumb: {
  // 		'@id': `${pageUrl}#breadcrumb`
  // 	},
  // 	inLanguage: siteLanguage,
  // 	potentialAction: [
  // 		{
  // 			'@type': 'ReadAction',
  // 			target: [pageUrl]
  // 		}
  // 	]
  // };

  let googleLocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: siteTitle,
    url: siteUrl,
    logo: siteLogo,
    image: images,
    telephone: telephone,
    priceRange: '$',
    // image: [
    // 	'https://example.com/photos/1x1/photo.jpg',
    // 	'https://example.com/photos/4x3/photo.jpg',
    // 	'https://example.com/photos/16x9/photo.jpg'
    // ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: telephone,
      contactType: 'Customer service'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country
    },
    sameAs: [
      facebookPage,
      `https://www.twitter.com/${twitterHandle}`,
      `https://www.linkedin.com/in/${linkedinProfile}`
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Products and Services',
      itemListElement: services
        .filter((s) => s.title !== '')
        .map((s) => {
          return {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title
            }
          };
        })
    },
    location: branches.map((b) => {
      return {
        '@type': 'Place',
        name: b.branch,
        address: {
          '@type': 'PostalAddress',
          streetAddress: b.address,
          addressLocality: b.city,
          addressRegion: b.city,
          addressCountry: b.country
        }
      };
    }),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00'
      }
    ]
  };

  const schemaOrgArray = googleLocalBusinessSchema;

  let jsonLdString = JSON.stringify(schemaOrgArray);
  let jsonLdScript = `<script type="application/ld+json">${jsonLdString}${'<'}/script>`;
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="description" content={metadescription} />
  <!-- <meta
		name="google-site-verification"
		content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
	/> -->
  <title>{metaTitle}</title>
  <!-- <meta name="robots" content="noindex,nofollow" /> -->
  {@html jsonLdScript}
</svelte:head>
