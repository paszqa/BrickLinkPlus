// background.js
function modifyPage(tab) {
    console.log("ABC0-");
    // Inject the content script programmatically
    browser.tabs.executeScript(tab.id, { file: "content.js", runAt: "document_end" }, function() {
      // Send a message to the content script to trigger the modifications
      browser.tabs.sendMessage(tab.id, { action: "modifyPage" });
    });
  }
  
  console.log("ABC1-");
  // Add a click event listener to the browser action button
  browser.browserAction.onClicked.addListener(modifyPage);