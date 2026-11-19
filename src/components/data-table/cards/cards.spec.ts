import { orderCardFieldIds, resolveCardSlots, selectedCardFieldIds, sortOnlyBy } from './cards';

describe('resolveCardSlots', () => {
	it('should make the first headed column the title, headless columns actions and the rest fields', () => {
		const slots = resolveCardSlots([
			{ id: 'select', header: undefined, card: 'select' },
			{ id: 'favorite', header: '' },
			{ id: 'token', header: 'Token' },
			{ id: 'price', header: 'Price' },
			{ id: 'menu', header: undefined },
		]);

		expect(Object.fromEntries(slots)).toEqual({ select: 'select', favorite: 'action', token: 'title', price: 'field', menu: 'action' });
	});

	it('should keep an explicit title and let the first headed column be a field', () => {
		const slots = resolveCardSlots([
			{ id: 'created', header: 'Created' },
			{ id: 'comment', header: 'Comment', card: 'title' },
			{ id: 'trash', header: '', card: 'hidden' },
		]);

		expect(Object.fromEntries(slots)).toEqual({ created: 'field', comment: 'title', trash: 'hidden' });
	});
});

describe('selectedCardFieldIds', () => {
	const fieldIds = ['price', 'atr', 'mfi', 'adx'];

	it('should follow the table visibility until the card fields are picked', () => {
		const ids = selectedCardFieldIds({ fieldIds, columnVisibility: { atr: false }, cardVisibility: {} });

		expect(ids).toEqual(['price', 'mfi', 'adx']);
	});

	it('should show only the picked card fields once any is picked', () => {
		const ids = selectedCardFieldIds({ fieldIds, columnVisibility: { atr: false }, cardVisibility: { atr: true, price: false } });

		expect(ids).toEqual(['atr']);
	});
});

describe('orderCardFieldIds', () => {
	it('should put the sorted fields first in sort order, even when they are not picked', () => {
		const ids = orderCardFieldIds(['price', 'mfi'], ['price', 'atr', 'mfi', 'adx'], [{ id: 'adx', desc: true }, { id: 'token', desc: false }, { id: 'mfi', desc: false }]);

		expect(ids).toEqual(['adx', 'mfi', 'price']);
	});
});

describe('sortOnlyBy', () => {
	it('should replace every level with the tapped field in its first direction', () => {
		const sorting = [{ id: 'price', desc: false }, { id: 'atr', desc: true }];

		expect(sortOnlyBy(sorting, { id: 'volume', descFirst: true })).toEqual([{ id: 'volume', desc: true }]);
	});

	it('should keep the direction of a field that was a lower level', () => {
		const sorting = [{ id: 'price', desc: false }, { id: 'atr', desc: false }];

		expect(sortOnlyBy(sorting, { id: 'atr', descFirst: true })).toEqual([{ id: 'atr', desc: false }]);
	});

	it('should flip the direction when the field is already the only level', () => {
		expect(sortOnlyBy([{ id: 'atr', desc: true }], { id: 'atr', descFirst: true })).toEqual([{ id: 'atr', desc: false }]);
	});
});
