const BasePage = require('./Base.page');
class RozetkaCartPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async clickOptionsAndCheckIfDeleteIsVisible() {
        const option = await this.page.waitForSelector(
            "//button[@id='cartProductActions0']"
        );
        await option.click();

        const deleteButton = await this.page.waitForSelector("//button[@type='button'][contains(.,'Видалити')]", { clickable: true });
    }
    async clickDelete() {
        const deleteButton = await this.page.waitForSelector("//button[@type='button'][contains(.,'Видалити')]");
        await deleteButton.click();
    }


    async checkIfEmptyCartIsDisplayed() {
        const emptyCart = await this.page.waitForSelector("//div[@data-testid='empty-cart']", { state: 'visible', timeout: 5000 });
        return emptyCart !== null;
    }

    async getPriceTotalOfItems(priceLocators) {
        let totalPrice = 0;
        for (const priceLocator of priceLocators) {
            const price = await priceLocator.innerText();
            const numericPrice = parseInt(price.replace(/[^\d]/g, ''));
            totalPrice += numericPrice;
        }
        console.log(totalPrice);
        return totalPrice;
    }

    async getPriceCheckout() {
        const basketText = await this.page.$("//div[@class='cart-receipt__sum-price']");
        const basketPrice = await basketText.innerText();
        const basketNumericPrice = parseInt(basketPrice.replace(/[^\d]/g, ''));
        console.log(basketNumericPrice);
        return basketNumericPrice;
    }

}



module.exports = RozetkaCartPage;