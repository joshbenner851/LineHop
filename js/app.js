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

function deleteItem(){
    console.log(itemToBeDeleted);
}

function productInfo(data){
    $.each(data.items,function(i, item){
        console.log(item);
        var cart = $('.cart');
        itemToBeDeleted = item;
        var html = "<li><button onclick='deleteItem()'>Delete</button><div class='productInfo'>" + item.name + "</div><div class='price'>";
        var price = item.salePrice +  "</div></li>";
        cart.append(html + price);
        virtualCart.push(item);
		bill += item.salePrice;
        console.log("Printing the item list" , virtualCart);
    })
}

function payCallBack(data){
     $.each(data.items,function(i, item){
        console.log(item);
        console.log("payment successful");
    })
}

$( document ).ready(function() {

    if(paid){
            $(this).removeClass('btn-primary');
            $(this).addClass('btn-success');
            $(this ).text("Paid");
            $('.InputData' ).css('visibility','hidden');
        }


    //TODO Add functionality for submitting through hitting enter instead of having to click button
//    $("input").keypress(function(event) {
//    if (event.which == 13) {
//        event.preventDefault();
//        $("form").submit();
//    }
//});


    $('.addItem' ).click(function(){
        var item = $('.UPC' ).val();
        console.log(item);
        var options =
        {
            apiKey: "q6dcjsx9c4gxmvks7wnarpkp",
            format: "json",
            upc: item
        };

        $.getJSON(walmartApiUrl, options, productInfo);


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
            "body": {
                "merchant_id" : costcoID,
                "medium" : "balance",
                "purchase_date" : "2016-10-02",
                "amount" : 250,
                "description" : "food"
            }
        };
       // $.getJSON(capitalOneURL,capitalOneOptions,payCallBack );
       // $.ajax(capitalOneURL,{
       //     "data": capitalOneOptions,
       //     "type": "POST",
       //     'contentType': 'application/json'
       // });

        $.post(capitalOneURL, capitalOneOptions, function(response) {
            // Do something with the request
            console.log(response);
        }, 'json');
	console.log(virtualCart);
	console.log(bill);
	$('.cart').append("<li><div class='productInfo'>BILL</div><div class='price'>\n" + bill.toFixed(2) + "</div></li>");
	$(this).removeClass('btn-primary');
        $(this).addClass('btn-success');

        //paid = true;
        //if(paid){
        //    $(this).removeClass('btn-primary');
        //    $(this).addClass('btn-success');
        //    $(this ).text("Paid");
        //    $('.InputData' ).css('visibility','hidden');
        //}
    });
});
