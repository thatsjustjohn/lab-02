'use strict';
console.log('linked');

let images = [];
let keywords = [];
let template = $('#photo-template');
let currentJSONFilePath = 'data/page-2.json';

//create object constructor
const ImageJSONObject = function(link, title, keyword, horns, description) {
  this.image_url = link;
  this.title = title;
  this.keyword = keyword;
  this.horns = horns;
  this.description = description;

  this.renderImageHTML = function() {
    template.append(
      $('<div></div>')
        .attr('class', this.keyword)
        .append(
          $('<h2></h2>').text(this.title),
          $('<img />').attr({ src: this.image_url, alt: this.title }),
          $('<p></p>').text(this.description)
        )
    );
  };
};

function createFilter() {
  let parent = $('select')[0];
  $('option:not(:first-child)').remove();
  keywords.forEach(element => {
    parent.append(new Option(element, element));
  });
}

//use AJAX to pull in data and render to DOM
function setupPageFromData(dataFilePath){
  $.get(dataFilePath).done(data => {
    createImageJSONObjects(data);
    createFilter();
    renderAllImages();
  });
}


//modify template with new data.
function createImageJSONObjects(imgArr) {
  images = [];
  keywords = [];
  imgArr.forEach(element => {
    if (!keywords.includes(element.keyword)) keywords.push(element.keyword);
    images.push(
      new ImageJSONObject(
        element.image_url,
        element.title,
        element.keyword,
        element.horns,
        element.description
      )
    );
  });
}
//render functions depending on keyword or default
function renderAllImages() {
  template.empty();
  images.forEach(e => {
    e.renderImageHTML();
  });
}

setupPageFromData(currentJSONFilePath);

// EVENT HANDLERS
//filter functionality
$('select').on('change', function() {
  let keyword = $(this).val();
  if (keyword === 'default') {
    $('section')
      .children()
      .show();
  } else {
    $('section')
      .children()
      .hide();
    $(`.${keyword}`).show();
  }
});

$('.pagination').on('click', function(e) {
  e.preventDefault();
  console.log(currentJSONFilePath);
  currentJSONFilePath = (currentJSONFilePath === 'data/page-1.json' ? 'data/page-2.json' : 'data/page-1.json');
  console.log(currentJSONFilePath);
  setupPageFromData(currentJSONFilePath);
});

