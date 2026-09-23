import { downloadBlob } from './download-blob';

describe('downloadBlob', () => {
  const objectUrl = 'blob:shonk-ui/table';

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => objectUrl);
    URL.revokeObjectURL = vi.fn();
  });

  function download(fileName: string) {
    const links: { href: string; download: string; inDocument: boolean }[] = [];

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(this: HTMLAnchorElement) {
      links.push({ href: this.href, download: this.download, inDocument: this.isConnected });
    });

    downloadBlob(new Blob(['table']), fileName);

    return links;
  }

  it('should click a link to the blob named after the file', () => {
    expect(download('table.csv')).toEqual([{ href: objectUrl, download: 'table.csv', inDocument: true }]);
  });

  it('should leave neither the link nor the object url behind', () => {
    download('table.csv');

    expect(document.querySelector('a')).toBe(null);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(objectUrl);
  });
});
