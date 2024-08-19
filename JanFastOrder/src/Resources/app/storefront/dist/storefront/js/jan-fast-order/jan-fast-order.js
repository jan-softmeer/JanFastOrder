(()=>{"use strict";var e={857:e=>{var t=function(e){var t;return!!e&&"object"==typeof e&&"[object RegExp]"!==(t=Object.prototype.toString.call(e))&&"[object Date]"!==t&&e.$$typeof!==r},r="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(e,t){return!1!==t.clone&&t.isMergeableObject(e)?o(Array.isArray(e)?[]:{},e,t):e}function n(e,t,r){return e.concat(t).map(function(e){return i(e,r)})}function s(e){return Object.keys(e).concat(Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(t){return Object.propertyIsEnumerable.call(e,t)}):[])}function a(e,t){try{return t in e}catch(e){return!1}}function o(e,r,c){(c=c||{}).arrayMerge=c.arrayMerge||n,c.isMergeableObject=c.isMergeableObject||t,c.cloneUnlessOtherwiseSpecified=i;var l,u,d=Array.isArray(r);return d!==Array.isArray(e)?i(r,c):d?c.arrayMerge(e,r,c):(u={},(l=c).isMergeableObject(e)&&s(e).forEach(function(t){u[t]=i(e[t],l)}),s(r).forEach(function(t){(!a(e,t)||Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))&&(a(e,t)&&l.isMergeableObject(r[t])?u[t]=(function(e,t){if(!t.customMerge)return o;var r=t.customMerge(e);return"function"==typeof r?r:o})(t,l)(e[t],r[t],l):u[t]=i(r[t],l))}),u)}o.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce(function(e,r){return o(e,r,t)},{})},e.exports=o}},t={};function r(i){var n=t[i];if(void 0!==n)return n.exports;var s=t[i]={exports:{}};return e[i](s,s.exports,r),s.exports}(()=>{r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t}})(),(()=>{r.d=(e,t)=>{for(var i in t)r.o(t,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}})(),(()=>{r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e=r(857),t=r.n(e);class i{static ucFirst(e){return e.charAt(0).toUpperCase()+e.slice(1)}static lcFirst(e){return e.charAt(0).toLowerCase()+e.slice(1)}static toDashCase(e){return e.replace(/([A-Z])/g,"-$1").replace(/^-/,"").toLowerCase()}static toLowerCamelCase(e,t){let r=i.toUpperCamelCase(e,t);return i.lcFirst(r)}static toUpperCamelCase(e,t){return t?e.split(t).map(e=>i.ucFirst(e.toLowerCase())).join(""):i.ucFirst(e.toLowerCase())}static parsePrimitive(e){try{return/^\d+(.|,)\d+$/.test(e)&&(e=e.replace(",",".")),JSON.parse(e)}catch(t){return e.toString()}}}class n{static isNode(e){return"object"==typeof e&&null!==e&&(e===document||e===window||e instanceof Node)}static hasAttribute(e,t){if(!n.isNode(e))throw Error("The element must be a valid HTML Node!");return"function"==typeof e.hasAttribute&&e.hasAttribute(t)}static getAttribute(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if(r&&!1===n.hasAttribute(e,t))throw Error('The required property "'.concat(t,'" does not exist!'));if("function"!=typeof e.getAttribute){if(r)throw Error("This node doesn't support the getAttribute function!");return}return e.getAttribute(t)}static getDataAttribute(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2],s=t.replace(/^data(|-)/,""),a=i.toLowerCamelCase(s,"-");if(!n.isNode(e)){if(r)throw Error("The passed node is not a valid HTML Node!");return}if(void 0===e.dataset){if(r)throw Error("This node doesn't support the dataset attribute!");return}let o=e.dataset[a];if(void 0===o){if(r)throw Error('The required data attribute "'.concat(t,'" does not exist on ').concat(e,"!"));return o}return i.parsePrimitive(o)}static querySelector(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if(r&&!n.isNode(e))throw Error("The parent node is not a valid HTML Node!");let i=e.querySelector(t)||!1;if(r&&!1===i)throw Error('The required element "'.concat(t,'" does not exist in parent node!'));return i}static querySelectorAll(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if(r&&!n.isNode(e))throw Error("The parent node is not a valid HTML Node!");let i=e.querySelectorAll(t);if(0===i.length&&(i=!1),r&&!1===i)throw Error('At least one item of "'.concat(t,'" must exist in parent node!'));return i}}class s{publish(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=new CustomEvent(e,{detail:t,cancelable:r});return this.el.dispatchEvent(i),i}subscribe(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=this,n=e.split("."),s=r.scope?t.bind(r.scope):t;if(r.once&&!0===r.once){let t=s;s=function(r){i.unsubscribe(e),t(r)}}return this.el.addEventListener(n[0],s),this.listeners.push({splitEventName:n,opts:r,cb:s}),!0}unsubscribe(e){let t=e.split(".");return this.listeners=this.listeners.reduce((e,r)=>([...r.splitEventName].sort().toString()===t.sort().toString()?this.el.removeEventListener(r.splitEventName[0],r.cb):e.push(r),e),[]),!0}reset(){return this.listeners.forEach(e=>{this.el.removeEventListener(e.splitEventName[0],e.cb)}),this.listeners=[],!0}get el(){return this._el}set el(e){this._el=e}get listeners(){return this._listeners}set listeners(e){this._listeners=e}constructor(e=document){this._el=e,e.$emitter=this,this._listeners=[]}}class a{init(){throw Error('The "init" method for the plugin "'.concat(this._pluginName,'" is not defined.'))}update(){}_init(){this._initialized||(this.init(),this._initialized=!0)}_update(){this._initialized&&this.update()}_mergeOptions(e){let r=i.toDashCase(this._pluginName),s=n.getDataAttribute(this.el,"data-".concat(r,"-config"),!1),a=n.getAttribute(this.el,"data-".concat(r,"-options"),!1),o=[this.constructor.options,this.options,e];s&&o.push(window.PluginConfigManager.get(this._pluginName,s));try{a&&o.push(JSON.parse(a))}catch(e){throw console.error(this.el),Error('The data attribute "data-'.concat(r,'-options" could not be parsed to json: ').concat(e.message))}return t().all(o.filter(e=>e instanceof Object&&!(e instanceof Array)).map(e=>e||{}))}_registerInstance(){window.PluginManager.getPluginInstancesFromElement(this.el).set(this._pluginName,this),window.PluginManager.getPlugin(this._pluginName,!1).get("instances").push(this)}_getPluginName(e){return e||(e=this.constructor.name),e}constructor(e,t={},r=!1){if(!n.isNode(e))throw Error("There is no valid element given.");this.el=e,this.$emitter=new s(this.el),this._pluginName=this._getPluginName(r),this.options=this._mergeOptions(t),this._initialized=!1,this._registerInstance(),this._init()}}class o extends a{init(){o.currencySymbol=JSON.parse(this.el.dataset.janfastorderPluginCurrencySymbol),document.querySelector("#total-price span.symbol").innerText=o.currencySymbol,document.querySelector("#total-price span.price").innerText=o.totalPrice.toFixed(2),o.divResults=document.querySelector("div.search-articles-results"),o.products=JSON.parse(JSON.parse(this.el.dataset.janfastorderPluginOptions)),document.querySelector(".add-more-inputs").addEventListener("click",()=>{this.addMoreInputs(1)}),this.addMoreInputs(3),document.querySelector("#submit-fast-order").addEventListener("submit",e=>this.formSubmit(e)),o.csvFileInput=document.getElementById("csvFileInput"),document.getElementById("upload-csv").addEventListener("click",()=>o.csvFileInput.click()),o.csvFileInput.addEventListener("change",e=>{this.handleFileSelect(e)}),document.addEventListener("click",e=>{let t=Array.from(document.querySelectorAll(".search-articles")).some(t=>t.contains(e.target));o.divResults.contains(e.target)||t||o.divResults.classList.remove("show")})}searchArticle(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2],i=t.value,n=Object.values(o.products).filter(e=>e.productNumber.toUpperCase().includes(i.toUpperCase())||e.name&&e.name.toUpperCase().includes(i.toUpperCase()));this.displayResults(n),r&&(t.dataset.id="",t.dataset.price=""),this.updatePrice()}displayResults(e){let t=o.divResults;if(t.innerHTML="",o.activeIndex=-1,0===e.length){this.closeResultDiv();return}t.classList.add("show"),e.forEach((e,r)=>{let i=document.createElement("div");i.classList.add("result-item"),i.dataset.index=r,i.dataset.id=e.id,i.dataset.productNumber=e.productNumber,i.dataset.price=e.grossPrice,i.dataset.stock=e.availableStock;let n="";n='\n                <div>\n                    <img src="'.concat(e.mediaUrl,'" alt="Product Img" />\n                </div>\n                <div>\n                    <p><b>').concat(e.name,"</b></p>\n                    <p><small>Product number: ").concat(e.productNumber,'</small></p>\n                    <p class="price">€ ').concat(e.grossPrice,"</p>\n\n                    ").concat(e.shippingFree?'\n                            <div class="container-free-shipping">\n                                <p class="point"></p>\n                                <p>Free shipping</p>\n                            </div>':"","\n\n                </div>"),i.innerHTML=n,i.addEventListener("click",()=>{let e=t.querySelectorAll(".result-item");o.activeIndex=i.dataset.index,this.enterProductIntoInput(e,o.currentFocusedInput)}),t.appendChild(i)})}onFocus(e,t){let r=o.divResults;r.classList.add("show"),this.searchArticle(e,t,!1),o.currentFocusedInput=t;let i=t.getBoundingClientRect();r.style.top="".concat(i.bottom+window.scrollY-3,"px"),r.style.left="".concat(i.left+window.scrollX,"px"),r.style.width="".concat(i.width,"px")}closeResultDiv(){let e=o.divResults;o.currentFocusedInput="",e.classList.remove("show"),e.innerHTML=""}onKeyDown(e,t){let r=o.divResults.querySelectorAll(".result-item");"ArrowDown"===e.key?(o.activeIndex=(o.activeIndex+1)%r.length,this.updateActiveItem(r)):"ArrowUp"===e.key?(o.activeIndex=(o.activeIndex-1+r.length)%r.length,this.updateActiveItem(r)):"Enter"===e.key&&(e.preventDefault(),this.enterProductIntoInput(r,t))}enterProductIntoInput(e,t){if(this.closeResultDiv(),o.activeIndex>=0&&o.activeIndex<e.length){let r=e[o.activeIndex],i=r.dataset.id;t.dataset.id=i,t.dataset.price=r.dataset.price,t.value=r.dataset.productNumber;let n=document.querySelector("#"+t.dataset.idEnterQuantity);n&&(n.value&&0!=n.value||(n.value=1),n.max=r.dataset.stock),this.updatePrice(),this.closeResultDiv()}}updateActiveItem(e){if(e.forEach(e=>e.classList.remove("active")),o.activeIndex>=0&&o.activeIndex<e.length){let t=e[o.activeIndex];t.classList.add("active"),t.scrollIntoView({behavior:"smooth",block:"nearest"})}}updatePrice(){o.totalPrice=0,document.querySelectorAll("input.search-articles").forEach(e=>{let t=document.querySelector("#"+e.dataset.idContainerMainPrice),r=document.querySelector("#"+e.dataset.idEnterQuantity),i=t.querySelector(".price");if(t&&i&&r){if(e.value.length>0&&e.dataset.price>0&&r.value.length>0&&r.value>0){let n=Number(r.value)*Number(e.dataset.price);o.totalPrice+=n,t.classList.add("show"),i.innerText=n.toFixed(2);return}t.classList.remove("show"),r.value="",i.innerText="0.00"}}),document.querySelector("#total-price span.price").innerText=o.totalPrice.toFixed(2)}addMoreInputs(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1?arguments[1]:void 0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",i=document.querySelector(".all-inputs-search-article"),n=o.amountSearchArticleInputs;if(i)for(let s=n;n+e>s;s++){let e=document.createElement("div");e.classList.add("row-fast-order"),e.innerHTML='\n                    <div class="div-search-articles">\n                        <input type="text" id=\'search-article'.concat(s,"' name='search-article").concat(s,'\' \n                            class="form-control search-articles" placeholder="Search article..."\n                            data-id-enter-quantity=\'enter-quantity').concat(s,"' \n                            data-id-container-main-price='container-main-price").concat(s,"' \n                            ").concat(t?'data-id="'+t.id+'" data-price="'+t.grossPrice+'" value="'+t.productNumber+'"':"",' />\n                    </div>\n                    <div class="div-enter-quantity">\n                        <input type="number" id=\'enter-quantity').concat(s,"' name='enter-quantity").concat(s,'\' class="form-control enter-quantity" ').concat(t?'value="'+r+'"':"",' min="0" step="1" max="').concat(t?t.availableStock:"100",'" placeholder="Quantity">\n                    </div>\n                ');let n=document.createElement("div");n.id="container-main-price"+s,n.classList.add("row-fast-order","show-price"),n.innerHTML='\n                    <p class="small"><b>Main product</b></p>\n                    <div class="main-prices">\n                        <span class="symbol"></span><span class="price"></span>\n                    </div>\n                ',i.appendChild(e),i.appendChild(n),setTimeout(()=>{let t=e.querySelector("input.search-articles");t.addEventListener("focus",e=>this.onFocus(e,t)),t.addEventListener("input",e=>this.searchArticle(e,t)),t.addEventListener("keydown",e=>this.onKeyDown(e,t)),e.querySelector("input.enter-quantity").addEventListener("input",e=>this.updatePrice()),n.querySelector(".main-prices span.symbol").innerText=o.currencySymbol},10),o.amountSearchArticleInputs++}}formSubmit(e){e.preventDefault();let t=document.querySelector("#submit-fast-order"),r=new FormData(t),i={},n=!0;for(let[e,t]of(console.log(o.products),r.entries()))if(e.startsWith("search-article")){let s=e.replace("search-article",""),a="enter-quantity".concat(s),c=r.get(a);if(t&&c){let t=document.getElementById(e),r=t.dataset.id,s=o.products.filter(e=>e.id==r);if(0==s.length)alert("Product with Product-number '"+t.value.trim()+"' doesnt exist"),n=!1;else{void 0!=i[r]?i[r]+=Number(c):i[r]=Number(c);let e=s[0];e.availableStock<i[r]&&(alert("Product with Product-number '"+t.value.trim()+"' has "+e.availableStock+" in stock. (You entered more)"),n=!1)}}}n&&fetch("/fastorder/submit-xml",{method:"POST",body:JSON.stringify(i),headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}}).then(e=>e.json()).then(e=>{e.success?window.location.href="/checkout/cart":alert(e.message)}).catch(e=>console.error("Error:",e))}handleFileSelect(e){let t=e.target.files[0];if(!t)return;let r=new FileReader;r.onload=e=>{e.target.result.split("\n").forEach(e=>{let[t,r]=e.split(";");if(t&&r){if(t=t.trim(),r=Number(r.trim()),t&&r>0){let e=o.products.filter(e=>e.productNumber==t);if(e.length>0){let t=e[0];t.availableStock<r&&(r=t.availableStock),this.addMoreInputs(1,t,r)}}this.updatePrice()}})},r.readAsText(t),o.csvFileInput.value=""}}o.products=[],o.activeIndex=-1,o.mainPrice=0,o.totalPrice=0,o.amountSearchArticleInputs=0,window.PluginManager.register("JanFastOrderPlugin",o,"[data-janfastorder-plugin]")})()})();