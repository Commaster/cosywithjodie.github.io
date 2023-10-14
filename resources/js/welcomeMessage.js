window.onload = function() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      var viewport = document.querySelector('meta[name="viewport"]');
      if (window.innerWidth / window.innerHeight > 1) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=0.1, maximum-scale=0.1, user-scalable=0');
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=0.6, maximum-scale=0.6, user-scalable=0');
      }
    }
  
    Swal.fire({
      title: 'Welcome to CosyWithJodie Bingo!',
      text: 'This is a randomly generated bingo card dedicated to the CosyWithJodie streams.',
      imageUrl: 'resources/images/logo.png',
      imageAlt: 'CosyWithJodie Bingo logo',
      showCloseButton: true,
      reverseButtons: true
    }).then((result) => {

    });
  }