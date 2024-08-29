import React, { useState } from "react";
import ReactDOM from "react-dom";
import { compose, withProps, withState, withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
} from "react-google-maps";

const MyMapComponent = compose(
  //   withState("customlat", "setCustomLat", 20.5937),
  //   withState("customlng", "setCustomLng", 78.9629),
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAtR47H4fiWQevfiYzmcfd_lgy3cI1NjSs&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `382px` }} />,
    mapElement: <div style={{ height: `100%`, width: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <>
    <GoogleMap
      defaultZoom={2}
      defaultCenter={{
        lat: props ? props.customlat : 20.5937,
        lng: props ? props.customlng : 78.9629,
      }}
      onClick={(e) => {
        // console.log("onclick e long ", e.latLng.lng());
        // console.log("onclick e lat", e.latLng.lat());
        props.setCustomLat(e.latLng.lat());
        props.setCustomLng(e.latLng.lng());
        // props.handleClick();
      }}
    >
      {props.isMarkerShown && (
        <>
          {/* <Circle
            defaultCenter={{
              lat: props ? parseFloat(props.customlat) : 20.5937,
              lng: props ? parseFloat(props.customlng) : 78.9629,
            }}
            onCenterChanged={(e) => {
              console.log("e", e);
            }}
            defaultRadius={5 * 1000}
          ></Circle> */}
          <Marker
            position={{
              lat: props ? props.customlat : 20.5937,
              lng: props ? props.customlng : 78.9629,
            }}
          />
        </>
      )}
      {/* {JSON.stringify(props, undefined, 2)} */}
    </GoogleMap>
  </>
));

export default MyMapComponent;
