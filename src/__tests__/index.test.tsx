/* tslint:disable */
import * as React from 'react';
import { shallow } from 'enzyme';
import CopyToClipboard from '../index';

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
});
