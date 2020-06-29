import imagesLoaded from 'imagesloaded';
import Masonry from 'masonry-layout';

const elem = document.querySelector('.grid');
if (elem) {
  var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-item',
  });
}

if (elem) {
  imagesLoaded(elem, () => {
    msnry.layout();
  });
}
