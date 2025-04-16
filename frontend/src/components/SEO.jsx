import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

/**
 * Enhanced SEO component with advanced optimization for search engines
 * Implements page-specific structured data, comprehensive meta tags, and technical SEO best practices
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  image,
  type = 'website',
  schemaType = 'WebPage',
  keywords = [
            "Luv's Allure",
            "Luv's Allure fashion",
            "Luv's Allure clothing",
            "Luv's Allure official",
            "Luv's Allure Nigeria",
            "Luv's Allure designer",
            "Luv's Allure collection",
            "Luv's Allure reviews",
            "Luv's Allure dresses",
            "Luv's Allure tops",
            "luxury dresses Nigeria",
            "designer gowns Lagos",
            "premium maxi dresses",
            "high-end women's clothing",
            "luxury evening wear",
            "designer wedding guest dresses",
            "luxury prom dresses",
            "formal attire Nigeria",
            "Nigerian luxury fashion",
            "premium casual wear",
            "designer tops Nigeria",
            "luxury jumpsuits",
            "formal evening gowns",
            "cocktail dresses Lagos",
            "couture fashion Nigeria",
            "Nigerian fashion brands",
            "Lagos fashion designers",
            "Lagos designer clothing",
            "Nigerian fashion online",
            "African luxury fashion",
            "Nigerian fashion boutiques",
            "West African high fashion",
            "premium clothing Nigeria",
            "Nigerian fashion online store",
            "Lagos fashion house",
            "Nigerian fashion e-commerce",
            "Abuja designer clothes",
            "Nigerian evening wear",
            "Port Harcourt luxury fashion",
            "Ibadan designer boutiques",
            "top fashion brands Nigeria",
            "luxury fashion Nigeria",
            "African couture clothing",
            "Nigerian fashion trends",
            "Nigerian designer labels",
            "high-end fashion Nigeria",
            "luxury shopping Lagos",
            "exclusive fashion Nigeria",
            "premium fashion stores Nigeria",
            "modern African fashion",
            "contemporary Nigerian style",
            "elegant formal wear",
            "luxurious fabric clothing",
            "high-fashion Nigerian dresses",
            "premium quality clothing",
            "handcrafted designer pieces",
            "exclusive fashion pieces",
            "limited edition dresses",
            "statement fashion pieces",
            "unique fashion designs",
            "bold African prints",
            "minimalist luxury clothing",
           " afro-contemporary fashion",
            "sophisticated elegant style",
            "premium fabrics Nigeria",
            "Nigerian wedding guest outfits",
           " premium engagement dresses",
            "luxury Christmas party outfits",
            "premium birthday celebration outfits",
            "corporate event clothing",
            "luxury dinner gowns",
            "red carpet outfits Nigeria",
           " graduation ceremony attire",
            "VIP event dresses",
            "award ceremony fashion",
            "2025 fashion trends Nigeria",
            "current African fashion styles",
            "trending Nigerian clothing",
            "seasonal luxury fashion",
            "Christmas fashion collection",
            "summer luxury clothing Nigeria",
            "spring fashion Nigeria",
            "rainy season premium fashion",
            "autumn fashion Nigeria",
            "festive season outfits",
            "Easter celebration dresses",
           " Eid celebration luxury attire",
            "latest Nigerian fashion trends",
           " wedding season luxury dresses",
            "where to buy luxury clothes in Lagos",
            "best designer brands in Nigeria",
            "premium clothing with home delivery",
            "affordable luxury fashion Nigeria",
            "custom-made designer dresses",
            "Nigerian fashion online shopping",
           " exclusive boutiques in Lagos",
            "fashion consultancy Nigeria",
           " personal shopping services Lagos",
            "bespoke tailoring Nigeria",
            "sustainable luxury fashion",
            "ethical clothing Nigeria",
            "premium fabric selection",
            "artisanal fashion craftsmanship",
            "slow fashion Nigeria",
            "handmade couture pieces",
            "luxury fashion craftsmanship",
            "limited edition collections",
            "fashion atelier Lagos",
            "luxury fashion house Nigeria",
            "luxury retail Nigeria",
            "Nigerian fashion influencers",
            "fashion lookbook 2025",
            "Nigerian fashion trends 2025",
            "Nigerian fashion week",
            "African textiles luxury",
            "fashion design innovations Nigeria",
            "fashion technology Nigeria",
            "where to buy high-quality evening gowns in Lagos",
            "best places to shop for luxury dresses in Nigeria",
            "sustainable luxury fashion brands in Nigeria",
            "best luxury fashion brands in Nigeria",
            "best designer wedding guest outfits in West Africa",
            "custom-made formal attire for corporate women",
            "high-end fashion for Nigerian celebrities",
            "premium quality African print modern dresses",
            "luxury fashion with international shipping from Nigeria",
            "high-end fashion boutiques in Lagos",
            "best designer boutiques for special occasion outfits in Lagos",
            "Nigerian-made luxury clothing with global quality",
            "exclusive fashion pieces for Nigerian celebrities",
            "handcrafted premium accessories for formal events",
            "top luxury fashion brands Nigeria",
            "best designer clothing Lagos",
            "premium alternative to imported fashion",
            "Nigerian equivalent of international luxury brands",
            "better than fast fashion alternatives",
            "luxury fashion at reasonable prices",
            "comparable to European designer quality",
            "affordable luxury fashion alternatives",
            "where to get babybooh dresses in Nigeria",
            "where to get premium dresses in Nigeria",
            "where to get fashionova dresses in Nigeria",
            "where to get ohpolly dresses in Nigeria",
            "where to get pretty little thing dresses in Nigeria",
            "where to get asos dresses in Nigeria",
            "where to get boohoo dresses in Nigeria",
            "where to get zara dresses in Nigeria",
            "where to get mango dresses in Nigeria",
            ],
  noindex = false,
  locale = 'en_US',
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  author = "Luv's Allure",
  // Product-specific props
  product = null,
  // Article-specific props
  article = null,
  // Location/Business props
  location = null,
  // Breadcrumb props
  breadcrumbs = null,
  // FAQ props
  faqs = null,
  // Video props
  video = null,
  // Social media accounts
  social = {
    instagram: 'shopluvsallure',
    facebook: 'luvsallureofficial',
    twitter: 'luvsallure',
  },
  children,
}) => {
  const { pathname } = useLocation();
  
  // Build the full title with brand name - keep it under 60 characters for best practice
  const fullTitle = title 
    ? `${title} | Luv's Allure`
    : "Luv's Allure - Premium Nigerian Fashion & Luxury Clothing";
  
  // Enhanced description with target keywords and strong call to action
  // Keep between 120-160 characters for optimal display
  const metaDescription = description || 
    "Discover premium Nigerian fashion at Luv's Allure. Shop our exclusive collection of luxury dresses, tops & accessories. Free shipping on orders over ₦100,000. Shop now!";
  
  // High-quality image with correct dimensions for social sharing
  const metaImage = image || "https://luvsallure.com/images/og-image-1200x630.jpg";
  
  // Base URL with trailing slash consistency
  const siteUrl = "https://luvsallure.com";
  
  // Full canonical URL with protocol
  const canonical = canonicalUrl || `${siteUrl}${pathname}`;
  
  // Generate Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Luv's Allure",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    sameAs: [
      social.facebook ? `https://www.facebook.com/${social.facebook}` : null,
      social.instagram ? `https://www.instagram.com/${social.instagram}` : null,
      social.twitter ? `https://twitter.com/${social.twitter}` : null,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2348161656841',
      contactType: 'customer service',
      areaServed: 'NG',
      availableLanguage: 'English',
    },
  };

  // Generate WebSite schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Luv's Allure",
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Create schema based on page type
  let pageSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    description: metaDescription,
    url: canonical,
    image: metaImage,
    inLanguage: locale.split('_')[0],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
  };

  // Product schema for product pages
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images ? product.images.map(img => typeof img === 'string' ? img : img.src) : metaImage,
    sku: product.sku,
    mpn: product.mpn,
    brand: {
      '@type': 'Brand',
      name: "Luv's Allure",
    },
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'NGN',
      price: product.price,
      priceValidUntil: product.priceValidUntil || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    ...(product.reviews && product.reviews.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating || '4.9',
        reviewCount: product.reviews.length.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      review: product.reviews.map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewBody: review.content,
        datePublished: review.date,
      })),
    } : {}),
  } : null;

  // Article schema for blog posts
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image || metaImage,
    author: {
      '@type': 'Person',
      name: article.author || author,
    },
    publisher: {
      '@type': 'Organization',
      name: "Luv's Allure",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    url: canonical,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    description: article.description || metaDescription,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    ...(!article.isNewsArticle ? { articleSection: article.category || category } : {}),
  } : null;

  // Breadcrumb schema
  const breadcrumbsSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${siteUrl}${breadcrumb.path}`,
    })),
  } : null;

  // FAQ schema
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // Local business schema
  const localBusinessSchema = location ? {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: "Luv's Allure",
    image: metaImage,
    '@id': `${siteUrl}/#localBusiness`,
    url: siteUrl,
    telephone: location.phone || '+2348161656841',
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.street,
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.country || 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.latitude,
      longitude: location.longitude,
    },
    openingHoursSpecification: location.hours?.map(hour => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hour.days,
      opens: hour.opens,
      closes: hour.closes,
    })) || [],
    priceRange: '₦₦₦',
  } : null;

  // Video schema
  const videoSchema = video ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description || metaDescription,
    thumbnailUrl: video.thumbnail || metaImage,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
  } : null;

  // Compute all valid schema objects
  const schemaObjects = [
    organizationSchema,
    websiteSchema,
    productSchema,
    articleSchema,
    breadcrumbsSchema,
    faqSchema,
    localBusinessSchema,
    videoSchema,
    // Default to page schema if none of the specific ones apply
    (!productSchema && !articleSchema) ? pageSchema : null,
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic meta tags with optimized title and description */}
      <html lang={locale.split('_')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={[...keywords, ...tags].join(', ')} />
      <meta name="author" content={author} />
      
      {/* Technical SEO tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#000000" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Robots directives - granular control */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Canonical URL for avoiding duplicate content */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph tags - optimized for engagement */}
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Luv's Allure" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      
      {/* Article specific OG tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}
      {tags && tags.map(tag => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}
      
      {/* Twitter Card tags - enhanced for better visibility */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content={`@${social.twitter}`} />
      <meta name="twitter:creator" content={`@${social.twitter}`} />
      
      {/* Pinterest verification */}
      {social.pinterest && (
        <meta name="p:domain_verify" content={social.pinterest} />
      )}
      
      {/* Preload critical assets for Core Web Vitals optimization */}
      <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
      <link rel="preconnect" href="https://cdn.shopify.com" />
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      
      {/* Mobile app links */}
      <meta name="apple-itunes-app" content="app-id=123456789" />
      <meta name="google-play-app" content="app-id=com.luvsallure.app" />
      
      {/* Structured data JSON-LD - optimized for rich snippets */}
      {schemaObjects.map((schema, index) => (
        <script type="application/ld+json" key={`schema-${index}`}>
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Additional head elements */}
      {children}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  schemaType: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  noindex: PropTypes.bool,
  locale: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    sku: PropTypes.string,
    mpn: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceValidUntil: PropTypes.string,
    inStock: PropTypes.bool,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reviews: PropTypes.arrayOf(PropTypes.shape({
      author: PropTypes.string,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      content: PropTypes.string,
      date: PropTypes.string,
    })),
  }),
  article: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    author: PropTypes.string,
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    isNewsArticle: PropTypes.bool,
  }),
  location: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    region: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    phone: PropTypes.string,
    hours: PropTypes.arrayOf(PropTypes.shape({
      days: PropTypes.string,
      opens: PropTypes.string,
      closes: PropTypes.string,
    })),
  }),
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
  })),
  faqs: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
  })),
  video: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    uploadDate: PropTypes.string,
    duration: PropTypes.string,
    contentUrl: PropTypes.string,
    embedUrl: PropTypes.string,
  }),
  social: PropTypes.shape({
    instagram: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    pinterest: PropTypes.string,
  }),
  children: PropTypes.node,
};

export default SEO;