// Измените каталог здесь: название, категория, цена и имя фото.
const productsData = [
{id:1,name:"Шашлык из свиной шейки",cat:"Шашлык",price:550,desc:"Сочный шашлык, приготовленный на огне.",img:"shashlik.jpg"},
{id:2,name:"Шашлык из курицы",cat:"Шашлык",price:450,desc:"Нежное куриное мясо с ароматом гриля.",img:"chicken.jpg"},
{id:3,name:"Люля-кебаб",cat:"Шашлык",price:420,desc:"Румяный люля-кебаб с пряностями.",img:"lula.jpg"},
{id:4,name:"Картофель фри",cat:"Гарниры",price:180,desc:"Золотистый картофель с хрустящей корочкой.",img:"fries.jpg"},
{id:5,name:"Картофель по-деревенски",cat:"Гарниры",price:200,desc:"Картофельные дольки с пряностями.",img:"potato.jpg"},
{id:6,name:"Овощи на гриле",cat:"Гарниры",price:250,desc:"Овощи, приготовленные на открытом огне.",img:"veggies.jpg"},
{id:7,name:"Борщ",cat:"Супы",price:350,desc:"Домашний суп с насыщенным вкусом.",img:"borscht.jpg"},
{id:8,name:"Суп куриный",cat:"Супы",price:320,desc:"Лёгкий куриный суп.",img:"soup.jpg"},
{id:9,name:"Салат овощной",cat:"Салаты",price:250,desc:"Свежие сезонные овощи.",img:"salad.jpg"},
{id:10,name:"Соус фирменный",cat:"Соусы",price:90,desc:"Добавьте любимый соус к блюду.",img:"sauce.jpg"},
{id:11,name:"Морс ягодный",cat:"Напитки",price:150,desc:"Освежающий ягодный напиток.",img:"mors.jpg"},
{id:12,name:"Чай",cat:"Напитки",price:100,desc:"Чёрный или зелёный чай.",img:"tea.jpg"}
];
const waNumber="79952906262"; // WhatsApp-номер кафе в международном формате без +.
let cartState={};let activeCategory="Все";
const rub=n=>new Intl.NumberFormat("ru-RU").format(n)+" ₽";
const productsEl=document.querySelector("#products"),filtersEl=document.querySelector("#filters");
function renderFilters(){const cats=["Все",...new Set(productsData.map(p=>p.cat))];filtersEl.innerHTML=cats.map(c=>`<button class="filter ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");filtersEl.querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderFilters();renderProducts();});}
function renderProducts(){const list=productsData.filter(p=>activeCategory==="Все"||p.cat===activeCategory);productsEl.innerHTML=list.map(p=>`<article class="product"><div class="product-photo"><img src="assets/${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=placeholder-icon>✳</span>'"></div><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${rub(p.price)}</span><button class="add" data-add="${p.id}">+ В корзину</button></div></article>`).join("");productsEl.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{cartState[b.dataset.add]=(cartState[b.dataset.add]||0)+1;renderCart();openCart();});}
function renderCart(){const entries=Object.entries(cartState).filter(([id,q])=>q>0);const count=entries.reduce((s,[id,q])=>s+q,0);document.querySelector("#cartCount").textContent=count;document.querySelector("#cartItems").innerHTML=entries.length?entries.map(([id,q])=>{const p=productsData.find(x=>x.id===+id);return `<div class="cart-row"><div><b>${p.name}</b><small>${rub(p.price)} · ${rub(p.price*q)}</small></div><div class="quantity"><button data-minus="${id}">−</button><span>${q}</span><button data-plus="${id}">+</button></div></div>`}).join(""):'<p class="empty">Корзина пока пустая. Добавьте что-нибудь вкусное!</p>';document.querySelector("#total").textContent=rub(entries.reduce((s,[id,q])=>s+productsData.find(p=>p.id===+id).price*q,0));document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>{cartState[b.dataset.minus]--;if(cartState[b.dataset.minus]<=0)delete cartState[b.dataset.minus];renderCart();});document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>{cartState[b.dataset.plus]++;renderCart();});}
function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#overlay").classList.add("open");}
function closeCart(){document.querySelector("#cart").classList.remove("open");document.querySelector("#overlay").classList.remove("open");}
document.querySelector("#cartOpen").onclick=openCart;document.querySelector("#cartClose").onclick=closeCart;document.querySelector("#overlay").onclick=closeCart;
document.querySelector("#checkout").onclick=()=>{if(!Object.values(cartState).some(Boolean)){alert("Сначала добавьте блюда в корзину.");return;}document.querySelector("#modalWrap").classList.add("open");};
document.querySelector("#modalClose").onclick=()=>document.querySelector("#modalWrap").classList.remove("open");
document.querySelector("#orderForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);const rows=Object.entries(cartState).filter(([id,q])=>q>0).map(([id,q])=>{const p=productsData.find(x=>x.id===+id);return `• ${p.name} × ${q} — ${rub(p.price*q)}`;});const total=Object.entries(cartState).reduce((s,[id,q])=>s+productsData.find(p=>p.id===+id).price*q,0);const msg=`Здравствуйте! Хочу оформить заказ в «Домашняя кухня».\n\n${rows.join("\n")}\n\nИтого: ${rub(total)}\n\nИмя: ${f.get("name")}\nТелефон: ${f.get("phone")}\nПолучение: ${f.get("delivery")}\nАдрес: ${f.get("address")||"—"}\nКомментарий: ${f.get("comment")||"—"}`;const url=`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;window.open(url,"_blank","noopener");};
document.querySelector("#hamb").onclick=()=>{const n=document.querySelector(".header nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="70px";n.style.right="10px";n.style.padding="20px";n.style.background="var(--paper)";n.style.flexDirection="column";n.style.zIndex="4";};
renderFilters();renderProducts();renderCart();