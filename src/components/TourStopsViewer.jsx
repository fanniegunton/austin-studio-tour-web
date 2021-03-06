import React, { useReducer, useMemo, useEffect } from "react"
import PropTypes from "prop-types"
import Fuse from "fuse.js"
import { reducer, initialState } from "reducers/tourStopsViewer"
import { MODES } from "components/ModeSelector"
import FilterBar from "components/FilterBar"
import MapView from "components/MapView"
import NoResults from "components/NoResults"
import useStorage from "hooks/useStorage"

let hasInitialized = false

const TourStopsViewer = ({
  tourStops,
  defaultSearchQuery,
  defaultFilters,
  defaultViewMode,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    mode: defaultViewMode || "map",
    searchQuery: defaultSearchQuery || "",
    filters: new Set(defaultFilters),
  })

  const [bookmarks, setBookmarks] = useStorage("bookmarks", {
    initialValue: null,
  })

  useEffect(() => {
    if (bookmarks && !hasInitialized) {
      dispatch({ action: "loadBookmarks", value: bookmarks })
      hasInitialized = true
    }

    window.setTimeout(() => {
      hasInitialized = true
    }, 2000)
  }, [bookmarks])

  useEffect(() => {
    if (hasInitialized) {
      setBookmarks(Array.from(state.bookmarkedStops))
    }
  }, [state.bookmarkedStops, setBookmarks])

  const fuse = useMemo(() => new Fuse(tourStops, fuseConfig), [tourStops])

  const filteredTourStops = useMemo(() => {
    const activeFilters = Array.from(state.filters).map(
      filter => filters[filter]
    )

    return applyFilters({
      list:
        state.searchQuery?.length > 0
          ? fuse.search(state.searchQuery).map(res => res.item)
          : tourStops,
      filters: activeFilters,
      state,
    })
  }, [fuse, state, tourStops])

  const currentTourStops =
    state.mode === MODES.MAP &&
    state.mapBounds &&
    !state.filters.has("bookmarkedOnly")
      ? filters.inView(state.mapBounds)(filteredTourStops)
      : filteredTourStops

  const filterBar = (
    <FilterBar
      key={`filter-bar-${state.filterBarKey}`}
      listTitle="tour stops"
      defaultSearchQuery={state.searchQuery || defaultSearchQuery}
      state={state}
      dispatch={dispatch}
    />
  )

  const noResults = (
    <NoResults
      searchQuery={state.searchQuery}
      resetSearch={() => {
        dispatch({ action: "clearSearchQuery" })
      }}
    />
  )

  // Saving this bit for posterity / reconsideration
  // const View = state.mode === MODES.MAP ? MapView : GridView
  const View = MapView

  return (
    <View
      state={state}
      dispatch={dispatch}
      currentTourStops={currentTourStops}
      filterBar={filterBar}
      noResults={noResults}
    />
  )
}

export default TourStopsViewer

TourStopsViewer.propTypes = {
  tourStops: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  defaultSearchQuery: PropTypes.string,
  defaultFilters: PropTypes.arrayOf(PropTypes.string),
  defaultViewMode: PropTypes.oneOf(Object.values(MODES)),
}

const filters = {
  inView: bounds => list =>
    list
      .filter(tourStop => tourStop.geoLocation)
      .filter(
        ({ geoLocation: { lat, lng } }) =>
          lng > bounds.nw.lng &&
          lng < bounds.se.lng &&
          lat < bounds.nw.lat &&
          lat > bounds.se.lat
      ),
  showEast: list => list.filter(entry => entry.stopType === "east"),
  showWest: list => list.filter(entry => entry.stopType === "west"),
  bookmarkedOnly: (list, state) =>
    list.filter(entry => state.bookmarkedStops.has(entry.stopNumber)),
}

const fuseConfig = {
  shouldSort: true,
  ignoreFieldNorm: true,
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 1.4 },
    { name: "category", weight: 1.3 },
    { name: "bio", weight: 1 },
    { name: "artistStatement", weight: 0.7 },
    { name: "address", weight: 0.7 },
    { name: "stopNumber", weight: 1.5 },
  ],
}

const applyFilters = ({ list, filters, state }) =>
  filters
    .filter(Boolean)
    .reduce((results, filter) => filter(results, state), list)
