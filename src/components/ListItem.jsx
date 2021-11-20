import React from "react"
import PropTypes from "prop-types"
import theme from "styles/theme"
import SanityImage from "gatsby-plugin-sanity-image"
import hexToRgb from "lib/hexToRgb"

const ListItem = React.memo(
  ({
    name,
    stopType,
    stopNumber,
    category,
    address,
    mainImage,
    className,
    onClick,
  }) => {
    return (
      <div
        css={{
          display: "flex",
          color: theme.n70,
          fontSize: 12,
          cursor: "pointer",
          padding: 16,
          paddingBottom: 8,
          borderBottom: `1px solid ${theme.n20}`,
          transition: "background 250ms",
          ":hover": {
            background: hexToRgb(theme.n20, 0.5),
          },
        }}
        onClick={onClick}
        className={className}
      >
        {mainImage && (
          <SanityImage
            {...mainImage}
            width={80}
            height={80}
            css={{
              flex: "0 0 80px",
              width: "80px",
              height: "80px",
              objectFit: "cover",
              marginRight: 16,
            }}
          />
        )}
        <div>
          <h4 css={{ ...theme.t4 }}>{stopType}</h4>

          <h3
            css={{
              color: theme.n80,
              fontSize: 15,
              fontWeight: 500,
              marginRight: 16,
            }}
          >
            {stopNumber} • {name}
          </h3>

          {address && (
            <div css={{ fontSize: 14, marginBottom: 6, color: theme.n50 }}>
              {address.slice(0, address.indexOf(","))}
            </div>
          )}
          {category && (
            <div css={{ fontSize: 14, marginBottom: 6, color: theme.n50 }}>
              {category}
            </div>
          )}
        </div>
      </div>
    )
  }
)

ListItem.displayName = "ListItem"

export default ListItem

ListItem.propTypes = {
  address: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string.isRequired,
  stopType: PropTypes.string,
  stopNumber: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  mainImage: PropTypes.shape({
    asset: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }),
}
