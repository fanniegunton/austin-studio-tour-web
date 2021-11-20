import React, { useReducer, useMemo } from "react"
import Fuse from "fuse.js"
import { reducer, initialState } from "reducers/tourStopsViewer"
import { MODES } from "components/ModeSelector"
import FilterBar from "components/FilterBar"
import MapView from "components/MapView"
import NoResults from "components/NoResults"

const TourStopsViewer = ({
  tourStops,
  defaultSearchQuery,
  defaultFilters,
  defaultViewMode,
  showingAll,
  preserveOrder,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    mode: defaultViewMode || "map",
    searchQuery: defaultSearchQuery || "",
    filters: new Set(defaultFilters),
  })
  const fuse = useMemo(() => new Fuse(tourStops, fuseConfig), [tourStops])

  const filteredTourStops = useMemo(() => {
    const activeFilters = Array.from(state.filters).map(
      filter => filters[filter]
    )

    return applyFilters(
      state.searchQuery?.length > 0
        ? fuse.search(state.searchQuery).map(res => res.item)
        : tourStops,
      activeFilters
    )
  }, [fuse, state.searchQuery, state.filters, tourStops])

  const currentTourStops =
    state.mode === MODES.MAP && state.mapBounds
      ? filters.inView(state.mapBounds)(filteredTourStops)
      : filteredTourStops

  const filterBar = (
    <FilterBar
      key={`filter-bar-${state.filterBarKey}`}
      listTitle="tour stops"
      defaultSearchQuery={state.searchQuery || defaultSearchQuery}
      mode={state.mode}
      filters={state.filters}
      dispatch={dispatch}
    />
  )

  const noResults = (
    <NoResults
      searchQuery={state.searchQuery}
      showingAll={showingAll}
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
      preserveOrder={preserveOrder}
    />
  )
}

export default TourStopsViewer

const filters = {
  hideClosed: list => list.filter(entry => entry.openForBusiness),
  currentlyOpen: list => list,
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
}

const fuseConfig = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ["name", "category", "bio", "stopNumber"],
}

const applyFilters = (list, filters) =>
  filters.filter(x => x).reduce((results, filter) => filter(results), list)
