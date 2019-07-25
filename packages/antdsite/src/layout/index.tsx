import React from 'react';
import ReactDom from 'react-dom';
import Media from 'react-media';
import '../assets/style';
import Header from './Header';
import Footer from './Footer';
import { PageContext } from './PageContext';
import { getcurrentLocaleConfigBySlug, resolveSidebarItems } from '../components/utils';
import { BackTop } from 'antd';
import { IAllMdxData } from '../templates/docs';

interface LayoutProps {
  pageContext: {
    webConfig: any;
    slug: string;
  };
  data: {
    mdx: {
      frontmatter: any;
    };
    allMdx: IAllMdxData;
  };
  isMobile: boolean;
  children: React.ReactElement<LayoutProps>;
}

interface LayoutState {}

export class Layout extends React.Component<LayoutProps, LayoutState> {
  constructor(props: LayoutProps) {
    super(props);
  }

  render() {
    const { children, pageContext, ...restProps } = this.props;
    const { webConfig, slug } = pageContext;
    const { locales } = webConfig;

    return (
      <div
        className={`page-wrapper ${((!locales && slug == '/') ||
          (locales && Object.keys(locales).includes(slug))) &&
          'index-page-wrapper'}`}
      >
        <Header {...restProps} ref="header" />
        {React.cloneElement(children, {
          ...children.props,
          isMobile: restProps.isMobile,
          ref: 'content',
        })}
        <Footer {...restProps} ref="footer" />
        <BackTop />
      </div>
    );
  }

  componentDidMount() {
    this.ajustScrollbarHeight();
    window.addEventListener('resize', this.ajustScrollbarHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.ajustScrollbarHeight);
  }

  componentDidUpdate() {
    this.ajustScrollbarHeight();
  }

  ajustScrollbarHeight = () => {
    const contentDom = ReactDom.findDOMNode(this.refs.content) as HTMLDivElement;
    const header = ReactDom.findDOMNode(this.refs.header) as HTMLDivElement;
    const footer = ReactDom.findDOMNode(this.refs.footer) as HTMLDivElement;
    if (!contentDom) return;

    contentDom.style.minHeight =
      window.innerHeight -
      (header ? header.offsetHeight : 0) -
      (footer ? footer.offsetHeight : 0) +
      'px';
  };

  renderPanel = (props: any) => {
    const mergeProps = { ...props, id: 'layout-panel' };
    return <div {...mergeProps} />;
  };
}

const WrapperLayout = (props: LayoutProps) => {
  const { pageContext } = props;
  const { currentLocaleWebConfig } = getcurrentLocaleConfigBySlug(
    pageContext.webConfig,
    pageContext.slug
  );

  const sidebarItems = resolveSidebarItems(
    props.data.allMdx,
    pageContext.webConfig,
    pageContext.slug
  );

  return (
    <PageContext.Provider value={{ ...pageContext, currentLocaleWebConfig, ...sidebarItems }}>
      <Media query="(max-width: 996px)">
        {isMobile => {
          const isNode = typeof window === `undefined`;
          return <Layout {...props} isMobile={isMobile && !isNode} />;
        }}
      </Media>
    </PageContext.Provider>
  );
};
export default WrapperLayout;
