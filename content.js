console.log("📄 Content script injected into Google Docs");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const transcript = request.transcript;
  console.log("🗣️ Received transcript:", transcript);

  // Try to insert text into the Google Docs editable area
  const editable = document.querySelector('[contenteditable="true"]');

  if (editable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(transcript));
    // Move cursor after inserted text
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("❌ Could not find editable area in Google Docs.");
  }
});