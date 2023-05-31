recipe_selectors = [
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.recipe-summary.wide', // thepioneerwoman.com
	'.wprm-recipe-container',
	'.recipe-content',
	'.simple-recipe-pro',
	'.mv-recipe-card',
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
	'body > main > section.recipeBody > div > div.recipeBody__left > div.ingredientList > div.ingredientList__body',
	'.ingredientList__body',
	'div.ingredientList',
	'.ingredientList',
	'body > main > section.recipeHeader > div.recipeHeader__main > div > div.recipeHeader__main__left',
	'body > main > section.recipeBody > div > div.recipeBody__right > div > div.recipeSteps__body > ul',
	'#block-system-main > div > div > section.container.main > div > div.col-sm-3.ingredients > ul',
	'body > main > section.recipeHeader > div.recipeHeader__main > div > div.recipeHeader__main__right > figure > img',
	'body > main > section.recipeHeader > div.recipeHeader__main > div > div.recipeHeader__main__left > div.textBlock > h1',
	'body > main > section.recipeHeader > div.recipeHeader__main > div > div.recipeHeader__main__right'
]

const closeButton = document.createElement('button');
closeButton.id = '_rf_closebtn';
closeButton.classList.add('_rfbtn');
closeButton.textContent = 'Adicionar ao Carrinho';

const disableButton = document.createElement('button');
disableButton.id = '_rf_disablebtn';
disableButton.classList.add('_rfbtn');
disableButton.textContent = 'disable on this site';

const controls = document.createElement('div');
controls.id  = '_rf_header';
controls.appendChild(document.createTextNode('SmartCart '));
controls.appendChild(document.createTextNode('by'));
controls.appendChild(document.createTextNode(' CONTINENTE'));


controls.appendChild(closeButton);

function hidePopup(){
	let highlight = document.getElementById('_rf_highlight');
	highlight.style.transition = 'opacity 400ms';
	highlight.style.opacity = 0;

	setTimeout(function() {
		highlight.parentNode.removeChild(highlight);
	}, 400);
}

function showPopup() {
	recipe_selectors.every(function(s) {
	  let original = document.querySelector(s);
	  if (original) {
		// clone the matched element
		let clone = original.cloneNode(true);
		clone.id = '_rf_highlight';

		// Select the h1 element separately
            let h1Element = document.querySelector('body > main > section.recipeHeader > div.recipeHeader__main > div > div.recipeHeader__main__left > div.textBlock > h1');
            if (h1Element) {
                // Clone the h1 element and append it to the clone
                let h1Clone = h1Element.cloneNode(true);
                clone.insertBefore(h1Clone, clone.firstChild);
            }

		// add some control buttons
		clone.prepend(controls);
		clone.style.transition = 'opacity 500ms';
		clone.style.display = 'block';
		clone.style.opacity = 0;
  
		document.body.insertBefore(clone, document.body.firstChild);
  
		// handle the two new buttons we attached to the popup
		closeButton.addEventListener('click', function() {
			window.location.href = 'https://www.continente.pt/checkout/carrinho/';
		  });
		  
		disableButton.addEventListener('click', function(b) {
		  chrome.storage.sync.set({ [document.location.hostname]: true }, hidePopup);
		});
  
		// add an event listener for clicking outside the recipe to close it
		let mouseUpHide = function(e) {
		  if (
			e.target !== clone &&
			!clone.contains(e.target) &&
			event.target.type !== 'submit'
		  ) {
			hidePopup();
			document.removeEventListener('mouseup', mouseUpHide);
		  }
		};
		document.addEventListener('mouseup', mouseUpHide);
  
		window.setTimeout(() => {
		  // fade in
		  clone.style.opacity = 1;
  
		  // scroll to top in case they hit refresh while lower in page
		  document.scrollingElement.scrollTop = 0;
		}, 10);
  
		// it worked, stop iterating through recipe_selectors
		return false;
	  }
	  return true;
	});
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === "showPopup") {
	  showPopup();
	}
  });
  
  



// check the blacklist to see if we should run on this site
chrome.storage.sync.get(document.location.hostname, function(items) {
	if (!(document.location.hostname in items)) {
		showPopup();
	}
});
