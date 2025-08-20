import { useRef, useEffect, useState, useCallback, React } from 'react'
import mapboxgl from 'mapbox-gl'

import { SearchBox, useSearchBoxCore } from "@mapbox/search-js-react";

import { SearchBoxCore, SessionToken } from '@mapbox/search-js-core';
import { useForm } from "react-hook-form";

import './Layer'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

import Marker from './Markers'

import fetchNewData  from './NewLayer'

import { listLogEntries, createLogEntry, deleteLogEntry } from './API';
import fetchLayerData from './Layer';
import exampleDOM from './LogForm'


const INITIAL_CENTER = [
  -74.0242,
  40.6941
]

const DEFAULT_MAP_BOUNDS = [
  [-74.03189, 40.69684],
  [-73.98121, 40.72286]
]
const INITIAL_ZOOM = 10.12
const accessToken = 'pk.eyJ1Ijoia3ZhbnV5IiwiYSI6ImNtZGt6a3JrMDB5a2cya3E3Y2UyNjNlMzIifQ.eKLmC5NnBZhCdk8CfeyXmg'

const token = 'random-string'

var markerArray = [];


function App() {
  // set the hooks
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const searchRef = useRef()

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [logEntries, setLogEntries] = useState();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [searchLog, setSearchLog] = useState();
  const [searchCategory, setSearchCategory] = useState()
  const [mapBounds, setMapBounds] = useState()

  const [displayFeatures, setDisplayFeatures] = useState();

  var coordinatesList = []

  
  const searchBoxCore = useSearchBoxCore({ accessToken: accessToken });
  

    useEffect(() => {
    performCategorySearch()
    return () => {
      if (searchCategory){
        mapRef.current.removeLayer(searchCategory).removeSource(searchCategory)}
    }
  }
  , [searchCategory])


  const performCategorySearch = async () => {
    
   
    
    fetchNewData(searchCategory).then((result)=>{
    console.log('Search results:', result.features)
    mapRef.current.addLayer({
                  id: searchCategory,
                  type: 'circle', 
                  source: {
                    type: 'geojson',
                    data: result,
                    generateId: true
                  },
                  paint: {
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-color': 'blue',
                    'circle-stroke-color': 'white'}
                });
  })
  } ;
function ClickedGameObj(feature){
    var html = '';
    html += "<div>";
    html += "<h2>" + feature.properties.name + "</h2>";
    html += "<h2>Address: " + feature.properties.full_address + "</h2>";
        html += "<h3>Comment</h3>";

    html += "<input class ='content' id = 'comment' value=''> </input>";
        html += "<h3>Rank</h3>";

    html += "<input class ='content' id = 'rank' value=''> </input>";
        html += "<h3>Image</h3>";

    html += "<input class ='content' id = 'img' value=''> </input>";
        html += "<h3>Date Visited</h3>";

    html += "<input type='date' class ='content' id = 'date' value=''> </date>";

    html += "<button class='content' id='btn-collectobj' value='Add'>Add</button>";
    //html += "<button class='content' id='btn-deleteobj' value='Delete'>Delete</button>";
    //html += "<input {...register('category')} class ='content' id = 'input' value=''> </input>"
    html += "</div>"
    return html;
}


    

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3ZhbnV5IiwiYSI6ImNtZGt6a3JrMDB5a2cya3E3Y2UyNjNlMzIifQ.eKLmC5NnBZhCdk8CfeyXmg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom
    });

    // load the data onto developer console
    mapRef.current.on('load',() => {
      //getBboxAndFetch()
      setMapLoaded(true);
      listLogEntries(logEntries, setLogEntries)
      //getLocationPts() 
    })

    mapRef.current.addInteraction('bar-click-interaction', {
        type: 'click',
        target: { layerId: 'bar' },
        handler: (e) => {
          // Copy coordinates array.
          const coordinates = e.feature.geometry.coordinates.slice();
          const description = e.feature.properties.name;

          console.log(e.feature)


          const popupNode = document.createElement("div")

        
          var z = document.createElement('div')
          z.innerHTML = ClickedGameObj(e.feature)


          // if the coordinates == the coords stores in the marker, don't do a popup?
          const pop = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(z)
            .addTo(mapRef.current);


          
          document.getElementById('btn-collectobj')
          .addEventListener('click', function(){{

            console.log('click button');

            console.log(document.getElementById('img'))

            console.log('{test-data:' + e.feature.geometry.coordinates)
            const data = {
    "title": e.feature.properties.name,
    "comment": document.getElementById('comment').value,
    "image": document.getElementById('img').value,
    "latitude": coordinates[1],
    "longitude": coordinates[0],
    "visitDate" : document.getElementById('date').value

}
            
      
            createLogEntry(JSON.stringify(data),logEntries, setLogEntries)
            console.log(logEntries)
            pop.remove()

          
    
          }
        
        
          
        
        
        
        })
        }
      });


   
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

 
    mapRef.current.addInteraction('bar-mouseenter-interaction', {
        type: 'mouseenter',
        target: { layerId: 'bar' },
        handler: (e) => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
          const coordinates = e.feature.geometry.coordinates.slice();
          const description = e.feature.properties.name;

          popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(mapRef.current);
        }
      });


     mapRef.current.addInteraction('bar-mouseleave-interaction', {
        type: 'mouseleave',
        target: { layerId: 'bar' },
        handler: () => {
          mapRef.current.getCanvas().style.cursor = '';
          popup.remove()
        }
      });
        
    mapRef.current.on('click', function (e){

      const features = mapRef.current.queryRenderedFeatures(e.point);
      
      console.log(e)

      const displayProperties = [
        'type',
        'properties',
        'id',
        'layer',
        'source',
        'sourceLayer',
        'state'
      ];

      /*
: 
40.70146767046461
longitude
: 
-74.01311695575714
      */

      const formattedFeatures = features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => {
          displayFeat[prop] = feat[prop];
        });
        return displayFeat;
      });

      setDisplayFeatures(formattedFeatures);
      
      //var popup = new mapboxgl.Popup()
      //  .setLngLat(feature.geometry.coordinates)
      //  .setHTML(ClickedGameObject(e.feature))
      //  .addTo(map);

    
        
    
    });
    // add an event listener for the map's move event

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from map
      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      // update state
      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)

      //setMapBounds(mapRef.current.getBounds().toArray())
      

      //console.log(getSuggestedPoints())

      


      
      

    })



  /*   mapRef.current.on('mousemove', (e) => {
      const features = mapRef.current.queryRenderedFeatures(e.point);
      console.log(e)

      const displayProperties = [
        'type',
        'properties',
        'id',
        'layer',
        'source',
        'sourceLayer',
        'state'
      ];

      const formattedFeatures = features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => {
          displayFeat[prop] = feat[prop];
        });
        return displayFeat;
      });

      setDisplayFeatures(formattedFeatures);
    });*/


    return () => {
      mapRef.current.remove()
    }
  }, [])


  


  const categoryButtons = [
    { label: "coffee", value: "coffee"},
    { label: "restaurant", value: "restaurant"},
    { label: "bars", value:"bar"},
    { label: "hotels", value: "hotel"},
    { label: "museum", value: "museum"}
  ]

 

  return (
    <>
    {}
      <div className='button-container'>
        {categoryButtons.map(({label, value}) => (
          <button
          key = {value}
          onClick={() =>{ setSearchCategory(value)}}
          className={`category-button ${searchCategory == value && 'active'}`}
          >
            {label}
            </button>
        )
        )} </div>

           

        {/* Map container */}
      <div id='map-container' ref={mapContainerRef} />
       {mapRef.current && logEntries && logEntries?.map((feature) => {
                return (<Marker
                    key={feature._id}
                    map={mapRef.current}
                    feature={feature}
                    logstate = {logEntries}
                    logset = {setLogEntries}
                />)
            })}
      <pre
        
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          overflow: 'auto',
          background: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        {JSON.stringify(logEntries, null, 2)}
      </pre>
        </>
  )
}

export default App