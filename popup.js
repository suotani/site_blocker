document.getElementById('toggleButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: "toggleBlock" }, (response) => {
    if (response.status) {
      alert("Start site blocking 60min");
    } else {
      alert("Blocking failed");
    }
  });
});
