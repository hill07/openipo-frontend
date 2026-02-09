import Head from 'next/head';

const SEO = ({
    title,
    description,
    canonical,
    keywords,
    openGraph
}) => {
    const siteName = 'OpenIPO';
    const defaultDescription = 'OpenIPO provides latest IPO updates in India including upcoming IPOs, IPO GMP today, allotment status and detailed IPO information.';
    const fullTitle = title ? `${title} | ${siteName}` : `IPO – Upcoming IPOs, IPO GMP Today & Allotment Status | ${siteName}`;
    const fullDescription = description || defaultDescription;
    const url = canonical || 'https://openipo.in';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            {openGraph?.image && <meta property="og:image" content={openGraph.image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />

            {/* Schema can be injected here or in standard components */}
        </Head>
    );
};

export default SEO;
