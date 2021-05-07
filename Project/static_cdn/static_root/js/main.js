$(document).ready(function(){

  
    var stripeForm = $(".stripe-payment-form")
    var stripeToken = stripeForm.attr("token")
    var stripeUrl = stripeForm.attr("url")
    var stripeButtonText = stripeForm.attr("button-text") || "Add card"
    
    var stripeTemp = $.templates("#stripeTemp")
    var stripeData = {
        publishKey: stripeToken,
        url: stripeUrl,
        buttonTitle: stripeButtonText
    }
    var stripeTempHtml  = stripeTemp.render(stripeData)
    stripeForm.html(stripeTempHtml)
    
    
    
    
    // https secure site when live
    
    var paymentForm = $(".payment-form")
    if (paymentForm.length > 1){
        alert("Only one payment form is allowed per page")
        paymentForm.css('display', 'none')
    }
    else if (paymentForm.length == 1) {
    
    var publishKey = paymentForm.attr('token')
    var url = paymentForm.attr('url')
        // Create a Stripe client
    var stripe = Stripe(publishKey);
    
    // Create an instance of Elements
    var elements = stripe.elements();
    
    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    
    // Create an instance of the card Element
    var card = elements.create('card', {style: style});
    
    // Add an instance of the card Element into the `card-element` <div>
    card.mount('#card-element');
    
    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
    
    // Handle form submission
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    
      stripe.createToken(card).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server
          stripeTokenHandler(url, result.token);
        }
      });
    });
    
    
    function redirectUrl(url, timeoffset) {
        // body...
        if (url){
        setTimeout(function(){
                    window.location.href = url
                }, timeoffset)
        }
    }
    
    function stripeTokenHandler(url, token){
        // console.log(token.id)
        // var paymentMethodEndpoint = '/billing/payment-method/create/'
        var data = {
            'token': token.id
        }
        $.ajax({
            data: data,
            url: '/billing/payment-method/create/',
            method: "POST",
            success: function(data){
                var message = data.message || "Success! Your card was added."
                card.clear()
                if (url){
                    message = message + "<br/><br/><i class='fa fa-spin fa-spinner'></i> Redirecting..."
                }
                if ($.alert){
                    $.alert(message)
                } else {
                    alert(message)
                }
                redirectUrl(url, 1500)
    
            },
            error: function(error){
                console.log(error)
            }
        })
    }
    }
    
    }) 