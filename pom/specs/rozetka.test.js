const { chromium } = require('playwright');
const RozetkaHomePage = require('../pageObject/RozetkaHome.page');
const RozetkaCartPage = require('../pageObject/RozetkaCart.page');


describe('rozetka smoke test', () => {
    jest.setTimeout(20000);
    let browser = null;
    let context = null;
    let page = null;
    let rozetkaHomePage = null;
    let rozetkaCartPage = null;

    beforeAll(async () => {
        browser = await chromium.launch({ headless: false });
        context = await browser.newContext();
        page = await context.newPage();
        rozetkaHomePage = new RozetkaHomePage(page);
        rozetkaCartPage = new RozetkaCartPage(page);
    });
    beforeEach(async () => {
        await rozetkaHomePage.navigate(page, 'https://rozetka.com.ua/');
    });

    //my own test case
    it('check if item was deleted from cart', async () => {
        const url = await page.url();
        expect(url).toBe("https://rozetka.com.ua/ua/");
        await rozetkaHomePage.clickSmartphoneCategory();
        await rozetkaHomePage.clickIphoneCategory();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.addToCartFirstItem();
        await rozetkaHomePage.clickCart();
        await page.waitForTimeout(1000);
        await rozetkaCartPage.clickOptionsAndCheckIfDeleteIsVisible();
        await rozetkaCartPage.clickDelete();
        await page.waitForTimeout(1000);
        const emptyCart = await rozetkaCartPage.checkIfEmptyCartIsDisplayed();
        expect(emptyCart).toBe(true);
    })

    it('verify if the price filter working correctly', async () => {
        const url = await page.url();
        expect(url).toBe("https://rozetka.com.ua/ua/");
        await rozetkaHomePage.clickSmartphoneCategory();
        await rozetkaHomePage.clickIphoneCategory();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.filterByIphone12();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.filterByIphone13();
        await page.waitForTimeout(500);
        await rozetkaHomePage.clickOnlyAvailable();
        await rozetkaHomePage.sortByPrice();
        await page.waitForTimeout(1000);
        const priceLocators = await page.$$("//span[@class='goods-tile__price-value']");
        await page.waitForTimeout(1000);
        const pricesInOrder = await rozetkaHomePage.assertPricesInAscendingOrder(priceLocators);
        expect(pricesInOrder).toBe(true);
        const itemTitles = await page.$$("//span[@class='goods-tile__title']");
        await page.waitForTimeout(1000);
        const allTitlesContainIphone12Or13 = await rozetkaHomePage.assertTitlesContainIphone12Or13(itemTitles);
        expect(allTitlesContainIphone12Or13).toBe(true);
    })

    //failing this test on purpose
    it('add items to the basket', async () => {
        const url = await page.url();
        expect(url).toBe("https://rozetka.com.ua/ua/");
        await rozetkaHomePage.clickSmartphoneCategory();
        await rozetkaHomePage.clickIphoneCategory();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.addToCartFirstItem();
        await rozetkaHomePage.clickCatalogue();
        await rozetkaHomePage.clickLaptops();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.addToCartFirstItem();
        await page.waitForTimeout(1000);
        await rozetkaHomePage.isCartValueTwo();
        expect(await rozetkaHomePage.isCartValueTwo()).toBe(true);
        await rozetkaHomePage.clickCart();
        await page.waitForTimeout(1000);
        await rozetkaCartPage.areTwoElementsVisible();
        //the following assertion will fail , it's done on purpose
        expect(await rozetkaCartPage.areTwoElementsVisible()).toBe(true);
        const priceLocators = await page.$$("//p[@data-testid='cost']");
        await page.waitForTimeout(1000);
        const totalItemsPrice = await rozetkaCartPage.getPriceTotalOfItems(priceLocators);
        const checkoutPrice = await rozetkaCartPage.getPriceCheckout();
        expect(totalItemsPrice).toEqual(checkoutPrice);
        await rozetkaCartPage.clickOptionsAndCheckIfDeleteIsVisible();
    })

    it('search the item', async () => {
        const url = await page.url();
        expect(url).toBe("https://rozetka.com.ua/ua/");
        await rozetkaHomePage.enterRandomText("lenovo laptop");
        await rozetkaHomePage.clickSearch();
        const itemTitles = await page.$$("//span[@class='goods-tile__title']");
        const allTitlesContainLenovo = await rozetkaHomePage.assertTitleContainKeywordLenovo(itemTitles);
        expect(allTitlesContainLenovo).toBe(true);
    })

    afterAll(async () => {
        // closing browser
        await context.close();
        await browser.close();
    });

});