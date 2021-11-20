import React from "react"
import PropTypes from "prop-types"
import SanityImage from "gatsby-plugin-sanity-image"
import Icons from "lib/icons"
import IconButton from "components/IconButton"
import IconRow from "components/IconRow"
import theme from "styles/theme"

const ArtistDetails = ({
  name,
  stopType,
  stopNumber,
  category,
  address,
  astUrl,
  website,
  artistStatement,
  bio,
  mainImage,
  artistPhoto,
  className,
}) => {
  return (
    <div className={className}>
      {category && <IconRow icon={Icons.Tag}>{category}</IconRow>}

      {address && <IconRow icon={Icons.MapMarker}>{address}</IconRow>}

      {website && (
        <IconButton icon={Icons.Website} href={website}>
          Website
        </IconButton>
      )}
      {astUrl && (
        <IconButton icon={Icons.Website} href={astUrl}>
          Austin Studio Tour page
        </IconButton>
      )}

      {mainImage && (
        <SanityImage
          {...mainImage}
          width={352}
          alt=""
          css={{
            display: "block",
            width: "100%",
            height: "auto",
            margin: "1em 0",
            borderRadius: 4,
          }}
          options={{
            __experimentalAspectRatio: true,
          }}
        />
      )}

      {artistStatement && (
        <>
          <h4
            css={{
              ...theme.t4,
              color: theme.n40,
              marginTop: "1.5em",
            }}
          >
            Artist Statement
          </h4>
          <p css={{ lineHeight: 1.4 }}>{artistStatement}</p>
        </>
      )}

      {bio && (
        <>
          <h4
            css={{
              ...theme.t4,
              color: theme.n40,
              marginTop: "1.5em",
            }}
          >
            About the Artist
          </h4>

          {artistPhoto && (
            <SanityImage
              {...artistPhoto}
              width={150}
              alt=""
              css={{
                float: "right",
                width: 150,
                margin: "1em 0 1em 1em",
                borderRadius: 4,
              }}
            />
          )}
          <p css={{ lineHeight: 1.4 }}>{bio}</p>
        </>
      )}
    </div>
  )
}

export default ArtistDetails

ArtistDetails.propTypes = {
  artistStatement: PropTypes.string,
  bio: PropTypes.string,
  className: PropTypes.string,
  astUrl: PropTypes.string,
  address: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string.isRequired,
  stopType: PropTypes.string,
  stopNumber: PropTypes.string,
  website: PropTypes.string,
  mainImage: PropTypes.shape({
    asset: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }),
  artistPhoto: PropTypes.shape({
    asset: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }),
}
