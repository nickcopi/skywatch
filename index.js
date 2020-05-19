const axios = require('axios');
const items = require('./items.json');
const endpoint = 'https://api.hypixel.net/skyblock/bazaar?key=729d5bb6-e173-4ae0-bd2f-f75629ac3a55';

const init = async ()=>{
	const bazaar = (await axios.get(endpoint)).data.products;
	Object.entries(bazaar).forEach(([k,v])=>{
		items[k].sell = v.quick_status.sellPrice;
		items[k].buy = v.quick_status.buyPrice;
	});
	Object.entries(items).forEach(([id,item])=>{
		item.id = id;
		calcCost(item);
	});
}

const calcCost = item=>{
	if(!item.recipe) return;
	let price = 0;
	item.recipe.forEach(component=>{
		if(!component.checked) calcCost(component);
		price += items[component.id].buy * component.quantity;
	});
	console.log(`${item.id}: sell for ${item.sell} make for ${price} making a profit of ${item.sell - price}`);
	item.calced = true;
}
init();

