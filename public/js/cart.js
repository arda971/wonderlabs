
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

  	 let upElt=document.getElementById('qte'+(newItemIndex+1));

     upElt.innerText=newItem.quantity;

  	 console.log('up products',cartProducts,'line',upElt);


  } else{

  	

  	  	cartProducts.push({name:prdName.value,
  		description:prdDescription.value,
  		price:prdPrice.value,
  		quantity:prdQuantity.value
  	});


     let listDom=document.createElement('li');
    let divList=document.createElement('div');

    let pDelete=document.createElement('p');
    let pDesc=document.createElement('p');
    let pPrice=document.createElement('p');
    let pAmount=document.createElement('p');
    let listDomText= document.createTextNode=prdName.value;
    let pDescText= document.createTextNode='Description : '+prdDescription.value;
    let pPriceText= document.createTextNode='$ '+prdPrice.value;
    let pAmountText= document.createTextNode='Quanity : '+prdQuantity.value;
  
    let pDeleteText= document.createTextNode="Delete";

            
 
    pDelete.append(spanDeleteText);    
    pDesc.append(pDescText);
    pPrice.append(pPriceText);
    pAmount.append(pAmountText);
    pAmount.id='qte'+cartProducts.length;
    listDom.append(listDomText);
    listDom.append(pDesc);
    listDom.append(pPrice);
    listDom.append(pAmount);    
    listDom.append(pDelete);
           
    listDom.id=cartProducts.length ;
    list.appendChild(listDom);
       
         


console.log('new products',cartProducts);
  }





         list.addEventListener('click',function(){
         
             if(event.target.innerText==="Delete"){
             	let index = parseInt(event.target.parentNode.id);

             	 console.log("delete", event.target.parentNode); 

             	cartProducts.splice(index, 1);

             	event.target.parentNode.remove();

               

             }
             
            
         });





    

    

}

