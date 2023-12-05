import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function Paint2Select(props) {

  const {regionLabels} = props;
  const numRegions = regionLabels.length;
  const [regionStates, setRegionStates] = useState(
    Array.from(Array(numRegions), rs=>false)
  );


  const dummyLayout = {x: -1, y: -1, height: -1, width: -1};
  const regionLayouts = useRef(
    Array.from(Array(numRegions), e=>{return {...dummyLayout}})
  );
  const containerLayout = useRef(null);
  const paintAction = useRef(-1);
  const currentRegion = useRef(-1);

  const identifyRegion = (e) => {

    let cLayout = containerLayout.current;
    let rLayouts = regionLayouts.current;

    let touchX = e.nativeEvent.locationX;
    let touchY = e.nativeEvent.locationY;
    let touchPageX = e.nativeEvent.pageX;
    let touchPageY = e.nativeEvent.pageY;    

    touchX = touchPageX - cLayout.x;
    touchY = touchPageY - cLayout.y;

    for (let i = 0; i < rLayouts.length; i++) {
      const layout = rLayouts[i];
      layout.y = i * layout.height;
      if (touchX > layout.x && touchX < layout.x + layout.width &&
          touchY > layout.y && touchY < layout.y + layout.height) {
        return i;
      }
    }
    return -1;
  }

  const handleStart = (e) => {
    // which region was touched?
    let touchedRegion = identifyRegion(e);

    // figure out what the paint action should be
    let newAction = !regionStates[touchedRegion];

    // update the UI with the new touch
    setRegionStates(regionStates.map((rs, idx) => idx === touchedRegion ?
      newAction :
      rs));

    // save the info we'll need for the rest of this gesture
    paintAction.current = newAction;
    currentRegion.current = touchedRegion;
  }

  const handleRelease = (e) => {
    paintAction.current = -1;
    currentRegion.current = -1;
  }

  const handleMove = (e) => {

    let touchedRegion = identifyRegion(e);
    console.log(touchedRegion);

    let currRegion = currentRegion.current;
    let pAction = paintAction.current;

    if (touchedRegion !== currRegion) {
      // moved into a new area!
      // change this region to the paintAction
      setRegionStates(regionStates.map((rs, idx) => idx === touchedRegion ?
        pAction :
        rs));
      currentRegion.current = touchedRegion;
    }
  }

  return (
    <View style={styles.container}>

      {/* outer container */}
      <View  
        style={{
          flex: 0.5,
          width: '100%',
          backgroundColor: 'lightgray',
          padding: '1%'
        }}
        onLayout={(e)=>{
          containerLayout.current = e.nativeEvent.layout;
        }}
        onMoveShouldSetResponder={(e)=>{
          return true;
        }}
        onStartShouldSetResponder={(e)=>{
          return true;
        }}
        onResponderMove={handleMove}
        onResponderStart={handleStart}
        onResponderRelease={(e)=>{
          console.log('orr');
        }}
      >

        {/* Paintable regions */}
        {regionStates.map((region, index) => {
          console.log('region', index, 'is', region);
          return (
            <View  
              key={index}
              style={[
                styles.regionLabel,
                region ?
                  {backgroundColor: 'teal'} :
                  {backgroundColor: 'lightgray'}
              ]}
              onLayout={(e)=>{
                regionLayouts.current[index] = {...e.nativeEvent.layout};
              }}
            >
              <Text>{regionLabels[index].label}</Text>
            </View>
          );
        })}
      </View>
      <Button
        title="Save"
        onPress={()=>{
          console.log("Saving options:", regionStates); 
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  const regionLabels = [
    {label: '1am-2am', value: false},
    {label: '2am-3am', value: false},
    {label: '3am-4am', value: false},
    {label: '4am-5am', value: false},
    {label: '6am-7am', value: false},
    {label: '7am-8am', value: false},
    {label: '8am-9am', value: false},
    {label: '9am-10am', value: false},
  ]
  return (
    <Paint2Select regionLabels={regionLabels}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
