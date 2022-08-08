import chromium from 'chrome-aws-lambda'

async function getBrowserInstance() {
    // Parse the title
    
	const executablePath = await chromium.executablePath

	if (!executablePath) {
		// running locally
		const puppeteer = require('puppeteer')
		return puppeteer.launch({
			args: chromium.args,
			headless: true,
			defaultViewport: {
				width: 1200,
				height: 630
			},
			ignoreHTTPSErrors: true
		})
	}

	return chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: {
			width: 1200,
			height: 630
		},
		executablePath,
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	})
}

export default async (req, res) => {
    const { title } = req.query
    const baseURL = "https://opengraph-rosy.vercel.app"
	const url = `${baseURL}/opengraph?title=${title}`

	// Perform URL validation
	if (!url || !url.trim()) {
		res.json({
			status: 'error',
			error: 'Enter a valid URL'
		})

		return
	}

	let browser = null

	try {
		browser = await getBrowserInstance()
		let page = await browser.newPage()
		await page.goto(url)
		const imageBuffer = await page.screenshot({ type: 'png' })
        res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
        res.setHeader('Content-Type', 'image/png')
        res.status(200).send(imageBuffer)
	} catch (error) {
		console.log(error)
		res.json({
			status: 'error',
			data: error.message || 'Something went wrong'
		})
		// return callback(error);
	} finally {
		if (browser !== null) {
			await browser.close()
		}
	}
}