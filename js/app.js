'use strict';
console.log('linked');

let images = [];
let keywords = [];
let currentJSONFilePath = 'data/page-1.json';

//create object constructor
const ImageJSONObject = function(link, title, keyword, horns, description) {
  this.image_url = link;
  this.title = title;
  this.keyword = keyword;
  this.horns = horns;
  this.description = description;
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
    renderAllImages(data);
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
function renderAllImages(data) {
  const imageRenderer = Handlebars.compile($('#div-template').text());
  let sectionPT = $('#photo-template');
  sectionPT.empty();
  data.forEach(image => sectionPT.append(imageRenderer(image)));
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

