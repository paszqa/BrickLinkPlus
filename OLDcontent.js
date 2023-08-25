// content.js
function modifyArticle(article) {
    const recursiveSearch = (element) => {
      if (element.tagName === "IMG") {
        const imageUrl = element.getAttribute("src");
        const imageUrlParts = imageUrl.replace("https://", "").split("/");
        console.log("Img URL Parts: "+imageUrlParts);
        const partColor = imageUrlParts[5];
        const partId = imageUrlParts[6].split(".")[0];
  
        const newImageUrl = imageUrl.replace("/PT/", "/PT/").replace(".t1.png", ".t2.png");
        element.setAttribute("src", newImageUrl);
  
      // Generate the URL with partId and partColor variables
      const url = `https://store.bricklink.com/v2/catalog/catalogitem.page?P=${partId}#T=P&C=${partColor}`;
      console.log("URL: "+url);
        // Add a new div displaying the partId and partColor
        /*
      const partInfoDiv = document.createElement("div");
      partInfoDiv.textContent = `<a href="google.com"> Part ID</a>: ${partId}, Color: ${partColor}`;
      */
      // Create a placeholder div for the content
      const partInfoDiv = document.createElement("div");
      partInfoDiv.innerHTML = `Part ID: ${partId}, Color: ${partColor}<br>Loading...`;
      element.parentElement.parentElement.parentElement.parentElement.appendChild(partInfoDiv);

      // Fetch the content from the URL and update the div with the fetched content
      fetchContent(url, partId, partColor, partInfoDiv);
    }
    // Modify div widths
    if (element.tagName === "DIV" && element.classList.contains("description")) {
      element.style.width = "25%";
    }

    if (element.tagName === "DIV" && element.classList.contains("condition")) {
      element.style.width = "5%";
    }

    if (element.tagName === "DIV" && element.classList.contains("buy")) {
        element.style.width = "12%";
      }
    for (const child of element.children) {
      recursiveSearch(child);
    }
  };
  
    // Perform recursive search starting from the article element
    recursiveSearch(article);
  }

  function fetchContent(url, partId, partColor, partInfoDiv) {
    console.log("FETCHING! "+partId ," - ", partColor, " - Stage 1");
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log("FETCHING from ", url, " - ", partId ," - ", partColor, " - Stage 2");
        let timeout = 0;
        const interval = setInterval(() => {
          timeout += 100;
          console.log("FETCHING! "+partId ," - ", partColor, " - Stage 3");
          const contentElement = doc.querySelector("table.pcipgSummaryTable");
          console.log("Found that many pcipgSummaryTable: "+contentElement.length);
          if (contentElement && contentElement.textContent.includes("Avg price")) {
            clearInterval(interval);
            partInfoDiv.innerHTML = `Part ID: ${partId}, Color: ${partColor}<br>Content: ${contentElement.textContent.trim()}`;
          } else if (timeout >= 5000) {
            clearInterval(interval);
            partInfoDiv.innerHTML = `Part ID: ${partId}, Color: ${partColor}<br>Content: Not available`;
          }
        }, 100);
      })
      .catch((error) => {
        console.log("Error fetching content:", error);
      });
  }

  
  function handlePageModification() {
    const articles = document.querySelectorAll("article.item.component.table-row");
    articles.forEach(modifyArticle);
  }
  
  // Listen for messages from the background script
  browser.runtime.onMessage.addListener(function (message) {
    if (message.action === "modifyPage") {
      handlePageModification();
    }
  });
  
  // Trigger the modifications immediately upon injection
  handlePageModification();