import React from 'react';
import { Anchor } from 'antd';
import EditButton from './EditButton';
import { IGraphqlFrontmatterData, IMarkDownFields, Toc, OneToc } from '../../templates/docs';
import moment from 'moment';
import AvatarList from './AvatarList';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import { PageContext } from '../../layout/PageContext';
import SEO from '../SEO/SEO';

const Link = Anchor.Link;

interface ArticleProps {
  content: {
    meta: IGraphqlFrontmatterData & IMarkDownFields;
    toc: Toc;
    code: {
      body: string;
    };
  };
  currentPageTitle: string;
}

export default class Article extends React.PureComponent<ArticleProps> {
  static contextType = PageContext;

  node: HTMLElement | null | undefined;

  getTocs = (toc: OneToc) => {
    return (
      <Link key={toc.url} href={toc.url} title={toc.title}>
        {toc.items && toc.items.map(this.getTocs)}
      </Link>
    );
  };

  render() {
    const props = this.props;
    const { content, currentPageTitle } = props;
    const { meta } = content;
    const { subtitle, path, modifiedTime, avatarList } = meta;
    const {
      currentLocaleWebConfig: {
        title,
        description,
        themeConfig: { lastUpdated, editLinkText, repo, docsRepo, docsBranch, showAvatarList },
      },
    } = this.context;
    const noAvatar = !showAvatarList || !avatarList || !avatarList.length;

    return (
      <>
        <SEO title={`${currentPageTitle} | ${title}`} description={description} />
        <article
          className="markdown"
          ref={node => {
            this.node = node;
          }}
        >
          <h1>
            {currentPageTitle}
            {!subtitle ? null : <span className="subtitle">{subtitle}</span>}
            <EditButton
              sourcePath={`https://github.com/${docsRepo || repo}/edit/${docsBranch}/`}
              title={editLinkText}
              filename={path}
            />
          </h1>

          {lastUpdated && (
            <div className={`modifiedTime ${noAvatar ? 'no-avatar-list' : ''}`}>
              {!noAvatar && <AvatarList avatarList={avatarList} />}
              {lastUpdated} {moment(modifiedTime).format('YYYY-MM-DD HH:mm:SS')}
            </div>
          )}

          {!content.toc.items.length ? null : (
            <div className="toc-affix">
              <Anchor offsetTop={70} className="toc">
                {content.toc.items.map(this.getTocs)}
              </Anchor>
            </div>
          )}
          <section className="markdown api-container">
            <MDXRenderer>{content.code.body}</MDXRenderer>
          </section>
        </article>
      </>
    );
  }
}
