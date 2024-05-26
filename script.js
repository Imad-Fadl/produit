let $listProductHTML = $('.listProduct');
let $listCartHTML = $('.listCart');
let $iconCart = $('.icon-cart');
let $iconCartSpan = $('.icon-cart span');
let $body = $('body');
let $closeCart = $('.close');
let products = [];
let cart = [];

$iconCart.on('click', () => {
    $body.toggleClass('showCart');
});
$closeCart.on('click', () => {
    $body.toggleClass('showCart');
});

const addDataToHTML = (filteredProducts) => {
    // Clear current products
    $listProductHTML.empty();

    // Add new products
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            let newProduct = $(`
                <div class="item" data-id="${product.id}">
                    <img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>
                </div>
            `);
            $listProductHTML.append(newProduct);
        });
    }
};

const filterProductsByCategory = (category) => {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else  {
        filteredProducts = products.filter(product => {
            return product.cat === category || (product.type && product.type.includes(category));
    });
}
    addDataToHTML(filteredProducts);
};

$('.filter button').on('click', (event) => {
    const category = $(event.target).attr('id');
    filterProductsByCategory(category);
});

$listProductHTML.on('click', '.addCart', function() {
    let id_product = $(this).parent().data('id');
    addToCart(id_product);
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    $listCartHTML.empty();
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            totalPrice += info.price * item.quantity;

            let newItem = $(`
                <div class="item" data-id="${item.product_id}">
                    <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">€${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus">></span>
                    </div>
                </div>
            `);
            $listCartHTML.append(newItem);
        });
    }

    $iconCartSpan.text(totalQuantity);
    $('.total').text(`Total: €${totalPrice.toFixed(2)}`);
};

$listCartHTML.on('click', '.minus, .plus', function() {
    let product_id = $(this).closest('.item').data('id');
    let type = $(this).hasClass('plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

const initApp = () => {
    // get data product
    $.getJSON('products.json', (data) => {
        products = data;
        addDataToHTML(products);

        // get data cart from memory
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};

initApp();
