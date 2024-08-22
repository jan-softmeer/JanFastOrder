import Plugin from 'src/plugin-system/plugin.class';


export default class JanFastOrderPlugin extends Plugin {
    
    static products = [];
    static divResults;
    static activeIndex = -1;
    static mainPrice = 0;
    static totalPrice = 0;
    static amountSearchArticleInputs = 0;
    static currentFocusedInput;

    init() {
        JanFastOrderPlugin.currencySymbol = JSON.parse(this.el.dataset.janfastorderPluginCurrencySymbol);

        document.querySelector("#total-price span.symbol").innerText = JanFastOrderPlugin.currencySymbol;
        document.querySelector("#total-price span.price").innerText = JanFastOrderPlugin.totalPrice.toFixed(2);
        
        JanFastOrderPlugin.divResults = document.querySelector("div.search-articles-results");
        JanFastOrderPlugin.products = JSON.parse(JSON.parse(this.el.dataset.janfastorderPluginOptions));
        
        document.querySelector(".add-more-inputs").addEventListener("click", () => {
            this.addMoreInputs(1);
        })

        this.addMoreInputs(3);

        document.querySelector("#submit-fast-order").addEventListener("submit", (event) => this.formSubmit(event));


        JanFastOrderPlugin.csvFileInput = document.getElementById('csvFileInput');

        document.getElementById('upload-csv').addEventListener('click', () => JanFastOrderPlugin.csvFileInput.click());
        JanFastOrderPlugin.csvFileInput.addEventListener('change', (event) => {this.handleFileSelect(event)});



        // close Result Div 
        document.addEventListener('click', (event) => {
            const clickedInsideSearch = Array.from(document.querySelectorAll(".search-articles")).some(element => element.contains(event.target));

            if (!JanFastOrderPlugin.divResults.contains(event.target) && !clickedInsideSearch) {
                this.closeResultDiv();
            }
        });
    }

    searchArticle(event, inputSearchArticle, needToSetPriceToZero = true) {
        const valueInputSearchArticle = inputSearchArticle.value;

        const matchingProducts = Object.values(JanFastOrderPlugin.products).filter(product => 
            product.productNumber.toUpperCase().includes(valueInputSearchArticle.toUpperCase()) ||
            (product.name && product.name.toUpperCase().includes(valueInputSearchArticle.toUpperCase()))
        );
        
        this.displayResults(matchingProducts);

        if(needToSetPriceToZero) {
            inputSearchArticle.dataset.id = "";
            inputSearchArticle.dataset.price = "";
        }

        this.updatePrice();
    }

