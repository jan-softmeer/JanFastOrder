import Plugin from 'src/plugin-system/plugin.class';


export default class JanFastOrderPlugin extends Plugin {
    
    static products = [];
    static divResults;
    static activeIndex = -1;
    static mainPrice = 0;
    static totalPrice = 0;

    init() {
        JanFastOrderPlugin.currencySymbol = JSON.parse(this.el.dataset.janfastorderPluginCurrencySymbol);
        document.querySelectorAll(".row-fast-order.show-price .main-prices span.symbol").forEach(symbol => {
            symbol.innerText = JanFastOrderPlugin.currencySymbol
        })
        document.querySelectorAll(".row-fast-order.show-price .main-prices span.price").forEach(price => {
            price.innerText = JanFastOrderPlugin.mainPrice.toFixed(2)
        }) 
        document.querySelector("#total-price span.symbol").innerText = JanFastOrderPlugin.currencySymbol
        document.querySelector("#total-price span.price").innerText = JanFastOrderPlugin.totalPrice.toFixed(2)

        JanFastOrderPlugin.products = JSON.parse(this.el.dataset.janfastorderPluginOptions);
        JanFastOrderPlugin.divResults = document.querySelector("div.search-articles-results");

        document.querySelectorAll("input.search-articles").forEach(inputSearchArticle => {
            inputSearchArticle.addEventListener("focus", (event) => this.onFocus(event, inputSearchArticle))
            inputSearchArticle.addEventListener("input", (event) => this.searchArticle(event, inputSearchArticle))
            inputSearchArticle.addEventListener("blur", () => this.closeResultDiv())
            inputSearchArticle.addEventListener("keydown", (event) => this.onKeyDown(event, inputSearchArticle))
        })

        document.querySelectorAll("input.enter-quantity").forEach(inputEnterQuantity => {
            inputEnterQuantity.addEventListener("input", (event) => this.updatePrice())
        })

        document.querySelector("#submit-fast-order").addEventListener("submit", (event) => this.formSubmit(event))
    }

    searchArticle(event, inputSearchArticle, needToSetPriceToZero = true) {
        const query = inputSearchArticle.value;
        const matchingProducts = JanFastOrderPlugin.products.filter(product =>
            product.id.includes(query)
        );

        this.displayResults(matchingProducts);


        if(needToSetPriceToZero) {
            inputSearchArticle.dataset.price = 0;
        }

        this.updatePrice();
    }

    displayResults(products) {
        console.log(products);

        const resultsContainer = JanFastOrderPlugin.divResults;
        resultsContainer.innerHTML = ""; // Clear previous results
        JanFastOrderPlugin.activeIndex = -1;

        if (products.length === 0) {
            this.closeResultDiv()
            return;
        }

        resultsContainer.classList.add("show");

        products.forEach((product, index) => {
            const productElement = document.createElement("div");
            productElement.classList.add("result-item");
            productElement.dataset.index = index;
            productElement.dataset.id = product.id;
            productElement.dataset.price = product.price;
            productElement.dataset.stack = product.stack;
            productElement.innerHTML = `<p>${product.name} - ${product.id} - Stack: ${product.stack}</p>`;

            resultsContainer.appendChild(productElement);
        });
    }

    onFocus(event, inputSearchArticle) {
        const resultsContainer = JanFastOrderPlugin.divResults;
        resultsContainer.classList.add("show");

        this.searchArticle(event, inputSearchArticle, false)

        const inputRect = inputSearchArticle.getBoundingClientRect();

        resultsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
        resultsContainer.style.left = `${inputRect.left + window.scrollX}px`;
        resultsContainer.style.width = `${inputRect.width}px`;
    }

    closeResultDiv() {
        const resultsContainer = JanFastOrderPlugin.divResults;

        resultsContainer.classList.remove("show");
        resultsContainer.innerHTML = "";
    }

