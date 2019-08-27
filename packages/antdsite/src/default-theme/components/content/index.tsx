import React from 'react';
import EditButton from './EditButton';
import moment from 'moment';
import AvatarList from './AvatarList';
import { PageContext } from 'antdsite';
import SEO from '../SEO/SEO';
import { getPageTitle } from '../utils';
import PrevAndNext from '../prevAndNext';
import Toc from '../Toc';

export default class Article extends React.PureComponent<{
  prev: React.Component | null;
  next: React.Component | null;
  isMoblie: boolean;
}> {
  static contextType = PageContext;
  node: HTMLElement | null | undefined;

  getPageTitle = (currentPageTitle: string, webAppName: string) => {
    return currentPageTitle ? `${currentPageTitle} | ${webAppName}` : webAppName;
  };

  render() {
    const {
      currentPageInfo,
      currentPageContent,
      currentLocaleWebConfig: {
        title,
        lang,
        description,
        head,
        themeConfig: {
          lastUpdated,
          editLinkText,
          editLinks,
          repo,
          docsRepo,
          docsBranch,
          showAvatarList,
          editLink
        }
      }
    } = this.context;

    const { subtitle, disableEditLink, disableUpdateTime } = currentPageInfo.frontmatter;
    const { path, modifiedTime, avatarList } = currentPageInfo.fields;
    const noAvatar = !showAvatarList || !avatarList || !avatarList.length;
    const editPath = this.getEditLink(editLink, docsRepo || repo, docsBranch, path);

    const currentPageTitle = getPageTitle(currentPageInfo);

    const { prev, next, isMoblie } = this.props;
    return (
      <>
        <SEO
          head={head as Array<any>}
          lang={lang}
          title={this.getPageTitle(currentPageTitle, title)}
          description={description}
        />
        <div className="main-container">
          <article
            className="markdown"
            ref={node => {
              this.node = node;
            }}
          >
            {(docsRepo || repo) && editLinkText && editLinks && !disableEditLink ? (
              <h1>
                {currentPageTitle}
                {!subtitle ? null : <span className="subtitle">{subtitle}</span>}

                <EditButton path={editPath} title={editLinkText} />
              </h1>
            ) : null}

            {lastUpdated && !disableUpdateTime && (
              <div className={`modifiedTime ${noAvatar ? 'modifiedTimeLeft' : ''}`}>
                {!noAvatar && <AvatarList avatarList={avatarList} />}
                {lastUpdated} {moment(modifiedTime).format('YYYY-MM-DD HH:mm:SS')}
              </div>
            )}

            {!isMoblie ? <Toc affix /> : null}
            <section className="markdown api-container">
              {React.createElement(currentPageContent)}
            </section>
            <PrevAndNext prev={prev} next={next} />
          </article>
        </div>
      </>
    );
  }
  getEditLink(editLink: string, docsRepo: string, docsBranch: string, path: string) {
    if (editLink) return editLink;

    const bitbucket = /bitbucket.org/;
    if (bitbucket.test(docsRepo)) {
      return (
        docsRepo +
        `/src` +
        `/${docsBranch}/` +
        path +
        `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
      );
    }

    const gitee = /gitee.com/;
    if (gitee.test(docsRepo)) {
      return `${docsRepo}/edit/${docsBranch}/${path}`;
    }

    return `https://github.com/${docsRepo}/edit/${docsBranch}/${path}`;
  }
}
