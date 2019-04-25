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
    $('input')[0].checked = true;
    $('input')[1].checked = false;
    renderAllImages(sortImagesByChecked(true, false));
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
function renderAllImages(images) {
  const imageRenderer = Handlebars.compile($('#div-template').text());
  let sectionPT = $('#photo-template');
  sectionPT.empty();
  images.forEach(image => sectionPT.append(imageRenderer(image)));
}

const sortImagesByChecked = (title, horns) => {
  let tempImages = images.slice(0);
  if(title && !horns){
    tempImages.sort( (a, b) => a.title.localeCompare(b.title, {sensitivity: 'base'}));
  }else if(horns && !title){
    tempImages.sort( (a, b) => a.horns - b.horns);
  }else if(horns && title){
    tempImages.sort( (a, b) => (a.horns - b.horns) !== 0 ? a.horns - b.horns : a.title.localeCompare(b.title, {sensitivity: 'base'}));
  }
  return tempImages;
};


setupPageFromData(currentJSONFilePath);


// EVENT HANDLERS
//filter functionality
$('select').on('change', function() {
  let keyword = $(this).val();
  if (keyword === 'default') {
    $('#photo-template')
      .children()
      .show();
  } else {
    $('#photo-template')
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


$('input').on('click',function () {
  renderAllImages(sortImagesByChecked($('input')[0].checked,$('input')[1].checked));
  //maybe add logic to only alow one check incase the TA's get sad.
});
