// content_script.js
//Config
tileWidth = '160px'; //One tile width
maxImageHeight = '105px'; //Max image height
addToCartHeight = '25px'; //the height of "- Qty +"
descriptionCharacterLimit = 50; //it gets cut after that
// Function to modify each article
function modifyArticle(article) {
  // Step 1: Change article width to 250px
  article.style.width = tileWidth;
  article.style.border = '1px solid #299';
  article.style.borderRadius = '8px';
  article.style.background = 'rgb(250,250,250)';
  article.style.background = 'linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(212,247,247,1) 84%)';
  article.style.marginRight = '3px';
  article.style.marginBottom = '3px';


  // Step 2: Modify DIVs with class "image-box"
  const imageBoxes = article.querySelectorAll('div.image-box');
  imageBoxes.forEach(imageBox => {
      imageBox.style.width = '80%';
      imageBox.style.height = maxImageHeight;
      imageBox.style.padding = '5px';
  });

  // Step 3: Modify DIVs with class "image-container"
  const imageContainers = article.querySelectorAll('div.image-container');
  imageContainers.forEach(imageContainer => {
      imageContainer.style.margin = 'auto';
      imageContainer.style.float = 'none';
      imageContainer.style.height = '100%';
      imageContainer.style.width = '100%';
      
  });
  // Step 3.5: Modify DIVs with class "image"
  const imageDivs = article.querySelectorAll('div.image');
  imageDivs.forEach(imageDiv => {
    imageDiv.style.height = '100%';
    imageDiv.style.width = '100%';
    imageDiv.style.objectFit = 'contain';
    imageDiv.style.overflow = 'hidden';
    imageDiv.style.display = 'inline-block';
  });

  // Step 4: Modify image src containing ".t1.png" to ".t2.png"
  const images = article.querySelectorAll('img[src*=".t1.png"]');
  images.forEach(image => {
      image.src = image.src.replace('.t1.png', '.t2.png');
      image.style.maxHeight = maxImageHeight;
      image.style.maxWidth = (tileWidth - 45);
      image.style.height = 'auto';
      image.style.width = 'auto';
      image.style.display  = 'block';

      //image.style.maxWidth = '250px';
      image.style.objectFit = 'contain';
  });

  // Step 5: Modify DIVs with class "condition"
  const conditions = article.querySelectorAll('div.condition');
  conditions.forEach(condition => {
    const text = condition.textContent;
    const symbols = ['♻️','🍋','💯','📦','🚧' ];
    const foundSymbols = symbols.filter(symbols => text.includes(symbols));
    if(foundSymbols.length > 0) {
      console.log("Nothing to do.");
    }
    else {
      const keywords = ['Used', 'New', 'Complete', 'Sealed', 'Incomplete'];
      const foundKeywords = keywords.filter(keyword => text.includes(keyword));
      var conditionString = "";
      if(text.includes("Used")){
        conditionString += "♻️\n";
      }
      if(text.includes("New")){
        conditionString += "🍋\n";
      }
      if(text.includes("Complete")){
        conditionString += "💯\n";
      }
      if(text.includes("Sealed")){
        conditionString += "📦\n";
      }
      if(text.includes("Incomplete")){
        conditionString += "🚧";
      }
      condition.setAttribute('title', foundKeywords.join(' '));
      
      condition.textContent = conditionString; //foundKeywords.join(' ');
      condition.style.width = '15%';
      condition.style.height = maxImageHeight;
      condition.style.fontSize = '18px';
      condition.style.padding = '5px 3px';
      condition.style.margin = '0';
    }
  });

  // Step 6: Remove breadcrumb
  
  const breadcrumbs = article.querySelectorAll('ul.bl-breadcrumb');
  breadcrumbs.forEach(breadcrumb => {
    breadcrumb.remove();
  });

  // Step 7: Modify DIVs with class "description"
  const descriptions = article.querySelectorAll('div.description');
  descriptions.forEach(description => {
    description.style.width = '95%';
    description.style.height = '34px';
    description.style.fontSize = '12px';
    description.style.lineHeight = '15px';
    description.style.padding = '3px';
    description.style.textAlign = 'center';
    description.style.paddingTop = '0';
    description.style.overflow = 'hidden';
    text = description.textContent;
    elementsInsideDescription = description.querySelectorAll('div');
    elementsInsideDescription.forEach(element =>{
      element.remove();
    });
    if (text.length > (descriptionCharacterLimit - 20)){
      description.style.lineBreak = 'anywhere';
    }
    if (text.length > descriptionCharacterLimit) {
      const truncatedText = text.slice(0, (descriptionCharacterLimit - 3)) + '...';
      description.innerHTML = truncatedText;
      description.setAttribute('title', text);
    } 
    else{
      description.innerHTML = text;
    }
  });

  // Step Pre-8: Get WANTED LIST info (to integrate it later into BUY info)
  wantedValue = 0;
  const wantedContainers =  article.querySelectorAll('div.in-wanted-list');
  wantedContainers.forEach(wantedContainer => {
    wantedValue = parseInt(wantedContainer.querySelector('span.text').textContent);
    wantedContainer.remove();
  });
  // Step 8: Modify BUY info 
  const buyContainers = article.querySelectorAll('div.buy');
  buyContainers.forEach(buyContainer => {
    var value = 0;
    // Change main buy container style:
    buyContainer.style.width = '97%';
    buyContainer.style.height = '50px';
    buyContainer.style.flexDirection = 'row';
    buyContainer.style.background = 'none';
    buyContainer.style.padding = '0 5px';
    buyContainer.style.marginBottom = '5px';
    console.log("A1");
    //Change p in BUY
    const pInsideBuy = buyContainer.querySelectorAll("p");
    pInsideBuy.forEach(p => {
      if(p.textContent.includes("Quantity: ")){
        p.style.width = '35%';
        p.style.height = '50px';
        p.style.fontSize = '15px';
        p.style.fontWeight = '700';
        p.style.marginRight = '5px';
        p.style.textAlign = 'center';
        p.style.display = 'inline-block';
        p.style.color = "black";
        p.style.borderRadius = '9px';
        p.textContent = p.textContent.replace('Quantity: ', '').replace(',', '');
        p.style.background = "none";
        console.log("A1a: "+p.textContent);
        value = parseInt(p.textContent);
        console.log("A1b");
        if(value > 5){
          p.style.background = 'none'; //"#DBFFB6";
        }
        if(value > 10){
          p.style.background = 'none'; //"#9FF34C";
        }
        if(value > 50){
          p.style.background = 'none'; //"#75D118";
        }
        if(value > 999){
          p.textContent = "999+";
          p.style.background = 'none'; //"#4B7D01";
        }
        else{
          p.textContent = "x"+p.textContent;
        }
        if(wantedValue > 0){
          p.innerHTML += '<br> 📝'+wantedValue+'';
          p.style.fontWeight = '700';
          p.style.lineHeight = '25px';
          if(value > wantedValue){
            p.style.background = "#4B7D01";
          }
          else{
            //p.style.color = "orange";
            p.style.background = "#9FF34C";
          }
        }
        else{
          p.style.lineHeight = '51px';
        }
        
      }
    });
    //Change div in BUY
    const divInsideBuy = buyContainer.querySelectorAll("div");
    console.log("A2");
    divInsideBuy.forEach(div => {
      //If it contains "PRICE"
      const text = div.textContent;
      if(text.includes("Price")){
        //Remove all span
        const spans = div.querySelectorAll('span');
        spans.forEach(span => {
          span.remove();
        });
        //Strong = main currency
        const strong = div.querySelector('strong');
        console.log("LAAA: "+strong.textContent);
        mainCurrency = getCurrencyAndValue(strong.textContent);
        //p = second currency
        console.log("LAAA1.9");
        pWithSecondCurrency = div.querySelector('p');
        if(pWithSecondCurrency){
          console.log("LAAA2: "+div.querySelector('p').textContent);
          secondCurrency = getCurrencyAndValue(div.querySelector('p').textContent);
          div.innerHTML = mainCurrency[1]+" "+mainCurrency[0]+"<br>"+secondCurrency[1]+" "+secondCurrency[0];
          div.style.lineHeight = '23px';
        }
        else{
          div.innerHTML = mainCurrency[1]+" "+mainCurrency[0]+"";
          div.style.lineHeight = '45px';
        }
        div.style.borderRadius = '9px';
        div.style.height = '50px';
        div.style.background = 'none';
        /*
        div.textContent = div.textContent.replace('Price: ', '');
        div.textContent = div.textContent.replace('(', '\n');
        */
        div.style.width = '65%';
        div.style.marginRight = '5px';
        div.style.fontSize = '13px';
        div.style.display = 'inline-block';
        div.style.textAlign = 'center';
      }
      else{//If it doesnt contain "PRICE" (then it's add to cart):
        //div.style.background = 'none';
        div.style.borderRadius = '9px';
        div.style.background = 'none';
        div.style.padding = 0;
        div.style.height = '47px';
        div.style.textAlign = 'center';
        const labels = div.querySelectorAll('.add-label');
        labels.forEach(label => {
            if (label.textContent === 'Add to Cart') {
                console.log("A3");
                label.remove();
            }
          });
        const inputThing = div.querySelector('.addToCartQty');
        console.log(inputThing.innerHTML);
        inputThing.style.width = '50px';
        inputThing.style.height = addToCartHeight;
        inputThing.style.webkitAppearance = "none";
        inputThing.style.mozAppearance = "none";
        inputThing.style.margin = '0';
        inputThing.style.padding = '0';
        customizeButtons(buyContainer, value);
        //Move ADD TO CART one level up
        const parentParentElement = div.parentElement.parentElement;
        parentParentElement.appendChild(div);
        div.style.width = '95%';
        div.style.margin = 'auto';
        div.style.textAlign = 'center';
        div.style.display = 'inline-block';
      }
    });
  });
  
}

