import { graphql } from "gatsby"

export const fragments = graphql`
  fragment TourStop on SanityTourStop {
    _id
    stopType
    stopNumber
    name
    category
    address
    astUrl
    website
    artistStatement
    bio
    mainImage {
      ...ImageWithPreview
    }
    artistPhoto {
      ...ImageWithPreview
    }
    geoLocation {
      lat
      lng
    }
  }
`
