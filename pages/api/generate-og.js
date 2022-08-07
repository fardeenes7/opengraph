import chromium from 'chrome-aws-lambda'
const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];
export default async function opengraph(req, res) {
  // Parse the title
  const { title } = req.query
  const baseURL = "http://opengraph-rosy.vercel.app"

  // Open the browser with the right window size

  const browser = await chromium.puppeteer.launch({
    //ignoreDefaultArgs: ['--disable-extensions'],
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security", minimal_args],
    executablePath: await chromium.executablePath,
    defaultViewport: chromium.defaultViewport,
    defaultViewport: { width: 1200, height: 630 },
    headless: true,
    ignoreHTTPSErrors: true,
  })

  // Navigate a new browser page to the layout page
  let page = await browser.newPage()
  //console.log(`${baseURL}/opengraph?title=${title}`)
  await page.goto(`${baseURL}/opengraph?title=${title}`, { waitUntil: 'networkidle2' })
//
  // Take a screenshot

  const screenshotBuffer = await page.screenshot({ type: 'png' })
  await browser.close()

  // Tell the consuming service to cache the image being sent
  res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(screenshotBuffer)
}