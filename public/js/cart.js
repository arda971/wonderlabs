let prdtName;


function add_to_cart(){
    let cartProducts=[];
    let list = document.getElementById('list');
    let prdName = document.getElementById('prdName');
    let prdDescription = document.getElementById('prdDescription');
    let prdPrice = document.getElementById('prdPrice');
    let prdQuantity = document.getElementById('prdQuantity');


    

  	cartProducts.push({name:prdName.innerText,
  		description:prdDescription.innerText,
  		price:prdPrice.innerText,
  		quantity:prdQuantity.innerText
  	});


    let listDom=document.createElement('li');
    let divList=document.createElement('div');
    let spanEdit=document.createElement('span');
    let spanDelete=document.createElement('span');
    let listDomText= document.createTextNode=prdDescription.innerText;
    let spanEditText= document.createTextNode="Edit";
    let spanDeleteText= document.createTextNode="Delete";
            
            spanEdit.append(spanEditText);
            spanDelete.append(spanDeleteText);
            divList.append(spanEdit);
            divList.append(spanDelete);
            divList.className="te";
            listDom.append(listDomText);
            listDom.append(divList);
            
            listDom.id=cartProducts.length ;
            list.appendChild(listDom);
       
         
         list.addEventListener('click',function(){
             if(event.target.innerText==="Edit"){
                    console.log("edit"); 
             }
             if(event.target.innerText==="Delete"){
                    console.log("delete"); 
             }
             event.target.className="checked";
             console.log(event);
         });





    

    console.log('add products',cartProducts);

}

function add_name(){

		console.log(event);
   			prdtName=event.target.value;
}