    onKeyDown(event, inputSearchArticle) {
        const resultsContainer = JanFastOrderPlugin.divResults;
        const items = resultsContainer.querySelectorAll(".result-item");

        if (event.key === "ArrowDown") {
            JanFastOrderPlugin.activeIndex = (JanFastOrderPlugin.activeIndex + 1) % items.length;
            this.updateActiveItem(items);

        } else if (event.key === "ArrowUp") {
            JanFastOrderPlugin.activeIndex = (JanFastOrderPlugin.activeIndex - 1 + items.length) % items.length;
            this.updateActiveItem(items);

        } else if (event.key === "Enter") {

            event.preventDefault()

            if (JanFastOrderPlugin.activeIndex >= 0 && JanFastOrderPlugin.activeIndex < items.length) {

                const selectedItem = items[JanFastOrderPlugin.activeIndex];
                const productId = selectedItem.dataset.id;
                inputSearchArticle.dataset.id = productId;
                inputSearchArticle.dataset.price = selectedItem.dataset.price;
                inputSearchArticle.value = productId;

                
                const enterQuantity = document.querySelector("#" + inputSearchArticle.dataset.idEnterQuantity)
                if(enterQuantity) {
                    if(!enterQuantity.value || enterQuantity.value == 0) {
                        enterQuantity.value = 1
                    }

                    enterQuantity.max = selectedItem.dataset.stack
                }
                
                this.updatePrice();
                this.closeResultDiv();
            }
        }
    }

    updateActiveItem(items) {
        items.forEach(item => item.classList.remove("active"));
        
        if (JanFastOrderPlugin.activeIndex >= 0 && JanFastOrderPlugin.activeIndex < items.length) {
            const activeItem = items[JanFastOrderPlugin.activeIndex];
            activeItem.classList.add("active");
            activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    updatePrice() {
        JanFastOrderPlugin.totalPrice = 0;

        document.querySelectorAll("input.search-articles").forEach(inputSearchArticle => {
            const containerMainPrice = document.querySelector("#" + inputSearchArticle.dataset.idContainerMainPrice);
            const enterQuantity = document.querySelector("#" + inputSearchArticle.dataset.idEnterQuantity);
            const spanPrice = containerMainPrice.querySelector(".price");
            if(!containerMainPrice || !spanPrice || !enterQuantity) {
                return
            }

            if(inputSearchArticle.value.length > 0 && inputSearchArticle.dataset.price > 0 && enterQuantity.value.length > 0 && enterQuantity.value > 0) {

                const itemPrice = (Number(enterQuantity.value) * Number(inputSearchArticle.dataset.price));
                JanFastOrderPlugin.totalPrice += itemPrice;

                containerMainPrice.classList.add("show");
                spanPrice.innerText = itemPrice.toFixed(2);

                return                
            }

            containerMainPrice.classList.remove("show");
            enterQuantity.value = "";
            spanPrice.innerText = (0).toFixed(2);
        })

        document.querySelector("#total-price span.price").innerText = JanFastOrderPlugin.totalPrice.toFixed(2);
    }

    formSubmit(event) {
        event.preventDefault();
        
        const form = document.querySelector("#submit-fast-order");
        const formData = new FormData(form);


        const articlesQuantities = {};

        for (let [key, value] of formData.entries()) {

            if (key.startsWith('search-article')) {
                const index = key.replace('search-article', '');
                const quantityKey = `enter-quantity${index}`;
                const quantity = formData.get(quantityKey);

                if (value && quantity) {
                    if(articlesQuantities[value] != undefined) {
                        articlesQuantities[value] += Number(quantity)

                    } else {
                        articlesQuantities[value] = Number(quantity);
                    }
                }
            }
        }


        // here first verify that no article is langer than stack


        fetch('/fastorder/submit-xml', {
            method: 'POST',
            body: JSON.stringify(articlesQuantities),
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }

            //TODO add CSRF-Token
        })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            if (data.success) {
                // Handle success (e.g., show a success message or redirect)
                console.log('Order added to cart successfully!');

                window.location.href = '/checkout/cart';

            } else {
                // Handle validation errors
                alert('There were errors with your submission.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
