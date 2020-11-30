import React from "react"
import { Layout } from "../components/Layout/index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faFolderOpen } from "@fortawesome/free-regular-svg-icons"
import {
  faChevronLeft,
  faChevronRight,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import useContentfulImage from "../components/useContentfulImage"
import SEO from "../components/seo"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"

export const query = graphql`
  query($id: String!) {
    contentfulBlogPost(id: { eq: $id }) {
      title
      publishDateJP: publishDate(formatString: "YYYY年MM月DD日")
      publishDate
      category {
        category
        categorySlug
        id
      }
      eyecatch {
        fluid(maxWidth: 1600) {
          ...GatsbyContentfulFluid_withWebp
        }
        description
        file {
          details {
            image {
              width
              height
            }
          }
          url
        }
      }
      content {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            __typename
            description
            title
            file {
              url
            }
          }
        }
      }
    }
  }
`

const options = {
  renderNode: {
    [INLINES.ENTRY_HYPERLINK]: ({
      data: {
        target: { slug, title },
      },
    }) => {
      return <Link to={slug}>{title}</Link>
    },
    [BLOCKS.EMBEDDED_ASSET]: node => (
      // <pre>
      //   <code>{JSON.stringify(node, null, 2)}</code>
      // </pre>
      <Img
        fluid={useContentfulImage(node.data.target.file.url)}
        alt={node.data.target.description}
      />
    ),
    [BLOCKS.HEADING_2]: (node, children) => {
      return (
        <h2>
          <FontAwesomeIcon icon={faCheckSquare} />
          {children}
        </h2>
      )
    },
  },
  renderText: text => {
    return text.split("\n").reduce((children, textSegment, index) => {
      return [...children, index > 0 && <br key={index} />, textSegment]
    }, [])
  },
}

export default ({ data, pageContext, location }) => {
  const { title, content } = data.contentfulBlogPost
  // console.log(documentToPlainTextString(content))
  // console.log(data.contentfulBlogPost.content.references[0].file)
  // console.log(JSON.stringify(data, null, 2))

  return (
    <Layout>
      <SEO
        pagetitle={data.contentfulBlogPost.title}
        pagedesc={`${documentToPlainTextString(
          data.contentfulBlogPost.content
        ).slice(0, 70)}・・・`}
        pagepath={location.pathname}
        blogimg={`https:${data.contentfulBlogPost.eyecatch.file.url}`}
        pageimgw={data.contentfulBlogPost.eyecatch.file.details.image.width}
        pageimgh={data.contentfulBlogPost.eyecatch.file.details.image.height}
      />
      <div>
        <div className="eyecatch">
          <figure>
            <Img
              fluid={data.contentfulBlogPost.eyecatch.fluid}
              alt={data.contentfulBlogPost.eyecatch.description}
            />
          </figure>
        </div>
        <article className="content">
          <div className="container">
            <h1 className="bar">{title}</h1>
            <aside className="info">
              <time dateTime={data.contentfulBlogPost.publishDate}>
                <FontAwesomeIcon icon={faClock} />
                {data.contentfulBlogPost.publishDateJP}
              </time>
              <div className="cat">
                <FontAwesomeIcon icon={faFolderOpen} />
                <ul>
                  {data.contentfulBlogPost.category.map(categoryItem => (
                    <li
                      className={categoryItem.categorySlug}
                      key={categoryItem.id}
                    >
                      <Link to={`/category/${categoryItem.categorySlug}`}>
                        {categoryItem.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <div className="postbody">
              {content && renderRichText(content, options)}
            </div>
            <ul className="postlink">
              {pageContext.next && (
                // gatsby-node.jsで`fields: publishDate, order: DESC`
                // でsortしているため、記事が降順(新→古)に並べ替えられている
                // そのため、`node.next`が新→古、`node.previous`古→新というデータの並びになっているため、
                // prev_buttonで`node.next(現在のページより1つ古い記事)`、previous_buttonで`node.previous`
                // (現在のページより1つ新しい記事)へ遷移するようしている
                <li className="prev">
                  <Link to={`/blog/post/${pageContext.next.id}`} rel="prev">
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>{pageContext.next.title}</span>
                  </Link>
                </li>
              )}
              {pageContext.previous && (
                <li className="next">
                  <Link to={`/blog/post/${pageContext.previous.id}`} rel="next">
                    <span>{pageContext.previous.title}</span>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </article>
      </div>
    </Layout>
  )
}
