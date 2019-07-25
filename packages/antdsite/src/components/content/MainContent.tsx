import React from 'react';
import { Link } from 'gatsby';
import { Badge, Row, Col, Menu, Icon, Affix } from 'antd';
import classNames from 'classnames';
import MobileMenu from 'rc-drawer';
import Article from './Article';
import { IGraphqlFrontmatterData, IMarkDownFields, Toc } from '../../templates/docs';
import { PageInfo } from '../utils';
import { PageContext } from '../../layout/PageContext';

const { SubMenu } = Menu;

function getFlatMenuList(menuList: PageInfo[]): PageInfo[] {
  return menuList.reduce((pre, cur) => {
    return (cur.children && cur.children.length
      ? getFlatMenuList(cur.children).concat(cur)
      : [cur]
    ).concat(pre);
  }, []);
}

function getActiveMenuItem(slug: string, currentPageSidebarItems: PageInfo[]): PageInfo {
  const newMenusList = getFlatMenuList(currentPageSidebarItems);
  const activeMenu = newMenusList.find(menu => menu.slug == slug);
  if (!activeMenu) return { title: '', slug: '', children: [] };

  return activeMenu;
}

export interface MainContentProps {
  isMobile: boolean;
  location: {
    pathname: string;
  };
  localizedPageData: {
    meta: IGraphqlFrontmatterData & IMarkDownFields;
    toc: Toc;
    code: {
      body: string;
    };
  };
}

interface MainContentState {
  openKeys: string[];
}
export default class MainContent extends React.PureComponent<MainContentProps, MainContentState> {
  static contextType = PageContext;

  constructor(props: MainContentProps) {
    super(props);
    this.state = {
      openKeys: [],
    };
  }

  scroller: any;

  componentDidMount() {
    this.chekScrollPosition();
    this.setState({
      openKeys: (this.getSideBarOpenKeys() || []) as Array<string>,
    });
  }

  componentWillReceiveProps() {
    const openKeys = this.getSideBarOpenKeys() as Array<string>;
    if (openKeys) {
      this.setState({
        openKeys,
      });
    }
  }
  componentDidUpdate(prevProps: MainContentProps) {
    this.chekScrollPosition(prevProps.localizedPageData.meta.slug);
  }

  componentWillUnmount() {
    this.scroller && this.scroller.destroy();
  }

  handleMenuOpenChange = (openKeys: string[]) => {
    this.setState({
      openKeys,
    });
  };
  getSideBarOpenKeys() {
    const { currentPageSidebarItems: menuList } = this.context;
    const newMenusList = getFlatMenuList(menuList);
    return newMenusList.filter(menu => !menu.collapsable).map(menu => menu.title);
  }

  generateMenuItem = ({ before = null, after = null }, item: PageInfo) => {
    if (!item.title) {
      return;
    }

    const text = [
      <span key="english">{item.title}</span>,
      <span className="chinese" key="chinese">
        {item.subtitle}
      </span>,
    ];

    const disabled = item.disabled;

    const child = !item.link ? (
      <Link to={item.slug || ''}>
        {before}
        {text}
        {after}
      </Link>
    ) : (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="menu-item-link-outside"
      >
        {before}
        {text} <Icon type="export" />
        {after}
      </a>
    );
    return (
      <Menu.Item key={item.slug || item.link} disabled={disabled}>
        {item.important ? <Badge dot={item.important}>{child}</Badge> : child}
      </Menu.Item>
    );
  };

  chekScrollPosition(slug?: string) {
    if (!window.location.hash && slug && slug !== location.pathname) {
      window.scrollTo(0, 0);
    } else if (window.location.hash) {
      const element = document.getElementById(
        decodeURIComponent(window.location.hash.replace('#', ''))
      );
      setTimeout(() => {
        if (element) {
          element.scrollIntoView(true);
        }
      }, 100);
    }
  }

  generateSubMenuItems = (menus?: PageInfo[], footerNavIcons = {}) => {
    if (!menus) return [];
    const generateMenuItem = this.generateMenuItem.bind(this, footerNavIcons);
    const itemGroups = menus.map(menu => {
      if (!menu.children || !menu.children.length) {
        return generateMenuItem(menu);
      }

      const groupItems = menu.children.map(this.generateMenuItem.bind(this, footerNavIcons));
      return (
        <SubMenu title={menu.title} key={menu.title}>
          {groupItems}
        </SubMenu>
      );
    });
    return itemGroups;
  };

  getMenuItems = (footerNavIcons = {}) => {
    const moduleData = this.context.currentPageSidebarItems;

    return this.generateSubMenuItems(moduleData, footerNavIcons);
  };

  getPreAndNext = (menuItems: any) => {
    const {
      localizedPageData: {
        meta: { slug },
      },
    } = this.props;

    const list = menuItems.length
      ? Object.keys(menuItems).reduce((pre, key) => {
          const ch = menuItems[key].props.children;
          return pre.concat(ch.length ? ch : menuItems[key]);
        }, [])
      : menuItems;

    const index = list.findIndex((item: any) => {
      return item.key === slug;
    });

    if (index === -1) {
      return {};
    }
    return {
      prev: list[index - 1],
      next: list[index + 1],
    };
  };

  render() {
    const { localizedPageData, isMobile } = this.props;

    const activeMenuItem = getActiveMenuItem(
      this.props.localizedPageData.meta.slug,
      this.context.currentPageSidebarItems
    );

    const menuItems = this.getMenuItems();
    const { prev, next } = this.getPreAndNext(menuItems);

    const mainContainerClass = classNames('main-container', {});

    const { openKeys } = this.state;
    const menuChild = (
      <Menu
        inlineIndent={16}
        className="aside-container"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={[(activeMenuItem && activeMenuItem.slug) || '/']}
        onOpenChange={this.handleMenuOpenChange}
      >
        {menuItems}
      </Menu>
    );
    return (
      <div className="main-wrapper">
        <Row>
          {isMobile ? (
            <MobileMenu key="mobile-menu" wrapperClassName="drawer-wrapper">
              {menuChild}
            </MobileMenu>
          ) : (
            <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} className="main-menu">
              <Affix offsetTop={70}>
                <section className="main-menu-inner">{menuChild}</section>
              </Affix>
            </Col>
          )}
          <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
            <div className={mainContainerClass}>
              <Article
                {...this.props}
                content={localizedPageData}
                currentPageTitle={activeMenuItem && activeMenuItem.title}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={{ span: 20, offset: 4 }} md={24} sm={24} xs={24}>
            <section className="prev-next-nav">
              {prev ? (
                <div className="prev-page">
                  <Icon className="footer-nav-icon-before" type="left" />
                  {prev.props.children}
                </div>
              ) : null}
              {next ? (
                <div className="next-page">
                  {next.props.children}
                  <Icon className="footer-nav-icon-after" type="right" />
                </div>
              ) : null}
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}
