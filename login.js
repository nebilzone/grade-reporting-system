const loginForm=document.querySelector('.loginForm');


async function fetchingData(){
    const response=await fetch('http://localhost:3000/users')
    const data=await response.json();
    return   data.map(item => ({ role: item.role, email: item.email, password: item.password }));
}


// loginForm.addEventListener('click',async function(e){
async function displayData(){

    const neba= await fetchingData();
    console.log(neba)
}
displayData()
// })
