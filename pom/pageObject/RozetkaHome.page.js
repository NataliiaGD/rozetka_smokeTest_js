const BasePage = require('./Base.page');
class RozetkaHomePage extends BasePage {
  constructor(page) {
    super(page);
  }
  async navigate() {
    await this.page.goto('https://rozetka.com.ua/');
  }

  async clickSmartphoneCategory() {
    const smartphonesCategory = await this.page.waitForSelector(
      "(//li[@class='menu-categories__item ng-star-inserted'][contains(., 'Смартфон')])[2]"
    );
    await smartphonesCategory.click();
  }

  async clickIphoneCategory() {
    const iphoneCategory = await this.page.waitForSelector(
      "//a[@title='https://rozetka.com.ua/ua/mobile-phones/c80003/producer=apple/']"
    );
    await iphoneCategory.click();
  }

  async filterByIphone12() {
    const iphone12Checkbox = await this.page.waitForSelector(
      "//a[@data-id='iPhone 12']"
    );
    await iphone12Checkbox.click();
  }


  async filterByIphone13() {
    const iphone13Checkbox = await this.page.waitForSelector(
      "//a[@data-id='iPhone 13']"
    );
    await iphone13Checkbox.click();
  }


  async clickOnlyAvailable() {
    const availableOnlyCheckbox = await this.page.waitForSelector(
      "//a[@data-id='Є в наявності']",
    );
    await availableOnlyCheckbox.click();
  }

  async sortByPrice() {
    const priceSortSelect = await this.page.waitForSelector(
      "//select[@_ngcontent-rz-client-c95='']"
    );
    await priceSortSelect.selectOption({ index: 1 });
  }

  async assertPricesInAscendingOrder(priceLocators) {
    let previousPrice = null;
    for (const priceLocator of priceLocators) {
      const price = await priceLocator.innerText();
      const numericPrice = parseInt(price.replace(/&nbsp;/g, '').trim());
      if (previousPrice !== null && numericPrice < previousPrice) {
        return false;
      }
      previousPrice = numericPrice;
    }
    return true;
  }
  async assertTitlesContainIphone12Or13(titleLocators) {
    for (const title of titleLocators) {
      const titleText = await title.innerText();
      if (!/iphone\s*1[23]/i.test(titleText)) {
        return false;
      }
    }
    return true;
  }


  //2nd test
  async addToCartFirstItem() {
    const firstItem = await this.page.waitForSelector(
      "(//button[@class='buy-button goods-tile__buy-button ng-star-inserted'])[1]"
    );
    await firstItem.click();
  }
  async clickCatalogue() {
    const catalogue = await this.page.waitForSelector(
      "//button[@aria-label='Каталог']"
    );
    await catalogue.click();
  }

  async clickLaptops() {
    const laptops = await this.page.waitForSelector(
      "(//a[@class='menu__hidden-title'])[1]"
    );
    await laptops.click();
  }

  async clickCart() {
    const cart = await this.page.waitForSelector(
      "//li[@class='header-actions__item header-actions__item--cart']"
    );
    await cart.click();
  }

  async isCartValueTwo() {
    const spanElement = await this.page.waitForSelector("//span[@class='badge badge--green ng-star-inserted']");
    const textContent = await spanElement.innerText();
    return textContent.trim() === '2';
  }

  async areTwoElementsVisible() {
    const elements = await this.page.$$("//a[@data-testid='title']");
    //failing test on purpose by putting 1
    return elements.length === 1;
  }
  //test 3 
  async enterRandomText(text) {
    const input = await this.page.waitForSelector(
      "//input[@name='search']"
    );
    await input.fill(text);
  }
  async clickSearch() {
    const find = await this.page.waitForSelector(
      "//button[@class='button button_color_green button_size_medium search-form__submit ng-star-inserted']"
    );
    await find.click();
  }

  async assertTitleContainKeywordLenovo(titleLocators) {
    for (const title of titleLocators) {
      const titleText = await title.innerText();
      if (!/lenovo/i.test(titleText)) {
        return false;
      }
    }
    return true;
  }


}
module.exports = RozetkaHomePage;