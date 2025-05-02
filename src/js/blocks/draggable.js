import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable.js';
gsap.registerPlugin(Draggable);

export function draggableCMS() {
	const container = document.querySelector('.cms-panel__main');
	if (!container) return;

	let gutter = 8;
	let zIndex = 1000;
	let threshold = 0.01;

	let blocksList = container.querySelectorAll('.cms-panel__block');
	if (!blocksList.length) return;

	const previewPage = document.querySelector('.preview-page');
	let previewSections = previewPage
		? previewPage.querySelectorAll('.preview-page__section')
		: [];
	const sectionsMap = new Map();

	initialize();

	function initialize() {
		gsap.set(container, { height: 'auto' });

		if (previewPage && previewSections.length === blocksList.length) {
			blocksList.forEach((block, index) => {
				sectionsMap.set(block, previewSections[index]);
			});
		}

		blocksList.forEach((block, index) => {
			block.tile = {
				row: null,
				index: index,
				isDragging: false,
				lastIndex: index,
				inBounds: true,
				positioned: false,
				x: 0,
				y: 0,
				height: block.offsetHeight,
			};

			Draggable.create(block, {
				type: 'y',
				bounds: container,
				onDrag: onDrag,
				onPress: onPress,
				onRelease: onRelease,
				zIndexBoost: false,
			});
		});

		layoutUpdate();

		window.addEventListener('resize', layoutUpdate);
	}

	function onPress() {
		const tile = this.target.tile;
		tile.isDragging = true;
		tile.lastIndex = Array.from(container.children).indexOf(this.target);

		gsap.set(this.target, { zIndex: ++zIndex });

		if (previewPage && sectionsMap.has(this.target)) {
			const previewSection = sectionsMap.get(this.target);
			gsap.to(previewSection, {
				boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
				duration: 0.2,
			});
		}
	}

	function onDrag() {
		const draggedElement = this.target;
		const draggedTile = draggedElement.tile;

		if (!this.hitTest(container, 0)) {
			draggedTile.inBounds = false;
			return;
		}

		draggedTile.inBounds = true;

		const firstBlock = container.firstElementChild;
		if (firstBlock && firstBlock !== draggedElement) {
			const firstBlockRect = firstBlock.getBoundingClientRect();
			const draggedRect = draggedElement.getBoundingClientRect();

			if (
				draggedRect.top <
				firstBlockRect.top + firstBlockRect.height * threshold
			) {
				container.insertBefore(draggedElement, firstBlock);
				updateBlocksList();
				updatePreviewSectionsOrder();
				quickLayout();
				return;
			}
		}

		Array.from(blocksList).forEach((block) => {
			if (block === draggedElement) return;

			const blockRect = block.getBoundingClientRect();
			const draggedRect = draggedElement.getBoundingClientRect();

			const blockMiddle = blockRect.top + blockRect.height / 2;
			const draggedMiddle = draggedRect.top + draggedRect.height / 2;

			const overlapThreshold = blockRect.height * threshold;

			if (
				draggedMiddle < blockMiddle &&
				Math.abs(draggedMiddle - blockMiddle) > overlapThreshold &&
				!block.isMoving
			) {
				const blockIndex = Array.from(container.children).indexOf(block);
				const draggedIndex = Array.from(container.children).indexOf(
					draggedElement
				);

				if (blockIndex < draggedIndex) {
					block.isMoving = true;
					container.insertBefore(draggedElement, block);
					updateBlocksList();
					updatePreviewSectionsOrder();

					quickLayout();

					setTimeout(() => {
						block.isMoving = false;
					}, 50);
				}
			} else if (
				draggedMiddle > blockMiddle &&
				Math.abs(draggedMiddle - blockMiddle) > overlapThreshold &&
				!block.isMoving
			) {
				const blockIndex = Array.from(container.children).indexOf(block);
				const draggedIndex = Array.from(container.children).indexOf(
					draggedElement
				);

				if (blockIndex > draggedIndex) {
					block.isMoving = true;
					if (block.nextElementSibling) {
						container.insertBefore(draggedElement, block.nextElementSibling);
					} else {
						container.appendChild(draggedElement);
					}
					updateBlocksList();
					updatePreviewSectionsOrder();

					quickLayout();

					setTimeout(() => {
						block.isMoving = false;
					}, 50);
				}
			}
		});
	}

	function quickLayout() {
		let yPosition = 0;

		Array.from(blocksList).forEach((block, index) => {
			const tile = block.tile;
			tile.index = index;
			tile.row = index;
			tile.y = yPosition;

			if (!tile.isDragging) {
				gsap.to(block, {
					y: yPosition,
					duration: 0.2,
					overwrite: true,
				});
			}

			yPosition += block.offsetHeight + gutter;
		});

		const totalHeight = yPosition > 0 ? yPosition - gutter : 0;
		gsap.to(container, {
			height: totalHeight,
			duration: 0.2,
		});
	}

	function onRelease() {
		const tile = this.target.tile;

		tile.isDragging = false;

		if (previewPage && sectionsMap.has(this.target)) {
			const previewSection = sectionsMap.get(this.target);
			gsap.to(previewSection, {
				boxShadow: 'none',
				duration: 0.2,
			});
		}

		layoutUpdate();
	}

	function updateBlocksList() {
		blocksList = container.querySelectorAll('.cms-panel__block');
	}

	function updatePreviewSectionsOrder() {
		if (!previewPage || previewSections.length !== blocksList.length) return;

		const currentBlocksOrder = Array.from(container.children);

		const newSectionsOrder = [];

		currentBlocksOrder.forEach((block) => {
			if (sectionsMap.has(block)) {
				newSectionsOrder.push(sectionsMap.get(block));
			}
		});

		newSectionsOrder.forEach((section) => {
			previewPage.appendChild(section);
		});

		previewSections = previewPage.querySelectorAll('.preview-page__section');
	}

	function layoutUpdate() {
		let yPosition = 0;

		Array.from(blocksList).forEach((block, index) => {
			const tile = block.tile;
			if (tile) {
				tile.index = index;
				tile.row = index;
				tile.y = yPosition;
				tile.positioned = true;
			}

			gsap.to(block, {
				y: yPosition,
				duration: 0.3,
				overwrite: true,
				clearProps: 'zIndex',
			});

			yPosition += block.offsetHeight + gutter;
		});

		const totalHeight = yPosition > 0 ? yPosition - gutter : 0;
		gsap.to(container, {
			height: totalHeight,
			duration: 0.3,
		});
	}
}
