let prdtName;

function add_to_cart(product_name,product_description,product_price,product_quantity){
    let cartProducts=[];
    let list = document.getElementById('list');
    let prdName = document.getElementById('prdName');
    let prdDescription = document.getElementById('prdDescription');
    let prdPrice = document.getElementById('prdPrice');
    let prdQuantity = document.getElementById('prdQuantity');

    

  	cartProducts.push({name:product_name,description:product_description,price:product_price,quantity:product_quantity});


    let listDom=document.createElement('li');
    let divList=document.createElement('div');
    let spanEdit=document.createElement('span');
    let spanDelete=document.createElement('span');
    let listDomText= document.createTextNode=product_description;
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
