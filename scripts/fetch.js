require("babel-core/register");
require("babel-polyfill");

let pathName = window.location.pathname;

const url = `https://quiprendquoi-api.benjaminadida.fr${pathName}`;

fetch(url)
	.then(response => response.json())
	.then(response =>
		localStorage.setItem("initData", JSON.stringify(response.items)),
	);

let repeatCall = [];

setInterval(() => {
	fetch(url)
		.then(response => response.json())
		.then(response => {
			repeatCall.push(JSON.stringify(response.items));
			let repeatCallToString = repeatCall.toString();
			let initData = localStorage.getItem("initData");
			if (
				repeatCallToString !== initData &&
				repeatCallToString.length > initData.length
			) {
				localStorage.setItem("initData", repeatCall.toString());
				let item_created = response.items.length - 1;
				console.log("item_created");
				// Notification authorization
				Notification.requestPermission();
				response.items.map((item, index) => {
					if (index === item_created) {
						// Send notification if user accept
						new Notification(`Un nouvel item à été ajouté : ${item.name}`);
						createElement(item._id, item.name);
					}
				});
			}
		})
		.then(() => {
			document.querySelector(".lds-ellipsis").classList.remove("isVisible");
			document.querySelector(".lds-ellipsis").classList.add("none");
		});
	repeatCall.pop();
}, 5000);

// Create element if new item added
let createElement = (itemId, itemName) => {
	var div = document.createElement("div");
	div.setAttribute("class", "item__box");
	div.innerHTML = `
		<p>${itemName}</p>
		<form method="post" action="${pathName}/items/${itemId}?_method=DELETE">
			<button data-url="${itemId}" class="btnItem"><img src="/images/delete.svg" style="width:30px"/></button>
		</form>`;
	let currentDiv = document.getElementById("lastNotification");
	currentDiv.appendChild(div);
	// Animation
	setTimeout(function() {
		div.className = div.className + " show";
	}, 100);
};
