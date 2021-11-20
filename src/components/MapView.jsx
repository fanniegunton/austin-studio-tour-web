import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import { useMediaQuery } from "@material-ui/core"
import theme from "styles/theme"
import ListItem from "components/ListItem"
import { MODES } from "components/ModeSelector"
import Pagination from "components/Pagination"
import Map from "components/Map"
import ActiveListingPanel from "components/ActiveListingPanel"
import cloneElement from "lib/cloneElement"

const PER_PAGE = 100

// Adapted from https://www.movable-type.co.uk/scripts/latlong.html
const computeDistance = (pt1, pt2) => {
  const toRad = deg => (Math.PI * deg) / 180

  const R = 6371e3 // metres

  // Convert to radians
  const φ1 = toRad(pt1.lat)
  const φ2 = toRad(pt2.lat)
  const Δφ = toRad(pt2.lat - pt1.lat)
  const Δλ = toRad(pt2.lng - pt1.lng)

  // Haversine Formula
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c

  // Convert to miles
  return d / 1609
}

const sortValue = r => {
  let v = r.distance * 3
  if (!r.mainImage) v = v * 2
  if (!r.artistPhoto) v = v * 1.5
  if (!r.website) v = v * 1.5

  return v
}

const MapView = ({
  state,
  dispatch,
  currentTourStops,
  filterBar,
  noResults,
}) => {
  const mobile = useMediaQuery(theme.mobile)
  const [mapOpen, setMapOpen] = useState(true)

  const paginatedTourStops = useMemo(
    () =>
      currentTourStops
        .filter(tourStop => tourStop.geoLocation)
        // Add distance to locations
        .map(tourStop => {
          const distance = computeDistance(
            tourStop.geoLocation,
            state.mapCenter
          )
          const v = sortValue({ ...tourStop, distance })
          return {
            ...tourStop,
            distance,
            sortValue: v,
          }
        })
        // Sort by distance
        // .sort((a, b) => a.distance - b.distance)
        .sort((a, b) => a.sortValue - b.sortValue)
        // Paginate
        .slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE),
    [currentTourStops, state.mapCenter, state.page]
  )

  return (
    <div
      css={{
        height: "100vh",
        scrollSnapAlign: "start",
        gridTemplateRows: "80px 1fr",
        position: "relative",
        "--listWidth": "400px",
        [theme.tablet]: {
          "--listWidth": "300px",
        },
        [theme.mobile]: {
          scrollSnapAlign: "none",
        },
      }}
      id="restaurants-list"
    >
      {mobile ? (
        <div>
          {filterBar}
          <TabBar mapOpen={mapOpen} setMapOpen={setMapOpen} />
        </div>
      ) : (
        filterBar
      )}

      <ActiveListingPanel
        state={state}
        dispatch={dispatch}
        listing={
          state.activeListing &&
          currentTourStops.find(({ _id }) => _id === state.activeListing)
        }
      />

      <div
        css={{
          display: "grid",
          gridTemplateColumns: "var(--listWidth) 1fr",
          gridTemplateRows: "1fr 100px",
          gridTemplateAreas: `
            "list map"
            "pagination map"
          `,
          height: "calc(100vh - 80px)",
          marginLeft: "calc(0.5 * var(--pagePadding))",
          [theme.mobile]: {
            display: "block",
            marginLeft: 0,
            maxHeight: "calc(100vh - 145px)",
          },
        }}
      >
        {(!mobile || !mapOpen) && (
          <>
            <div
              css={[
                {
                  position: "relative",
                  gridArea: "list",
                  overflowY: state.activeListing ? "hidden" : "auto",
                  WebkitOverflowScrolling: "touch",
                  padding:
                    state.mode === MODES.MAP
                      ? "0 1px 0 0"
                      : "0 var(--pagePadding) var(--pagePadding) var(--pagePadding)",
                  [theme.mobile]: {
                    height: "calc(100% - 72px)",
                  },
                },
                paginatedTourStops.length > 0 && {
                  ":before": {
                    content: "''",
                    display: "block",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    zIndex: 2,
                    pointerEvents: "none",
                    background: `linear-gradient(to top, transparent, ${theme.n10})`,
                  },
                  ":after": {
                    content: "''",
                    display: "block",
                    position: "sticky",
                    bottom:
                      state.mode === MODES.MAP
                        ? 0
                        : "calc(-1 * var(--pagePadding))",
                    left: 0,
                    right: 0,
                    height: 50,
                    zIndex: 2,
                    pointerEvents: "none",
                    background: `linear-gradient(to bottom, transparent, ${theme.n10})`,
                  },
                },
              ]}
            >
              {paginatedTourStops.length > 0 ? (
                <div
                  css={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: state.mode !== MODES.MAP && 24,
                    marginTop: -30,
                    [theme.mobile]: {
                      gridTemplateColumns: "1fr",
                      gap: state.mode !== MODES.MAP ? 8 : 16,
                    },
                  }}
                >
                  {paginatedTourStops.map(location => (
                    <ListItem
                      key={location._id}
                      {...location}
                      onClick={() => {
                        dispatch(
                          state.filters.has("bookmarkedOnly") &&
                            state.bookmarkedStops.has(location.stopNumber)
                            ? {
                                action: "activateListingAndCenter",
                                value: {
                                  _id: location._id,
                                  name: location.name,
                                  geoLocation: location.geoLocation,
                                },
                              }
                            : {
                                action: "activateListing",
                                value: location._id,
                                name: location.name,
                              }
                        )
                      }}
                    />
                  ))}
                </div>
              ) : (
                cloneElement(noResults, {
                  css: { marginRight: "calc(0.5 * var(--pagePadding))" },
                })
              )}
            </div>

            <Pagination
              currentPage={state.page}
              perPage={PER_PAGE}
              totalCount={currentTourStops.length}
              setPage={n => dispatch({ action: "setPage", value: n })}
              css={{
                gridArea: "pagination",
                width: "100%",
                maxWidth: 225,
                margin: "24px auto",
              }}
            />
          </>
        )}

        {(!mobile || mapOpen) && (
          <div
            css={{
              gridArea: "map",
              height: "100%",
              padding: "var(--pagePadding)",
              paddingTop: 0,
              paddingLeft: 0,

              [theme.mobile]: {
                padding: "var(--pagePadding)",
              },
            }}
          >
            <Map
              locations={paginatedTourStops}
              onChange={({ center, bounds, zoom }) => {
                dispatch({
                  action: "setMapGeometry",
                  value: { center, bounds, zoom },
                })
              }}
              activeListing={state.activeListing}
              center={state.mapCenter}
              zoom={state.mapZoom}
              dispatch={dispatch}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MapView

MapView.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentTourStops: PropTypes.array.isRequired,
  filterBar: PropTypes.node.isRequired,
  noResults: PropTypes.node,
}

const TabBar = ({ mapOpen, setMapOpen }) => {
  return (
    <div
      css={{
        display: "flex",
        marginTop: 8,
        padding: "0 12px",
        borderBottom: `1px solid ${theme.n20}`,
      }}
    >
      <Tab active={mapOpen} onClick={() => setMapOpen(true)}>
        Map
      </Tab>
      <Tab active={!mapOpen} onClick={() => setMapOpen(false)}>
        List
      </Tab>
    </div>
  )
}

TabBar.propTypes = {
  mapOpen: PropTypes.bool.isRequired,
  setMapOpen: PropTypes.func.isRequired,
}

const Tab = ({ active, onClick, children }) => (
  <div
    css={{
      background: active ? theme.n10 : "#13202f",
      border: `1px solid ${active ? theme.n20 : "#13202f"}`,
      borderBottomColor: active ? theme.n10 : theme.n20,
      borderRadius: "3px 3px 0 0",
      padding: "8px 16px",
      marginLeft: 4,
      marginBottom: -1,
      fontSize: 12,
    }}
    onClick={onClick}
  >
    {children}
  </div>
)

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
