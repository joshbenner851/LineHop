/**
 * Created by joshbenner on 10/1/16.
 */


var walmartApiUrl = "http://api.walmartlabs.com/v1/items?callback=?";
var upcValidLengths = [5,6,12];
var virtualCart = [];
var bill = 0;

function productInfo(data){
    $.each(data.items,function(i, item){
        console.log(item);
        var cart = $('.cart');
        var html = "<li><div class='productInfo'>" + item.name + "</div><div class='price'>";
        var price = item.salePrice +  "</div></li>";
        cart.append(html + price);
        virtualCart.push(item);
	bill += item.salePrice;
    })
}

$( document ).ready(function() {

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

	console.log(virtualCart);
	console.log(bill);
	$('.cart').append("<li><div class='productInfo'>BILL</div><div class='price'>\n" + bill.toFixed(2) + "</div></li>");
	$(this).removeClass('btn-primary');
        $(this).addClass('btn-success');

    });
});
