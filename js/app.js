/**
 * Created by joshbenner on 10/1/16.
 */


var walmartApiUrl = "http://api.walmartlabs.com/v1/items?callback=?";
var upcValidLengths = [5,6,12];
var virtualCart = [];
var bill = 0;
var paid = false;
//used for
var costcoID = "57cf75cea73e494d8675f2b1";
var joshAcctId = "57ddf498e63c5995587e8d66";
var capitalOneURL2 = "http://api.reimaginebanking.com/accounts/";
var capitalOneKey = "04e7f8ab2d8b74d58ea9f870c4246949";
var capitalOneURL = "http://api.reimaginebanking.com/accounts/" + joshAcctId  + "/purchases?key=" + capitalOneKey;
var itemToBeDeleted;
var openFoodFactsUrl = "http://world.openfoodfacts.org/api/v0/product/";
var currentImage = "";
var url = "http://api.reimaginebanking.com/accounts/57ddf498e63c5995587e8d66/purchases?key=04e7f8ab2d8b74d58ea9f870c4246949";
function deleteItem(){
    console.log(itemToBeDeleted);
}

function image(data){
    $.each(data.items,function(i, item) {
         currentImage = item.image_small_url;
        console.log(item.image_small_url);
    });
}

function productInfo(data){
    $.each(data.items,function(i, item){
        console.log(item);
        var cart = $('.cart');
        itemToBeDeleted = item;

        var openFoodOptions = {
            format: "json"
        };
        $.getJSON(openFoodFactsUrl + item.upc,openFoodOptions,image ).done(function(resp){
            var a = resp;
            var html = "<li><img src='" + resp.product.image_small_url + "'><div class='productInfo'>" + item.name + "</div><div class='price'>";
            var price = item.salePrice +  "</div></li>";
            cart.append(html + price);
            virtualCart.push(item);
            bill += item.salePrice;
            console.log("Printing the item list" , virtualCart);
        });


    })
}

function payCallBack(data){
     $.each(data.items,function(i, item){
        console.log(item);
        console.log("payment successful");
    })
}

function addItemToDatabase(){
     var item = $('.UPC' ).val();
        console.log(item);
        var options =
        {
            apiKey: "q6dcjsx9c4gxmvks7wnarpkp",
            format: "json",
            upc: item
        };

        $.getJSON(walmartApiUrl, options, productInfo);
}

function hideInfo(){
    var btn = $('.checkout');
    btn.removeClass('btn-primary');
    btn.addClass('btn-success');
    btn.text("Paid");
    $('.InputData' ).css('visibility','hidden');
}

$( document ).ready(function() {

    if(paid){
           hideInfo();
    }

    $("input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        addItemToDatabase();
    }
});

    $('.addItem' ).click(function(){
        addItemToDatabase();
    });

    $('.removeItem').click(function(){
	var itemCode = $('.Upc').val();
	console.log(itemCode);

	for(var i = 0; i < virtualCart.length; i++)
	{
		if(virtualCart[i].upc == itemCode)
		{
			bill -= virtualCart[i].salePrice;
			console.log(virtualCart[i]);
			var cart = $('.cart');
			var html = "<li><div class='productInfo'>" + virtualCart[i].name + "</div><div class='price'>";
			var price = (-1*virtualCart[i].salePrice) +  "</div></li>";
			cart.append(html + price);
			virtualCart.splice(i,1);
			return;
		}
	}
	alert("No such item in list");
	console.log("Invalid removal");
    });

    $('.checkout' ).click(function(){
        var capitalOneOptions = {
              "merchant_id": "57cf75cea73e494d8675f2b1",
              "medium": "balance",
              "purchase_date": "2016-10-02",
              "amount": 6969,
              "description": "dank food"
        };
       // $.getJSON(capitalOneURL,capitalOneOptions,payCallBack );
        $.ajax({
            type: "POST",
            data: capitalOneOptions,
            url: capitalOneURL,
            crossDomain: true,
            dataType: "jsonp",
            headers:{
                "Cross-Origin": true,
                "Content-Type": "application/json",
                "X-M2X-KEY": "83ffdd46ec1f3a278c0188dc034784d7",
                'X-Flynn': 'lives'
            }

        } ).done(function(resp){
            console.log(resp);
        } );

	    $('.cart').append("<li><div class='productInfo'>BILL</div><div class='price'>\n" + bill.toFixed(2) + "</div></li>");
        hideInfo();
    });
});
