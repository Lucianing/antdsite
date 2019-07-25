import React from 'react';
import { graphql } from 'gatsby';
import WrapperLayout from '../layout';
import MainContent from '../components/content/MainContent';

export interface IGraphqlFrontmatterData {
  title: string;
  important?: boolean;
  disabled?: boolean;
  link?: string;
  subtitle?: string;
}

export interface IMarkDownFields {
  slug: string;
  path: string;
  modifiedTime: string;
  avatarList: Array<{
    href: string;
    text: string;
    src: string;
  }>;
}

export interface OneToc {
  url: string;
  title: string;
  items: OneToc[];
}

export interface Toc {
  items: OneToc[];
}

export interface IMdxData {
  code: {
    body: string;
  };
  tableOfContents: Toc;
  frontmatter: IGraphqlFrontmatterData;
  fields: IMarkDownFields;
}

export type Headings = Array<{
  depth: number;
  value: string;
}>;

export type Edges = Array<{
  node: {
    tableOfContents: Toc;
    frontmatter: IGraphqlFrontmatterData;
    fields: IMarkDownFields;
    headings: Headings;
  };
}>;

export interface IAllMdxData {
  edges: Edges;
}

export default function Template({
  data,
  pageContext,
  ...rest
}: {
  data: { mdx: IMdxData; allMdx: IAllMdxData };
  isMobile: boolean;
  location: {
    pathname: string;
  };
  pageContext: {
    webConfig: any;
    slug: string;
  };
}) {
  const { mdx } = data;

  const { frontmatter, fields, code, tableOfContents } = mdx;

  return (
    <WrapperLayout data={data} pageContext={pageContext} {...rest}>
      <MainContent
        {...rest}
        localizedPageData={{
          meta: {
            ...frontmatter,
            ...fields,
          },
          toc: tableOfContents,
          code,
        }}
      />
    </WrapperLayout>
  );
}

export const pageQuery = graphql`
  query DocsQuery($slug: String!) {
    allMdx {
      edges {
        node {
          tableOfContents
          headings {
            depth
            value
          }
          fields {
            slug
            path
          }
          frontmatter {
            title
            subtitle
            link
            important
            disabled
          }
          code {
            body
          }
        }
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      tableOfContents
      frontmatter {
        title
      }
      fields {
        modifiedTime
        path
        slug
        avatarList {
          href
          text
          src
        }
      }
      code {
        body
      }
    }
  }
`;
