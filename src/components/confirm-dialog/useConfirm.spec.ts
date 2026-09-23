import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import ConfirmDialog from './ConfirmDialog.vue';
import { useConfirm, useConfirmState } from './useConfirm';

describe('useConfirm', () => {
  afterEach(() => {
    useConfirmState().value = null;
  });

  it('should call the accept callback when the action button is clicked', async () => {
    mount(ConfirmDialog, { attachTo: document.body });

    const accept = vi.fn();
    useConfirm().require({ message: 'Are you sure?', acceptButtonText: 'Confirm', accept });
    await flushPromises();

    await new DOMWrapper(document.body).getElementByText('button', 'Confirm').trigger('click');

    expect(accept).toHaveBeenCalledTimes(1);
  });

  it('should call the reject callback when the cancel button is clicked', async () => {
    mount(ConfirmDialog, { attachTo: document.body });

    const reject = vi.fn();
    useConfirm().require({ message: 'Are you sure?', acceptButtonText: 'Confirm', accept: vi.fn(), reject });
    await flushPromises();

    await new DOMWrapper(document.body).getElementByText('button', 'Cancel').trigger('click');

    expect(reject).toHaveBeenCalledTimes(1);
  });
});
