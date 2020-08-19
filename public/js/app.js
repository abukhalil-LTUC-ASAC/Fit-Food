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
  generateSports(indexOption);
  // startup values
  startUpValues();
  renderBarChart();

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
  $('#maxCalories').val(parseInt(localStorage.getItem('total') || 2000).toFixed(1)); // calories page
  $('.optimal-calories').html(parseInt(localStorage.getItem('total') || 2000).toFixed(1));
  $('#weight').val(parseInt(localStorage.getItem('weight')));
  $('#height').val(parseInt(localStorage.getItem('height')));
  $('#age').val(parseInt(localStorage.getItem('age')));
  $(`.radio-container input[value="${localStorage.getItem('gender')}"]`).attr('checked','checked');
  $('#thisCalories').html(parseInt(localStorage.getItem('total') || 2000).toFixed(1) + ' Calories');

  $('.pagination *').removeAttr('class'); // pagination
  let btn = parseInt(localStorage.getItem('btn'));
  $(`.pagination a:nth-of-type(${btn})`).attr('class', 'active');
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
  setTimeout(function(){ window.location.replace("/"); }, 2000);
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
  // $("toggleBtn").click(toggleCharts);

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

// option generator on startup
function generateSports(index) {
  let exercise = {
    walking: 267,
    swimming: 492,
    running: 773,
    bicycling: 562,
    football: 494,
  }
  
  let select = $('#sportMeasure');

  $.each(exercise, function(key, value) {
    select
      .append($('<option></option>')
        .attr('value', value)
        .text(key));
  });
}

function activitySubmit() {
  let activity = $('#sportMeasure').find(":selected").val();
  let hours = $('#sportHours').val();
  $('.burned-calories').html(activity*hours);
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

// ------ slideshow ------ //

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "flex";
}

var slideIndex = 0;
autoShowSlides();

function autoShowSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    

  slides[slideIndex-1].style.display = "flex";  
  setTimeout(autoShowSlides, 6000); // Change image every 6 seconds
}


// function toggleCharts() {
//   chart.destroy();

//   if (chartToggle == 1) {
//     renderPieChart();
//     chartToggle = 2;
//   } 
//   else if (chartToggle == 2) {
//     renderBarChartTotal();
//     chartToggle = 3;
//   }
//   else if (chartToggle == 3) {
//     renderBarChart();
//     chartToggle = 1;
//   }
// }

function renderBarChart(){
  var chartDiv = document.getElementById('myChart').getContext('2d'); // canvas drawing
  chartDiv.innerHTML = '';
  let chart = new Chart(chartDiv, {
    type: 'bar',
    data: {
      labels : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets : [
      {
        label: 'Average Caloric %',
        backgroundColor: '#7d5353',
        data : [89,99,120,90,85,83,80]
      },
      {
        type: 'line',
        label: "Average Fat %",
        fill: false,
        data: [94,110,100,85,45,63,86],
      },
    ]}
  })
}
