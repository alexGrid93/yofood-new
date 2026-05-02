export const writeClipboard = async (content: string): Promise<void> => {
  const type = 'text/plain'
  const clipboardItemData = {
    [type]: content,
  }
  const clipboardItem = new ClipboardItem(clipboardItemData)
  await navigator.clipboard.write([clipboardItem])
};
