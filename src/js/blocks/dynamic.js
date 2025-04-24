
// Dynamic
// data-da=calss, index(last, first), media
// ---------------------------------------------- 

var originalPositions = [];
var daElements = document.querySelectorAll('[data-da]');
var daElementsArray = [];
var daMatchMedia = [];
//Заполняем массивы
if (daElements.length > 0) {
	var number = 0;
	for (var index = 0; index < daElements.length; index++) {
		var daElement = daElements[index];
		var daMove = daElement.getAttribute('data-da');
		if (daMove != '') {
			var daArray = daMove.split(',');
			var daPlace = daArray[1] ? daArray[1].trim() : 'last';
			var daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
			var daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
			var daDestination = document.querySelector('.' + daArray[0].trim())
			if (daArray.length > 0 && daDestination) {
				daElement.setAttribute('data-da-index', number);
				//Заполняем массив первоначальных позиций т
				originalPositions[number] = {
					"parent": daElement.parentNode,
					"index": indexInParent(daElement)
				};
				//Заполняем массив элементов 
				daElementsArray[number] = {
					"element": daElement,
					"destination": document.querySelector('.' + daArray[0].trim()),
					"place": daPlace,
					"breakpoint": daBreakpoint,
					"type": daType
				}
				number++;
			}
		}
	}
	dynamicAdaptSort(daElementsArray);

	//Создаем события в точке брейкпоинта
	for (var index = 0; index < daElementsArray.length; index++) {
		var el = daElementsArray[index];
		var daBreakpoint = el.breakpoint;
		var daType = el.type;

		daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
		daMatchMedia[index].addListener(dynamicAdapt);
	}
}
//Основная функция
function dynamicAdapt(e) {
	for (var index = 0; index < daElementsArray.length; index++) {
		var el = daElementsArray[index];
		var daElement = el.element;
		var daDestination = el.destination;
		var daPlace = el.place;
		var daBreakpoint = el.breakpoint;
		var daClassname = "_dynamic_adapt_" + daBreakpoint;

		if (daMatchMedia[index].matches) {
			//Перебрасываем элементы
			if (!daElement.classList.contains(daClassname)) {
				var actualIndex = indexOfElements(daDestination)[daPlace];
				if (daPlace === 'first') {
					actualIndex = indexOfElements(daDestination)[0];
				} else if (daPlace === 'last') {
					actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
				}
				daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
				daElement.classList.add(daClassname);
			}
		} else {
			//Возвращаем на место
			if (daElement.classList.contains(daClassname)) {
				dynamicAdaptBack(daElement);
				daElement.classList.remove(daClassname);
			}
		}
	}

}

//Вызов основной функции
dynamicAdapt();

//Функция возврата на место
function dynamicAdaptBack(el) {
	var daIndex = el.getAttribute('data-da-index');
	var originalPlace = originalPositions[daIndex];
	var parentPlace = originalPlace['parent'];
	var indexPlace = originalPlace['index'];
	var actualIndex = indexOfElements(parentPlace, true)[indexPlace];
	parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
}
//Функция получения индекса внутри родителя
function indexInParent(el) {
	var children = Array.prototype.slice.call(el.parentNode.children);
	return children.indexOf(el);
}
//Функция получения массива индексов элементов внутри родителя 
function indexOfElements(parent, back) {
	var children = parent.children;
	var childrenArray = [];
	for (var i = 0; i < children.length; i++) {
		var childrenElement = children[i];
		if (back) {
			childrenArray.push(i);
		} else {
			//Исключая перенесенный элемент
			if (childrenElement.getAttribute('data-da') == null) {
				childrenArray.push(i);
			}
		}
	}
	return childrenArray;
}
//Сортировка объекта
function dynamicAdaptSort(arr) {
	arr.sort(function (a, b) {
		if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
	});
	arr.sort(function (a, b) {
		if (a.place > b.place) { return 1 } else { return -1 }
	});
}
