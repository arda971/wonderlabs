
let cartProducts=[];

function add_to_cart(){
    
    let list = document.getElementById('list');
    let prdName = document.getElementById('prdName');
    let prdDescription = document.getElementById('prdDescription');
    let prdPrice = document.getElementById('prdPrice');
    let prdQuantity = document.getElementById('prdQuantity');


    console.log(prdName);
    console.log('val',prdName.value);


    let newItemIndex;
    let newItem=cartProducts.find(isAdded,this);
    

    function isAdded(item,index) { 
    newItemIndex=index;	
    return item.name === prdName.value;

   }


  if(newItem){



  	 newItem.quantity= parseInt(newItem.quantity)+ parseInt(prdQuantity.value);
  	 cartProducts[newItemIndex]=newItem;

  	 console.log('up products',cartProducts);

  } else{

  	

  	  	cartProducts.push({name:prdName.value,
  		description:prdDescription.value,
  		price:prdPrice.value,
  		quantity:prdQuantity.value
  	});


     let listDom=document.createElement('li');
    let divList=document.createElement('div');
    let spanEdit=document.createElement('span');
    let spanDelete=document.createElement('span');
    let pDesc=document.createElement('p');
    let pPrice=document.createElement('p');
    let pAmount=document.createElement('p');
    let listDomText= document.createTextNode=prdName.value;
    let pDescText= document.createTextNode=prdDescription.value;
    let pPriceText= document.createTextNode=prdPrice.value;
    let pAmountText= document.createTextNode=prdQuantity.value;
    let spanEditText= document.createTextNode="Edit";
    let spanDeleteText= document.createTextNode="Delete";
            
            spanEdit.append(spanEditText);
            spanDelete.append(spanDeleteText);
            divList.append(spanEdit);
            divList.append(spanDelete);
            divList.className="te";
            listDom.append(listDomText);
            listDom.append(pDesc);
            listDom.append(pPrice);
            listDom.append(pAmount);
            listDom.append(divList);
            
            listDom.id=cartProducts.length ;
            list.appendChild(listDom);
       
         


console.log('new products',cartProducts);
  }





         list.addEventListener('click',function(){
             if(event.target.innerText==="Edit"){
                    console.log("edit"); 
             }
             if(event.target.innerText==="Delete"){
                    console.log("delete"); 
             }
             event.target.className="checked";
            
         });





    

    

}

