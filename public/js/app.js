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

// event listener onchange form change Basal Metabolic Rate (BMR)
$('#form-calories').on('change', function() {
  let weight = parseInt($('#weight').val());
  let height = parseInt($('#height').val());
  let age = parseInt($('#age').val());
  let gender = $("input[name='gender']:checked").val();
  let total = 0;

  if (gender == 'male') {
    total = 13.397*weight + 4.799*height - 5.677*age + 88.362; // sourced from https://www.calculator.net/bmr-calculator.html
  } else if (gender == 'female') {
    total = 9.247*weight + 3.098*height - 4.330*age + 447.593;
  }

  localStorage.setItem('total', total);
  localStorage.getItem('total')
  $('#optimal-calories').html(total.toFixed(1));
  $('input#baseCalories').val(total.toFixed(1));
});

// event listener on tabbing
$( function() {
  $("#tabs").tabs();
} );