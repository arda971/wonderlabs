function add_to_cart(product_id,product_price,product_description){
    let cartProducts=[];
    let list = document.getElementById('list');


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
            if(item.type==="d") listDom.className="daily"; 
            listDom.id=cartProducts.length;
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



    cartProducts.push({product_id,product_price});

    console.log('add products',cartProducts);

}
