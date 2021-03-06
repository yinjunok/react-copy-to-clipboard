import * as React from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import './sty.less';
import CopyToClipboard from '../src/index';

setConfig({
  ignoreSFC: true, // RHL will be __completely__ disabled for SFC
  pureRender: true, // RHL will not change render method
});

class App extends React.Component {
  public render() {
    return (
      <div className='demo'>
        <CopyToClipboard tip={{ hover: '点击复制' }} text='一行白鹭上青天abcd'>
          aaaaaaaaaaaaa
        </CopyToClipboard>
      </div>
    );
  }
}

export default hot(App);
// export default App;
