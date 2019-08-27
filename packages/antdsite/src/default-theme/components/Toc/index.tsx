import React from 'react';
import { Anchor } from 'antd';
import { OneToc } from '../../../templates';
import { PageContext } from 'antdsite';

const Link = Anchor.Link;

export default class Toc extends React.PureComponent<{ affix?: boolean }> {
  static contextType = PageContext;

  getTocs = (toc: OneToc): any => {
    return (
      <Link key={toc.url} href={toc.url} title={toc.title}>
        {toc.items && toc.items.map(this.getTocs)}
      </Link>
    );
  };

  render() {
    const { currentPageInfo } = this.context;
    const { affix } = this.props;

    return currentPageInfo.tableOfContents.items && currentPageInfo.tableOfContents.items.length ? (
      <div className={` ${affix ? 'toc-affix' : 'toc-unfixed'}`}>
        <Anchor
          affix={affix}
          offsetTop={70}
          className={`toc ${affix ? 'toc-affix' : ''}`}
          targetOffset={0}
        >
          {currentPageInfo.tableOfContents.items.map(this.getTocs)}
        </Anchor>
      </div>
    ) : null;
  }
}
