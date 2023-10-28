function capture() {
// Get the specific element you want to capture
    var elementToCapture = document.getElementById('game');
  
    // Hide the elements you want to exclude from the screenshot
    var elementsToHide = elementToCapture.querySelectorAll('.refreshButton, .user-count, .the-team, .community, button');
    elementsToHide.forEach(function(element) {
      element.style.display = 'none';
    });

    var elementsToReveal = elementToCapture.querySelectorAll('.timestamp');
    elementsToReveal.forEach(function (element) {
      element.style.display = '';
    })

    // Use html2canvas to capture the modified element
    html2canvas(elementToCapture, {
      windowWidth: 2*elementToCapture.scrollWidth,
      windowHeight: 2*elementToCapture.scrollHeight
    }).then(function(canvas) {
      // Show the hidden elements again
      elementsToHide.forEach(function(element) {
        element.style.display = '';
      });
      elementsToReveal.forEach(function (element) {
        element.style.display = 'none';
      })

      var link = document.createElement('a');
      link.download = `cosywithjodiebingo-${luxon.DateTime.utc().toISODate()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
}