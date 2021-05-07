$(document).ready(function(){  
    
    function buttonAnimation(btn, text, check){
      if (check){
        btn.addClass("disabled")
        btn.html("<i class='fa fa-spin fa-spinner'></i> Sending...")
      } else {
        btn.removeClass("disabled")
        btn.html(text)
      }
      
    }
    cForm.submit(function(event){
      event.preventDefault()

      var cFormBtn = cForm.find("[type='submit']")
      var cFormBtnText = cFormBtn.text()

      var data = cForm.serialize()
      var form = $(this)
      buttonAnimation(cFormBtn, "", true)
      $.ajax({
        method: cFormMethod,
        url:  cFormAction,
        data: data,
        success: function(data){
          cForm[0].reset()
          $.alert({
            title: "Success!",
            content: data.message,
            theme: "modern",
          })
          setTimeout(function(){
            buttonAnimation(cFormBtn, cFormBtnText, false)
          }, 500)
        },
        error: function(error){
          console.log(error.responseJSON)
          var jsonData = error.responseJSON
          var msg = ""

          $.each(jsonData, function(key, value){ // key, value  array index / object
            msg += key + ": " + value[0].message + "<br/>"
          })

          $.alert({
            title: "Oops!",
            content: msg,
            theme: "modern",
          })

          setTimeout(function(){
            buttonAnimation(cFormBtn, cFormBtnText, false)
          }, 500)

        }
      })
    })
    // // Contact form Handler 
    // var cForm = $(".contact-form") 
    // var cFormMethod = cForm.attr("method")
    // var cFormAction = cForm.attr("action")


    // function cFormButtonSubmitAnimation(btn, text, submit){
    //   if (submit){
    //     btn.addClass("disabled")
    //     btn.html("<i class='fa fa-spin fa-spinner'></i> sending ..")
    //   }
    //   else{
    //     btn.removeClass("disabled")
    //     btn.html(text) // this is the deafult text that will be here
    //   }
      
    // }
    // // reason why we use submit rather than form button click is because submits can happen anwheree, but we want to handle a form when its about to be submitted
    // // somteimes you put text input and press enter 

    // // 1 make the ajax call here
    // // 2 go to the view that handles it to return some data
    // cForm.submit(function(e){
    //   e.preventDefault()
    //   var cFormButton = cForm.find('[type="submit"]')
    //   var cFormButtonText = cFormButton.text() //default text
      
    //   var data = cForm.serialize()
    //   var form = $(this) // this form
    //   cFormButtonSubmitAnimation(cFormButtonText,"",true) // once the user presses enter show the loading icon
    //   $.ajax({
    //     method: cFormMethod,
    //     url : cFormAction,
    //     data : data,
    //     success: function(data){
    //       cForm[0].reset() // resetting the form
    //       $.alert({
    //         title : "Success!",
    //         content : data.message, // comes from views.py from jsonResponse 
    //         theme : "modern"
    //       })
    //       // emulate some time being passed for the loading icon
    //       setTimeout(function(){
    //         cFormButtonSubmitAnimation(cFormButtonText,cFormButtonText,false)
    //       }, 1500)
    //     },
    //     error : function(error){
    //       console.log(error.responseJSON)
    //       var json = error.responseJSON

    //       var str =""
    //       $.each(json,function(k,val){
    //         str += k + ": " + val[0].message +"<br/>"
    //       })

    //       $.alert({
    //         title : "Oh dear!",
    //         content : str,
    //         theme : "modern"
    //       })
    //       setTimeout(function(){
    //         cFormButtonSubmitAnimation(cFormButtonText,cFormButtonText,false)
    //       }, 1500)
    //     }
    //   })
    // })

    // 111 - Search Automatically
    var form = $(".search")
    var input = form.find("[name='q']") //input name='q'
    // set up vairable that will handle our typing
    var timer;
    var interval = 500; // after 1/2 second do this ...
    var button = form.find('[type="submit"]')
    input.keyup(function(e){
      // evyertime the user lifts their fingers a key we reset the timer
      clearTimeout(timer)
      timer = setTimeout(displayItems,interval)
    })

    input.keydown(function(e){
      // evyertime the user enters a key we reset the timer
      clearTimeout(timer)
    })
    // running - allow user to finish typing, after typing wait 1 second and show
    function displayItems(){
      search()
      var q = input.val()
      setTimeout(function(){
        window.location.href='/search/?q=' + q
      },1000)
      
    }
    function search(){
      button.addClass("disabled")
      button.html("<i class='fa fa-spin fa-spinner'></i> finding ..")
    }


    // basket + Add Items 
    var itemForm = $(".ajax-item-form") // we got our form by its class name
    itemForm.submit(function(e){
      e.preventDefault();
      //console.log("form not sending")
      var form = $(this) //this grabs the currently worked on form
      // var action = form.attr("action"); 
      var action = form.attr("endpoint"); // own arbitray endpoint 
      var method= form.attr("method");
      var formData = form.serialize();

      // 105- this is how i need to do the order, customer will be directed to new page, once staff change status customer is notified
      $.ajax({
        url : action,
        method : method,
        data : formData,
        success : function(data){
          console.log("passs")
          console.log(data)
          console.log("in basket",data.in)
          console.log("in basket",data.out)
          var spanChange = form.find(".span-change")
          // if item in basket show this
          if(data.in){
            spanChange.html('In Cart <button type="submit" class="btn btn-link">Remove</button>')
          }
          else{
            spanChange.html('<button type="submit" class="btn btn-success">Add to Basket</button>')
          }
          var basketCounter = $(".basket-counter")
          basketCounter.text(data.basketItemCounter)
          // if basket is in the current path, we will update the basket
          if (window.location.href.indexOf("basket") != -1){
            updateBasket()
          }
        },
        error : function(error){
          $.alert({
            title : "Oh dear!",
            content : "Error has taken place",
            theme : "modern"

          })
          console.log("error")
          console.log(error)
        }
      })
    })
    function updateBasket(){
      console.log("in current basket")
      var Basketurl = window.location.href
      var basketT = $(".basket-t")
      var basketB = basketT.find(".basket-b")
      //basketB.html("<h1>Changed</h1>") 
      var itemR = basketB.find(".basket-p")

      
      // so success call happens, it updates the basket if we are already in basket 

      // need another ajax call to update the basket 
      var updateBasketUrl = '/api/basket/'; // this is our endpoint
      var updateMethod = "GET";
      var data ={};
      // we are using the GET method to "update" the basket, we are just getting the updated data based on any of the post data thats happening in the baove ajax call

      $.ajax({
        url: updateBasketUrl,
        method:updateMethod,
        data:data,
        success: function(data){
          console.log("success")
          console.log(data)
          
          var deleteItemForm = $(".delete-item-link")
          if (data.items.length > 0){
            itemR.html(" ")
            count = data.items.length
            $.each(data.items, function(i, item){
              var newDeleteItemForm = deleteItemForm.clone()
              newDeleteItemForm.css("display","block")
              newDeleteItemForm.find(".basket-item-id").val(item.id)
              basketB.prepend("<tr><th scope='row'>"+ count +"</th><td><a href ='" + item.url+ "'a>"+
                 item.name +"</a>"+ newDeleteItemForm.html() +"</td><td>"+ item.price + "</td></tr>")
                count--
            })
            
            basketB.find(".basket-st").text(data.subtotal)
            basketB.find(".basket-t").text(data.total)
          }
          else{
            // refresh page if we dont have products 
            window.location.href = Basketurl
          }
          
        },
        error: function(error){
          $.alert({
            title : "Oh dear!",
            content : "Error has taken place",
            theme : "modern"

          })
          console.log("error")
          console.log(error)
        }
      })
    }
  })