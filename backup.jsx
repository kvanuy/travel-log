import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { SearchBox, useSearchBoxCore } from "@mapbox/search-js-react";

import { SearchBoxCore, SessionToken } from '@mapbox/search-js-core';

import './Layer'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

import Marker from './Markers'

import fetchNewData  from './NewLayer'

import { listLogEntries } from './API';
import fetchLayerData from './Layer';

// APP backup.. go clean up the OG

//declare init const
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

const aghhh = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[-74.019865,40.691074],"type":"Point"},"properties":{"name":"Joe Coffee Company","mapbox_id":"dXJuOm1ieHBvaTo4ZjJiMTZjZC1iY2I4LTQyNmUtYTEyNy1hYjJiOWRhNTc3ZGI","feature_type":"poi","address":"517 Clayton Road","full_address":"517 Clayton Road, New York, New York 10004, United States","place_formatted":"New York, New York 10004, United States","context":{"country":{"name":"United States","country_code":"US","country_code_alpha_3":"USA"},"region":{"name":"New York","region_code":"NY","region_code_full":"US-NY"},"postcode":{"id":"dXJuOm1ieHBsYzpBWGZPN0E","name":"10004"},"place":{"id":"dXJuOm1ieHBsYzpEZTVJN0E","name":"New York City"},"locality":{"id":"dXJuOm1ieHBsYzpGREtLN0E","name":"Manhattan"},"neighborhood":{"id":"dXJuOm1ieHBsYzpEdnFzN0E","name":"Governors Island"},"address":{"name":"517 Clayton Road","address_number":"517","street_name":"clayton road"},"street":{"name":"Clayton Road"}},"coordinates":{"latitude":40.691074,"longitude":-74.019865,"routable_points":[{"name":"POI","latitude":40.691073,"longitude":-74.019865}]},"language":"en","maki":"cafe","poi_category":["café","food"],"poi_category_ids":["cafe","food"],"external_ids":{},"metadata":{"website":"http://www.joenewyork.com","open_hours":{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"1700"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1700"}}]}},"distance":497}},{"type":"Feature","geometry":{"coordinates":[-74.01329040527344,40.70093536376953],"type":"Point"},"properties":{"name":"Dunkin'","mapbox_id":"dXJuOm1ieHBvaToxNGYxNTkwNS1hNGY4LTQ0MWItYWQ2Ny0zODM3YmY4OTkzNmY","feature_type":"poi","address":"4 Whitehall Street","full_address":"4 Whitehall Street, New York, New York 10004, United States","place_formatted":"New York, New York 10004, United States","context":{"country":{"name":"United States","country_code":"US","country_code_alpha_3":"USA"},"region":{"name":"New York","region_code":"NY","region_code_full":"US-NY"},"postcode":{"id":"dXJuOm1ieHBsYzpBWGZPN0E","name":"10004"},"place":{"id":"dXJuOm1ieHBsYzpEZTVJN0E","name":"New York City"},"locality":{"id":"dXJuOm1ieHBsYzpGREtLN0E","name":"Manhattan"},"neighborhood":{"id":"dXJuOm1ieHBsYzpETVpzN0E","name":"Financial District"},"address":{"name":"4 Whitehall Street","address_number":"4","street_name":"whitehall street"},"street":{"name":"whitehall street"}},"coordinates":{"latitude":40.70093536376953,"longitude":-74.01329040527344,"routable_points":[{"name":"POI","latitude":40.7011250178617,"longitude":-74.0136331126575}]},"language":"en","maki":"cafe","poi_category":["café","coffee","coffee shop","donut shop","food","food and drink"],"poi_category_ids":["cafe","coffee","coffee_shop","donut_shop","food","food_and_drink"],"brand":["Dunkin'","Dunkin"],"brand_id":["dunkin"],"external_ids":{"dataplor":"bbb576fb-5fa6-49b0-bd3a-18070cdb506a","golden":"dunkin-358349"},"metadata":{"phone":"+12127428001","website":"https://locations.dunkindonuts.com/en/ny/new-york/4-south-street/366342?y_source=1_MjAxNTExMDk4Ni03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D","open_hours":{"periods":[{"open":{"day":0,"time":"0000"}}],"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}},"distance":1193}},{"type":"Feature","geometry":{"coordinates":[-74.01260304,40.701859],"type":"Point"},"properties":{"name":"Harbor Cafe","mapbox_id":"dXJuOm1ieHBvaTpkN2JlNjUyZS04M2Y0LTQwZjEtODgzMy0xNTBhNDdjNGI0ZjQ","feature_type":"poi","address":"83 Whitehall St","full_address":"83 Whitehall St, New York, New York 10004, United States","place_formatted":"New York, New York 10004, United States","context":{"country":{"name":"United States","country_code":"US","country_code_alpha_3":"USA"},"region":{"name":"New York","region_code":"NY","region_code_full":"US-NY"},"postcode":{"id":"dXJuOm1ieHBsYzpBWGZPN0E","name":"10004"},"place":{"id":"dXJuOm1ieHBsYzpEZTVJN0E","name":"New York City"},"locality":{"id":"dXJuOm1ieHBsYzpGREtLN0E","name":"Manhattan"},"neighborhood":{"id":"dXJuOm1ieHBsYzpETVpzN0E","name":"Financial District"},"address":{"name":"83 Whitehall St","address_number":"83","street_name":"whitehall st"},"street":{"name":"whitehall st"}},"coordinates":{"latitude":40.701859,"longitude":-74.01260304,"routable_points":[{"name":"POI","latitude":40.701842746896006,"longitude":-74.01265781507126}]},"language":"en","maki":"cafe","poi_category":["café","coffee","coffee shop","food","food and drink"],"poi_category_ids":["cafe","coffee","coffee_shop","food","food_and_drink"],"external_ids":{"dataplor":"fa6f1ea0-cec1-4fec-ada3-cf6b7cb7dd77"},"metadata":{},"distance":1304}},{"type":"Feature","geometry":{"coordinates":[-74.011612,40.701345],"type":"Point"},"properties":{"name":"Joe Coffee Company","mapbox_id":"dXJuOm1ieHBvaTo5OGU3YzE2OS0yNzQ0LTQzZjQtYmI2Zi00ZGNjOTU3NjA2MDI","feature_type":"poi","address":"10 South St Slip 7","full_address":"10 South St Slip 7, New York, New York 10004, United States","place_formatted":"New York, New York 10004, United States","context":{"country":{"name":"United States","country_code":"US","country_code_alpha_3":"USA"},"region":{"name":"New York","region_code":"NY","region_code_full":"US-NY"},"postcode":{"id":"dXJuOm1ieHBsYzpBWGZPN0E","name":"10004"},"place":{"id":"dXJuOm1ieHBsYzpEZTVJN0E","name":"New York City"},"locality":{"id":"dXJuOm1ieHBsYzpGREtLN0E","name":"Manhattan"},"neighborhood":{"id":"dXJuOm1ieHBsYzpETVpzN0E","name":"Financial District"},"address":{"name":"10 South St Slip 7","address_number":"7","street_name":"south st slip"},"street":{"name":"south st slip"}},"coordinates":{"latitude":40.701345,"longitude":-74.011612,"routable_points":[{"name":"POI","latitude":40.701450352532426,"longitude":-74.01163729651202}]},"language":"en","maki":"cafe","poi_category":["café","coffee","coffee shop","food","food and drink"],"poi_category_ids":["cafe","coffee","coffee_shop","food","food_and_drink"],"brand":["Joe Coffee"],"brand_id":["joe_coffee"],"external_ids":{"dataplor":"b2233b7c-18c1-4d1f-80cf-7880dab29a65"},"metadata":{"phone":"+12129247400","website":"https://joecoffeecompany.com/","open_hours":{"periods":[{"open":{"day":0,"time":"0700"},"close":{"day":0,"time":"1400"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"1400"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"1400"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"1400"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"1400"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"1400"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"1400"}}]}},"distance":1332}},{"type":"Feature","geometry":{"coordinates":[-74.01377868652344,40.703369140625],"type":"Point"},"properties":{"name":"Starbucks","mapbox_id":"dXJuOm1ieHBvaTo3ZGE1NmJiNC04MjRiLTQwMGItOTA5My1lOTMzZmQxNjgzZTQ","feature_type":"poi","address":"1 Battery Park Plaza","full_address":"1 Battery Park Plaza, New York, New York 10004, United States","place_formatted":"New York, New York 10004, United States","context":{"country":{"name":"United States","country_code":"US","country_code_alpha_3":"USA"},"region":{"name":"New York","region_code":"NY","region_code_full":"US-NY"},"postcode":{"id":"dXJuOm1ieHBsYzpBWGZPN0E","name":"10004"},"place":{"id":"dXJuOm1ieHBsYzpEZTVJN0E","name":"New York City"},"locality":{"id":"dXJuOm1ieHBsYzpGREtLN0E","name":"Manhattan"},"neighborhood":{"id":"dXJuOm1ieHBsYzpETVpzN0E","name":"Financial District"},"address":{"name":"1 Battery Park Plaza","address_number":"1","street_name":"battery park plaza"},"street":{"name":"battery park plaza"}},"coordinates":{"latitude":40.703369140625,"longitude":-74.01377868652344,"routable_points":[{"name":"POI","latitude":40.70311938,"longitude":-74.01390595}]},"language":"en","maki":"bakery","poi_category":["bakery","café","coffee","coffee shop","food","food and drink","teahouse"],"poi_category_ids":["bakery","cafe","coffee","coffee_shop","food","food_and_drink","teahouse"],"brand":["Starbucks","星巴克","スターバックス","สตาร์บัคส์","ستاربكس"],"brand_id":["starbucks"],"external_ids":{"dataplor":"16f4877b-b1d5-4f7b-8ef5-38134f8355a5","golden":"starbucks-7244"},"metadata":{"phone":"+12124821180","website":"https://www.starbucks.com/store-locator/store/16686/","open_hours":{"periods":[{"open":{"day":0,"time":"0700"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0600"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0600"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0600"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0600"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0600"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"1900"}}]}},"distance":1354}}],"attribution":"© 2025 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service. (https://www.mapbox.com/about/maps/)","response_id":"dvGsuvxXi66rMTotPSVuv-Bpao91WW8KTTb2jGhBmssiwVewo5VUT0FjfZom50Fnx15VdnnqQ12dsOkQn1wtmGsxTiOLaicYItl4mw=="}



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


  const searchBoxCore = useSearchBoxCore({ accessToken: accessToken });
  console.log(searchBoxCore)
  
  //useEffect(() => {
     // print out the logs
  //  (async() => {
  //    const logEntry = await listLogEntries();
  //    setLogEntries(logEntry);

  //  })();
  //},[]);

  //const displayinfo = fetch('https://api.mapbox.com/search/searchbox/v1/suggest?q=Michigan%20Stadium&language=en&limit=1&session_token=[GENERATED-UUID]&proximity=-83.748708,42.265837&country=US&access_token=pk.eyJ1Ijoia3ZhbnV5IiwiYSI6ImNtZGt6a3JrMDB5a2cya3E3Y2UyNjNlMzIifQ.eKLmC5NnBZhCdk8CfeyXmg')
  
  /*const getSuggestedPoints = useCallback(async() => {

    try{
      const mapinfo = fetch('https://api.mapbox.com/search/searchbox/v1/category/coffee?'+
        'access_token=pk.eyJ1Ijoia3ZhbnV5IiwiYSI6ImNtZGt6a3JrMDB5a2cya3E3Y2UyNjNlMzIifQ.eKLmC5NnBZhCdk8CfeyXmg&language=en&'+
        'limit=5&proximity=-74.0242%2C40.6941')
        //-74.0242,
  
        //&bbox=-124.35526789303981%2C38.41262975705166%2C-120.52250410696067%2C39.54169087094499')
      .then(d => d.json())
      .then((something) =>{
        setSearchLog(something.features) 
        console.log(something.features)
      })
    }
    catch(error) {
            console.error(error)

    }        
    return(something.features)

  })*/

    
  //const search = new MapboxSearchBox();
  //search.accessToken = accessToken;
  //mapRef.addControl(search);

  const getLocationPts = useCallback(async () => {
        //const bounds = mapRef.current.getBounds()
    
        try {
            const data = await fetch('http://localhost:1337/api/logs')
              .then(d => d.json())
    
            setLogEntries(data)
        } catch (error) {
            console.error(error)
        }
    }, [])
  



  const performCategorySearch = async () => {
    
    const { features } = await searchRef.current.category(searchCategory, {  limit: 25 });
    setSearchResults(features);
    setSearchBounds(mapBounds);

    console.log('Search results:', features)
  };

   useEffect(() => {
      performCategorySearch()
    }, [searchCategory])

    // how u make the map visual
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3ZhbnV5IiwiYSI6ImNtZGt6a3JrMDB5a2cya3E3Y2UyNjNlMzIifQ.eKLmC5NnBZhCdk8CfeyXmg'
    // map obj visual effects
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom
    });
    // u can return a function where u do clean up but u wouldn't need to be returning a promise


    // load the data onto developer console
    mapRef.current.on('load',() => {
      //getBboxAndFetch()
      setMapLoaded(true);
      getLocationPts()
      //performCategorySearch()

      fetchLayerData().then((result)=>{ 
        mapRef.current.addLayer({
                  id: 'locations',
                  type: 'circle', 
          //        /* Add a GeoJSON source containing place coordinates and information. */
                  source: {
                    type: 'geojson',
                    data: result
                  },
                  paint: {
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-color': 'blue',
                    'circle-stroke-color': 'white'}
                });

        })

       //  fetchNewData().then((result)=>{return result}).then((item)=>{console.log(item)})
        
      /*    fetchNewData().then((result)=>{
            console.log(result)
            mapRef.current.getSource('locations').updateData(result)

        }) */

      
      

      

      


      
    })

    mapRef.current.on('moveend', () => {
      //getBboxAndFetch()
      //getLocationPts()
    
      //console.log(logEntries)

    })

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

  for (let key in logEntries){
    console.log(key, logEntries[key]);

    const popup = new mapboxgl.Popup({ 
      closeButton: false,
      closeonClick: false,
      rcoffset: 25 })
    .setText(logEntries[key].title);

    new mapboxgl.Marker()
    .setLngLat([logEntries[key].longitude, logEntries[key].latitude])
    .setPopup(popup)
    .addTo(mapRef.current);

  }
  /*console.log(searchLog)

  for (let store in searchLog){
    searchLog[store].properties.id = store
    console.log(searchLog[store])
  
    
  }*/

  //mapRef.current.addInteraction('places-mouseenter-interaction',{
  //  type: 'mouseenter',
  //  target: {layerId:'places'}
  //})


  // if logging new entries

  

  // displaying suggestions
  //    new mapboxgl.Marker({ color: 'orange', rotation: 45 }).setLngLat([logEntries[key].longitude, logEntries[key].latitude]).addTo(mapRef.current);
  // pop up to either add the suggestion .. turn it to blue or not



  return (
    <>
    {}
      <div className='button-container'>
        {categoryButtons.map(({label, value}) => (
          <button
          key = {value}
          onClick={() => setSearchCategory(value)}
          className={`category-button ${searchCategory == value && 'active'}`}
          >
            {label}
            </button>
        )
        )} </div>

        

        {/* Map container */}
      <div id='map-container' ref={mapContainerRef} />
        </>
  )
}

export default App