    displayResults(products) {
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
            productElement.dataset.productNumber = product.productNumber;
            productElement.dataset.price = product.grossPrice;
            productElement.dataset.stock = product.availableStock;


            let productElement_innerHTML = ''

            productElement_innerHTML = `
                <div>
                    <img src="${product.mediaUrl}" alt="Product Img" />
                </div>
                <div>
                    <p><b>${product.name}</b></p>
                    <p><small>Product number: ${product.productNumber}</small></p>
                    <p class="price">€ ${product.grossPrice}</p>

                    ${  
                        product.shippingFree? `
                            <div class="container-free-shipping">
                                <p class="point"></p>
                                <p>Free shipping</p>
                            </div>` : ``
                    }

                </div>`;


            productElement.innerHTML = productElement_innerHTML;

            productElement.addEventListener("click", () => {
                const items = resultsContainer.querySelectorAll(".result-item");

                JanFastOrderPlugin.activeIndex = productElement.dataset.index;
                this.enterProductIntoInput(items, JanFastOrderPlugin.currentFocusedInput);
            })

            resultsContainer.appendChild(productElement);
        });
    }

    onFocus(event, inputSearchArticle) {
        const resultsContainer = JanFastOrderPlugin.divResults;
        resultsContainer.classList.add("show");

        this.searchArticle(event, inputSearchArticle, false);

        JanFastOrderPlugin.currentFocusedInput = inputSearchArticle;

        const inputRect = inputSearchArticle.getBoundingClientRect();

        resultsContainer.style.top = `${inputRect.bottom + window.scrollY - 3}px`;
        resultsContainer.style.left = `${inputRect.left + window.scrollX}px`;
        resultsContainer.style.width = `${inputRect.width}px`;
    }

    closeResultDiv() {
        const resultsContainer = JanFastOrderPlugin.divResults;

        JanFastOrderPlugin.currentFocusedInput = "";

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
            event.preventDefault();
            this.enterProductIntoInput(items, inputSearchArticle);
        }
    }

    enterProductIntoInput(items, inputSearchArticle) {
        this.closeResultDiv();

        if (JanFastOrderPlugin.activeIndex >= 0 && JanFastOrderPlugin.activeIndex < items.length) {

            const selectedItem = items[JanFastOrderPlugin.activeIndex];
            const productId = selectedItem.dataset.id;
            inputSearchArticle.dataset.id = productId;
            inputSearchArticle.dataset.price = selectedItem.dataset.price;
            inputSearchArticle.value = selectedItem.dataset.productNumber;

            
            const enterQuantity = document.querySelector("#" + inputSearchArticle.dataset.idEnterQuantity)
            if(enterQuantity) {
                if(!enterQuantity.value || enterQuantity.value == 0) {
                    enterQuantity.value = 1;
                }

                enterQuantity.max = selectedItem.dataset.stock;
            }
            
            this.updatePrice();
            this.closeResultDiv();
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

    addMoreInputs(amount = 1, product, quantity = "") {
        const container_allInputsSearchArticle = document.querySelector(".all-inputs-search-article");

        let amountSearchArticleInputs = JanFastOrderPlugin.amountSearchArticleInputs;

        if(container_allInputsSearchArticle) {
            for(let i = amountSearchArticleInputs; (amountSearchArticleInputs + amount) > i; i++) {
                
                const div_rowFastOrder = document.createElement("div");
                div_rowFastOrder.classList.add("row-fast-order");
                div_rowFastOrder.innerHTML = `
                    <div class="div-search-articles">
                        <input type="text" id='search-article${i}' name='search-article${i}' 
                            class="form-control search-articles" placeholder="Search article..."
                            data-id-enter-quantity='enter-quantity${i}' 
                            data-id-container-main-price='container-main-price${i}' 
                            ${product? 'data-id="' +product.id+ '" data-price="' +product.grossPrice+ '" value="'+ product.productNumber +'"' : ''} />
                    </div>
                    <div class="div-enter-quantity">
                        <input type="number" id='enter-quantity${i}' name='enter-quantity${i}' class="form-control enter-quantity" ${product? 'value="'+ quantity +'"' : ''} min="0" step="1" max="${product? product.availableStock : '100'}" placeholder="Quantity">
                    </div>
                `;
    
                const div_rowFastOrder_showPrice = document.createElement("div");
                div_rowFastOrder_showPrice.id= 'container-main-price' + i;
                div_rowFastOrder_showPrice.classList.add("row-fast-order", "show-price");
                div_rowFastOrder_showPrice.innerHTML = `
                    <p class="small"><b>Main product</b></p>
                    <div class="main-prices">
                        <span class="symbol"></span><span class="price"></span>
                    </div>
                `;

                container_allInputsSearchArticle.appendChild(div_rowFastOrder);
                container_allInputsSearchArticle.appendChild(div_rowFastOrder_showPrice);

                setTimeout(() => {
                    const inputSearchArticle = div_rowFastOrder.querySelector("input.search-articles");
                    inputSearchArticle.addEventListener("focus", (event) => this.onFocus(event, inputSearchArticle));
                    inputSearchArticle.addEventListener("input", (event) => this.searchArticle(event, inputSearchArticle));
                    // inputSearchArticle.addEventListener("blur", () => this.closeResultDiv());
                    inputSearchArticle.addEventListener("keydown", (event) => this.onKeyDown(event, inputSearchArticle));
                    
                    const inputEnterQuantity = div_rowFastOrder.querySelector("input.enter-quantity");
                    inputEnterQuantity.addEventListener("input", (event) => this.updatePrice());

                    div_rowFastOrder_showPrice.querySelector(".main-prices span.symbol").innerText = JanFastOrderPlugin.currencySymbol;
                }, 10)


                JanFastOrderPlugin.amountSearchArticleInputs++;
            }
        }
    }

    formSubmit(event) {
        event.preventDefault();

        const submitButton = document.querySelector("#submit-form")
        if(submitButton) {
            submitButton.disabled = true;
        }
        
        const form = document.querySelector("#submit-fast-order");
        const formData = new FormData(form);


        const articlesQuantities = {};
        let isSaveable = true;

        console.log(JanFastOrderPlugin.products);
        

        for (let [key, value] of formData.entries()) {

            if (key.startsWith('search-article')) {

                const index = key.replace('search-article', '');
                const quantityKey = `enter-quantity${index}`;
                const quantity = formData.get(quantityKey);

                if (value && quantity) {
                    const input = document.getElementById(key)
                    const productId = input.dataset.id

                    const filtered_products = JanFastOrderPlugin.products.filter(product => product.id == productId);
                    if(filtered_products.length == 0) {
                        alert("Product with Product-number '"+ input.value.trim() +"' doesnt exist");
                        isSaveable = false;

                    } else {
                        
                        if(articlesQuantities[productId] != undefined) {
                            articlesQuantities[productId] += Number(quantity)
                            
                        } else {
                            articlesQuantities[productId] = Number(quantity);
                        }
                        
                        const product = filtered_products[0];
                        if(product.availableStock < articlesQuantities[productId]) {
                            alert("Product with Product-number '"+ input.value.trim() +"' has "+ product.availableStock +" in stock. (You entered more)");
                            isSaveable = false;
                        }
                    }
                }
            }
        }


        if(isSaveable) {
            fetch('/fastorder/submit-xml', {
                method: 'POST',
                body: JSON.stringify(articlesQuantities),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
                // add CSRF-Token
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/checkout/cart';
    
                } else {
                    alert(data.message);
                    
                    if(submitButton) {
                        submitButton.disabled = false;
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            if(submitButton) {
                submitButton.disabled = false;
            }
        }
    }


    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
    
        const reader = new FileReader();
        reader.onload = (fileEvent) => {
            const lines = fileEvent.target.result.split('\n');

            lines.forEach((line) => {
                let [productNumber, quantity] = line.split(';');
                
                if(productNumber && quantity) {
                    productNumber = productNumber.trim();
                    quantity = Number(quantity.trim());
    
                    if (productNumber && quantity > 0) {
                        const productArray = JanFastOrderPlugin.products.filter(product => product.productNumber == productNumber);

                        if(productArray.length > 0) {
                            const product = productArray[0];

                            if(product.availableStock < quantity) {
                                quantity = product.availableStock;
                            }

                            this.addMoreInputs(1, product, quantity);
                        }
                    }

                    this.updatePrice();
                }
            });
        };

        reader.readAsText(file);


        JanFastOrderPlugin.csvFileInput.value = '';
    }
}
