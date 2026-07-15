(function(){
  const cart = {};
  const cartCountEl = document.getElementById('cartCount');
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const productsEl = document.getElementById('products');
  const searchEl = document.getElementById('search');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const checkout = document.getElementById('checkout');
  const loginToggle = document.getElementById('loginToggle');
  const logoutButton = document.getElementById('logoutButton');
  const loginModal = document.getElementById('loginModal');
  const closeLogin = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const userGreeting = document.getElementById('userGreeting');

  const credentials = {username:'Maddy', password:'grocery123'};
  let currentUser = localStorage.getItem('greenleafUser');

  function format(n){return Number(n).toFixed(2)}

  function updateCartUI(){
    const items = Object.values(cart);
    cartItemsEl.innerHTML = '';
    let total = 0;
    let count = 0;
    items.forEach(it=>{
      total += it.price * it.qty;
      count += it.qty;
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${it.name}</strong><br>
          <small>$${format(it.price)} x ${it.qty}</small>
        </div>
        <div>
          <button data-id="${it.id}" class="dec">-</button>
          <button data-id="${it.id}" class="inc">+</button>
          <button data-id="${it.id}" class="rm">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = format(total);
    cartCountEl.textContent = count;
  }

  function addToCart(id,name,price){
    if(!cart[id]) cart[id] = {id,name,price,qty:0};
    cart[id].qty += 1;
    updateCartUI();
  }

  function openLogin(){ loginModal.setAttribute('aria-hidden','false'); }
  function closeLoginModal(){ loginModal.setAttribute('aria-hidden','true'); loginError.textContent=''; loginForm.reset(); }

  function updateLoginUI(){
    if(currentUser){
      loginToggle.style.display = 'none';
      logoutButton.style.display = 'inline-flex';
      userGreeting.textContent = `Hello, ${currentUser}`;
    } else {
      loginToggle.style.display = 'inline-flex';
      logoutButton.style.display = 'none';
      userGreeting.textContent = '';
    }
  }

  function login(username,password){
    if(username === credentials.username && password === credentials.password){
      currentUser = username;
      localStorage.setItem('greenleafUser', currentUser);
      updateLoginUI();
      closeLoginModal();
      return true;
    }
    loginError.textContent = 'Invalid username or password';
    return false;
  }

  function logout(){
    currentUser = null;
    localStorage.removeItem('greenleafUser');
    updateLoginUI();
  }

  productsEl.addEventListener('click', e=>{
    const btn = e.target.closest('.add-to-cart');
    if(!btn) return;
    const prod = btn.closest('.product');
    const id = prod.dataset.id;
    const name = prod.dataset.name;
    const price = parseFloat(prod.dataset.price);
    addToCart(id,name,price);
  });

  cartItemsEl.addEventListener('click', e=>{
    const inc = e.target.closest('.inc');
    const dec = e.target.closest('.dec');
    const rm = e.target.closest('.rm');
    if(inc){ const id = inc.dataset.id; cart[id].qty += 1; updateCartUI(); }
    if(dec){ const id = dec.dataset.id; cart[id].qty -= 1; if(cart[id].qty <= 0) delete cart[id]; updateCartUI(); }
    if(rm){ const id = rm.dataset.id; delete cart[id]; updateCartUI(); }
  });

  cartToggle.addEventListener('click', ()=>{
    const hidden = cartPanel.getAttribute('aria-hidden') === 'true';
    cartPanel.setAttribute('aria-hidden', (!hidden).toString());
  });
  closeCart.addEventListener('click', ()=>cartPanel.setAttribute('aria-hidden','true'));

  checkout.addEventListener('click', ()=>{
    if(!currentUser){
      openLogin();
      return alert('Please login before checkout.');
    }
    const total = Object.values(cart).reduce((s,i)=>s + i.price*i.qty,0);
    if(total <= 0) return alert('Your cart is empty');
    alert('Checkout — total: $' + format(total) + '\n(Logged in as ' + currentUser + ')');
    Object.keys(cart).forEach(k=>delete cart[k]);
    updateCartUI();
    cartPanel.setAttribute('aria-hidden','true');
  });

  loginToggle.addEventListener('click', openLogin);
  logoutButton.addEventListener('click', logout);
  closeLogin.addEventListener('click', closeLoginModal);
  loginModal.addEventListener('click', e=>{ if(e.target === loginModal) closeLoginModal(); });

  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    login(loginUser.value.trim(), loginPass.value);
  });

  searchEl.addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.product').forEach(p=>{
      const name = p.dataset.name.toLowerCase();
      p.style.display = name.includes(q) ? '' : 'none';
    });
  });

  cartPanel.setAttribute('aria-hidden','true');
  loginModal.setAttribute('aria-hidden','true');
  updateCartUI();
  updateLoginUI();
})();
