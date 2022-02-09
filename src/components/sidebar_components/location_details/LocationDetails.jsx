import React, { useContext } from 'react'
import PalletCard from './PalletCard'
import palletpalContext from '../../../palletpalContext'

function LocationDetails() {
    const {
        state: { locations, clickedLocation, microModes },
        dispatch
    } = useContext(palletpalContext)

    // this function retrieves the location object directly from the array of arrays of location objects
    function getLocation(coordString) {
        // split coordinate into x and y coords, example ["01","02"]
        const coords = coordString.split('_')
        // convert to numbers
        let x = Number(coords[0])
        let y = Number(coords[1])
        // index and return location object
        return locations[y][x]
    }

    // prepare pallet cards
    const palletCards = []
    // get location object
    const locationDisplayed = clickedLocation ? clickedLocation : null
    // if a location object is found...
    if (locationDisplayed) {
        // prepare array of pallet ids at location id
        const palletIds = locationDisplayed.pallets_on_location
        // if the first element of array is NOT null there IS pallets at this location
        if (palletIds[0] != null) {
            // for every pallet id prepare a pallet card
            palletIds.map((palletId, index) =>
                palletCards.push(
                    <PalletCard
                        palletId={palletId}
                        key={index}
                        locationId={locationDisplayed.coordinates}
                    />
                )
            )
        }
    }
    // Open add pallet option
    const handleClick = () => {
        dispatch({
            type: 'setMicroMode',
            data: { mode: 'AddPallet', bool: true }
        })
    }

    if (microModes.LocationDetails) {
        if (clickedLocation?.category != 'inaccessible') {
            // if there are pallet cards then render pallet cards
            return palletCards.length > 0 ? (
                <div>
                    <button
                        style={{ padding: '5px', margin: '5px' }}
                        onClick={handleClick}>
                        +
                    </button>
                    <div id='locationDetails'>{palletCards}</div>
                </div>
            ) : (
                <div>
                    <button onClick={handleClick}>+</button>
                    <div id='locationDetails'>
                        No pallets in this locations.
                    </div>
                </div>
            )
        } else {
            dispatch({
                type: 'setMicroMode',
                data: { mode: 'LocationDetails', bool: false }
            })
            return <></>
        }
    } else {
        return <></>
    }
}

export default LocationDetails
