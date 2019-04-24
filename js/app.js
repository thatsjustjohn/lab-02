'use strict';
console.log('linked');

let images = [];
let template = $('#photo-template');

//create object constructor
const ImageJSONObject = function(link, title, keyword, horns, description) {
  this.image_url = link;
  this.title = title;
  this.keyword = keyword;
  this.horns = horns;
  this.description = description;

  this.renderImageHTML = function() {
    console.log(this.link);
    template.append(
      $('<h2></h2>').text(this.title),
      $('<img />').attr({ src: this.image_url, alt: this.title }),
      $('<p></p>').text(this.description)
    );
  };
};

//use AJAX to pull in data and render to DOM
$.get('../data/page-1.json').done(data => {
  console.log('data: ' + data);
  createImageJSONObjects(data);
  renderAllImages();
});

//modify template with new data.
function createImageJSONObjects(imgArr) {
  console.log('running');
  imgArr.forEach(element => {
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

function renderAllImages() {
  console.log(`images: ${images}`);
  images.forEach(e => e.renderImageHTML());
}