// Step Post-8 - function to add + customize increment and decrement buttons

function customizeButtons(whereToScan, availableNumber) {
  console.log("AAAAA");
  const addToCartDivs = whereToScan.querySelectorAll('.addToCart');

  addToCartDivs.forEach(div => {
    console.log("BBB");
      const input = div.querySelector('.addToCartQty');
      input.style.appearance = 'textfield';
      input.style.display = 'inline-block';
      input.style.verticalAlign = 'top';
      input.style.borderRadius = '0';
      input.style.border = '2px solid #008CBA';
      input.style.fontSize = '20px';
      input.style.textAlign = 'center';
      input.style.fontWeight = '700';
      input.placeholder = '';

      console.log("BBB2");
      const incrementButton = document.createElement('button');
      console.log("BBB2.5");
      incrementButton.className = 'increment-button';
      incrementButton.textContent = '+';
      incrementButton.style.width = '35px';
      incrementButton.style.height = addToCartHeight;
      incrementButton.style.fontSize = '28px';
      incrementButton.style.fontWeight = '700';
      incrementButton.style.margin = '700';
      incrementButton.style.padding = '700';
      incrementButton.style.lineHeight = '15px';
      incrementButton.style.borderRadius = '0 10px 10px 0';
      incrementButton.style.border = 'none';
      incrementButton.style.outline = 'none';
      incrementButton.style.display = 'inline-block';
      incrementButton.style.verticalAlign = 'top';
      incrementButton.addEventListener('click', () => {
        if(!input.value || input.value == ""){
          input.value = 1;
        }
        else if(input.value < availableNumber){
          input.value = parseInt(input.value) + 1;
          //input.stepDown();
        }
        triggerOnChange(input);
        //input.stepUp();
      });

      console.log("BBB3");
      const decrementButton = document.createElement('button');
      decrementButton.className = 'decrement-button';
      decrementButton.textContent = '-';
      decrementButton.style.width = '35px';
      decrementButton.style.height = addToCartHeight;
      decrementButton.style.fontSize = '28px';
      decrementButton.style.fontWeight = '700';
      decrementButton.style.margin = '700';
      decrementButton.style.padding = '700';
      decrementButton.style.lineHeight = '15px';
      decrementButton.style.borderRadius = '10px 0 0 10px';
      decrementButton.style.border = 'none';
      decrementButton.style.outline = 'none';
      decrementButton.style.display = 'inline-block';
      decrementButton.style.verticalAlign = 'top';
      decrementButton.addEventListener('click', () => {
        if(!input.value || input.value == ""){
          input.value = 0;
        }
        else if(input.value > 0){
          input.value = parseInt(input.value) - 1;
          //input.stepDown();
        }
        triggerOnChange(input);
      });

      console.log("BBB4");
      const span = div.querySelector('span');
      span.prepend(decrementButton);
      span.appendChild(incrementButton);
      const inCart = span.querySelectorAll('span.cart-qty');
      console.log("XYZ0000");
      inCart.forEach(singleInCart => {
        console.log("XYZ1111");
        span.appendChild(singleInCart);
        console.log("IN CAAAAAAAAAAAAAAAAAAAAART: "+singleInCart.textContent)
        singleInCart.textContent = singleInCart.textContent.replace("in cart","");
        singleInCart.textContent = "🛒"+singleInCart.textContent;
        singleInCart.style.fontSize = "14px";
        singleInCart.style.lineHeight = "20px";
        singleInCart.style.height = "18px";
        singleInCart.style.margin = "2px";
        singleInCart.style.display = "inline-block";
        singleInCart.style.width = "70%";
        singleInCart.style.backgroundColor = "#336600";
        singleInCart.style.color = "white";
        singleInCart.style.borderRadius = "5px";
      });
      

      //div.appendChild(span);
  });
}

