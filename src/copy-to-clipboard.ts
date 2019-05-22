// const ele = document.getElementById('demo');
// const range = document.createRange();
// range.selectNode(ele);

// const select = document.getSelection();
// select.addRange(range);
// document.execCommand('copy');

export default function(text: string): boolean {
  // 为了获取选区, 创建辅助元素
  
  const tempEle = document.createElement('span');
  tempEle.style.whiteSpace = 'pre';
  tempEle.style.opacity = '0';
  tempEle.style.position = 'fixed';
  tempEle.style.top = '0px;';
  tempEle.textContent = text;
  document.body.appendChild(tempEle);
  console.log(text)
  console.log(tempEle)
  tempEle.addEventListener('copy', function(e) {
    console.log(e);
  })
  
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(tempEle);
  
  try {
    if (selection !== null) {
      selection.removeAllRanges()
      selection.addRange(range);
      const result = document.execCommand('copy');
      console.log(result);
      return result;
    } else {
      return false;
    }
  } finally {
    document.body.removeChild(tempEle);
  }
}
