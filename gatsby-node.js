const { O_NOCTTY } = require("constants")
const path = require("path")
const { nextTick } = require("process")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogresult = await graphql(`
    query {
      allContentfulBlogPost(sort: { fields: publishDate, order: DESC }) {
        edges {
          node {
            id
            slug
          }
          next {
            id
            title
            slug
          }
          previous {
            id
            title
            slug
          }
        }
      }
      allContentfulCategory {
        edges {
          node {
            categorySlug
            id
            category
            blogpost {
              title
            }
          }
        }
      }
    }
  `)

  if (blogresult.errors) {
    reporter.panicOnBuild(`GraphQLのクエリでエラーが発生しました`)
    return
  }

  blogresult.data.allContentfulBlogPost.edges.forEach(
    ({ node, next, previous }) => {
      createPage({
        path: `/blog/post/${node.id}`,
        component: path.resolve(`./src/templates/blogpost-template.jsx`),
        context: {
          id: node.id,
          next,
          previous,
        },
      })
    }
  )

  const blogPostsPerPage = 6
  const allblogPosts = blogresult.data.allContentfulBlogPost.edges.length
  const blogPages = Math.ceil(allblogPosts / blogPostsPerPage)

  Array.from({ length: blogPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog/` : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-template.jsx"),
      context: {
        skip: blogPostsPerPage * i,
        limit: blogPostsPerPage,
        currentPage: i + 1,
        isFirst: i + 1 === 1,
        isLast: i + 1 === blogPages,
      },
    })
  })

  blogresult.data.allContentfulCategory.edges.forEach(({ node }) => {
    const categoryPostPerPage = 6
    const allCategoryPosts = node.blogpost.length
    const categoryPages = Math.ceil(allCategoryPosts / categoryPostPerPage)
    Array.from({ length: categoryPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/category/${node.categorySlug}`
            : `/category/${node.categorySlug}/${i + 1}`,
        component: path.resolve(`./src/templates/category-template.jsx`),
        context: {
          category_id: node.id,
          category_name: node.category,
          category_slug: node.categorySlug,
          skip: i * categoryPostPerPage,
          limit: categoryPostPerPage,
          currentPage: i + 1,
          isFirst: i + 1 === 1,
          isLast: i + 1 === categoryPages,
        },
      })
    })
  })

  blogresult.data.allContentfulCategory.edges.forEach(({ node }) => {
    createPage({
      path: `category/${node.categorySlug}`,
      component: path.resolve(`./src/templates/category-template.jsx`),
      context: {
        category_id: node.id,
        category_name: node.category,
        skip: 0,
        limit: 100,
        currentPage: 1,
        isFirst: true,
        isLast: true,
      },
    })
  })
}
