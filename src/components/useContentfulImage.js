import React from 'react'
import { useStaticQuery, graphql} from 'gatsby'
import Img from 'gatsby-image'

export default props => {
  const { allImageSharp } = useStaticQuery(graphql`
    query {
      allImageSharp {
        nodes {
          fluid(maxWidth: 785) {
            originalName
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)
  // console.log(assetUrl)
  return (
    <figure>
      <Img
        fluid={
          allImageSharp.nodes.find(n => n.fluid.originalName === props.filename).fluid
        }
        alt={props.alt}
        style={props.style}
      ></Img>
    </figure>
  )
}