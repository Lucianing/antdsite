import './introduction.less'

# 介绍

AntdSite 是一个基于[Ant Design](https://ant.design)，由[GatsbyJs](https://www.gatsbyjs.org/)驱动的一个文档生成器 (你可以完全不会这两项技术，只需要会 markdown 的基础知识，然后简单配置，就能搭建一个网站。当然，如果你会这两项技术那更好)。文档的配置参考了基于 vue 的文档生成器 - [vuepress](https://vuepress.vuejs.org/config/)。

import ImgWidthBase from '@components/ImgWidthBase'

<div class="pic-plus">
  <ImgWidthBase url="antd-icon.svg" width={150} />
   <span>+</span>
  <ImgWidthBase url="react-icon.svg" width={150}/>
    <span>+</span> 
  <ImgWidthBase url="gatsby-icon-144x144.png" width={150}/>
</div>

## 基本特点

- 上手简单，只需要 markdown 和一点 js 知识就能上手。
- 你可以可以在 markdown 里写 JSX，具体可以参考[mdx](https://github.com/mdx-js/mdx)。
- 可以直接在 markdown 中使用 [Ant Design 所有组件](https://ant.design/components/button-cn/)，满足日常开发需求。
- 可以定制[主题颜色](../default-theme-config#定制主题颜色)。

## 技术栈

- [Ant Design](https://ant.design/docs/react/introduce-cn)
- [Gatsby](https://www.gatsbyjs.org/)
- markdown
- [mdx](https://github.com/mdx-js/mdx)
- [React](https://reactjs.org/)

## 支持环境

- 现代浏览器和 IE11。
- 支持服务端渲染。

## 版本

- antdsite 版本：[![npm package](https://img.shields.io/npm/v/antdsite.svg?style=flat-square)](https://www.npmjs.org/package/antdsite)
- antdsite-cli 版本：[![npm package](https://img.shields.io/npm/v/antdsite-cli.svg?style=flat-square)](https://www.npmjs.org/package/antdsite-cli)