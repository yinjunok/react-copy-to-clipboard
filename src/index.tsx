import * as React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip'
import './copy.less';

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
  copyText?: string | null;
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
      copy,
      onClick,
      children,
      className,
      ...props
    } = this.props;

    const tip = this.getTip();
    const tipType = this.getTipType();

    return (
      <>
        {
          tip !== null
          && <ReactTooltip
              type={tipType}
              effect='solid'
              id={`tooltip-${this.id}`}
            >
              <span
                ref={this.spanRef}
                onClick={this.clickHandler}
                {...props}
              >
                {tip.hover}
              </span>
            </ReactTooltip>
        }
        <span
          data-tip
          data-for={`tooltip-${this.id}`}
          className={`copy-container ${className}`}
        >
          {children}
        </span>
      </>
    );
  }

  spanRef = React.createRef<HTMLSpanElement>();
  private clickHandler = async () => {
    const { copyText, copy } = this.props;
    let content: null | string = null;

    if (copyText !== undefined) {
      content = copyText;
    } else {
      const { current } = this.spanRef;
      if (current !== null) {
        content = current.textContent;
      }
    }

    if (content === null) {
      (copy as TCopy)(false);
      return;
    } else {
      copyToClipboard(content);
      (copy as TCopy)(false);
    }
  }

  private getTipType = () => {
    const { status } = this.state;
    switch (status) {
      case 'hover':
        return 'info';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }

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
