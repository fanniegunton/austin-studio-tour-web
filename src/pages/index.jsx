import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"
import Layout from "components/Layout"
import TourStopsViewer from "../components/TourStopsViewer"

const HomePage = ({
  data: {
    tourStopData: { tourStops },
  },
}) => {
  return (
    <Layout title="A Borrowed List Of Austin Studio Tour Stops">
      <TourStopsViewer
        tourStops={tourStops}
        defaultSearchQuery=""
        showingAll={true}
      />
    </Layout>
  )
}

export default HomePage

HomePage.propTypes = {
  data: PropTypes.shape({
    tourStopData: PropTypes.shape({
      tourStops: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
}

export const query = graphql`
  {
    tourStopData: allSanityTourStop(
      sort: { fields: [stopNumber], order: [ASC] }
    ) {
      tourStops: nodes {
        ...TourStop
      }
    }
  }
`
