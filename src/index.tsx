import * as React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip'

type TCopy = (result: boolean) => void;

interface ITip {
  success?: string;
  error?: string;
  hover?: string;
}

type TStatus = 'hover' | 'success' | 'error';

interface ICopyToCliboardState {
  status: TStatus;
}

interface ICopyToClipboardProps extends React.HTMLAttributes<HTMLSpanElement> {
  text?: string | null;
  copy?: TCopy;
  tip: ITip;
}

let toolTipId = 0;
class CopyToClipboard extends React.Component<ICopyToClipboardProps, ICopyToCliboardState> {
  public static defaultProps = {
    text: null,
    copy: () => {},
    tip: null,
    className: '',
  }

  public state = {
    status: ('hover' as TStatus),
  }

  private id = toolTipId++;
  public render() {
    const {
      tip,
      copy,
      onClick,
      children,
      className,
      ...props
    } = this.props;
    const { status } = this.state;
    const t = this.getTip();

    return (
      <>
        {
          t !== null
          && <ReactTooltip
              type='success'
              effect='solid'
              id={`tooltip-${this.id}`}
            >
              <span>
                {
                  t[status]
                }
              </span>
            </ReactTooltip>
        }
        <span
          data-tip
          ref={this.spanRef}
          onClick={this.clickHandler}
          data-for={`tooltip-${this.id}`}
          style={{ cursor: 'pointer ' }}
          {...props}
        >
          {children}
        </span>
      </>
    );
  }

  spanRef = React.createRef<HTMLSpanElement>();
  private clickHandler = async () => {
    const { text, copy } = this.props;
    // 要复制的内容
    let content: null | string = null;

    // 如果 props 没有传递 text
    // 就使用 children 的文字 
    if (text !== undefined) {
      content = text;
    } else {
      const { current } = this.spanRef;
      if (current !== null) {
        content = current.textContent;
      }
    }

    let r; // 复制的结果
    // 如果内容为 null, 复制失败
    if (content === null) {
      r = false;
    } else {
      r = copyToClipboard(content);
    }

    (copy as TCopy)(r);
    if (r) {
      this.setState({
        status: 'success',
      });
    } else {
      this.setState({
        status: 'error',
      })
    }

    setTimeout(() => {
      this.setState({
        status: 'hover',
      })
    }, 1500);
  }

  // private getTipType = () => {
  //   const { status } = this.state;
    
  //   switch (status) {
  //     case 'hover':
  //       return 'info';
  //     case 'success':
  //       return 'success';
  //     case 'error':
  //       return 'error';
  //     default:
  //       return 'info';
  //   }
  // }

  private getTip = () : null | ITip => {
    const { tip } = this.props;
    const defaultTip: ITip = {
      hover: '点击复制',
      success: '复制成功',
      error: '复制失败',
    }
    if (tip === null) return null;
    return {
      ...defaultTip,
      ...tip,
    }
  }
}

export default CopyToClipboard;
