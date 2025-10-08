export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      {/* Preconnect to Google Fonts to speed up font stylesheet/fetching */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* Add any additional critical preload links here if you self-host fonts or critical CSS */}
    </>
  );
}
