/* tslint:disable */
import * as React from 'react';
import { shallow } from 'enzyme';
import fs from 'fs';
import puppeteer from 'puppeteer';
import CopyToClipboard from '../index';

jest.setTimeout(30000);

async function initPage() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Green Program\\chromium\\chrome.exe',
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/');
  return { page, browser };
}

async function getRect(page: puppeteer.Page, ele: puppeteer.ElementHandle<Element> | null) {
  const rect = await page.evaluate((container): ClientRect => {
    const { width, height, left, top, bottom, right } = container.getBoundingClientRect();
    return { width, height, left, top, bottom, right }
  }, ele);
  return rect;
}

describe('渲染测试', () => {
  it('渲染子节点测试', () => {
    const wrapper = shallow(
      <CopyToClipboard>
        一行测试文字
      </CopyToClipboard>
    );
  
    expect(wrapper.exists('span[data-tip]')).toBe(true);
    expect(wrapper.contains('一行测试文字')).toBe(true);
  });

  it('渲染包裹元素子节点', () => {
    const wrapper = shallow(
      <CopyToClipboard>
        <a href='http://www.google.com'>一行测试文字</a>
      </CopyToClipboard>
    );

    expect(wrapper.contains(<a href='http://www.google.com'>一行测试文字</a>)).toBe(true);
  });

  it('status change', async () => {
    const { page, browser } = await initPage();
    try {
      const tip = await page.$('#root .demo [data-tip]');
      const toolTip = await page.$('#root .demo .__react_component_tooltip');
      expect(toolTip).not.toEqual(null);
      if (toolTip !== null) {
        // const text = await page.evaluate(element => element.textContent, element);
        // const text = await (await element.getProperty('textContent')).jsonValue();
        fs.writeFileSync('./test', await (await toolTip.getProperty('textContent')).jsonValue())
        expect(await page.evaluate(element => element.textContent, toolTip)).toEqual('点击复制');
      }

      expect(tip).not.toEqual(null);
      if (tip !== null) {
        await tip.click();
        expect(await page.evaluate(element => element.textContent, toolTip)).toEqual('复制成功');
      }
    } finally {
      await page.close();
    }
  });
});