function triggerOnChange(input) {
  const onChangeEvent = new Event('change', { bubbles: true });
  input.dispatchEvent(onChangeEvent);

  const onKeyDownEvent = new KeyboardEvent('keydown', { keyCode: 13 });
  input.dispatchEvent(onKeyDownEvent);
}

//Getting an array with [0] = currency, and [1] = value
function getCurrencyAndValue(inputString){
  console.log("INPUT STRING 1: "+inputString);
  if(inputString == "" || !inputString || inputString == " "){
    return ["" , ""];
  }
  console.log("INPUT STRING 2: "+inputString);
  fixedText = inputString.replace('~', '').replace("(","").replace(')', '');
  const words = fixedText.split(' ');
  console.log("INPUT STRING FIXED 1: "+fixedText);
  if (words.length >= 2) {
    // Convert the second word to a number and limit it to 2 decimal places
    const secondWord = parseFloat(words[1]).toFixed(2);
    console.log("INPUT STRING SECOND: "+secondWord);
    if(!isNaN(secondWord)){ //if a number is parsed, limit it to 2 decimal
      words[1] = secondWord;
    }
  }
  return words;

}
// Function to modify all articles on the page
function modifyPage() {
  
  // Step A: Remove breadcrumb
  
  const tableheaders = document.querySelectorAll('div.table-header');
  tableheaders.forEach(tableheader => {
    tableheader.remove();
  });

  // Step B: Modify articles (each found item)
  const articles = document.querySelectorAll('article.item.component.table-row');
  articles.forEach(article => {
      modifyArticle(article);
  });
}


// Define your custom CSS rules
const customCSS = `
    /* Your custom CSS rules here */
    .bl-3 .notification-inline--success {
      display: none;
    }
    .decrement-button {
      background-color: #008CBA;
    }
    .decrement-button:hover {
      background-color: #1ac6ff;
    }
    .increment-button {
      background-color: #008CBA;
    }
    .increment-button:hover {
      background-color: #1ac6ff;
    }
    .cart-qty {
      display: none;
      /*
      font-size = 14px;
      line-height = 20px;
      height = 18px;
      margin = 2px;
      display = inline-block;
      width = 70%;
      background-color = #336600;
      color = white;
      border-radius = 5px;
      */
    }
    .anchor-to-top {
      display: none;
    }
    .table-view .add-wanted {
      top: 75%;
      left: 110%;
    }
`;

// Function to inject the custom CSS
function injectCustomCSS() {
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
}

  // Listen for messages from the background script
  browser.runtime.onMessage.addListener(function (message) {
    if (message.action === "modifyPage") {
      modifyPage();
    }
  });
  
  // Trigger the modifications immediately upon injection
  modifyPage();
  injectCustomCSS();