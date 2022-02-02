export default function reducer (state, action) {

    switch (action.type) {

        case 'setLocationData':
            return { 
                ...state,
                locations : action.data
            }

        case 'setLotsInWarehouse' :
            return {
                ...state,
                lots : action.data
            }

        case 'setProductData' :
            return {
                ...state,
                products: action.data
            }

        case 'setSeeds' :
            return {
                ...state,
                seeds: action.data
            }

        case 'setClickedLocation' :
            return {
            ... state,
            clickedLocation : action.data
            }

        case 'setSelectedMoveLocation' :
            return {
            ... state,
            selectedMoveLocation : action.data
            }


        default:
        // return state // this is an optional default, however this alternative provides more feedback
        throw new Error(`action.type: ${action.type} is not recognised. Switch statement defaulted to throw Error`)
    }
}

