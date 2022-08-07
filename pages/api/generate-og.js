import chromium from 'chrome-aws-lambda'

export default async function opengraph(req, res) {
  // Parse the title
  const { title } = req.query
  const baseURL = "http://opengraph-rosy.vercel.app"

  // Open the browser with the right window size

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    defaultViewport: { width: 1200, height: 630 },
    headless: true,
    ignoreHTTPSErrors: true,
  })

  // Navigate a new browser page to the layout page
  let page = await browser.newPage()
  //console.log(`${baseURL}/opengraph?title=${title}`)
  await page.goto(`${baseURL}/opengraph?title=${title}`, { waitUntil: 'networkidle2' })

  // Take a screenshot
  const screenshotBuffer = await page.screenshot({ type: 'png' })
  await browser.close()

  // Tell the consuming service to cache the image being sent
  res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(screenshotBuffer)
}