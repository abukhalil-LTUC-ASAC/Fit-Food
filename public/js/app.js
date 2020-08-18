'use strict';
let indexOption = 0;
// hide and show filters in home page
$(document).ready(function () {
  $('#refine').click(function () {
    $('#filter').slideToggle();
  });

  // startup functions
  listeners();
  generateOptions(indexOption);

  // startup values
  startUpValues();

  $('.pagination *').removeAttr('class');
  let btn = parseInt(localStorage.getItem('btn'));
  $(`.pagination a:nth-of-type(${btn})`).attr('class', 'active');

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

// --------------------- Functions --------------------- //

function startUpValues() {
  $('#maxCalories').val(parseInt(localStorage.getItem('total') || 2000).toFixed(1));
  $('.optimal-calories').html(parseInt(localStorage.getItem('total') || 2000).toFixed(1));
  $('#weight').val(parseInt(localStorage.getItem('weight')));
  $('#height').val(parseInt(localStorage.getItem('height')));
  $('#age').val(parseInt(localStorage.getItem('age')));
  $(`.radio-container input[value="${localStorage.getItem('gender')}"]`).attr('checked','checked');
}

function formCaloriesSubmit() {
  // event listener onchange form change Basal Metabolic Rate (BMR)
  let weight = parseInt($('#weight').val());
  let height = parseInt($('#height').val());
  let age = parseInt($('#age').val());
  let gender = $('input[name=\'gender\']:checked').val();
  let total = parseInt(localStorage.getItem('total') || 2000).toFixed(1);

  if (gender === 'male') {
    total = (13.397*weight + 4.799*height - 5.677*age + 88.362).toFixed(1); // sourced from https://www.calculator.net/bmr-calculator.html
  } else if (gender === 'female') {
    total = (9.247*weight + 3.098*height - 4.330*age + 447.593).toFixed(1);
  }
  localStorage.setItem('total', total);
  localStorage.setItem('weight', weight);
  localStorage.setItem('height', height);
  localStorage.setItem('age', age);
  localStorage.setItem('gender', gender);
  $('.optimal-calories').html(total);
  $('input#baseCalories').val(total);
}

function pagination(btn) {
  $('.pagination *').removeAttr('class');
  localStorage.setItem('btn', btn);
  $(`.pagination a:nth-of-type(${btn})`).attr('class', 'active');
}

function resetBtn() {
  localStorage.setItem('btn', 1);
}

// event listener on tabbing
function listeners() {
  $('#tabs').tabs();
  $('#addCalories').click(formCaloriesSubmit);
  $('#addIngredient').click(renderAddIngredient);
  $('#removeIngredient').click(renderRemoveIngredient);
  $('#resetBtn').click(resetBtn);
}

// option generator on startup
function generateOptions(index) {
  let measurements = ['Ounce', 'Gram', 'Pound', 'Kilogram', 'Pinch', 'Liter', 'Fluid ounce', 'Gallon',
    'Pint', 'Quart', 'Milliliter', 'Drop', 'Cup', 'Tablespoon', 'Teaspoon'];
  let select = $('#ingredientMeasure' + index);

  $.each(measurements, function(key, value) {
    select
      .append($('<option></option>')
        .attr('value', value.toLowerCase())
        .text(value));
  });
}

function renderAddIngredient() {
  indexOption ++;

  let template = $('#addTemplate').html();
  let obj = {
    index: 'id' + indexOption,
    name: 'searchIngredient' + indexOption,
    amount: 'ingredientAmount' + indexOption,
    measure: 'ingredientMeasure' + indexOption
  }
  let objRendered = Mustache.render(template,obj);
  $('.template-add-area').append(objRendered);
  generateOptions(indexOption);
}


//---- nabvar responsive -----
function renderRemoveIngredient() {
  $('#id' + indexOption).remove();
  if (indexOption > 0) {
    indexOption --;
  }
}


const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', ()=>{
  //Animate Links
  navLinks.classList.toggle('open');
  links.forEach(link => {
    link.classList.toggle('fade');
  });

  //Hamburger Animation
  hamburger.classList.toggle('toggle');
});
