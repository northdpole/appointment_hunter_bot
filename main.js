require('dotenv').config()  // local dev

const puppeteer = require('puppeteer') 
const TelegramBot = require('node-telegram-bot-api')

let checker = async () => {
    const browser = await puppeteer.launch({ headless: true,arg:['--no-sandbox']})
    const page = await browser.newPage()

    await page.setViewport({ width: 1280, height: 800 })
    const navigationPromise = page.waitForNavigation()

    let element_selector = process.env.ELEMENT_SELECTOR
    let submit_selector = process.env.SUBMIT_SELECTOR
    let pass_selector = process.env.PASS_SELECTOR
    let email_selector = process.env.EMAIL_SELECTOR
    let email = process.env.EMAIL
    let main_url = process.env.MAIN_URL
    let pass = process.env.PASSWORD
    let no_success_val = process.env.NO_SUCCESS_VAL

    const token = process.env.TELEGRAM_API_TOKEN 
    const bot = new TelegramBot(token, { polling: false })
    const chatid = process.env.TEKEGRAM_CHAT_ID
    let telegram_success_message = "Appointment found! visit "+main_url
    
    try {
        await page.goto(main_url)
        await navigationPromise

        await page.type(email_selector, email)
       
        await page.type(pass_selector, pass)
        
        await page.waitForSelector(submit_selector) // CSS selector like  '#identifierNext'
        await page.click(submit_selector)            
        await page.waitForTimeout(500);
        
        let no_success = await page.$eval(element_selector, el => el.textContent);
        if ( no_success == no_success_val){
            result = false
        }
        else {
            console.log(no_success)
            sendMessage(telegram_url,message,reply,res);
            bot.sendMessage(chatid,telegram_success_message)
            result = true
        }
        await browser.close()
        return result
    }catch (e) {
        console.log(e.message)
        bot.sendMessage(chatid, "Hunter job encountered an exception, you might want to investigate, message was: "+e.message)
    }
}
    
    checker().then((value) => {   console.log(value);  // Success!
    });