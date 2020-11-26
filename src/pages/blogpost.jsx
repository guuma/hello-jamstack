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
// import useContentfulImage from "../utils/useContentfulImage"

export const query = graphql`
  query {
    contentfulBlogPost {
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
      <img
        src={node.data.target.file.url}
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
}

export default ({ data }) => {
  const { title, content } = data.contentfulBlogPost
  // console.log(data.contentfulBlogPost.content.references[0].file)
  // console.log(JSON.stringify(data, null, 2))

  return (
    <Layout>
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
                      {categoryItem.category}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <div className="postbody">
              {content && renderRichText(content, options)}
            </div>
            <ul className="postlink">
              <li className="prev">
                <a href="base-blogpost.html" rel="prev">
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span>前の記事</span>
                </a>
              </li>
              <li className="next">
                <a href="base-blogpost.html" rel="next">
                  <span>次の記事</span>
                  <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </Layout>
  )
}
