document.addEventListener("DOMContentLoaded", function () {
  // Fetch product data when the page loads
  fetchProductData();

  const addToCartBtn = document.querySelector('.btn');
  const messageDiv = document.querySelector('.msg');

  addToCartBtn.addEventListener('click', function () {
    // Get selected color
    const selectedColor = document.querySelector('.color-option.selected');
    const color = selectedColor ? selectedColor.dataset.color : 'No color selected';

    // Get selected size
    const selectedSize = document.querySelector('.size-option-radio:checked');
    const size = selectedSize ? selectedSize.value : 'No size selected';

    const productTitle = document.querySelector('.product-title').textContent;

    // Display message
    messageDiv.textContent = `${productTitle} Color ${color}, Size ${size} is added to cart`;
    messageDiv.style.display = 'block'; // Show the message div
  });

  // Function to fetch product data from the API
  function fetchProductData() {
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Display product details
        displayProductDetails(data.product);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  // Function to display product details
  function displayProductDetails(product) {
    const productTitle = document.querySelector('.product-title');
    productTitle.textContent = product.title;

    const lastPrice = document.querySelector('.last-price span');
    lastPrice.textContent = product.compare_at_price;

    const newPrice = document.querySelector('.new-price span');
    newPrice.textContent = product.price;

    //the discount percentage
    const new_price = product.price;
    const newPriceNumber = parseFloat(new_price.replace('$', ''));
    const old_price = product.compare_at_price;
    const oldPriceNumber = parseFloat(old_price.replace('$', ''));

    const discountPercentage = ((1 - (newPriceNumber / oldPriceNumber)) * 100).toFixed(0);
    console.log(`Discount Percentage: ${discountPercentage}%`);
    const discount = document.querySelector('.discount');
    discount.textContent = `${discountPercentage}% Off`;

    const description = document.querySelector('.description');
    description.textContent = product.description;

    //for display the colors
    const colorOptionsContainer = document.querySelector('.color-options');
    product.options[0].values.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.className = 'color-option';
      colorBox.dataset.color = Object.keys(color)[0];
      colorBox.style.backgroundColor = color[Object.keys(color)[0]];
      colorBox.addEventListener('click', function () {
        // console.log('Selected color:', Object.keys(color)[0]);
        const selectedColor = document.querySelector('.color-option.selected');
        if (selectedColor) {
          selectedColor.classList.remove('selected');
        }
        this.classList.add('selected');
      });
      colorOptionsContainer.appendChild(colorBox);
    });

    // for display sizes
    const sizeOptionsContainer = document.querySelector('.size-options');
    product.options[1].values.forEach(size => {
      const sizeOptionDiv = document.createElement('div');
      sizeOptionDiv.className = 'size-option';

      const sizeOption = document.createElement('input');
      sizeOption.type = 'radio';
      sizeOption.className = 'size-option-radio';
      sizeOption.name = 'size';
      sizeOption.value = size;
      sizeOption.id = size;

      const sizeLabel = document.createElement('label');
      sizeLabel.htmlFor = size;
      sizeLabel.textContent = size;

      sizeOption.addEventListener('change', function () {
        if (this.checked) {
          // console.log('Selected size:', this.value);
        }
      });

      sizeOptionDiv.appendChild(sizeOption);
      sizeOptionDiv.appendChild(sizeLabel);
      sizeOptionsContainer.appendChild(sizeOptionDiv);
    });
  }
});

// for image slider
const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
  imgItem.addEventListener('click', (event) => {
    event.preventDefault();
    imgId = imgItem.dataset.id;
    slideImage();
  });
});

function slideImage() {
  const displaywidth = document.querySelector('.img-showcase img:first-child').clientWidth;

  document.querySelector('.img-showcase').style.transform = `translateX(${-(imgId - 1) * displaywidth}px)`;
}

window.addEventListener('resize', slideImage);

// Quantity Button
const quantityElement = document.querySelector('.quantity');
const minusBtn = document.querySelector('.minus-btn');
const plusBtn = document.querySelector('.plus-btn');

minusBtn.addEventListener('click', function () {
  let value = parseInt(quantityElement.textContent);
  if (value > 1) {
    quantityElement.textContent = value - 1;
  }
});

plusBtn.addEventListener('click', function () {
  let value = parseInt(quantityElement.textContent);
  quantityElement.textContent = value + 1;
});

