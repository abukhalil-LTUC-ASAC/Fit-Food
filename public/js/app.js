'use strict';

// hide and show filters in home page
$(document).ready(function () {
  $('#refine').click(function () {
    $('#filter').slideToggle();
  });
});

// favorit icon
$('.fav').on({
  mouseenter: function () {
    $('.favIcon').css('color', '#F46B45');
    $('.favIcon').removeClass('far');
    $('.favIcon').addClass('fas');
  },
  mouseleave: function () {
    $('.favIcon').css('color', '#646363');
    $('.favIcon').removeClass('fas');
    $('.favIcon').addClass('far');
  },
  click: function () {
    $('.favIcon').css('color', '#F46B45');
    $('.favIcon').removeClass('far');
    $('.favIcon').addClass('fas');
  },
});
