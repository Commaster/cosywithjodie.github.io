function capture() {
// Get the specific element you want to capture
    var elementToCapture = document.getElementById('game');
  
    // Hide the elements you want to exclude from the screenshot
    var elementsToHide = elementToCapture.querySelectorAll('.refreshButton, .user-count, .the-team, .community, button');
    elementsToHide.forEach(function(element) {
      element.style.display = 'none';
    });
  
    // Use html2canvas to capture the modified element
    html2canvas(elementToCapture, {
      windowWidth: elementToCapture.scrollWidth,
      windowHeight: elementToCapture.scrollHeight
    }).then(function(canvas) {
      // Show the hidden elements again
      elementsToHide.forEach(function(element) {
        element.style.display = '';
      });
  
      var link = document.createElement('a');
      link.download = 'cosywithjodiebingo.png';
      link.href = canvas.toDataURL();
      link.click();
    });
}